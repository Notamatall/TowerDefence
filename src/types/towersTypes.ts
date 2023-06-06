import { CanvasBuilder } from "@/scripts/canvasBuilder";
import Enemy, { IImageCenter } from "./enemyTypes";
import Sprite from "./sprite";
import Utilities from "@/utilities/utilities";
import Towers from "@/scripts/towers";


export class Tower {
	constructor(towerInitializer: ITower, canvasAccessor: CanvasBuilder) {
		this.type = towerInitializer.type;
		this.context = canvasAccessor.context;
		this.framesAmount = towerInitializer.framesAmount ? towerInitializer.framesAmount : 0;
		this.frameChangeRate = towerInitializer.frameRate ? towerInitializer.frameRate : 0;
		this.attackDamage = towerInitializer.attackDamage ? towerInitializer.attackDamage : 0;
		this.attackRadius = towerInitializer.attackRadius ? towerInitializer.attackRadius : 0;
		this.towerId = towerInitializer.towerId;
		this.getAttackTargetInRadius = towerInitializer.getAttackTargetInRadius;
		this.removeTargetForTowers = towerInitializer.removeTargetForTowers;
		this.type = towerInitializer.type;
		this.price = towerInitializer.price;
		this.name = towerInitializer.name;
		this.positionX = towerInitializer.positionX;
		this.positionY = towerInitializer.positionY;
		this.sprite = towerInitializer.sprite;

		this.imageCenter = {
			centerX: this.positionX + this.sprite.pxWidth / 2,
			centerY: this.positionY + this.sprite.pxHeight / 2
		}

		if (this.attackRadius) {
			this.towerCircleRadius = new Path2D();
			this.towerCircleRadius.arc(this.imageCenter.centerX, this.imageCenter.centerY, this.attackRadius, 0, 2 * Math.PI);
		}
		this.audio = new Audio(towerInitializer.fireAudio);
		this.audio.volume = 0.4;
		this.upgradeType = towerInitializer.upgradeType;
	}
	private audio: HTMLAudioElement | undefined;

	private towerCircleRadius?: Path2D;
	private getAttackTargetInRadius: (searchRadius: Path2D) => Enemy | undefined;
	private removeTargetForTowers: (target: Enemy) => void;
	private context: CanvasRenderingContext2D;
	private imageCenter: IImageCenter;
	private rotationAngle: number = 0;

	private type: TowerType;
	private framesAmount: number;
	private frameChangeRate: number;
	private attackDamage: number;
	private attackRadius: number;
	private price: number;
	private name: string;
	private upgradeType?: TowerType;
	public currentFrameChangeValue: number = 0;
	public currentSpriteFrame: number = 0;
	public attackTarget: Enemy | null = null;
	public positionX: number;
	public positionY: number;
	public sprite: Sprite;
	public readonly towerId: number;

	get towerPrice() {
		return this.price;
	}

	get towerType() {
		return this.type;
	}

	get towerUpgradeType() {
		return this.upgradeType;
	}

	update() {

		if (hasTarget.call(this))
			this.attack();
		else
			this.searchAttackTarget();

		this.drawTower();

		function hasTarget(this: Tower) {
			return this.attackTarget != null
		}
	}

	public upgrade() {
		if (this.upgradeType) {
			const upgradeTemplate = Towers.getTowerByType(this.upgradeType);
			if (upgradeTemplate) {
				_.merge(this, upgradeTemplate);
				this.upgradeType = upgradeTemplate.upgradeType;
			}
		}
	}

	private drawTower() {
		const spriteStartAngle = 90;
		const sprite = this.sprite;

		Utilities.drawRotatedImage(
			this.context,
			sprite.image,
			this.imageCenter.centerX,
			this.imageCenter.centerY,
			this.currentSpriteFrame * sprite.pxWidth, 0,
			sprite.pxWidth,
			128,
			-(sprite.pxWidth / 2),
			-(sprite.pxHeight / 2),
			128,
			128,
			this.rotationAngle + spriteStartAngle);

	}

	private searchAttackTarget() {
		const target = this.getAttackTargetInRadius(this.towerCircleRadius!)
		if (target) {
			this.attackTarget = target;
			this.currentSpriteFrame = 0;
			this.currentFrameChangeValue = 0;
		}
	}

	private attack() {
		if (isInAttackRadius.call(this) === false) {
			this.attackTarget = null;
			this.currentSpriteFrame = 0;
		}
		else {
			this.fireAndRotate();
		}

		function isInAttackRadius(this: Tower) {
			return this.context.isPointInPath(this.towerCircleRadius!,
				this.attackTarget!.center.centerX,
				this.attackTarget!.center.centerY)
		}
	}

	animate() {
		this.tryChangeAnimationFrame();
		return this.tryRestartAnimation();
	}

	private tryRestartAnimation() {
		if (this.currentSpriteFrame == this.framesAmount) {
			this.currentSpriteFrame = 0;
			return true;
		}
		return false;
	}

	private tryChangeAnimationFrame() {
		this.currentFrameChangeValue++;
		if (isTimeToChangeFrame.call(this)) {
			this.currentSpriteFrame++;
			this.currentFrameChangeValue = 0;
		}
		function isTimeToChangeFrame(this: Tower) {
			return this.frameChangeRate === this.currentFrameChangeValue
		}
	}

	private getAngleToAttackTarget() {
		let angle = Math.atan2(this.attackTarget!.center.centerY - this.imageCenter.centerY, this.attackTarget!.center.centerX - this.imageCenter.centerX);
		return angle * (180 / Math.PI);
	}

	private fireAndRotate() {
		if (this.attackTarget === null)
			return;

		this.rotationAngle = this.getAngleToAttackTarget();
		if (this.animate()) {
			this.playShotAudio();
			this.attackTarget.currentHp = this.attackTarget.currentHp - this.attackDamage;
			if (this.attackTarget.currentHp <= 0) {
				this.onEnemyKilled();
			}
		}
	}

	private playShotAudio() {
		if (this.audio) {
			this.audio.play().catch(e => e);
		}
	}

	private onEnemyKilled() {
		if (this.attackTarget === null)
			throw new Error('Attack target is null - cannot be possible');
		this.removeTargetForTowers(this.attackTarget);
	}

}

export type TowerType = 'platform' |
	'singleBarrelCannon' |
	'doubleBarrelCannon' |
	'doubleBarrelCannonPlus' |
	'tripleBarrelCannon' |
	'simpleLaserCannon' |
	'advancedLaserCannon' |
	'supremeLaserCannon' |
	'supremeLaserCannonPlus';

export type DefaultTowerType = {
	[keyof in TowerType]: ITowerInitializer
}

export interface ITower extends ITowerInitializer {
	positionY: number;
	positionX: number;
	towerId: number;
	getAttackTargetInRadius(searchRadius: Path2D): Enemy | undefined;
	removeTargetForTowers(target: Enemy): void;
}

export interface ITowerInitializer {
	type: TowerType;
	fireAudio?: string;
	framesAmount?: number;
	frameRate?: number;
	attackDamage?: number;
	attackRadius?: number;
	itemImageSrc: string;
	price: number;
	name: string;
	sprite: Sprite;
	upgradeType?: TowerType;
}
