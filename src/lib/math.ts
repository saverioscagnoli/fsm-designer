class Vector2 {
  public x: number;
  public y: number;

  public static ZERO = new Vector2(0, 0);

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  public length() {
    return Math.sqrt(this.lengthSquared());
  }

  public normalize() {
    let l = this.length();

    if (l === 0) return;

    this.x /= l;
    this.y /= l;
  }
}

export { Vector2 };
