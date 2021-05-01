export default [
  {
    input: "index.js",
    output: {
      file: "build/three-noise.module.js",
      format: "es",
    },
    external: ["three"],
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
  },
];
