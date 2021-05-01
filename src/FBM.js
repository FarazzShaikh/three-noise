import * as THREE from "three";
import { Perlin } from "./Perlin.js";

export class FBM {
  #scale;
  #persistance;
  #lacunarity;
  #octaves;
  #redistribution;
  #noise;
  constructor({
    seed,
    scale,
    persistance,
    lacunarity,
    octaves,
    redistribution,
  }) {
    this.#noise = new Perlin(seed);
    this.#scale = scale ?? 1;
    this.#persistance = persistance ?? 0.5;
    this.#lacunarity = lacunarity ?? 2;
    this.#octaves = octaves ?? 6;
    this.#redistribution = redistribution ?? 1;
  }

  get(input) {
    let result = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = amplitude;

    let noiseFunction =
      input instanceof THREE.Vector3
        ? this.#noise.perlin3.bind(this.#noise)
        : this.#noise.perlin2.bind(this.#noise);

    for (let i = 0; i < this.#octaves; i++) {
      const position = new THREE.Vector2(
        input.x * this.#scale * frequency,
        input.y * this.#scale * frequency
      );

      const noiseVal = noiseFunction(position) * 2 - 1;
      result += noiseVal * amplitude;

      frequency *= this.#lacunarity;
      amplitude *= this.#persistance;
      max += amplitude;
    }

    const redistributed = Math.pow(result, this.#redistribution);
    return redistributed / max + 0.5;
  }
}
