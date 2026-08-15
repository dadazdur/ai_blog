-- =====================================================================
-- Studio Aumentato — schema iniziale
-- Esegui questo file nell'SQL Editor di Supabase (una volta sola).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Profili utente (estende auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  studio      text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- Ogni nuovo utente registrato ottiene automaticamente un profilo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, studio)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'studio', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: evita la ricorsione delle policy quando si controlla il ruolo.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- Autori (E-E-A-T: firma reale su ogni articolo)
-- ---------------------------------------------------------------------
create table if not exists public.authors (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  role_title   text,
  bio          text,
  credentials  text,
  avatar_url   text,
  linkedin_url text,
  email        text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Categorie (cluster tematici, ognuna è una landing indicizzabile)
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  description     text,
  seo_title       text,
  seo_description text,
  position        int not null default 0,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Articoli
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  content_md      text not null default '',
  cover_url       text,
  cover_alt       text,
  category_id     uuid references public.categories (id) on delete set null,
  author_id       uuid references public.authors (id) on delete set null,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  focus_keyword   text,
  canonical_url   text,
  noindex         boolean not null default false,
  faq             jsonb,
  reading_minutes int,
  views           int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category_id);
create index if not exists posts_author_idx on public.posts (author_id);

-- Ricerca full-text in italiano su titolo, sommario e corpo.
create index if not exists posts_search_idx on public.posts
  using gin (to_tsvector('italian', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content_md, '')));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Risorse dell'area riservata
-- ---------------------------------------------------------------------
create table if not exists public.resources (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  type         text not null default 'guida' check (type in ('prompt', 'template', 'guida', 'video')),
  prompt_text  text,
  external_url text,
  file_path    text,
  file_name    text,
  file_size    bigint,
  published    boolean not null default true,
  downloads    int not null default 0,
  position     int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.resource_downloads (
  id          uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resources (id) on delete cascade,
  user_id     uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists resource_downloads_resource_idx on public.resource_downloads (resource_id);

-- ---------------------------------------------------------------------
-- Newsletter (double opt-in)
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  status          text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  source          text,
  token           uuid not null default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz
);

create index if not exists newsletter_status_idx on public.newsletter_subscribers (status, created_at desc);

-- Iscrizione: la chiamiamo dal server, restituisce il token per il link di conferma.
create or replace function public.subscribe_newsletter(p_email text, p_source text default null)
returns table (token uuid, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'email non valida';
  end if;

  insert into public.newsletter_subscribers as n (email, source)
  values (v_email, p_source)
  on conflict (email) do update
    set status = case when n.status = 'unsubscribed' then 'pending' else n.status end,
        unsubscribed_at = case when n.status = 'unsubscribed' then null else n.unsubscribed_at end,
        source = coalesce(n.source, excluded.source);

  return query
    select n.token, n.status from public.newsletter_subscribers n where n.email = v_email;
end;
$$;

create or replace function public.confirm_newsletter(p_token uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  update public.newsletter_subscribers
     set status = 'confirmed',
         confirmed_at = coalesce(confirmed_at, now())
   where token = p_token
  returning email into v_email;

  return v_email;
end;
$$;

create or replace function public.unsubscribe_newsletter(p_token uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  update public.newsletter_subscribers
     set status = 'unsubscribed',
         unsubscribed_at = now()
   where token = p_token
  returning email into v_email;

  return v_email;
end;
$$;

-- Conteggio download senza esporre update sulla tabella.
create or replace function public.register_download(p_resource uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'accesso riservato agli iscritti';
  end if;

  insert into public.resource_downloads (resource_id, user_id) values (p_resource, auth.uid());
  update public.resources set downloads = downloads + 1 where id = p_resource;
end;
$$;

-- Contatore visite articolo (best effort, non bloccante).
create or replace function public.register_view(p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts set views = views + 1 where slug = p_slug and status = 'published';
end;
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles               enable row level security;
alter table public.authors                enable row level security;
alter table public.categories             enable row level security;
alter table public.posts                  enable row level security;
alter table public.resources              enable row level security;
alter table public.resource_downloads     enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profili: ognuno vede e modifica il proprio; gli admin vedono tutto.
drop policy if exists "profili leggibili dal proprietario" on public.profiles;
create policy "profili leggibili dal proprietario" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profili modificabili dal proprietario" on public.profiles;
create policy "profili modificabili dal proprietario" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profili gestiti dagli admin" on public.profiles;
create policy "profili gestiti dagli admin" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Autori e categorie: lettura pubblica, scrittura solo admin.
drop policy if exists "autori pubblici" on public.authors;
create policy "autori pubblici" on public.authors for select to anon, authenticated using (true);

drop policy if exists "autori gestiti dagli admin" on public.authors;
create policy "autori gestiti dagli admin" on public.authors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categorie pubbliche" on public.categories;
create policy "categorie pubbliche" on public.categories for select to anon, authenticated using (true);

drop policy if exists "categorie gestite dagli admin" on public.categories;
create policy "categorie gestite dagli admin" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Articoli: pubblici solo se pubblicati; le bozze restano agli admin.
drop policy if exists "articoli pubblicati visibili a tutti" on public.posts;
create policy "articoli pubblicati visibili a tutti" on public.posts
  for select to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "articoli gestiti dagli admin" on public.posts;
create policy "articoli gestiti dagli admin" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Risorse: visibili solo a chi ha un account.
drop policy if exists "risorse visibili agli iscritti" on public.resources;
create policy "risorse visibili agli iscritti" on public.resources
  for select to authenticated using (published or public.is_admin());

drop policy if exists "risorse gestite dagli admin" on public.resources;
create policy "risorse gestite dagli admin" on public.resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Log download: ognuno vede i propri, gli admin vedono tutto.
drop policy if exists "download propri" on public.resource_downloads;
create policy "download propri" on public.resource_downloads
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- Newsletter: nessuna lettura pubblica. Iscrizione via funzione, gestione via admin.
drop policy if exists "iscritti gestiti dagli admin" on public.newsletter_subscribers;
create policy "iscritti gestiti dagli admin" on public.newsletter_subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- L'iscrizione passa solo dal server (service role): il token di conferma non
-- deve mai essere restituito al browser.
revoke all on function public.subscribe_newsletter(text, text) from public, anon, authenticated;
grant execute on function public.confirm_newsletter(uuid) to anon, authenticated;
grant execute on function public.unsubscribe_newsletter(uuid) to anon, authenticated;
grant execute on function public.register_download(uuid) to authenticated;
grant execute on function public.register_view(text) to anon, authenticated;

-- =====================================================================
-- Storage: bucket privato per i file scaricabili
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('risorse', 'risorse', false)
on conflict (id) do nothing;

drop policy if exists "file risorse leggibili dagli iscritti" on storage.objects;
create policy "file risorse leggibili dagli iscritti" on storage.objects
  for select to authenticated using (bucket_id = 'risorse');

drop policy if exists "file risorse gestiti dagli admin" on storage.objects;
create policy "file risorse gestiti dagli admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'risorse' and public.is_admin())
  with check (bucket_id = 'risorse' and public.is_admin());
