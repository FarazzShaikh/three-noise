import { Perlin } from "./Perlin.js";

/**
 * This class is an implimentaiton of a Fractal Brownian Motion
 * function using Perlin Nosie.
 */
export class FBM {
  /**
   * Create an instance of the FBM class.
   * Use this instance to generate fBm noise.
   *
   * @param {Object} options Options for fBm generaiton.
   * @param {number} options.THREE THREE.js instance, or { Vector2, Vector3 }
   * @param {number} options.seed Seed for Perlin Noise
   * @param {number} options.scale What distance to view the noisemap
   * @param {number} options.persistance How much each octave contributes to the overall shape
   * @param {number} options.lacunarity How much detail is added or removed at each octave
   * @param {number} options.octaves Levels of detail you want you perlin noise to have
   * @param {number} options.redistribution Level of flatness within the valleys
   */
  constructor(options) {
    const { THREE: { Vector2, Vector3 }, seed, scale, persistance, lacunarity, octaves, redistribution } =
      options;
    this._noise = new Perlin(seed, { Vector2, Vector3 });
    this._scale = scale || 1;
    this._persistance = persistance || 0.5;
    this._lacunarity = lacunarity || 2;
    this._octaves = octaves || 6;
    this._redistribution = redistribution || 1;
    this._three = { Vector2, Vector3 }
  }

  /**
   * Sample 2D Perlin Noise with fBm at given
   * coordinates. The function will use <code>Perlin_get2</code> or <code>Perlin_get3</code>
   * depending on the input vector's type.
   *
   * @param {(Vector2 | THREE.Vector3)} input Coordinates to sample noise at.
   * @returns {number} Normalized noise in the range [0, 1]
   */
  get2(input) {
    const { Vector2 } = this._three

    let result = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = amplitude;

    let noiseFunction = this._noise.get2.bind(this._noise);

    for (let i = 0; i < this._octaves; i++) {
      const position = new Vector2(
        input.x * this._scale * frequency,
        input.y * this._scale * frequency
      );

      const noiseVal = noiseFunction(position);
      result += noiseVal * amplitude;

      frequency *= this._lacunarity;
      amplitude *= this._persistance;
      max += amplitude;
    }

    const redistributed = Math.pow(result, this._redistribution);
    return redistributed / max;
  }

  /**
   * Sample 3D Perlin Noise with fBm at given
   * coordinates. The function will use <code>Perlin_get2</code> or <code>Perlin_get3</code>
   * depending on the input vector's type.
   *
   * @param {Vector3} input Coordinates to sample noise at.
   * @returns {number} Normalized noise in the range [0, 1]
   */
  get3(input) {
    const { Vector3 } = this._three

    let result = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = amplitude;

    let noiseFunction = this._noise.get3.bind(this._noise);

    for (let i = 0; i < this._octaves; i++) {
      const position = new Vector3(
        input.x * this._scale * frequency,
        input.y * this._scale * frequency,
        input.z * this._scale * frequency
      );

      const noiseVal = noiseFunction(position);
      result += noiseVal * amplitude;

      frequency *= this._lacunarity;
      amplitude *= this._persistance;
      max += amplitude;
    }

    const redistributed = Math.pow(result, this._redistribution);
    return redistributed / max;
  }
}
