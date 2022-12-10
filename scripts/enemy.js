
class Enemy {
  constructor(x, y, startFrame, framesAmount, frameRate, height, width, dirX = null, dirY = null) {
    this.x = x;
    this.y = y;
    this.startFrame = startFrame;
    this.framesAmount = framesAmount;
    this.frame = startFrame;
    this.frameRate = frameRate;
    this.dirX = dirX;
    this.dirY = dirY;
    this.height = height;
    this.width = width;
  }
  changeFrameCount = 0;
  currentHp;
  dirX;
  dirY;
  frameRate;
  startFrame;
  framesAmount;
  frame;
  angle = 0;
  x;
  height;
  width;
  y;
  turnPlaceList = [];

  animate() {
    this.changeFrameCount++;
    this.tryChangeAnimationFrame();
    return this.tryRestartAnimation();
  }

  tryChangeAnimationFrame() {
    if (this.frameRate == this.changeFrameCount) {
      this.frame++;
      this.changeFrameCount = 0;
    }
  }

  tryRestartAnimation() {
    if (this.frame > this.framesAmount) {
      this.frame = this.startFrame;
      return true;
    }
    return false;
  }

  move(speed) {

    if (this.turnPlaceList[0]?.x === this.x &&
      this.turnPlaceList[0]?.y === this.y) {
      const turnPlace = this.turnPlaceList.shift();
      this.dirX = turnPlace.dirX;
      this.dirY = turnPlace.dirY;
    }

    this.x = this.x + speed * this.dirX;
    this.y = this.y + speed * this.dirY;
  }
  busy = false;
  drawHp(ctx) {
    ctx.fillStyle = 'red';
    const percentage = this.currentHp / this.hp;
    if (percentage < 0)
      return;
    ctx.fillRect(this.x + this.width / 6, this.y + this.height / 4, 64 * percentage, 5);
  }

}
