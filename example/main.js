import { OrbitControls } from "./lib/OrbitControls.js";

const { FBM } = THREE_Noise;

const size = {
  w: 40,
  h: 40,
  l: 5,
};

const cubes = [];

function genCubes(scene) {
  //   for (let x = 0; x < size.w; x++) {
  //     for (let y = 0; y < size.h; y++) {
  //       for (let z = 0; z < size.l; z++) {
  //         const geometry = new THREE.BoxGeometry(1, 1, 1);
  //         const material = new THREE.MeshNormalMaterial();
  //         const cube = new THREE.Mesh(geometry, material);

  //         cube.position.x = x - size.w / 2;
  //         cube.position.y = y - size.h / 2;
  //         cube.position.z = z - size.l / 2;

  //         cubes.push(cube);
  //         scene.add(cube);
  //       }
  //     }
  //   }

  for (let x = 0; x < size.w; x++) {
    for (let y = 0; y < size.h; y++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const cube = new THREE.Mesh(geometry, material);
      cubes.push(cube);
      cube.position.x = x - size.w / 2;
      cube.position.z = y - size.h / 2;

      scene.add(cube);
    }
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 25, 0);

const gridHelper = new THREE.GridHelper(30, 20);
scene.add(gridHelper);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const dlight = new THREE.DirectionalLight(0xffffff);
dlight.position.set(5, 5, -5);
scene.add(dlight);

genCubes(scene);

const fbm = new FBM({
  seed: 15,
  scale: 0.07,
  octaves: 4,
  persistance: 0.5,
  lacunarity: 2,
  redistribution: 1,
  height: 1,
});

cubes.forEach((cube, i) => {
  const pos = new THREE.Vector2(i % size.w, i / size.w);
  // const pos = new THREE.Vector3(
  //   i % size.l,
  //   (i / size.l) % size.h,
  //   i / (size.h * size.l)
  // );

  // pos.multiplyScalar(scale);
  pos.addScalar(1 / 10000);
  const n = fbm.get(pos);

  const c = Math.floor(n * 255);
  cube.position.y = n * 10;

  // if (n <= 0.5) cube.visible = false;
  // else cube.visible = true;

  cube.material.color = new THREE.Color(`rgb(${c}, ${c}, ${c})`);
});

const animate = function (dt) {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
