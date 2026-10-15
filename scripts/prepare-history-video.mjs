import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
if (path.resolve(process.cwd()) !== path.resolve(root)) {
  throw new Error("Run history video preparation from the repository root.");
}
const require = createRequire(import.meta.url);
const nextRequire = createRequire(
  require.resolve("next/package.json", { paths: [path.join(root, "apps", "web")] }),
);
const sharp = nextRequire("sharp");
const sourceDirectory = path.join(root, "docs", "video");
const outputDirectory = path.join(root, "apps", "web", "public", "history-media");
const entries = [
  ["a (1).jpg", "Vil bò lanmè ak mòn", "Ville côtière et montagnes"],
  ["a (1).webp", "Jaden an teras", "Cultures en terrasses"],
  ["a (2).jpg", "Men k ap kenbe grenn koulè lò", "Mains tenant des grains dorés"],
  ["a (2).webp", "Moun k ap travay tè", "Personnes travaillant la terre"],
  ["a (3).jpg", "Legliz wouj ak yon gwo kay won", "Église rouge et son clocher"],
  ["a (3).webp", "Yon plat diri", "Un plat de riz"],
  ["a (4).jpg", "Yon plat manje ak yon nap kolore", "Un plat sur une nappe colorée"],
  ["a (4).webp", "Yon pisin bò lanmè", "Une piscine en bord de mer"],
  ["a (5).jpg", "Drapo ble ak wouj ak yon anblèm", "Drapeau bleu et rouge avec un emblème"],
  ["a (5).webp", "Kaskad nan yon peyizaj vèt", "Cascade dans un paysage verdoyant"],
  ["a (6).jpg", "Yon fò sou tèt mòn", "Une forteresse au sommet d’une montagne"],
  ["a (6).webp", "Yon drapo k ap flote nan syèl la", "Un drapeau flottant dans le ciel"],
  ["a (7).jpg", "Kaskad ak yon basen dlo", "Cascades et bassin"],
  ["a (7).webp", "Yon zile ak dlo ble", "Une île entourée d’eau bleue"],
  ["a (8).jpg", "Yon plas ak yon legliz wouj", "Une place et une église rouge"],
  ["a (9).jpg", "Jaden ak mòn nan fon an", "Champs avec des montagnes à l’horizon"],
  ["a (10).jpg", "Yon gwo wòch bò lanmè", "Un grand rocher en bord de mer"],
  ["a (11).jpg", "Yon plat ak vyann ak legim", "Un plat de viande et de légumes"],
  [
    "a (12).jpg",
    "Ilistrasyon yon fanm k ap koud yon drapo",
    "Illustration d’une femme cousant un drapeau",
  ],
  ["a (13).jpg", "Kay kolore nan yon vil", "Maisons colorées dans une ville"],
  [
    "b (1).jpeg",
    "Konpozisyon anblèm ak tèks sou drapo a",
    "Composition d’un emblème et de texte sur le drapeau",
  ],
  ["b (1).png", "Peyizaj yon vil anba limyè solèy la", "Paysage urbain sous la lumière du soleil"],
  ["b (2).png", "Konpozisyon vizyèl HaitiGov", "Composition visuelle HaitiGov"],
  [
    "b (3).png",
    "Mak wonn ak tèks Repiblik Ayiti",
    "Marque circulaire portant le texte République d’Haïti",
  ],
  [
    "b (4).png",
    "Mak ak tèks Anbasad Repiblik Ayiti",
    "Marque portant le texte Ambassade de la République d’Haïti",
  ],
  [
    "b (5).png",
    "Ilistrasyon yon fanm k ap sèvi ak telefòn",
    "Illustration d’une femme utilisant un téléphone",
  ],
  ["b (6).png", "Konpozisyon yon anblèm ak pye palmis", "Composition d’un emblème avec un palmier"],
  ["b (7).png", "Ilistrasyon yon fò nan limyè solèy", "Illustration d’une forteresse au soleil"],
  ["b (8).png", "Ilistrasyon yon vil ak yon bè", "Illustration d’une ville et d’une baie"],
  [
    "b (9).png",
    "Ilistrasyon dans ak kostim kolore",
    "Illustration de danse et de costumes colorés",
  ],
  ["b (10).png", "Ilistrasyon litoral ak mòn", "Illustration d’un littoral et de montagnes"],
  ["b (11).png", "Konpozisyon yon anblèm sou fon blan", "Composition d’un emblème sur fond blanc"],
  [
    "flag-artibonite.png",
    "Mak konseptyèl ki gen non Latibonit",
    "Marque conceptuelle portant le nom Artibonite",
  ],
  [
    "flag-centre.png",
    "Mak konseptyèl ki gen non Sant",
    "Marque conceptuelle portant le nom Centre",
  ],
  [
    "flag-Grand’Anse.png",
    "Mak konseptyèl ki gen non Grandans",
    "Marque conceptuelle portant le nom Grand’Anse",
  ],
  ["flag-Nippes.png", "Mak konseptyèl ki gen non Nip", "Marque conceptuelle portant le nom Nippes"],
  [
    "flag-nord-est.png",
    "Mak konseptyèl ki gen non Nòdès",
    "Marque conceptuelle portant le nom Nord-Est",
  ],
  [
    "flag-nord-ouest.png",
    "Mak konseptyèl ki gen non Nòdwès",
    "Marque conceptuelle portant le nom Nord-Ouest",
  ],
  ["flag-nord.png", "Mak konseptyèl ki gen non Nò", "Marque conceptuelle portant le nom Nord"],
  ["flag-ouest.png", "Mak konseptyèl ki gen non Lwès", "Marque conceptuelle portant le nom Ouest"],
  ["flag-Sud.png", "Mak konseptyèl ki gen non Sid", "Marque conceptuelle portant le nom Sud"],
];
const actualImages = (await readdir("docs/video")).filter((name) =>
  /\.(png|jpe?g|webp)$/i.test(name),
);
if (
  actualImages.length !== entries.length ||
  actualImages.some((name) => !entries.some(([source]) => source === name))
) {
  throw new Error(
    "Image inventory changed. Review every image and its descriptions before rendering.",
  );
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed:\n${result.stderr}`);
  return result.stdout;
}

async function readSource(name) {
  if (name !== "Haiti_Cherie.mp3" && !entries.some(([source]) => source === name)) {
    throw new Error(`Unreviewed media source: ${name}`);
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- Names are restricted to the reviewed source inventory above.
  return readFile(path.join(sourceDirectory, name));
}

async function writeCaptions(locale, content) {
  if (locale !== "ht" && locale !== "fr") throw new Error("Unsupported caption locale.");
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- Root is fixed and caption basename is restricted to ht/fr.
  await writeFile(path.join(outputDirectory, `${locale}.vtt`), content);
}

const audio = path.join(sourceDirectory, "Haiti_Cherie.mp3");
const audioDuration = Number(
  run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    audio,
  ]).trim(),
);
const duration = 6 + entries.length * 5;
if (!Number.isFinite(audioDuration) || audioDuration < duration) {
  throw new Error("The soundtrack must cover the complete slideshow without looping.");
}
const scratch = await mkdtemp(path.join(tmpdir(), "haitigov-history-video-"));
const escapeXml = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const stamp = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  return `00:${minutes}:${(seconds % 60).toString().padStart(2, "0")}.000`;
};

try {
  const segments = [];
  const slides = [];
  const frames = [
    { source: null, ht: "Ayiti nan imaj", fr: "Haïti en images", seconds: 3 },
    ...entries.map(([source, ht, fr]) => ({ source, ht, fr, seconds: 5 })),
    {
      source: null,
      ht: "Dekouvri istwa a ak sous li yo sou HaitiGov",
      fr: "Découvrez l’histoire et ses sources sur HaitiGov",
      seconds: 3,
    },
  ];
  let start = 0;
  for (const [index, frame] of frames.entries()) {
    const layers = [];
    if (frame.source) {
      const image = path.join(sourceDirectory, frame.source);
      layers.push({
        input: await sharp(image)
          .rotate()
          .resize(1280, 720, { fit: "cover" })
          .blur(25)
          .modulate({ brightness: 0.3 })
          .png()
          .toBuffer(),
        left: 0,
        top: 0,
      });
      layers.push({
        input: await sharp(image)
          .rotate()
          .resize(1120, 510, { fit: "contain", background: "#101e32" })
          .png()
          .toBuffer(),
        left: 80,
        top: 95,
      });
    }
    const svg = `<svg width="1280" height="720">
      <rect x="0" y="0" width="1280" height="76" fill="#0c192c"/>
      <rect x="0" y="76" width="640" height="4" fill="#2877c7"/>
      <rect x="640" y="76" width="640" height="4" fill="#d34856"/>
      <text x="50" y="49" fill="#ffffff" font-family="Arial" font-size="26">HAITIGOV · AYITI NAN IMAJ / HAÏTI EN IMAGES</text>
      <text x="640" y="${frame.source ? 644 : 320}" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="${frame.source ? 24 : 38}">${escapeXml(frame.ht)}</text>
      <text x="640" y="${frame.source ? 675 : 375}" text-anchor="middle" fill="#d4dfec" font-family="Arial" font-size="22">${escapeXml(frame.fr)}</text>
      <text x="640" y="705" text-anchor="middle" fill="#c7d5e6" font-family="Arial" font-size="14">Montaj pwototip · Montage prototype · Mak yo pa prèv estati ofisyèl / Marques sans statut officiel vérifié</text>
    </svg>`;
    layers.push({ input: Buffer.from(svg), left: 0, top: 0 });
    const png = path.join(scratch, `frame-${index.toString()}.png`);
    await sharp({ create: { width: 1280, height: 720, channels: 3, background: "#101e32" } })
      .composite(layers)
      .png()
      .toFile(png);
    if (index === 1) {
      await sharp(png).webp({ quality: 85 }).toFile(path.join(scratch, "poster.webp"));
    }
    const segment = `segment-${index.toString()}.mp4`;
    run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-loop",
      "1",
      "-framerate",
      "24",
      "-i",
      png,
      "-t",
      frame.seconds.toString(),
      "-vf",
      `fade=t=in:st=0:d=0.35,fade=t=out:st=${(frame.seconds - 0.35).toString()}:d=0.35`,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "24",
      "-pix_fmt",
      "yuv420p",
      "-an",
      path.join(scratch, segment),
    ]);
    segments.push(`file '${segment}'`);
    slides.push({
      source: frame.source,
      ht: frame.ht,
      fr: frame.fr,
      start,
      end: start + frame.seconds,
      ...(frame.source
        ? {
            sha256: createHash("sha256")
              .update(await readSource(frame.source))
              .digest("hex"),
          }
        : {}),
    });
    start += frame.seconds;
    console.log(`Rendered ${index + 1}/${frames.length}: ${frame.source ?? "title"}`);
  }
  const concat = path.join(scratch, "segments.txt");
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- Fixed basename within this render's private temporary directory.
  await writeFile(concat, segments.join("\n"));
  const video = path.join(scratch, "ayiti-nan-imaj.mp4");
  run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concat,
    "-i",
    audio,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-af",
    `volume=0.55,afade=t=in:d=2,afade=t=out:st=${duration - 3}:d=3`,
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-t",
    duration.toString(),
    "-movflags",
    "+faststart",
    video,
  ]);
  const probe = JSON.parse(
    run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", video]),
  );
  if (
    Math.abs(Number(probe.format.duration) - duration) > 0.1 ||
    !probe.streams.some(
      (stream) => stream.codec_name === "h264" && stream.width === 1280 && stream.height === 720,
    ) ||
    !probe.streams.some((stream) => stream.codec_name === "aac")
  ) {
    throw new Error("Rendered video failed duration, dimensions or codec validation.");
  }
  await mkdir("apps/web/public/history-media", { recursive: true });
  await copyFile(video, path.join(outputDirectory, "ayiti-nan-imaj.mp4"));
  await copyFile(path.join(scratch, "poster.webp"), path.join(outputDirectory, "poster.webp"));
  for (const locale of ["ht", "fr"]) {
    const music =
      locale === "ht"
        ? "[Mizik enstrimantal: Haiti Cherie]"
        : "[Musique instrumentale : Haiti Cherie]";
    await writeCaptions(
      locale,
      `WEBVTT\n\n${slides.map((slide) => `${stamp(slide.start)} --> ${stamp(slide.end)}\n${music}\n${locale === "fr" ? slide.fr : slide.ht}`).join("\n\n")}\n`,
    );
  }
  await writeFile(
    "apps/web/app/_data/history-media.json",
    `${JSON.stringify(
      {
        duration,
        imageCount: entries.length,
        rightsConfirmation:
          "Owner confirmed public-use permission on 2026-10-14; not independently verified.",
        soundtrack: "Haiti_Cherie.mp3",
        soundtrackSha256: createHash("sha256")
          .update(await readSource("Haiti_Cherie.mp3"))
          .digest("hex"),
        audioDescription: "Owner identified recording as instrumental, without lyrics or speech.",
        slides,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Verified ${duration}s video with all ${entries.length} images and AAC soundtrack.`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
