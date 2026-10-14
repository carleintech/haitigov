import { PrototypeNotice, PublicArt, PublicHero, PublicShell } from "./public-page.js";
import "./history-experience.css";

type HistoryLocale = "ht" | "fr";

const sources = [
  {
    id: "source-taino",
    label: "Smithsonian Magazine — Who Were the Taíno, the Original Inhabitants of the Caribbean?",
    href: "https://www.smithsonianmag.com/history/who-were-taino-original-inhabitants-columbus-island-73824867/",
  },
  {
    id: "source-colonial",
    label: "Encyclopaedia Britannica — Haiti: Early period",
    href: "https://www.britannica.com/place/Haiti/Early-period",
  },
  {
    id: "source-revolution",
    label:
      "U.S. Department of State, Office of the Historian — The United States and the Haitian Revolution, 1791–1804",
    href: "https://history.state.gov/milestones/1784-1800/haitian-rev",
  },
  {
    id: "source-debt",
    label: "Boston University Law Review — A Debt of Dishonor (Kim Oosterlinck et al.)",
    href: "https://www.bu.edu/bulawreview/2022/05/26/volume-102-number-4/",
  },
  {
    id: "source-occupation",
    label:
      "U.S. Department of State, Office of the Historian — U.S. Invasion and Occupation of Haiti, 1915–34",
    href: "https://history.state.gov/milestones/1914-1920/haiti",
  },
  {
    id: "source-unmih",
    label: "United Nations Peacekeeping — United Nations Mission in Haiti (UNMIH)",
    href: "https://peacekeeping.un.org/sites/default/files/past/unmihbackgr1.html",
  },
  {
    id: "source-arms",
    label: "Small Arms Survey — Haiti country study (PDF)",
    href: "https://www.smallarmssurvey.org/sites/default/files/resources/SAS-OP14-Haiti-EN.pdf",
  },
  {
    id: "source-minustah",
    label: "United Nations Peacekeeping — MINUSTAH fact sheet",
    href: "https://peacekeeping.un.org/en/factsheet/minustah",
  },
  {
    id: "source-council",
    label: "United Nations News — Guterres welcomes creation of transitional council in Haiti",
    href: "https://news.un.org/en/story/2024/04/1148541",
  },
  {
    id: "source-sanite",
    label: "Fondation pour la mémoire de l’esclavage — Sanité Bélair",
    href: "https://memoire-esclavage.org/biographies/sanite-belair",
  },
  {
    id: "source-un-2026",
    label: "BINUH — Secretary-General’s report on the situation in Haiti, 14 July 2026 (PDF)",
    href: "https://binuh.unmissions.org/sites/default/files/2026-07/SG%20Report%20on%20the%20situation%20in%20Haiti%20%2814%20July%202026%29.pdf",
  },
  {
    id: "source-unesco",
    label: "UNESCO — Parc national historique : Citadelle, Sans-Souci, Ramiers",
    href: "https://whc.unesco.org/en/list/180/",
  },
] as const;

function Citation({ sourceId, children }: Readonly<{ sourceId: string; children: string }>) {
  return (
    <a className="hg-history-citation" href={`#${sourceId}`}>
      {children}
    </a>
  );
}

