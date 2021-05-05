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

    var p = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180,
    ];

    /**
     * An implimentation of Perlin Noise by Ken Perlin.
     */
    class Perlin {
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
        const _gradientVecs = [
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
          new THREE__namespace.Vector3(0, 0, 0),
          new THREE__namespace.Vector3(0, 0, 1),
          new THREE__namespace.Vector3(0, 1, 0),
          new THREE__namespace.Vector3(0, 1, 1),
          new THREE__namespace.Vector3(1, 0, 0),
          new THREE__namespace.Vector3(1, 0, 1),
          new THREE__namespace.Vector3(1, 1, 0),
          new THREE__namespace.Vector3(1, 1, 1),
        ];

        this.shaderChunk = {
          defines: "",
          header: header,
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
        if (posInCell instanceof THREE__namespace.Vector3) {
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
        if (input.z !== undefined) input = new THREE__namespace.Vector2(input.x, input.y);

        const cell = new THREE__namespace.Vector2(Math.floor(input.x), Math.floor(input.y));
        input.sub(cell);

        cell.x &= 255;
        cell.y &= 255;

        const gradiantDot = [];
        for (let i = 0; i < 4; i++) {
          const s3 = this._offsetMatrix[i * 2];
          const s = new THREE__namespace.Vector2(s3.x, s3.y);

          const grad3 = this.gradP[
            this._gradient(new THREE__namespace.Vector2().addVectors(cell, s))
          ];
          const grad2 = new THREE__namespace.Vector2(grad3.x, grad3.y);
          const dist2 = new THREE__namespace.Vector2().subVectors(input, s);

          gradiantDot.push(grad2.dot(dist2));
        }

        const u = this._fade(input.x);
        const v = this._fade(input.y);

        const value = this._lerp(
          this._lerp(gradiantDot[0], gradiantDot[2], u),
          this._lerp(gradiantDot[1], gradiantDot[3], u),
          v
        );

        return Perlin.map(value, -1, 1, 0, 1);
      }

      /**
       * Samples 3D Perlin Nosie at given coordinates.
       * @param {THREE.Vector}3 input Coordincates to sample at
       * @returns {number} Value of Perlin Noise at that coordinate.
       */
      get3(input) {
        if (input.z === undefined)
          throw "Input to Perlin::get3() must be of type THREE.Vector3";

        const cell = new THREE__namespace.Vector3(
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

          const grad3 = this.gradP[
            this._gradient(new THREE__namespace.Vector3().addVectors(cell, s))
          ];
          const dist2 = new THREE__namespace.Vector3().subVectors(input, s);

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

        return Perlin.map(value, -1, 1, 0, 1);
      }
    }

    /**
     * This class is an implimentaiton of a Fractal Brownian Motion
     * function using Perlin Nosie.
     */
    class FBM {
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
        this._scale = scale || 1;
        this._persistance = persistance || 0.5;
        this._lacunarity = lacunarity || 2;
        this._octaves = octaves || 6;
        this._redistribution = redistribution || 1;
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
