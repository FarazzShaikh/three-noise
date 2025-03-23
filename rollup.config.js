import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import { uglify } from "rollup-plugin-uglify";
import packageJson from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        name: packageJson.name,
      },
      {
        file: "dist/index.js",
        format: "es",
        exports: "named",
        sourcemap: true,
        name: packageJson.name,
      },
    ],
    plugins: [
      typescript({
        declaration: true,
      }),
      copy({
        targets: [
          {
            src: "package.json",
            dest: "dist",
            transform: (contents) => {
              const pkg = JSON.parse(contents.toString());
              pkg.private = false;
              return JSON.stringify(pkg, null, 2);
            },
          },
        ],
      }),
      uglify(),
    ],
  },
];
