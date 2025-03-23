export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
  }

  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }

  addVectors(a: Vector2, b: Vector2) {
    const newVector = new Vector2();
    newVector.x = a.x + b.x;
    newVector.y = a.y + b.y;
    return newVector;
  }

  subVectors(a: Vector2, b: Vector2) {
    const newVector = new Vector2();
    newVector.x = a.x - b.x;
    newVector.y = a.y - b.y;
    return newVector;
  }
}
