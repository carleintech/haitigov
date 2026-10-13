import {
  Alert,
  Button,
  Card,
  DataTable,
  EmergencyAlert,
  GovernmentFooter,
  GovernmentHeader,
  InstitutionHeader,
  LanguageSelector,
  Pagination,
  PublicInformationBanner,
  SearchField,
  ServiceCard,
  StatusBadge,
  TextInput,
} from "@haitigov/ui";

export function ComponentsShowcase() {
  return (
    <main className="hg-container hg-showcase" id="main-content">
      <p className="hg-eyebrow">Phase 4B · Kounye a</p>
      <h1>Konpozan fondasyon</h1>
      <p className="hg-lede">Konpozan sa yo bay yon baz aksesib pou eksperyans piblik HaitiGov.</p>
      <section aria-labelledby="actions-heading" className="hg-showcase__section">
        <h2 id="actions-heading">Aksyon</h2>
        <div className="hg-showcase__row">
          <Button>Kontinye</Button>
          <Button variant="secondary">Aprann plis</Button>
          <Button variant="quiet">Anile</Button>
          <Button variant="danger">Retire</Button>
        </div>
      </section>
      <section aria-labelledby="form-heading" className="hg-showcase__section">
        <h2 id="form-heading">Fòm</h2>
        <div className="hg-showcase__form">
          <TextInput
            id="institution-search"
            label="Chèche yon enstitisyon"
            hint="Sèvi ak non oswa akwonim ofisyèl la."
            placeholder="Pa egzanp: MEF"
          />
          <TextInput
            id="invalid-example"
            label="Egzanp erè"
            error="Tanpri verifye enfòmasyon sa a."
            defaultValue="Valè ki pa valab"
          />
        </div>
      </section>
      <section aria-labelledby="feedback-heading" className="hg-showcase__section">
        <h2 id="feedback-heading">Feedback ak estati</h2>
        <div className="hg-showcase__stack">
          <Alert title="Enfòmasyon" tone="information">
            Sèvis la disponib nan lang ou chwazi a.
          </Alert>
          <Alert title="Atansyon" tone="warning">
            Verifye done yo anvan ou soumèt fòm nan.
          </Alert>
          <div className="hg-showcase__row">
            <StatusBadge tone="success">Verifye</StatusBadge>
            <StatusBadge tone="warning">An revizyon</StatusBadge>
            <StatusBadge tone="danger">Bloke</StatusBadge>
          </div>
        </div>
      </section>
      <Card title="Kat enfòmasyon">
        <p>
          Kat yo sèvi pou prezante enfòmasyon piblik san yo pa ekspoze done prive oswa modèl baz
          done entèn.
        </p>
      </Card>
      <section aria-labelledby="portal-heading" className="hg-showcase__section">
        <h2 id="portal-heading">Modèl pòtal</h2>
        <GovernmentHeader>
          <a href="/services">Sèvis</a>
          <a href="/institutions">Enstitisyon</a>
        </GovernmentHeader>
        <LanguageSelector
          label="Chwazi lang"
          onChange={() => undefined}
          options={[
            { code: "ht", label: "Kreyòl" },
            { code: "fr", label: "Français" },
          ]}
          value="ht"
        />
        <SearchField
          label="Chèche nan sèvis yo"
          onSearch={() => undefined}
          placeholder="Tape yon sèvis"
        />
        <ServiceCard
          description="Jwenn enfòmasyon piblik sou sèvis taks yo."
          href="/services/taxes"
          institution="Ministè Ekonomi ak Finans"
          title="Enfòmasyon sou taks"
        />
        <Pagination currentPage={1} onPageChange={() => undefined} totalPages={3} />
        <GovernmentFooter>
          <a href="/accessibility">Aksesibilite</a>
          <a href="/contact">Kontakte nou</a>
        </GovernmentFooter>
      </section>
      <section aria-labelledby="registry-heading" className="hg-showcase__section">
        <h2 id="registry-heading">Enfòmasyon ak enstitisyon</h2>
        <PublicInformationBanner>
          Dosye sa a gen sous ak estati verifikasyon ki dwe parèt ak kontni an.
        </PublicInformationBanner>
        <EmergencyAlert title="Alèt demonstrasyon">
          Sa a se yon egzanp koòdone, pa yon avi ofisyèl.
        </EmergencyAlert>
        <InstitutionHeader
          institutionId="HT-MEF"
          name="Ministè Ekonomi ak Finans"
          acronym="MEF"
          type="Enstitisyon egzekitif"
          verificationLabel="Sous ak verifikasyon obligatwa"
        />
        <DataTable
          caption="Egzanp lis enstitisyon"
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Non" },
            { key: "status", label: "Estati" },
          ]}
          getRowKey={(row) => row.id}
          rows={[{ id: "HT-MEF", name: "Ministè Ekonomi ak Finans", status: "Nan revizyon" }]}
        />
      </section>
    </main>
  );
}
