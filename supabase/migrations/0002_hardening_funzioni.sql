-- =====================================================================
-- Studio Aumentato — irrobustimento delle funzioni
-- Chiude gli endpoint /rest/v1/rpc che non devono essere pubblici.
-- Segnalazioni risolte: function_search_path_mutable,
-- anon_security_definer_function_executable.
-- =====================================================================

-- search_path fisso anche sulla funzione di trigger
alter function public.touch_updated_at() set search_path = public;

-- Funzioni di solo uso interno: non devono essere raggiungibili via API
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;

-- Conteggio download: solo utenti autenticati, mai anonimi
revoke all on function public.register_download(uuid) from public, anon;
grant execute on function public.register_download(uuid) to authenticated;

-- Contatore visite non ancora collegato al sito: niente endpoint pubblico spammabile.
-- Se in futuro lo colleghi, ricorda di rimettere il grant a anon e authenticated.
revoke all on function public.register_view(text) from public, anon, authenticated;

-- Restano pubbliche per scelta:
--   confirm_newsletter e unsubscribe_newsletter → servono ai link inviati per email
--     e richiedono comunque di conoscere il token.
--   is_admin → viene chiamata dentro le policy RLS: revocarla le farebbe fallire.
--     Per un anonimo restituisce sempre false.
