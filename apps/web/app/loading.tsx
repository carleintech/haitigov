import { GovernmentFooter, GovernmentHeader } from "@haitigov/ui";

export default function Loading() {
  return (
    <>
      <GovernmentHeader />
      <main className="hg-container hg-web-status" id="main-content">
        <div aria-live="polite" aria-busy="true" className="hg-web-status__content" role="status">
          <p className="hg-eyebrow">HaitiGov</p>
          <p>Tanpri tann pandan paj la ap chaje…</p>
        </div>
      </main>
      <GovernmentFooter />
    </>
  );
}
