export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  sub(v: Vector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }

  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  addVectors(a: Vector3, b: Vector3) {
    const newVector = new Vector3();
    newVector.x = a.x + b.x;
    newVector.y = a.y + b.y;
    newVector.z = a.z + b.z;
    return newVector;
  }

  subVectors(a: Vector3, b: Vector3) {
    const newVector = new Vector3();
    newVector.x = a.x - b.x;
    newVector.y = a.y - b.y;
    newVector.z = a.z - b.z;
    return newVector;
  }
}
