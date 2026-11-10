import { ButtonLink, Container } from "@/components/ui";

/* Binnen een taal is de taal hier niet bekend (not-found krijgt geen params); daarom tweetalig en compact. */
export default function NotFound() {
  return (
    <section className="py-32">
      <Container className="text-center">
        <div className="animate-fade-up text-sm font-medium text-brand-600">404</div>
        <h1 className="mt-3 animate-fade-up text-4xl font-semibold tracking-tight text-ink [animation-delay:80ms] sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md animate-fade-up text-neutral-600 [animation-delay:160ms]">This page does not exist or has been moved. · Deze pagina bestaat niet of is verplaatst.</p>
        <div className="mt-8 animate-fade-up [animation-delay:240ms]">
          <ButtonLink href="/">Home</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
