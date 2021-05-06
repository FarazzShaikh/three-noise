import glslify from "rollup-plugin-glslify";

const glslOpts = {
  // Default
  include: ["**/*.vs", "**/*.fs", "**/*.vert", "**/*.frag", "**/*.glsl"],

  // Undefined by default
  exclude: "node_modules/**",

  // Compress shader by default using logic from rollup-plugin-glsl
  compress: false,
};

export default [
  {
    input: "index.js",
    output: {
      file: "build/three-noise.module.js",
      format: "es",
    },
    external: ["three"],
    plugins: [glslify(glslOpts)],
  },
  {
    input: "index.js",
    output: {
      file: "build/three-noise.js",
      format: "iife",
      globals: {
        three: "THREE",
      },
      name: "THREE_Noise",
    },
    external: ["three"],
    plugins: [glslify(glslOpts)],
  },
];
