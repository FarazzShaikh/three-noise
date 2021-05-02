import * as THREE from "three";

/**
 * An implimentation of Perlin Noise by Ken Perlin.
 */
export class Perlin {
  _seed = 0;
  _gradientVecs;
  _offsetMatrix;

  /**
   *
   * @param {number} seed Seed Value for PRNG.
   */
  constructor(seed) {
    this._seed = seed;
    this._gradientVecs = [
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
    this._offsetMatrix = [
      // 2D Vecs
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 1, 0),
      // + 3D Vecs
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 1, 1),
    ];
  }

  _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  _lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  _hash(a) {
    a = a ^ 61 ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    a = a ^ (a >> 15);
    return a;
  }

  _gradient(posInCell) {
    let gradientVecIndex;

    const x = this._hash(this._seed + posInCell.x);
    const y = this._hash(this._seed + x + posInCell.y);

    if (posInCell instanceof THREE.Vector3)
      gradientVecIndex = this._hash(this._seed + y + posInCell.z) % 12;
    else gradientVecIndex = y % 4;

    return gradientVecIndex;
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
   * @param {THREE.Vector2} input Coordincates to sample at
   * @returns {number} Value of Perlin Noise at that coordinate.
   */
  get2(input) {
    if (!(input instanceof THREE.Vector2))
      throw "Input to Noise::perlin2() must be of type THREE.Vector2";

    const cell = new THREE.Vector2(Math.floor(input.x), Math.floor(input.y));
    const posInCell = input.sub(cell);

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    cell.x &= 255;
    cell.y &= 255;

    const gradiantDot = [];
    for (let i = 0; i < 4; i++) {
      const s3 = this._offsetMatrix[i];
      const s = new THREE.Vector2(s3.x, s3.y);

      const grad3 = this._gradientVecs[
        this._gradient(new THREE.Vector2(0, 0).addVectors(cell, s))
      ];
      const grad2 = new THREE.Vector2(grad3.x, grad3.y);
      const dist2 = new THREE.Vector2(0, 0).subVectors(posInCell, s);

      gradiantDot.push(grad2.dot(dist2));
    }

    // Compute the this.fade curve value for x, y, z
    const u = this._fade(posInCell.x);
    const v = this._fade(posInCell.y);

    const value = this._lerp(
      this._lerp(gradiantDot[0], gradiantDot[2], u),
      this._lerp(gradiantDot[1], gradiantDot[3], u),
      v
    );

    // Interpolate
    return Perlin.map(value, -1, 1, 0, 1);
  }

  /**
   * Samples 3D Perlin Nosie at given coordinates.
   * @param {THREE.Vector}3 input Coordincates to sample at
   * @returns {number} Value of Perlin Noise at that coordinate.
   */
  get3(input) {
    if (!(input instanceof THREE.Vector3))
      throw "Input to Noise::perlin3() must be of type THREE.Vector3";

    const cell = new THREE.Vector3(
      Math.floor(input.x),
      Math.floor(input.y),
      Math.floor(input.z)
    );
    const posInCell = input.sub(cell);

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    cell.x &= 255;
    cell.y &= 255;
    cell.z &= 255;

    const gradiantDot = [];
    for (let i = 0; i < 8; i++) {
      const s = this._offsetMatrix[i];

      const grad3 = this._gradientVecs[
        this._gradient(new THREE.Vector3(0, 0, 0).addVectors(cell, s))
      ];
      const dist2 = new THREE.Vector3(0, 0, 0).subVectors(posInCell, s);

      gradiantDot.push(grad3.dot(dist2));
    }

    // Compute the this.fade curve value for x, y, z
    const u = this._fade(posInCell.x);
    const v = this._fade(posInCell.y);
    const w = this._fade(posInCell.z);

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

    // Interpolate
    return Perlin.map(value, -1, 1, 0, 1);
  }
}
