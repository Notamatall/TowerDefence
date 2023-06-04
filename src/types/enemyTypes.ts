import Sprite from "@/types/sprite";
import { TurnPosition } from ".";
import Configurator from "@/scripts/configurator";
import { CanvasBuilder } from "@/scripts/canvasBuilder";
import Utilities from "@/utilities/utilities";

export default class Enemy {
	constructor(enemyInitializer: IEnemy, canvasAccessor: CanvasBuilder) {
		this.context = canvasAccessor.context;
		this.sprite = enemyInitializer.sprite;
		this.frameChangeRate = enemyInitializer.frameChangeRate;
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
		this.name = enemyInitializer.name;
		this.innerType = enemyInitializer.type;
		this.imageCenter = {
			centerX: enemyInitializer.positionX + (enemyInitializer.sprite.pxWidth / 2),
			centerY: enemyInitializer.positionY + (enemyInitializer.sprite.pxHeight / 2),
		}
		this.dealDamage = enemyInitializer.dealDamage;
		this.releseEnemyAfterPass = enemyInitializer.releseEnemyAfterPass;
	}
	public enemyId: number;
	private innerType: EnemyType;
	private name: string;
	private dealDamage: (damage: number) => void;
	private releseEnemyAfterPass: (enemyId: number) => void;
	private positionX: number;
	private positionY: number;
	private sprite: Sprite;
	private context: CanvasRenderingContext2D;
	private totalHP: number;

	private turnPositions: TurnPosition[];

	private moveDirX: number;
	private moveDirY: number;
	private moveSpeed: number;
	private frameChangeRate: number;

	private currentSpriteFrame: number = 0;
	private currentFrameChangeValue: number = 0;

	public readonly deathReward: number;
	private damageOnPass: number;

	private healthBarHeight = 5;
	private healthBarWidth = 64;

	public imageCenter: IImageCenter;
	public currentHp: number;

	get type() {
		return this.innerType;
	}

	get center() {
		return this.imageCenter;
	}
	update() {

		this.move()
		this.animate();
		this.drawHp();
		this.drawCurrentSpriteFrame();
	}

	drawCurrentSpriteFrame() {
		const sprite = this.sprite;
		if (this.sprite.rotated) {
			Utilities.drawFlippedImage(
				this.context,
				sprite.image,
				this.positionX,
				this.positionY,
				sprite.xFramesStart + this.currentSpriteFrame * sprite.pxWidth,
				sprite.yFramesStart,
				sprite.pxWidth,
				sprite.pxHeight,
				sprite.pxWidth,
				0,
				sprite.pxWidth,
				sprite.pxHeight
			)
		} else
			this.context.drawImage(sprite.image,
				sprite.xFramesStart + this.currentSpriteFrame * sprite.pxWidth,
				sprite.yFramesStart,
				sprite.pxWidth,
				sprite.pxHeight,
				this.positionX,
				this.positionY,
				this.sprite.displayX,
				this.sprite.displayY);
	}

	animate() {
		this.tryChangeAnimationFrame();
		this.tryRestartAnimation();
	}

	move() {
		this.tryTurn();
		this.positionX = this.getNewPositionAfterMove(this.positionX, this.moveSpeed, this.moveDirX);
		this.positionY = this.getNewPositionAfterMove(this.positionY, this.moveSpeed, this.moveDirY);
		this.imageCenter = this.getImageCenter();
		if (this.positionX > screen.width) {
			this.dealDamage(this.damageOnPass);
			this.releseEnemyAfterPass(this.enemyId);
		}
	}

	private getNewPositionAfterMove(position: number, moveSpeed: number, direction: number) {
		return position + moveSpeed * direction;
	}

	private getImageCenter(): IImageCenter {
		return {
			centerX: this.positionX + (this.sprite.pxWidth / 2) + this.sprite.uniqueXCorrelation,
			centerY: this.positionY + (this.sprite.pxHeight / 2) + this.sprite.uniqueYCorrelation
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
		}
		else {
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

		function isAtTurnPosition(vectorToTurn: number, moveSpeed: number) {
			return vectorToTurn <= moveSpeed;
		}

		function getVectorToTurnPosition(this: Enemy) {

			const rangeToTurnX = this.imageCenter.centerX - this.turnPositions[0].xTurnStart;
			const rangeToTurnY = this.imageCenter.centerY - this.turnPositions[0].yTurnStart;
			//console.log(rangeToTurnX, rangeToTurnY)
			return Math.sqrt(rangeToTurnX * rangeToTurnX + rangeToTurnY * rangeToTurnY);
		}
	}

	tryChangeAnimationFrame() {
		this.currentFrameChangeValue++;
		if (isTimeToChangeFrame.call(this)) {
			this.currentSpriteFrame++;
			this.currentFrameChangeValue = 0;
		}
		function isTimeToChangeFrame(this: Enemy) {
			return this.frameChangeRate === this.currentFrameChangeValue
		}
	}

	tryRestartAnimation() {
		if (isCurrentFrameLast.call(this))
			this.currentSpriteFrame = 0;

		function isCurrentFrameLast(this: Enemy) {
			return this.currentSpriteFrame > this.sprite.framesAmount
		}
	}

	drawHp() {
		this.context.fillStyle = '#c31010df';
		const percentage = this.currentHp / this.totalHP;
		if (percentage < 0)
			return;
		// ctx.fillRect(this.center.x, this.center.y - 500, 2, 1000);
		// ctx.fillRect(this.center.x - 500, this.center.y, 1000, 2);
		this.context.fillRect(this.imageCenter.centerX,
			this.imageCenter.centerY - this.sprite.pxHeight / 2,
			this.healthBarWidth * percentage,
			this.healthBarHeight);
	}

}

export interface IEnemy extends IEnemyInitializer {
	dealDamage: (damage: number) => void;
	releseEnemyAfterPass: (enemyId: number) => void;
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
	sprite: Sprite;
	totalHP: number;
	damageOnPass: number;
	deathReward: number;
	frameChangeRate: number;
	type: EnemyType;
	enemyImgSrc: string;
}


export type DefaultEnemyType = {
	[keyof in EnemyType]: IEnemyInitializer
}

export interface IImageCenter {
	centerX: number;
	centerY: number;
}

export type EnemyType = 'demon' |
	'demonBoss' |
	'dragon' |
	'jinn' |
	'lizard' |
	'medusa' |
	'smallDragon';
