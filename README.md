<br />
<p align="center">
  <h1 align="center">TS-Noise</h1>

  <p align="center">
    Simple CPU gradient noise library. Now with fBm!
    <br />
    <a href="https://farazzshaikh.github.io/ts-noise/">View Demo</a>
    ·
    <a href="https://github.com/FarazzShaikh/three-noise/issues/new">Report Bug</a>
    ·
    <a href="mailto:farazzshikh@gmail.com">Hire me!</a>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/ts-noise"><img align="center" src="https://img.shields.io/npm/v/ts-noise?color=cc3534&style=for-the-badge" /></a>
  </p>
</p>

## Installation

```bash
npm i ts-noise
# or
yarn add ts-noise
```

## Usage

```js
import { Perlin, FBM } from "ts-noise";

// Instantiate. Seed optional
const perlin = new Perlin(seed);
const fbm = new FBM(seed, { ...fbmOptions });

perlin.get2(vector2); // Get 2D Perlin Nosie
perlin.get3(vector3); // Get 3D Perlin Nosie

fbm.get2(vector2); // Get 2D Perlin Nosie with fBm
fbm.get3(vector3); // Get 3D Perlin Nosie with fBm
```
