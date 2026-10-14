import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const nextRequire = createRequire(
  require.resolve("next/package.json", { paths: [path.join(root, "apps", "web")] }),
);
const sharp = nextRequire("sharp");
const output = path.join(root, "apps", "web", "public", "discover");
await mkdir(output, { recursive: true });

async function crop(source, name, referenceWidth, box) {
  const image = sharp(path.join(root, "docs", source));
  const metadata = await image.metadata();
  if (!metadata.width) throw new Error(`Missing image dimensions: ${source}`);
  const scale = metadata.width / referenceWidth;
  const [left, top, width, height] = box.map((value) => Math.round(value * scale));
  await image
    .extract({ left, top, width, height })
    .webp({ quality: 85 })
    .toFile(path.join(output, `${name}.webp`));
}

const departments = [
  ["ouest", "ouest page.png"],
  ["sud-est", "sud-est page.png"],
  ["nord", "Nord page.png"],
  ["nord-est", "Nord-est page.png"],
  ["artibonite", "artibonite page.png"],
  ["centre", "centrepage.png"],
  ["sud", "Sud page.png"],
  ["grande-anse", "Grand’Anse page.png"],
  ["nord-ouest", "Nord-ouest page.png"],
  ["nippes", "Nippes page.png"],
];
for (const [slug, source] of departments) {
  await crop(source, `${slug}-landscape`, 1312, [800, 65, 510, 190]);
  await crop(source, `${slug}-concept`, 1312, [34, 115, 230, 155]);
}
await crop("institutionpage.png", "palace", 990, [420, 110, 565, 225]);
await crop("explorehaiti.png", "heritage", 990, [48, 643, 332, 155]);
await crop("explorehaiti.png", "culture", 990, [401, 643, 273, 130]);
await crop("explorehaiti.png", "beach", 990, [697, 643, 244, 130]);
await crop("explorehaiti.png", "food", 990, [49, 926, 208, 75]);
await crop("explorehaiti.png", "jacmel", 990, [278, 926, 208, 75]);
await crop("explorehaiti.png", "waterfall", 990, [506, 926, 208, 75]);
for (let index = 0; index < 6; index += 1) {
  await crop("histoire.png", `era-${index.toString()}`, 990, [42 + index * 155, 536, 139, 76]);
}
for (const index of [0, 1, 4]) {
  await crop("histoire.png", `figure-${index.toString()}`, 990, [43 + index * 154, 797, 141, 85]);
}
for (const index of [0, 1]) {
  await crop("histoire.png", `monument-${index.toString()}`, 990, [
    43 + index * 154,
    1010,
    141,
    78,
  ]);
}
console.log(
  "Prepared owner-supplied illustrative artwork; no documentary or official status implied.",
);
