import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-xl flex-col justify-center py-20">
      <Eyebrow>Errore 404</Eyebrow>
      <h1 className="t-h1 mt-4">Questa pagina non esiste</h1>
      <p className="t-lead mt-4">
        Il link potrebbe essere vecchio o contenere un refuso. Dal blog trovi tutto quello che è stato pubblicato.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/blog">Vai al blog</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Torna alla home
        </ButtonLink>
      </div>
    </Container>
  );
}
