import { ButtonLink, Column } from "@/components/ui";

export default function NotFound() {
  return (
    <Column className="flex min-h-[58vh] flex-col justify-center py-16">
      <p className="meta">Errore 404</p>
      <h1 className="t-h1 mt-3">Questa pagina non esiste</h1>
      <p className="t-deck mt-4 max-w-[48ch]">
        Il link potrebbe essere vecchio o contenere un refuso. Negli articoli trovi tutto quello che è stato pubblicato.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/blog">Vai agli articoli</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Torna alla home
        </ButtonLink>
      </div>
    </Column>
  );
}
