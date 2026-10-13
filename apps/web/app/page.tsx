import { HomeIntro } from "./_components/home-intro.js";
import { PublicHomepage } from "./_components/public-homepage.js";

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <PublicHomepage locale="ht" />
    </>
  );
}
