import * as THREE from "three";
import "./style.css";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Perlin } from "ts-noise";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(25, 25, 25);

const axes = new THREE.AxesHelper(20);
scene.add(axes);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const dlight = new THREE.DirectionalLight(0xffffff);
dlight.position.set(5, 5, -5);
scene.add(dlight);

const geometry = new THREE.SphereGeometry(10, 128, 128);
const material = new THREE.MeshNormalMaterial({ wireframe: false });
const sphere = new THREE.Mesh(geometry, material);

const perlin = new Perlin(Math.random());
scene.add(sphere);

const sposition = sphere.geometry.attributes.position.clone();
const snormal = sphere.geometry.attributes.normal.clone();
const l = sposition.count;

const animate = function (dt: number) {
  const position = sphere.geometry.attributes.position;

  for (let i = 0; i < l; i++) {
    const pos = new THREE.Vector3().fromBufferAttribute(sposition, i);
    const norm = new THREE.Vector3().fromBufferAttribute(snormal, i);
    const newPos = pos.clone();

    pos.multiplyScalar(0.3);
    pos.x += dt * 0.002;
    const n = perlin.get3(pos) * 10;

    newPos.add(norm.multiplyScalar(n));
    position.setXYZ(i, newPos.x, newPos.y, newPos.z);
  }

  position.needsUpdate = true;

  sphere.geometry.computeVertexNormals();
  sphere.geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate(0);
