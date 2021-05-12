import * as THREE from "three";
import definitions_perlin from "./shaders/perlin.glsl";
import p from "./p.js";

/**
 * An implimentation of Perlin Noise by Ken Perlin.
 */
export class Perlin {
  /**
   *
   * @param {number} seed Seed Value for PRNG.
   */
  constructor(seed) {
    const _gradientVecs = [
      // 2D Vecs
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(1, -1, 0),
      new THREE.Vector3(-1, -1, 0),
      // + 3D Vecs
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(0, 1, 1),
      new THREE.Vector3(0, -1, 1),
      new THREE.Vector3(0, 1, -1),
      new THREE.Vector3(0, -1, -1),
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
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(1, 1, 1),
    ];

    /**
     * GLSL Shader Chunk for 2D Perlin Noise. Can be used with
     * three-CustomShaderMaterial.
     * See: <a href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial">three-CustomShaderMaterial</a>
     */
    this.shaderChunk = {
      defines: "",
      header: definitions_perlin,
      main: "",
      uniforms: [{ three_noise_seed: this._seed }],
    };

    this.perm = perm;
    this.gradP = gradP;
  }

  _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  _lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  _gradient(posInCell) {
    if (posInCell instanceof THREE.Vector3) {
      return posInCell.x + this.perm[posInCell.y + this.perm[posInCell.z]];
    } else {
      return posInCell.x + this.perm[posInCell.y];
    }
  }

  /**
   * Maps a number from one range to another.
   * @param {number} x       Input Number
   * @param {number} in_min  Current range minimum
   * @param {number} in_max  Current range maximum
   * @param {number} out_min New range minimum
   * @param {number} out_max New range maximum
   * @returns {number} Input Mapped to range [out_min, out_max]
   */
  static map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  /**
   * Samples 2D Perlin Nosie at given coordinates.
   * @param {THREE.Vector2 | THREE.Vector3} input Coordincates to sample at
   * @returns {number} Value of Perlin Noise at that coordinate.
   */
  get2(input) {
    if (input.z !== undefined) input = new THREE.Vector2(input.x, input.y);

    const cell = new THREE.Vector2(Math.floor(input.x), Math.floor(input.y));
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;

    const gradiantDot = [];
    for (let i = 0; i < 4; i++) {
      const s3 = this._offsetMatrix[i * 2];
      const s = new THREE.Vector2(s3.x, s3.y);

      const grad3 =
        this.gradP[this._gradient(new THREE.Vector2().addVectors(cell, s))];
      const grad2 = new THREE.Vector2(grad3.x, grad3.y);
      const dist2 = new THREE.Vector2().subVectors(input, s);

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

  /**
   * Samples 3D Perlin Nosie at given coordinates.
   * @param {THREE.Vector}3 input Coordincates to sample at
   * @returns {number} Value of Perlin Noise at that coordinate.
   */
  get3(input) {
    if (input.z === undefined)
      throw "Input to Perlin::get3() must be of type THREE.Vector3";

    const cell = new THREE.Vector3(
      Math.floor(input.x),
      Math.floor(input.y),
      Math.floor(input.z)
    );
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;
    cell.z &= 255;

    const gradiantDot = [];
    for (let i = 0; i < 8; i++) {
      const s = this._offsetMatrix[i];

      const grad3 =
        this.gradP[this._gradient(new THREE.Vector3().addVectors(cell, s))];
      const dist2 = new THREE.Vector3().subVectors(input, s);

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
