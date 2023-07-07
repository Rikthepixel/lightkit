import { defineConfig } from 'tsup';

export default defineConfig({
    dts: true,
    format: ["esm", "cjs"],
    outDir: "./lib",
    clean: true,
    entry: [
        "src/index.ts",
        "src/modules/register.ts",
        "src/modules/request.ts",
        "src/modules/response.ts",
        "src/errors/index.ts",
        "src/types/index.ts"
    ],
    treeshake: true,
    splitting: true,
    sourcemap: true,
    minify: true,
    skipNodeModulesBundle: true,
    target: "es2015"
});