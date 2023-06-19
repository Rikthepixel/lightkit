import { defineConfig } from 'tsup';

export default defineConfig({
    dts: true,
    format: ["esm", "cjs"],
    outDir: "./lib",
    clean: true,
    entry: ["src/index.ts"],
    treeshake: true,
    target: "es2015"
});