import Sprite from "@/types/sprite";
import { TurnPosition } from ".";
import { CanvasBuilder } from "@/scripts/canvasBuilder";
import Utilities from "@/utilities/utilities";
import { ImagePath } from "./imagePath";

export default class Enemy {
	constructor(enemyInitializer: IEnemy, canvasAccessor: CanvasBuilder) {
		this.context = canvasAccessor.context;
		this.moveSprite = enemyInitializer.moveSprite;
		this.deathSprite = enemyInitializer.deathSprite;
		this.currentSprite = enemyInitializer.moveSprite;

		this.enemyId = enemyInitializer.enemyId;
		this.moveDirX = enemyInitializer.moveDirX;
		this.moveDirY = enemyInitializer.moveDirY;
		this.moveSpeed = enemyInitializer.moveSpeed;
		this.totalHP = enemyInitializer.totalHP;
		this.currentHp = enemyInitializer.totalHP;
		this.turnPositions = enemyInitializer.turnPositions;
		this.deathReward = enemyInitializer.deathReward;
		this.damageOnPass = enemyInitializer.damageOnPass;
		this.positionX = enemyInitializer.positionX;
		this.positionY = enemyInitializer.positionY;
		this.enemyLookingDir = this.moveDirX;
		this.name = enemyInitializer.name;
		this.innerType = enemyInitializer.type;
		this.imageCenter = {
			centerX: enemyInitializer.positionX + (enemyInitializer.moveSprite.pxWidth / 2),
			centerY: enemyInitializer.positionY + (enemyInitializer.moveSprite.pxHeight / 2),
		}
		this.dealDamage = enemyInitializer.dealDamage;
		this.releseEnemyAfterPass = enemyInitializer.releseEnemyAfterPass;
		this.deleteEnemy = enemyInitializer.deleteEnemy;
		this.deathAnimation = Utilities.createImage(ImagePath.lizardDeath);
	}
	private currentSprite: Sprite
	private deathSprite?: Sprite
	deathAnimation: HTMLImageElement;
	public enemyId: number;
	private innerType: EnemyType;
	private name: string;
	private dealDamage: (damage: number) => void;
	private deleteEnemy: (enemyId: number) => void;
	private releseEnemyAfterPass: (enemyId: number) => void;
	private positionX: number;
	private positionY: number;
	private moveSprite: Sprite;
	private context: CanvasRenderingContext2D;
	private totalHP: number;

	private turnPositions: TurnPosition[];

	public moveDirX: number;
	public moveDirY: number;
	private moveSpeed: number;


	private currentSpriteFrame: number = 0;
	private currentFrameChangeValue: number = 0;

	public readonly deathReward: number;
	private damageOnPass: number;
	private isAlive: boolean = true;
	private healthBarHeight = 6;
	private healthBarWidth = 64;
	private enemyLookingDir: number;
	public imageCenter: IImageCenter;
	public currentHp: number;

	get type() {
		return this.innerType;
	}

	get center() {
		return this.imageCenter;
	}

	get isTargetable(): boolean {
		return this.isAlive === true;
	}

	get isMovingBackward(): boolean {
		return this.enemyLookingDir === -1;
	}

	update() {
		if (this.isAlive) {
			this.move()
			this.animate();
			this.drawHp();
			this.drawCurrentSpriteFrame();
		}
		else {
			this.animateDeath();
		}
	}

	drawCurrentSpriteFrame() {
		const sprite = this.currentSprite;
		//this.context.fillRect(this.positionX, this.positionY, 256, 256);
		if ((!sprite.rotated && this.isMovingBackward) || (sprite.rotated && !this.isMovingBackward)) {
			Utilities.drawFlippedImage(
				this.context,
				sprite.image,
				this.positionX,
				this.positionY,
				sprite.xFramesStart + this.currentSpriteFrame * sprite.pxWidth,
				sprite.yFramesStart,
				sprite.pxWidth,
				sprite.pxHeight,
				sprite.pxWidth - sprite.rotatedXcorrelation,
				0,
				sprite.displayX,
				sprite.displayY
			)
		} else
			this.context.drawImage(sprite.image,
				sprite.xFramesStart + this.currentSpriteFrame * sprite.pxWidth,
				sprite.yFramesStart,
				sprite.pxWidth,
				sprite.pxHeight,
				this.positionX,
				this.positionY,
				sprite.displayX,
				sprite.displayY);
	}

	animate() {
		this.tryChangeAnimationFrame();
		this.tryRestartAnimation();
	}

	move() {
		this.tryTurn();
		this.moveToNextTurn();
		this.imageCenter = this.getImageCenter();
		if (this.positionX > screen.width && this.turnPositions.length === 0) {
			this.dealDamage(this.damageOnPass);
			this.releseEnemyAfterPass(this.enemyId);
		}
	}

	private animateDeath() {

		this.drawCurrentSpriteFrame();
		this.tryChangeAnimationFrame();
		if (this.currentSpriteFrame > this.currentSprite.framesAmount)
			this.deleteEnemy(this.enemyId);
	}

	private dropAnimationCounters() {
		this.currentFrameChangeValue = 0;
		this.currentSpriteFrame = 0;
	}


	setUnitDead() {
		this.isAlive = false;
		if (this.deathSprite)
			this.currentSprite = this.deathSprite
		this.dropAnimationCounters();
	}

	private getNewPositionAfterMove(position: number, moveSpeed: number, direction: number) {
		return position + moveSpeed * direction;
	}

