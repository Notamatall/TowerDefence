import Sprite from "@/types/sprite";

class Enemy extends Sprite {
	constructor({ id, x, y, startFrame, framesAmount, frameRate, height, width, startDirX, startDirY, moveSpeed, totalHP, turnArray, reward, damage }) {
		super(id, x, y, startFrame, framesAmount, frameRate, height, width);

		this.dirX = startDirX;
		this.dirY = startDirY;
		this.moveSpeed = moveSpeed;
		this.totalHP = totalHP;
		this.currentHp = totalHP;
		this.turnArray = turnArray;
		this.reward = reward;
		this.damage = damage;
	}

	//HP
	totalHP;
	currentHp;
	turnArray;

	//Move
	dirX;
	dirY;
	moveSpeed = 0;

	//Design
	healthBarHeight = 5;
	healthBarWidth = 64;

	//Utilities
	reward = 0;
	damage = 0;


	update() {
		this.move()
		this.animate();
		const image = demonImageList[this.currentFrame];
		this.drawHp();
		ctx.drawImage(image, 0, 0, image.width, image.height, this.x, this.y, this.width, this.height);
	}

	animate() {
		this.changeFrameCount++;
		this.tryChangeAnimationFrame();
		this.tryRestartAnimation();
	}

	tryChangeAnimationFrame() {
		if (this.frameRate == this.changeFrameCount) {
			this.currentFrame++;
			this.changeFrameCount = 0;
		}
	}

	tryRestartAnimation() {
		if (this.currentFrame > this.framesAmount)
			this.currentFrame = this.startFrame;
	}

	move() {
		this.tryTurn();
		this.x = this.x + this.moveSpeed * this.dirX;
		this.y = this.y + this.moveSpeed * this.dirY;
		this.center = { x: this.x + (this.width / 2), y: this.y + (this.height / 2) };
		if (this.x > screen.width) {
			userStatsProxy.userLife = userStatsProxy.userLife - this.damage;
			demonsList.splice(demonsList.findIndex(x => x.id == this.id), 1);
		}

	}

	tryTurn() {
		var a = this.x - this.turnArray[0]?.x;
		var b = this.y - this.turnArray[0]?.y;

		var c = Math.sqrt(a * a + b * b);

		if (c <= this.moveSpeed) {
			this.x = this.turnArray[0].x;
			this.y = this.turnArray[0].y;
			const turnPlace = this.turnArray.shift();
			this.dirX = turnPlace.dirX;
			this.dirY = turnPlace.dirY;
		}
	}

	drawHp() {
		ctx.fillStyle = '#c31010df';
		const percentage = this.currentHp / this.totalHP;
		if (percentage < 0)
			return;
		// ctx.fillRect(this.center.x, this.center.y - 500, 2, 1000);
		// ctx.fillRect(this.center.x - 500, this.center.y, 1000, 2);
		ctx.fillRect(this.center.x - this.width / 2.5, this.center.y - this.height / 4, this.healthBarWidth * percentage, this.healthBarHeight);
	}

}
