import { CanvasBuilder } from "@/scripts/canvasBuilder";
import Enemy, { IImageCenter } from "./enemyTypes";
import Sprite from "./sprite";
import Utilities from "@/utilities/utilities";
import Towers from "@/scripts/towers";
import { ImagePath } from "./imagePath";


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
		this.setAudio(towerInitializer.fireAudio);
		this.upgradeType = towerInitializer.upgradeType;
		this.explosionSprite = new Image();
		this.explosionSprite.src = ImagePath.bigRingExplosion33;

	}

	private setAudio(audioSrc: string | undefined) {
		if (this.audio)
			this.audio.remove();
		this.audio = new Audio(audioSrc);
		this.audio.volume = 0.1;
	}
	private explosionPromises: {
		drawExplosion: () => void,
		tryRemoveAnimation: () => void,
	}[] = [];
	private explosionSprite: HTMLImageElement;
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
		this.drawExplosions();
		if (hasTarget.call(this))
			this.attack();
		else
			this.searchAttackTarget();

		this.drawTower();

		function hasTarget(this: Tower) {
			return this.attackTarget != null
		}

	}

	public drawExplosions() {
		for (let index = 0; index < this.explosionPromises.length; index++) {
			const shotAnimation = this.explosionPromises[index];
			shotAnimation.drawExplosion();
			shotAnimation.tryRemoveAnimation();
		}
	}
	public upgrade() {
		if (this.upgradeType) {
			const upgradeTemplate = Towers.getTowerByType(this.upgradeType);
			if (upgradeTemplate) {
				for (const key in upgradeTemplate) {
					if (Object.prototype.hasOwnProperty.call(this, key)) {
						this[key] = upgradeTemplate[key];
					}
				}
				this.setAudio(upgradeTemplate.fireAudio)
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
		this.animate();
		const isAnimationRestarted = this.tryRestartAnimation();
		if (isAnimationRestarted) {
			this.playShotAudio();
			this.createShotAnimaton();
			this.attackTarget.currentHp = this.attackTarget.currentHp - this.attackDamage;
			if (this.attackTarget.currentHp <= 0) {
				this.onEnemyKilled();
			}
		}
	}


	private createShotAnimaton() {
		let count = 0;
		let count2 = 0;
		const xPos = this.attackTarget!.imageCenter.centerX - 46 + this.attackTarget!.moveDirX * 23;
		const yPos = this.attackTarget!.imageCenter.centerY - 46 + this.attackTarget!.moveDirY * 23

		const index = this.explosionPromises.length - 1;
		const shotAnimation = {
			drawExplosion: () => {
				// if (count % 2 === 0)
				count2++;
				this.context.drawImage(this.explosionSprite, count2 * 128, 0, 128, 128, xPos, yPos, 92, 92);
				count++;
			},
			tryRemoveAnimation: () => {
				if (count === 15)
					this.explosionPromises.splice(index, 1);
			}
		}

		this.explosionPromises.push(shotAnimation);
	}


	private playShotAudio() {
		if (this.audio) {
			this.audio.play().catch(e => console.error(e));
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
	price: number;
	name: string;
	sprite: Sprite;
	attackSprite?: Sprite;
	upgradeType?: TowerType;
}