	private getImageCenter(): IImageCenter {
		return {
			centerX: this.positionX + (this.currentSprite.displayX / 2) + this.currentSprite.uniqueXCorrelation,
			centerY: this.positionY + (this.currentSprite.displayY / 2) + this.currentSprite.uniqueYCorrelation
		};
	}

	tryTurn() {
		if (this.turnPositions.length == 0)
			return;

		if (isAtTurnPosition(getVectorToTurnPosition.call(this), this.moveSpeed)) {
			const turnPosition = this.turnPositions.shift();
			if (_.isUndefined(turnPosition))
				throw new Error('Turn position does not exist');
			this.moveDirX = turnPosition.dirX;
			this.moveDirY = turnPosition.dirY;
			if (turnPosition.dirX !== 0)
				this.enemyLookingDir = turnPosition.dirX;
		}
		this.fixMoveVector();
		function isAtTurnPosition(vectorToTurn: number, moveSpeed: number) {
			return vectorToTurn <= moveSpeed;
		}

		function getVectorToTurnPosition(this: Enemy) {
			const rangeToTurnX = this.imageCenter.centerX - this.turnPositions[0].xTurnStart;
			const rangeToTurnY = this.imageCenter.centerY - this.turnPositions[0].yTurnStart;
			return Math.sqrt(rangeToTurnX * rangeToTurnX + rangeToTurnY * rangeToTurnY);
		}
	}

	private moveToNextTurn() {
		if (this.turnPositions.length == 0) {
			this.positionX = this.getNewPositionAfterMove(this.positionX, this.moveSpeed, this.moveDirX);
			this.positionY = this.getNewPositionAfterMove(this.positionY, this.moveSpeed, this.moveDirY);
			return;
		}

		const rangeToTurnX = this.imageCenter.centerX - this.turnPositions[0].xTurnStart;
		const rangeToTurnY = this.imageCenter.centerY - this.turnPositions[0].yTurnStart;

		if (rangeToTurnX > 0 && rangeToTurnX + (this.moveSpeed * this.moveDirX) > rangeToTurnX) {
			if (Math.abs(rangeToTurnX) < Math.abs(this.moveSpeed))
				this.positionX = this.positionX - rangeToTurnX;
			else
				this.positionX = this.positionX - this.moveSpeed;
		}
		else {
			this.positionX = this.getNewPositionAfterMove(this.positionX, this.moveSpeed, this.moveDirX);
			this.positionY = this.getNewPositionAfterMove(this.positionY, this.moveSpeed, this.moveDirY);
		}
	}

	private fixMoveVector() {
		if (this.turnPositions.length == 0)
			return;

		const rangeToTurnX = this.imageCenter.centerX - this.turnPositions[0].xTurnStart;
		const rangeToTurnY = this.imageCenter.centerY - this.turnPositions[0].yTurnStart;

		if ((rangeToTurnY - (this.moveSpeed * this.moveDirY)) === rangeToTurnY && rangeToTurnY !== 0) {
			if (Math.abs(rangeToTurnY) < Math.abs(this.moveSpeed))
				this.positionY = this.positionY - rangeToTurnY;
			else
				this.positionY = this.positionY + (- this.moveSpeed * Math.sign(rangeToTurnY));
		}

		if ((rangeToTurnX - (this.moveSpeed * this.moveDirX)) === rangeToTurnX && rangeToTurnX !== 0) {
			if (Math.abs(rangeToTurnX) < Math.abs(this.moveSpeed))
				this.positionX = this.positionX - rangeToTurnX;
			else
				this.positionX = this.positionX + (- this.moveSpeed * Math.sign(rangeToTurnX));
		}


	}

	tryChangeAnimationFrame() {
		this.currentFrameChangeValue++;
		if (isTimeToChangeFrame.call(this)) {
			this.currentSpriteFrame++;
			this.currentFrameChangeValue = 0;
		}
		function isTimeToChangeFrame(this: Enemy) {
			return this.currentSprite.frameChangeRate === this.currentFrameChangeValue
		}
	}

	tryRestartAnimation() {
		if (isCurrentFrameLast.call(this))
			this.currentSpriteFrame = 0;

		function isCurrentFrameLast(this: Enemy) {
			return this.currentSpriteFrame > this.currentSprite.framesAmount
		}
	}

	drawHp() {
		const percentage = this.currentHp / this.totalHP;
		if (percentage < 0)
			return;

		this.context.fillStyle = '#c31010df';
		this.context.fillRect(this.positionX + this.currentSprite.pxWidth / 2 - this.currentSprite.hpBarXCorrelation,
			this.positionY + this.currentSprite.pxHeight / 2 - this.currentSprite.hpBarYCorrelation,
			this.healthBarWidth * percentage,
			this.healthBarHeight);
	}

}

export interface IEnemy extends IEnemyInitializer {
	dealDamage: (damage: number) => void;
	releseEnemyAfterPass: (enemyId: number) => void;
	deleteEnemy: (enemyId: number) => void;
	turnPositions: TurnPosition[];
	positionX: number;
	positionY: number;
	moveDirX: number;
	moveDirY: number;
	enemyId: number;
}


export interface IEnemyInitializer {
	name: string;
	moveSpeed: number;
	moveSprite: Sprite;
	deathSprite?: Sprite;
	totalHP: number;
	damageOnPass: number;
	deathReward: number;
	type: EnemyType;
}


export type DefaultEnemyType = {
	[keyof in EnemyType]: IEnemyInitializer
}

export interface IImageCenter {
	centerX: number;
	centerY: number;
}

export type EnemyType = 'demon' | 'robot' |
	'demonBoss' |
	'dragon' |
	'jinn' |
	'lizard' |
	'medusa' |
	'smallDragon';
