import { Perlin } from "./Perlin";
import { Vector2 } from "./utils/Vector2";
import { Vector3 } from "./utils/Vector3";

interface FBMOpts {
  seed: number;
  scale: number;
  persistance: number;
  lacunarity: number;
  octaves: number;
  redistribution: number;
}

export class FBM {
  _noise: Perlin;
  _scale: number;
  _persistance: number;
  _lacunarity: number;
  _octaves: number;
  _redistribution: number;

  constructor(options: FBMOpts) {
    const { seed, scale, persistance, lacunarity, octaves, redistribution } =
      options;
    this._noise = new Perlin(seed);
    this._scale = scale || 1;
    this._persistance = persistance || 0.5;
    this._lacunarity = lacunarity || 2;
    this._octaves = octaves || 6;
    this._redistribution = redistribution || 1;
  }

  get2(input: Vector2 | number[]) {
    if (Array.isArray(input)) {
      input = new Vector2(input[0], input[1]);
    }

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

  get3(input: Vector3 | number[]) {
    if (Array.isArray(input)) {
      input = new Vector3(input[0], input[1], input[2]);
    }

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
