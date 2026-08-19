-- =====================================================================
-- Le Scritture — iscrizione automatica dei titolari di account
--
-- Chi crea un account entra nella newsletter senza un secondo passaggio:
-- l'indirizzo è già dimostrato dalla conferma dell'account, quindi lo stato
-- nasce 'confirmed' e non serve un altro giro di doppio opt-in.
--
-- Il vincolo che questa funzione non deve violare mai: chi si è disiscritto
-- resta disiscritto. Un nuovo accesso, una nuova conferma o un rilancio dello
-- script di allineamento non devono riportarlo in lista.
-- =====================================================================

create or replace function public.subscribe_account_holder(p_email text)
returns table (status text, token uuid)
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

  insert into public.newsletter_subscribers as n (email, source, status, confirmed_at)
  values (v_email, 'account', 'confirmed', now())
  on conflict (email) do update
     -- 'pending' diventa 'confirmed': l'account prova il possesso della casella.
     -- 'unsubscribed' resta com'è: è una volontà espressa, non un dato mancante.
     set status       = case when n.status = 'pending' then 'confirmed' else n.status end,
         confirmed_at = case when n.status = 'pending' then now() else n.confirmed_at end,
         source       = coalesce(n.source, 'account');

  return query
    select n.status, n.token from public.newsletter_subscribers n where n.email = v_email;
end;
$$;

-- Solo lato server, con la chiave service role: non deve essere un endpoint
-- pubblico, altrimenti chiunque potrebbe iscrivere l'indirizzo di un altro.
revoke all on function public.subscribe_account_holder(text) from public, anon, authenticated;
