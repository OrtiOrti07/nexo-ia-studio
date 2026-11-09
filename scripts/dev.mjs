// Arranca `next dev` junto con el generador de la lista de clases de Tailwind
// en modo vigilancia (ver scripts/tailwind-classes.mjs).

import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const watcher = spawn(process.execPath, ["scripts/tailwind-classes.mjs", "--watch"], {
  stdio: "inherit",
});
const next = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
});

const stop = () => {
  watcher.kill();
  next.kill();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => {
  watcher.kill();
  process.exit(code ?? 0);
});
