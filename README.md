<br />
<p align="center">
  <h1 align="center">THREE-Noise</h1>

  <p align="center">
    Simple gradient noise library for use with Three.js. Now with fBm!
    <br />
    <a href="https://farazzshaikh.github.io/three-noise/example/index.html">View Demo</a>
    ·
    <a href="https://github.com/FarazzShaikh/three-noise/issues/new">Report Bug</a>
    ·
    <a href="https://farazzshaikh.github.io/three-noise/index.html">API Docs</a>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/three-noise"><img align="center" src="https://img.shields.io/npm/v/three-noise?color=cc3534&style=for-the-badge" /></a>
  </p>
</p>



## Installation

Make sure to have ThreeJS installed.
```bash
$ npm i three
```

Install through NPM
```bash
$ npm i three-noise
```

For Browsers, download `build/three-noise.js`.

## Importing

### Browser

In your HTML
```html
<script src="lib/three-noise.js"></script>
<script src="./main.js" defer></script>
```

Then, in your JavaScript you can use the `THREE_Noise` object.
```js
const { Perlin, FBM } = THREE_Noise;
```

### NodeJS
In NodeJS, you can import it like you normally do.
```js
import { Perlin, FBM } from 'THREE_Noise';
```

## Usage

### Perlin
```js
// Instantiate the class with a seed
const perlin = new Perlin(Math.random())

perlin.get2(vector2)   // Get 2D Perlin Nosie
perlin.get3(vector3)   // Get 3D Perlin Nosie
```

### fBm
```js
// Instantiate the class with a seed
const fbm = new FBM({
    seed: Math.random()
})

fbm.get(vector2)      // Get 2D Perlin Nosie with fBm
fbm.get(vector3)      // Get 3D Perlin Nosie with fBm
```
