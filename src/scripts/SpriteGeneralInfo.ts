export default class SpriteGeneralInfo {
	constructor(id, x, y, startFrame, framesAmount, frameRate, height, width) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.startFrame = startFrame;
		this.currentFrame = startFrame;
		this.framesAmount = framesAmount;
		this.frameRate = frameRate;
		this.height = height;
		this.width = width;
		this.center = { x: x + (width / 2), y: y + (height / 2) }
	}

	//Frame
	id = null;
	changeFrameCount = 0;
	frameRate = 0;
	startFrame = 0;
	framesAmount = 0;
	currentFrame = 0;
	center = {};

	//Size
	height = 0;
	width = 0;

	//Location
	x = 0;
	y = 0;
}
