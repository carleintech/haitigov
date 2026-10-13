import { preview } from "vite";

const server = await preview({
  build: {
    outDir: "storybook-static",
  },
  preview: {
    host: "127.0.0.1",
    port: 6006,
    strictPort: true,
  },
});

async function shutdown() {
  await server.close();
  process.exitCode = 0;
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
