import p from "./utils/p";
import { Vector2 } from "./utils/Vector2";
import { Vector3 } from "./utils/Vector3";

export class Perlin {
  _seed: number;
  _offsetMatrix: Vector3[];
  _perm: number[];
  _gradP: Vector3[];
  _three: { Vector2: any; Vector3: any };

  constructor(seed: number) {
    const _gradientVecs = [
      // 2D Vecs
      new Vector3(1, 1, 0),
      new Vector3(-1, 1, 0),
      new Vector3(1, -1, 0),
      new Vector3(-1, -1, 0),
      // + 3D Vecs
      new Vector3(1, 0, 1),
      new Vector3(-1, 0, 1),
      new Vector3(1, 0, -1),
      new Vector3(-1, 0, -1),
      new Vector3(0, 1, 1),
      new Vector3(0, -1, 1),
      new Vector3(0, 1, -1),
      new Vector3(0, -1, -1),
    ];

    var perm = new Array(512);
    var gradP = new Array(512);

    if (!seed) seed = 1;
    seed *= 65536;

    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed >> 8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = _gradientVecs[v % 12];
    }

    this._seed = seed;

    this._offsetMatrix = [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 1),
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 1),
      new Vector3(1, 1, 0),
      new Vector3(1, 1, 1),
    ];

    this._perm = perm;
    this._gradP = gradP;
  }

  _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  _lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  _gradient(posInCell) {
    const perm = this._perm;
    if (posInCell instanceof Vector3) {
      return posInCell.x + perm[posInCell.y + perm[posInCell.z]];
    } else {
      return posInCell.x + perm[posInCell.y];
    }
  }

  get2(input: Vector2 | number[]) {
    if (Array.isArray(input)) {
      input = new Vector2(input[0], input[1]);
    }

    const cell = new Vector2(Math.floor(input.x), Math.floor(input.y));
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;

    const gradiantDot: number[] = [];
    for (let i = 0; i < 4; i++) {
      const s3 = this._offsetMatrix[i * 2];
      const s = new Vector2(s3.x, s3.y);

      const grad3 =
        this._gradP[this._gradient(new Vector2().addVectors(cell, s))];
      const grad2 = new Vector2(grad3.x, grad3.y);
      const dist2 = new Vector2().subVectors(input, s);

      gradiantDot.push(grad2.dot(dist2));
    }

    const u = this._fade(input.x);
    const v = this._fade(input.y);

    const value = this._lerp(
      this._lerp(gradiantDot[0], gradiantDot[2], u),
      this._lerp(gradiantDot[1], gradiantDot[3], u),
      v
    );

    return value;
  }

  get3(input: Vector3 | number[]) {
    if (Array.isArray(input)) {
      input = new Vector3(input[0], input[1], input[2]);
    }

    if (input.z === undefined)
      throw "Input to Perlin::get3() must be of type THREE.Vector3";

    const cell = new Vector3(
      Math.floor(input.x),
      Math.floor(input.y),
      Math.floor(input.z)
    );
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;
    cell.z &= 255;

    const gradiantDot: number[] = [];
    for (let i = 0; i < 8; i++) {
      const s = this._offsetMatrix[i];

      const grad3 =
        this._gradP[this._gradient(new Vector3().addVectors(cell, s))];
      const dist2 = new Vector3().subVectors(input, s);

      gradiantDot.push(grad3.dot(dist2));
    }

    const u = this._fade(input.x);
    const v = this._fade(input.y);
    const w = this._fade(input.z);

    const value = this._lerp(
      this._lerp(
        this._lerp(gradiantDot[0], gradiantDot[4], u),
        this._lerp(gradiantDot[1], gradiantDot[5], u),
        w
      ),
      this._lerp(
        this._lerp(gradiantDot[2], gradiantDot[6], u),
        this._lerp(gradiantDot[3], gradiantDot[7], u),
        w
      ),
      v
    );

    return value;
  }
}
