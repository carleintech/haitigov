export default {
  "*.{cjs,css,js,json,jsonc,jsx,mjs,ts,tsx}": ["biome check --write --no-errors-on-unmatched"],
  "*.{cjs,js,jsx,mjs,ts,tsx}": ["eslint --fix"],
};