export function HistoryExperience({ locale }: Readonly<{ locale: HistoryLocale }>) {
  const french = locale === "fr";
  const copy = french
    ? {
        navHome: "Accueil",
        navHistory: "Histoire",
        primaryNavigation: "Navigation principale",
        footerNavigation: "Navigation de pied de page",
        switchLanguage: "Kreyòl",
        banner:
          "Cette page est un contenu historique éducatif du prototype TechKlein; ce n’est ni une source officielle ni une plateforme adoptée par le Gouvernement d’Haïti. Les repères sont liés à des sources et restent soumis à une révision éditoriale.",
        eyebrow: "Haïti · repères historiques",
        title: "Histoire d’Haïti",
        intro:
          "Une histoire qui commence avant la colonisation et se poursuit au-delà de l’indépendance. Cette première version privilégie quelques repères documentés; elle ne prétend pas raconter toutes les expériences ni résoudre les débats historiques.",
        contents: "Dans cette page",
        timelineLink: "Chronologie",
        figuresLink: "Personnes",
        faqLink: "Questions fréquentes",
        mediaLink: "Vidéo et diaporamas",
        timelineTitle: "Repères chronologiques",
        timelineIntro:
          "Les dates simplifient des processus plus longs. Les liens « source » permettent de retrouver les références utilisées pour chaque sujet.",
        timeline: [
          {
            date: "Avant 1492",
            title: "Des sociétés taíno sur l’île",
            body: "Des communautés taíno vivaient sur Hispaniola, l’île qui comprend aujourd’hui Haïti et la République dominicaine. La colonisation a bouleversé leurs sociétés; les Taíno et leurs descendants ne doivent pas être décrits comme un peuple simplement « disparu ».",
            source: "source-taino",
            sourceLabel: "Source 1",
          },
          {
            date: "1492",
            title: "Arrivée de Christophe Colomb",
            body: "L’arrivée des Européens ouvre une période de colonisation espagnole marquée par la dépossession, le travail forcé, la violence et les maladies. Les effets sur les populations autochtones furent catastrophiques.",
            source: "source-taino",
            sourceLabel: "Source 1",
          },
          {
            date: "1697",
            title: "Le traité de Ryswick",
            body: "L’Espagne cède à la France la partie occidentale d’Hispaniola. La colonie française prend le nom de Saint-Domingue et se développe autour de plantations exploitées par le travail d’Africains réduits en esclavage.",
            source: "source-colonial",
            sourceLabel: "Source 2",
          },
          {
            date: "1791",
            title: "Début de la Révolution haïtienne",
            body: "Une insurrection commence dans le nord de Saint-Domingue le 22 août. La révolution devient un conflit complexe impliquant des personnes réduites en esclavage, des libres de couleur, les autorités françaises et des puissances étrangères.",
            source: "source-revolution",
            sourceLabel: "Source 3",
          },
          {
            date: "1er janvier 1804",
            title: "Indépendance",
            body: "Jean-Jacques Dessalines proclame l’indépendance. Le nouvel État reprend le nom d’Haïti et devient le premier État indépendant issu d’une révolution victorieuse contre l’esclavage.",
            source: "source-revolution",
            sourceLabel: "Source 3",
          },
          {
            date: "1824–1825",
            title: "L’indemnité imposée par la France",
            body: "La reconnaissance française de l’indépendance est liée à une indemnité imposée à Haïti. Son histoire et ses conséquences économiques font encore l’objet de recherches; les montants et les effets à long terme doivent être présentés avec leur contexte et leurs sources.",
            source: "source-debt",
            sourceLabel: "Source 4",
          },
          {
            date: "1915–1934",
            title: "Occupation américaine",
            body: "Les forces américaines occupent Haïti de 1915 à 1934. Cette période est aussi marquée par une forte ingérence dans les finances et les institutions du pays.",
            source: "source-occupation",
            sourceLabel: "Source 5",
          },
          {
            date: "1986–1995",
            title: "Transition politique et retour à l’ordre constitutionnel",
            body: "Après le départ de Jean-Claude Duvalier en 1986, une série de gouvernements se succède. Le coup d’État de 1991 interrompt le mandat de Jean-Bertrand Aristide; il revient en Haïti en octobre 1994. L’ONU contribue ensuite à la création d’une police civile nationale.",
            source: "source-unmih",
            sourceLabel: "Source 6",
          },
          {
            date: "1990s",
            title: "Armée, armes et sécurité publique",
            body: "Les inventaires d’armes et de matériel militaire cités pour Haïti concernent des périodes différentes. Les recherches sur les armes légères et les opérations de 1994–1995 ne justifient pas, à elles seules, une liste exhaustive ni une conclusion sur la destination de chaque équipement.",
            source: "source-arms",
            sourceLabel: "Source 7",
          },
          {
            date: "2004–2017",
            title: "Mission des Nations Unies et séisme de 2010",
            body: "La MINUSTAH commence en 2004. Le séisme du 12 janvier 2010 cause des pertes humaines et des destructions majeures; l’ONU renforce alors sa mission pour soutenir les efforts immédiats de relèvement.",
            source: "source-minustah",
            sourceLabel: "Source 8",
          },
          {
            date: "2024",
            title: "Création d’un conseil présidentiel de transition",
            body: "En avril 2024, le Secrétaire général de l’ONU accueille la création du Conseil présidentiel de transition. Ce jalon daté n’est pas un compte rendu de la situation politique actuelle; la chronologie devra être vérifiée et mise à jour avant toute affirmation sur le présent.",
            source: "source-council",
            sourceLabel: "Source 9",
          },
          {
            date: "14 juillet 2026",
            title: "Un rapport de l’ONU sur la situation en Haïti",
            body: "Le Secrétaire général de l’ONU transmet un rapport sur Haïti au Conseil de sécurité. Il s’agit d’un repère daté dans une source des Nations Unies, pas d’une synthèse complète de l’histoire du pays ni d’une description garantie de la situation actuelle.",
            source: "source-un-2026",
            sourceLabel: "Source 11",
          },
        ],
        figuresTitle: "Quelques figures de la révolution",
        figuresIntro:
          "Ces portraits courts ne représentent pas toutes les personnes ni tous les groupes qui ont contribué à la révolution. Des biographies plus complètes nécessitent davantage de sources et de relectures.",
        figures: [
          {
            name: "Toussaint Louverture",
            text: "Dirigeant politique et militaire important de la révolution. Son rôle s’inscrit dans un conflit aux alliances et aux objectifs changeants, et non dans un récit porté par une seule personne.",
            source: "source-revolution",
            sourceLabel: "Source 3",
          },
          {
            name: "Jean-Jacques Dessalines",
            text: "Chef militaire de la révolution et figure de la proclamation de l’indépendance d’Haïti, le 1er janvier 1804.",
            source: "source-revolution",
            sourceLabel: "Source 3",
          },
          {
            name: "Sanité Bélair",
            text: "Combattante de la révolution, exécutée par les forces françaises en 1802. Les détails biographiques et certaines citations rapportées doivent être vérifiés avant d’être publiés comme des faits établis.",
            source: "source-sanite",
            sourceLabel: "Source 10",
          },
        ],
        faqTitle: "Questions fréquentes",
        faq: [
          {
            question: "Haïti a-t-il déjà eu du matériel militaire?",
            answer:
              "Oui. Haïti a eu des forces armées et du matériel militaire à différentes périodes. Un inventaire doit toujours indiquer son année, l’unité concernée et si l’équipement était opérationnel. Les listes largement partagées ne décrivent pas nécessairement une seule armée à une seule date.",
          },
          {
            question: "Que sont devenus tous ces équipements?",
            answer:
              "Les sources accessibles décrivent des saisies, du désarmement et des changements institutionnels, mais elles ne permettent pas ici de retracer chaque appareil, véhicule ou arme jusqu’à sa destination finale. La conclusion prudente est qu’Haïti a possédé du matériel militaire dans le passé, mais que cette page ne peut ni confirmer le sort de chaque pièce ni déduire l’inventaire actuel.",
          },
        ],
        mediaTitle: "Vidéo et diaporamas",
        mediaBody:
          "Aucune vidéo ni aucun diaporama n’est publié pour le moment. Ces formats compléteront les textes — ils ne les remplaceront pas — et devront inclure les sources, les droits d’utilisation, des sous-titres, une transcription, des commandes au clavier et aucune lecture automatique.",
        sourcesTitle: "Sources et méthode",
        sourcesIntro:
          "Les sources ci-dessous servent de points de départ; elles ne remplacent pas une revue historique indépendante. Elles reflètent aussi le point de vue de leurs auteurs et institutions.",
        coverageNote:
          "Les sources datées de cette version vont jusqu’au rapport de l’ONU du 14 juillet 2026; elles ne décrivent pas nécessairement la situation actuelle. La chronologie n’est pas exhaustive. Les portraits, certains détails et les traductions restent à compléter et à faire relire.",
        backHome: "Retour à l’accueil",
      }
    : {
        navHome: "Akèy",
        navHistory: "Istwa",
        primaryNavigation: "Navigasyon prensipal",
        footerNavigation: "Navigasyon anba paj",
        switchLanguage: "Français",
        banner:
          "Paj sa a se kontni istorik edikatif yon pwototip TechKlein; li pa yon sous ofisyèl ni yon platfòm Gouvènman Ayiti adopte. Chak etap mare ak sous; kontni an bezwen revizyon editoryal.",
        eyebrow: "Ayiti · kèk dat enpòtan",
        title: "Istwa Ayiti",
        intro:
          "Istwa a kòmanse anvan kolonizasyon epi li kontinye apre endepandans. Premye edisyon sa a prezante kèk etap ki gen sous; li pa pretann rakonte tout eksperyans ni rezoud deba istorik.",
        contents: "Nan paj sa a",
        timelineLink: "Kwonoloji",
        figuresLink: "Moun",
        faqLink: "Kesyon moun poze",
        mediaLink: "Videyo ak dyaporama",
        timelineTitle: "Kèk etap nan listwa",
        timelineIntro:
          "Dat yo rezime pwosesis ki te dire lontan. Lyen « sous » yo mennen nan referans nou te konsilte pou chak sijè.",
        timeline: [
          {
            date: "Anvan 1492",
            title: "Sosyete Taíno sou zile a",
            body: "Kominote Taíno yo te viv sou zile Ispanyola, kote Ayiti ak Repiblik Dominikèn ye jodi a. Kolonizasyon te boulvèse sosyete sa yo; nou pa dwe dekri Taíno yo ak desandan yo tankou se yon pèp ki te senpleman « disparèt ».",
            source: "source-taino",
            sourceLabel: "Sous 1",
          },
          {
            date: "1492",
            title: "Christopher Columbus rive",
            body: "Lè Ewopeyen yo rive, sa louvri yon peryòd kolonizasyon Espayòl ki te make ak pèt tè, travay fòse, vyolans ak maladi. Konsekans yo pou pèp endijèn yo te katastwofik.",
            source: "source-taino",
            sourceLabel: "Sous 1",
          },
          {
            date: "1697",
            title: "Trete Ryswick",
            body: "Espay bay Lafrans pati lwès zile Ispanyola a. Koloni fransè a vin rele Sen Domeng; plantasyon yo te depann sou travay fòse Afriken yo te mete nan esklavaj.",
            source: "source-colonial",
            sourceLabel: "Sous 2",
          },
          {
            date: "1791",
            title: "Revolisyon Ayisyen an kòmanse",
            body: "Yon leve-kanpe kòmanse nan nò Sen Domeng nan dat 22 out. Revolisyon an tounen yon konfli konplèks kote moun yo te mete nan esklavaj, moun lib, otorite fransè ak pisans etranje te mele.",
            source: "source-revolution",
            sourceLabel: "Sous 3",
          },
          {
            date: "1ye janvye 1804",
            title: "Endepandans",
            body: "Jean-Jacques Dessalines pwoklame endepandans. Nouvo eta a reprann non Ayiti epi li vin premye eta endepandan ki soti nan yon revolisyon ki te ranpòte viktwa kont esklavaj.",
            source: "source-revolution",
            sourceLabel: "Sous 3",
          },
          {
            date: "1824–1825",
            title: "Lafrans enpoze yon dedomajman",
            body: "Lafrans mare rekonesans endepandans Ayiti ak yon dedomajman li enpoze sou peyi a. Istwa ak konsekans ekonomik li toujou ap etidye; fòk yo bay kontèks ak sous pou montan yo ak efè alontèm yo.",
            source: "source-debt",
            sourceLabel: "Sous 4",
          },
          {
            date: "1915–1934",
            title: "Okipasyon ameriken",
            body: "Fòs ameriken te okipe Ayiti soti 1915 rive 1934. Se te yon peryòd gwo enfliyans sou finans ak enstitisyon peyi a tou.",
            source: "source-occupation",
            sourceLabel: "Sous 5",
          },
          {
            date: "1986–1995",
            title: "Tranzisyon politik ak retou nan lòd konstitisyonèl",
            body: "Apre Jean-Claude Duvalier pati an 1986, plizyè gouvènman pase. Koudeta 1991 lan koupe manda Jean-Bertrand Aristide; li retounen Ayiti nan mwa oktòb 1994. Apre sa, Nasyonzini ede mete yon polis sivil nasyonal sou pye.",
            source: "source-unmih",
            sourceLabel: "Sous 6",
          },
          {
            date: "Ane 1990 yo",
            title: "Lame, zam ak sekirite piblik",
            body: "Lis zam ak ekipman militè yo site pou Ayiti soti nan plizyè epòk. Rechèch sou zam lejè ak operasyon 1994–1995 yo pa sifi pou pwouve yon lis konplè ni pou di egzakteman kote chak ekipman fini.",
            source: "source-arms",
            sourceLabel: "Sous 7",
          },
          {
            date: "2004–2017",
            title: "Misyon Nasyonzini ak tranblemanntè 2010 la",
            body: "MINUSTAH kòmanse an 2004. Tranblemanntè 12 janvye 2010 la lakòz anpil moun mouri ak gwo dega; Nasyonzini ranfòse misyon li pou ede efò rekiperasyon imedya yo.",
            source: "source-minustah",
            sourceLabel: "Sous 8",
          },
          {
            date: "2024",
            title: "Kreyasyon yon konsèy prezidansyèl tranzisyon",
            body: "Nan mwa avril 2024, Sekretè Jeneral Nasyonzini an akeyi kreyasyon Konsèy Prezidansyèl Tranzisyon an. Dat sa a pa yon bilan sou sitiyasyon politik jodi a; fòk yo verifye epi mete kwonoloji a ajou anvan yo fè deklarasyon sou sa k ap pase kounye a.",
            source: "source-council",
            sourceLabel: "Sous 9",
          },
          {
            date: "14 jiyè 2026",
            title: "Yon rapò Nasyonzini sou sitiyasyon an Ayiti",
            body: "Sekretè Jeneral Nasyonzini an voye yon rapò sou Ayiti bay Konsèy Sekirite a. Se yon dat ki soti nan yon sous Nasyonzini; li pa yon istwa konplè sou peyi a ni yon deskripsyon ki garanti sitiyasyon jodi a.",
            source: "source-un-2026",
            sourceLabel: "Sous 11",
          },
        ],
        figuresTitle: "Kèk figi nan revolisyon an",
        figuresIntro:
          "Ti pòtrè sa yo pa reprezante tout moun ni tout gwoup ki te patisipe nan revolisyon an. Pou biyografi ki pi konplè, fòk gen plis sous ak revizyon.",
        figures: [
          {
            name: "Toussaint Louverture",
            text: "Yon lidè politik ak militè ki te jwe yon gwo wòl nan revolisyon an. Wòl li fè pati yon konfli kote alyans ak objektif yo t ap chanje; se pa yon istwa yon sèl moun te mennen.",
            source: "source-revolution",
            sourceLabel: "Sous 3",
          },
          {
            name: "Jean-Jacques Dessalines",
            text: "Lidè militè nan revolisyon an epi youn nan figi ki te pwoklame endepandans Ayiti nan dat 1ye janvye 1804.",
            source: "source-revolution",
            sourceLabel: "Sous 3",
          },
          {
            name: "Sanité Bélair",
            text: "Yon konbatan nan revolisyon an; fòs fransè yo te egzekite l an 1802. Fòk yo verifye detay biyografik ak sitasyon yo rapòte anvan yo prezante yo kòm reyalite.",
            source: "source-sanite",
            sourceLabel: "Sous 10",
          },
        ],
        faqTitle: "Kesyon moun poze souvan",
        faq: [
          {
            question: "Èske Ayiti te gen ekipman militè?",
            answer:
              "Wi. Ayiti te gen fòs ame ak ekipman militè nan diferan epòk. Chak lis dwe bay ane a, inite ki te genyen ekipman an, epi di si li te ka sèvi. Lis anpil moun pataje yo pa nesesèman dekri menm lame a nan menm dat la.",
          },
          {
            question: "Kisa ki rive tout ekipman sa yo?",
            answer:
              "Sous ki disponib yo pale sou sezi zam, dezameman ak chanjman nan enstitisyon yo, men enfòmasyon nou genyen la a pa pèmèt nou swiv chak avyon, machin oswa zam rive nan dènye kote li ye. Konklizyon pridan an se Ayiti te gen ekipman militè nan tan lontan; paj sa a pa ka konfime sò chak pyès ni dedui ki ekipman ki la kounye a.",
          },
        ],
        mediaTitle: "Videyo ak dyaporama",
        mediaBody:
          "Nou poko pibliye videyo ni dyaporama. Yo pral konplete tèks yo, se pa ranplase yo; fòk yo gen sous, dwa itilizasyon, soutit, transkripsyon, kontwòl klavye, epi yo pa dwe jwe poukont yo.",
        sourcesTitle: "Sous ak metòd",
        sourcesIntro:
          "Sous ki anba yo se pwen depa; yo pa ranplase yon verifikasyon istorik endepandan. Yo reflete tou opinyon otè ak enstitisyon ki pibliye yo.",
        coverageNote:
          "Sous ki gen dat nan edisyon sa a rive nan rapò Nasyonzini 14 jiyè 2026 la; yo pa nesesèman dekri sitiyasyon jodi a. Kwonoloji a pa konplè. Nou poko fin konplete ni fè revize pòtrè yo, kèk detay ak tradiksyon yo.",
        backHome: "Retounen nan akèy",
      };

  return (
    <PublicShell locale={locale} page="history">
      <PublicHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={
          french
            ? "Une terre de liberté, un peuple de courage. Découvrez les grandes étapes d’une histoire qui commence avant 1492."
            : "Yon tè libète, yon pèp kouraj. Dekouvri gwo etap yon istwa ki kòmanse anvan 1492."
        }
        image="/homepage-citadelle.webp"
      >
        <div className="hg-public-pills">
          <a href="#chronology">{copy.timelineLink}</a>
          <a href="#figures">{copy.figuresLink}</a>
        </div>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container hg-history">
        <details className="hg-history-editorial">
          <summary>
            {french ? "À propos de ce parcours historique" : "Konsènan pakou istorik sa a"}
          </summary>
          <p>{copy.banner}</p>
          <p>{copy.intro}</p>
        </details>
        <nav className="hg-history-toc" aria-label={copy.contents}>
          <strong>{copy.contents}</strong>
          <a href="#chronology">{copy.timelineLink}</a>
          <a href="#figures">{copy.figuresLink}</a>
          <a href="#questions">{copy.faqLink}</a>
          <a href="#media">{copy.mediaLink}</a>
        </nav>

        <section className="hg-history-section" id="chronology" aria-labelledby="chronology-title">
          <div className="hg-history-section-heading">
            <p className="hg-eyebrow">{copy.eyebrow}</p>
            <h2 id="chronology-title">{copy.timelineTitle}</h2>
            <p>{copy.timelineIntro}</p>
          </div>
          <ol className="hg-history-timeline">
            {copy.timeline.map((item, index) => (
              <li className="hg-history-event" key={item.date}>
                {index < 6 ? <PublicArt src={`/discover/era-${index.toString()}.webp`} /> : null}
                <time className="hg-history-event__date">{item.date}</time>
                <article className="hg-history-event__content">
                  <h3>{item.title}</h3>
                  <details>
                    <summary>{french ? "Lire ce repère" : "Li repè sa a"}</summary>
                    <p>{item.body}</p>
                    <Citation sourceId={item.source}>{item.sourceLabel}</Citation>
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="hg-history-section" id="figures" aria-labelledby="figures-title">
          <div className="hg-history-section-heading">
            <p className="hg-eyebrow">{copy.figuresLink}</p>
            <h2 id="figures-title">{copy.figuresTitle}</h2>
            <p>{copy.figuresIntro}</p>
          </div>
          <div className="hg-history-figures">
            {copy.figures.map((figure) => (
              <article className="hg-history-figure" key={figure.name}>
                <PublicArt
                  src={`/discover/figure-${figure.name === "Toussaint Louverture" ? "0" : figure.name === "Jean-Jacques Dessalines" ? "1" : "4"}.webp`}
                />
                <h3>{figure.name}</h3>
                <p>{figure.text}</p>
                <Citation sourceId={figure.source}>{figure.sourceLabel}</Citation>
              </article>
            ))}
          </div>
          <p className="hg-public-muted">
            {french
              ? "Portraits interprétatifs fournis avec la maquette, pas des portraits documentaires authentifiés."
              : "Pòtrè entèpretatif ki vini ak makèt la, se pa pòtrè dokimantè otantifye."}
          </p>
        </section>

        <section className="hg-history-section" id="monuments" aria-labelledby="monuments-heading">
          <div className="hg-history-section-heading">
            <h2 id="monuments-heading">{french ? "Mémoire & patrimoine" : "Memwa ak eritaj"}</h2>
            <p>
              {french
                ? "Le Parc national historique, un ensemble inscrit au patrimoine mondial."
                : "Pak nasyonal istorik la, yon ansanm ki sou lis eritaj mondyal."}
            </p>
          </div>
          <div className="hg-public-grid">
            {["Citadelle", "Sans-Souci", "Ramiers"].map((name, index) => (
              <article className="hg-public-card" key={name}>
                {index < 2 ? (
                  <PublicArt src={`/discover/monument-${index.toString()}.webp`} />
                ) : null}
                <div className="hg-public-card__body">
                  <h3>{name}</h3>
                  <p>
                    {french
                      ? "Ressource historique UNESCO. Illustration thématique, non documentaire."
                      : "Resous istorik UNESCO. Ilistrasyon tematik, pa dokimantè."}
                  </p>
                  <Citation sourceId="source-unesco">UNESCO</Citation>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hg-history-section" id="questions" aria-labelledby="questions-title">
          <div className="hg-history-section-heading">
            <p className="hg-eyebrow">{copy.faqLink}</p>
            <h2 id="questions-title">{copy.faqTitle}</h2>
          </div>
          <div className="hg-history-faq">
            {copy.faq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
                <Citation sourceId="source-arms">{french ? "Source 7" : "Sous 7"}</Citation>
                {index === 1 ? (
                  <>
                    {" "}
                    <Citation sourceId="source-unmih">{french ? "Source 6" : "Sous 6"}</Citation>
                  </>
                ) : null}
              </details>
            ))}
          </div>
        </section>

        <section className="hg-history-media" id="media" aria-labelledby="media-title">
          <p className="hg-eyebrow">{copy.mediaLink}</p>
          <h2 id="media-title">{copy.mediaTitle}</h2>
          <p>{copy.mediaBody}</p>
        </section>

        <section className="hg-history-sources" aria-labelledby="sources-title">
          <div className="hg-history-section-heading">
            <p className="hg-eyebrow">{copy.sourcesTitle}</p>
            <h2 id="sources-title">{copy.sourcesTitle}</h2>
            <p>{copy.sourcesIntro}</p>
          </div>
          <ol>
            {sources.map((source) => (
              <li id={source.id} key={source.id}>
                <a href={source.href}>{source.label}</a>
              </li>
            ))}
          </ol>
          <p className="hg-history-coverage">{copy.coverageNote}</p>
        </section>
      </div>
    </PublicShell>
  );
}
