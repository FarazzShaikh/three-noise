import * as THREE from "three";
import { Perlin } from "./Perlin.js";

/**
 * This class is an implimentaiton of a Fractal Brownian Motion
 * function using Perlin Nosie.
 */
export class FBM {
  #scale;
  #persistance;
  #lacunarity;
  #octaves;
  #redistribution;
  #noise;

  /**
   * Create an instance of the FBM class.
   * Use this instance to generate fBm noise.
   *
   * @param {Object} options Options for fBm generaiton.
   * @param {number} options.seed Seed for Perlin Noise
   * @param {number} options.scale What distance to view the noisemap
   * @param {number} options.persistance How much each octave contributes to the overall shape
   * @param {number} options.lacunarity How much detail is added or removed at each octave
   * @param {number} options.octaves Levels of detail you want you perlin noise to have
   * @param {number} options.redistribution Level of flatness within the valleys
   */
  constructor(options) {
    const {
      seed,
      scale,
      persistance,
      lacunarity,
      octaves,
      redistribution,
    } = options;
    this.#noise = new Perlin(seed);
    this.#scale = scale ?? 1;
    this.#persistance = persistance ?? 0.5;
    this.#lacunarity = lacunarity ?? 2;
    this.#octaves = octaves ?? 6;
    this.#redistribution = redistribution ?? 1;
  }

  /**
   * Sample 2D or 3D Perlin Noise with fBm at given
   * coordinates. The function will use <code>Perlin#get2</code> or <code>Perlin#get3</code>
   * depending on the input vector's type.
   *
   * @param {(THREE.Vector2 | THREE.Vector3)} input Coordinates to sample noise at.
   * @returns {number} Normalized noise in the range [0, 1]
   */
  get(input) {
    let result = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = amplitude;

    let noiseFunction =
      input instanceof THREE.Vector3
        ? this.#noise.get3.bind(this.#noise)
        : this.#noise.get2.bind(this.#noise);

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
