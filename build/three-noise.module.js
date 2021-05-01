import * as THREE from 'three';

class Perlin {
  #seed = 0;
  #gradientVecs;
  #offsetMatrix;

  constructor(seed) {
    this.#seed = seed;
    this.#gradientVecs = [
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
    this.#offsetMatrix = [
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

  #fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  #lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  #hash(a) {
    a = a ^ 61 ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    a = a ^ (a >> 15);
    return a;
  }

  #gradient(posInCell) {
    let gradientVecIndex;

    const x = this.#hash(this.#seed + posInCell.x);
    const y = this.#hash(this.#seed + x + posInCell.y);

    if (posInCell instanceof THREE.Vector3)
      gradientVecIndex = this.#hash(this.#seed + y + posInCell.z) % 12;
    else gradientVecIndex = y % 4;

    return gradientVecIndex;
  }

  static map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  perlin2(input) {
    if (!(input instanceof THREE.Vector2))
      throw "Input to Noise::perlin2() must be of type THREE.Vector2";

    const cell = new THREE.Vector2(Math.floor(input.x), Math.floor(input.y));
    const posInCell = input.sub(cell);

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    cell.x &= 255;
    cell.y &= 255;

    const gradiantDot = [];
    for (let i = 0; i < 4; i++) {
      const s3 = this.#offsetMatrix[i];
      const s = new THREE.Vector2(s3.x, s3.y);

      const grad3 = this.#gradientVecs[
        this.#gradient(new THREE.Vector2(0, 0).addVectors(cell, s))
      ];
      const grad2 = new THREE.Vector2(grad3.x, grad3.y);
      const dist2 = new THREE.Vector2(0, 0).subVectors(posInCell, s);

      gradiantDot.push(grad2.dot(dist2));
    }

    // Compute the this.fade curve value for x, y, z
    const u = this.#fade(posInCell.x);
    const v = this.#fade(posInCell.y);

    const value = this.#lerp(
      this.#lerp(gradiantDot[0], gradiantDot[2], u),
      this.#lerp(gradiantDot[1], gradiantDot[3], u),
      v
    );

    // Interpolate
    return Perlin.map(value, -1, 1, 0, 1);
  }

  perlin3(input) {
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
      const s = this.#offsetMatrix[i];

      const grad3 = this.#gradientVecs[
        this.#gradient(new THREE.Vector3(0, 0, 0).addVectors(cell, s))
      ];
      const dist2 = new THREE.Vector3(0, 0, 0).subVectors(posInCell, s);

      gradiantDot.push(grad3.dot(dist2));
    }

    // Compute the this.fade curve value for x, y, z
    const u = this.#fade(posInCell.x);
    const v = this.#fade(posInCell.y);
    const w = this.#fade(posInCell.z);

    const value = this.#lerp(
      this.#lerp(
        this.#lerp(gradiantDot[0], gradiantDot[4], u),
        this.#lerp(gradiantDot[1], gradiantDot[5], u),
        w
      ),
      this.#lerp(
        this.#lerp(gradiantDot[2], gradiantDot[6], u),
        this.#lerp(gradiantDot[3], gradiantDot[7], u),
        w
      ),
      v
    );

    // Interpolate
    return Perlin.map(value, -1, 1, 0, 1);
  }
}

class FBM {
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

export { FBM, Perlin };
