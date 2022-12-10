class SpriteGeneralInfo {
  constructor(x, y, startFrame, framesAmount, frameRate, height, width) {
    this.x = x;
    this.y = y;
    this.startFrame = startFrame;
    this.currentFrame = startFrame;
    this.framesAmount = framesAmount;
    this.frameRate = frameRate;
    this.dirX = dirX;
    this.dirY = dirY;
    this.height = height;
    this.width = width;
  }

  //Frame
  changeFrameCount;
  frameRate;
  startFrame;
  framesAmount;
  currentFrame;

  //Size
  height;
  width;

  //Location
  x;
  y;
}
