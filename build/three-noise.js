var THREE_Noise = (function (exports, THREE) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

    var header = `

uniform int three_noise_seed;

vec3 three_noise_gradientVecs[12] = vec3[](
    // 2D Vecs
    vec3(1, 1, 0),
    vec3(-1, 1, 0),
    vec3(1, -1, 0),
    vec3(-1, -1, 0),
    // + 3D Vecs
    vec3(1, 0, 1),
    vec3(-1, 0, 1),
    vec3(1, 0, -1),
    vec3(-1, 0, -1),
    vec3(0, 1, 1),
    vec3(0, -1, 1),
    vec3(0, 1, -1),
    vec3(0, -1, -1)
);

vec3 three_noise_offsetMatrix[8] = vec3[](
    // 2D Vecs
    vec3(0, 0, 0),
    vec3(0, 1, 0),
    vec3(1, 0, 0),
    vec3(1, 1, 0),
    // + 3D Vecs
    vec3(0, 0, 1),
    vec3(0, 1, 1),
    vec3(1, 0, 1),
    vec3(1, 1, 1)
);

int three_noise_hash(int a) {
    a = a ^ 61 ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    a = a ^ (a >> 15);
    return a;
}

int three_noise_gradient(vec2 posInCell) {
    int x = three_noise_hash(three_noise_seed + int(posInCell.x));
    int y = three_noise_hash(three_noise_seed + x + int(posInCell.y));
    return y % 4;
}

float three_noise_fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}


float perlin(vec2 pos) {
    vec2 cell = floor(pos);
    vec2 posInCell = pos - cell;

    float gradiantDot[4];
    for (int i = 0; i < 4; i++) {
        vec3 s3 = three_noise_offsetMatrix[i];
        vec2 s = s3.xy;

        vec3 grad3 = three_noise_gradientVecs[
            three_noise_gradient(cell + s)
        ];
        vec2 grad2 = grad3.xy;
        vec2 dist2 = posInCell - s;
    
        gradiantDot[i] = dot(grad2, dist2);
    }

    // Compute the this.fade curve value for x, y, z
    float u = three_noise_fade(posInCell.x);
    float v = three_noise_fade(posInCell.y);

    float value = mix(
        mix(gradiantDot[0], gradiantDot[2], u),
        mix(gradiantDot[1], gradiantDot[3], u),
        v
    );

    return value;
}

`;

    /**
     * An implimentation of Perlin Noise by Ken Perlin.
     */
    class Perlin {
      _seed = 0;
      _gradientVecs;
      _offsetMatrix;

      /**
       * GLSL Shader Chunk for 2D Perlin Noise. Can be used with
       * three-CustomShaderMaterial.
       * See: <a href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial">three-CustomShaderMaterial</a>
       */
      shaderChunk;

      /**
       *
       * @param {number} seed Seed Value for PRNG.
       */
      constructor(seed) {
        this._seed = seed;
        this._gradientVecs = [
          // 2D Vecs
          new THREE__namespace.Vector3(1, 1, 0),
          new THREE__namespace.Vector3(-1, 1, 0),
          new THREE__namespace.Vector3(1, -1, 0),
          new THREE__namespace.Vector3(-1, -1, 0),
          // + 3D Vecs
          new THREE__namespace.Vector3(1, 0, 1),
          new THREE__namespace.Vector3(-1, 0, 1),
          new THREE__namespace.Vector3(1, 0, -1),
          new THREE__namespace.Vector3(-1, 0, -1),
          new THREE__namespace.Vector3(0, 1, 1),
          new THREE__namespace.Vector3(0, -1, 1),
          new THREE__namespace.Vector3(0, 1, -1),
          new THREE__namespace.Vector3(0, -1, -1),
        ];
        this._offsetMatrix = [
          // 2D Vecs
          new THREE__namespace.Vector3(0, 0, 0),
          new THREE__namespace.Vector3(0, 1, 0),
          new THREE__namespace.Vector3(1, 0, 0),
          new THREE__namespace.Vector3(1, 1, 0),
          // + 3D Vecs
          new THREE__namespace.Vector3(0, 0, 1),
          new THREE__namespace.Vector3(0, 1, 1),
          new THREE__namespace.Vector3(1, 0, 1),
          new THREE__namespace.Vector3(1, 1, 1),
        ];

        this.shaderChunk = {
          defines: "",
          header: header,
          main: "",
          uniforms: [{ three_noise_seed: this._seed }],
        };
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

        if (posInCell instanceof THREE__namespace.Vector3)
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
        if (!(input instanceof THREE__namespace.Vector2))
          throw "Input to Noise::perlin2() must be of type THREE.Vector2";

        const cell = new THREE__namespace.Vector2(Math.floor(input.x), Math.floor(input.y));
        const posInCell = input.sub(cell);

        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        cell.x &= 255;
        cell.y &= 255;

        const gradiantDot = [];
        for (let i = 0; i < 4; i++) {
          const s3 = this._offsetMatrix[i];
          const s = new THREE__namespace.Vector2(s3.x, s3.y);

          const grad3 = this._gradientVecs[
            this._gradient(new THREE__namespace.Vector2(0, 0).addVectors(cell, s))
          ];
          const grad2 = new THREE__namespace.Vector2(grad3.x, grad3.y);
          const dist2 = new THREE__namespace.Vector2(0, 0).subVectors(posInCell, s);

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
        if (!(input instanceof THREE__namespace.Vector3))
          throw "Input to Noise::perlin3() must be of type THREE.Vector3";

        const cell = new THREE__namespace.Vector3(
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
            this._gradient(new THREE__namespace.Vector3(0, 0, 0).addVectors(cell, s))
          ];
          const dist2 = new THREE__namespace.Vector3(0, 0, 0).subVectors(posInCell, s);

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

    /**
     * This class is an implimentaiton of a Fractal Brownian Motion
     * function using Perlin Nosie.
     */
    class FBM {
      _scale;
      _persistance;
      _lacunarity;
      _octaves;
      _redistribution;
      _noise;

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
        this._noise = new Perlin(seed);
        this._scale = scale ?? 1;
        this._persistance = persistance ?? 0.5;
        this._lacunarity = lacunarity ?? 2;
        this._octaves = octaves ?? 6;
        this._redistribution = redistribution ?? 1;
      }

      /**
       * Sample 2D or 3D Perlin Noise with fBm at given
       * coordinates. The function will use <code>Perlin_get2</code> or <code>Perlin_get3</code>
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
          input instanceof THREE__namespace.Vector3
            ? this._noise.get3.bind(this._noise)
            : this._noise.get2.bind(this._noise);

        for (let i = 0; i < this._octaves; i++) {
          const position = new THREE__namespace.Vector2(
            input.x * this._scale * frequency,
            input.y * this._scale * frequency
          );

          const noiseVal = noiseFunction(position) * 2 - 1;
          result += noiseVal * amplitude;

          frequency *= this._lacunarity;
          amplitude *= this._persistance;
          max += amplitude;
        }

        const redistributed = Math.pow(result, this._redistribution);
        return redistributed / max + 0.5;
      }
    }

    exports.FBM = FBM;
    exports.Perlin = Perlin;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, THREE));
