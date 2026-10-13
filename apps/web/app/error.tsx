"use client";

import { Button, GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Report only a non-sensitive Next.js correlation digest when one exists.
    if (error.digest) {
      console.error("HaitiGov public page error", { digest: error.digest });
    }
  }, [error.digest]);

  return (
    <>
      <GovernmentHeader>
        <a href="/services">Sèvis</a>
        <a href="/institutions">Enstitisyon</a>
      </GovernmentHeader>
      <main className="hg-container hg-web-status" id="main-content">
        <PublicInformationBanner>
          Sa a se yon pwototip HaitiGov. Li pa reprezante yon sèvis oswa yon adopsyon ofisyèl.
        </PublicInformationBanner>
        <section aria-labelledby="error-heading" className="hg-web-status__content">
          <p className="hg-eyebrow">Erè teknik</p>
          <h1 id="error-heading">Nou pa kapab montre paj sa a kounye a.</h1>
          <p>Eseye ankò. Si pwoblèm nan kontinye, retounen sou paj dakèy la.</p>
          <div className="hg-web-status__actions">
            <Button onClick={retry}>Eseye ankò</Button>
            <a className="hg-button hg-button--secondary" href="/">
              Paj dakèy
            </a>
          </div>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/transparency">Sous ak verifikasyon</a>
      </GovernmentFooter>
    </>
  );
}
