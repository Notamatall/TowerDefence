import { CanvasBuilder } from "@/scripts/canvasBuilder";
import Enemy, { IImageCenter } from "./enemyTypes";
import Sprite from "./sprite";
import Utilities from "@/utilities/utilities";
import Towers from "@/scripts/towers";

export class Tower {
	constructor(towerInitializer: ITower, canvasAccessor: CanvasBuilder) {
		this.type = towerInitializer.type;
		this.context = canvasAccessor.context;
		this.canvasAccessor = canvasAccessor;
		this.attackDamage = towerInitializer.attackDamage ? towerInitializer.attackDamage : 0;
		this.attackRadius = towerInitializer.attackRadius ? towerInitializer.attackRadius : 0;
		this.towerId = towerInitializer.towerId;
		this.getAttackTargetInRadius = towerInitializer.getAttackTargetInRadius;
		this.removeTargetForTowers = towerInitializer.removeTargetForTowers;
		this.rewardForKill = towerInitializer.rewardForKill;
		this.type = towerInitializer.type;
		this.price = towerInitializer.price;
		this.name = towerInitializer.name;
		this.specialEffect = towerInitializer.specialEffect;
		this.positionX = towerInitializer.positionX;
		this.positionY = towerInitializer.positionY;
		this.sprite = towerInitializer.sprite;
		this.totalPrice = towerInitializer.price;
		this.imageCenter = {
			centerX: this.positionX + this.sprite.pxWidth / 2,
			centerY: this.positionY + this.sprite.pxHeight / 2
		}

		if (this.attackRadius) {
			this.towerCircleRadius = new Path2D();
			this.towerCircleRadius.arc(this.imageCenter.centerX, this.imageCenter.centerY, this.attackRadius, 0, 2 * Math.PI);
		}
		this.setFireAudio(towerInitializer.fireAudio);
		this.setInstalationAudio(towerInitializer.installationAudio);
		this.installationAudio.play();
		this.setUpgradeAudio(towerInitializer.upgradeAudio);

		this.upgradeType = towerInitializer.upgradeType;
		this.attackSprite = towerInitializer.attackSprite;
	}
	private specialEffect?: (attackTarget: Enemy[]) => void;
	private fireAnimations: {
		drawExplosion: () => void,
		tryRemoveAnimation: () => void,
	}[] = [];
	private attackSprite?: Sprite;
	private installationAudio!: HTMLAudioElement;
	private fireAudio: HTMLAudioElement | undefined;
	private upgradeAudio!: HTMLAudioElement;
	private towerCircleRadius?: Path2D;
	private getAttackTargetInRadius: (searchRadius: Path2D) => Enemy[] | undefined;
	private removeTargetForTowers: (target: Enemy) => void;
	private rewardForKill: (amount: number) => void;
	private context: CanvasRenderingContext2D;
	private canvasAccessor: CanvasBuilder;
	private imageCenter: IImageCenter;
	private rotationAngle: number = 0;
	private type: TowerType;
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
	private totalPrice: number;

	get towerPrice() {
		return this.price;
	}

	get towerTotalPrice() {
		return this.totalPrice;
	}

	get towerType() {
		return this.type;
	}

	get towerUpgradeType() {
		return this.upgradeType;
	}

	get towerAttackRadius() {
		return this.attackRadius;
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
		for (let index = 0; index < this.fireAnimations.length; index++) {
			const shotAnimation = this.fireAnimations[index];
			shotAnimation.drawExplosion();
			shotAnimation.tryRemoveAnimation();
		}
	}

	private setFireAudio(audioSrc: string | undefined) {
		if (this.fireAudio)
			this.fireAudio.remove;
		this.fireAudio = new Audio(audioSrc);
		const avrFPS = 60;
		const shootAnimationPlaybackSpeed = (this.sprite.framesAmount * this.sprite.frameChangeRate) / avrFPS - 1;
		this.fireAudio.playbackRate = 1.3 - shootAnimationPlaybackSpeed;
		this.fireAudio.volume = this.canvasAccessor.globalTowersVolume;
	}

	private setInstalationAudio(audioSrc: string | undefined) {
		this.installationAudio = new Audio(audioSrc);
		this.installationAudio.volume = 0.1;
	}

	private setUpgradeAudio(audioSrc: string | undefined) {
		this.upgradeAudio = new Audio(audioSrc);
		this.upgradeAudio.volume = 0.1;
	}

	setAttackVolume() {
		if (this.fireAudio)
			this.fireAudio.volume = this.canvasAccessor.globalTowersVolume;
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
				this.setFireAudio(upgradeTemplate.fireAudio)
				this.upgradeType = upgradeTemplate.upgradeType;
				this.attackSprite = upgradeTemplate.attackSprite;
				this.towerCircleRadius = new Path2D();
				this.towerCircleRadius.arc(this.imageCenter.centerX, this.imageCenter.centerY, this.attackRadius, 0, 2 * Math.PI);
				this.setUpgradeAudio(upgradeTemplate.upgradeAudio);
				this.upgradeAudio.play();
				this.totalPrice = this.totalPrice + this.price;
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
			sprite.pxHeight,
			-(sprite.pxWidth / 2),
			-(sprite.pxHeight / 2),
			sprite.displayX,
			sprite.displayY,
			this.rotationAngle + spriteStartAngle);

	}

	private searchAttackTarget() {
		const targets = this.getAttackTargetInRadius(this.towerCircleRadius!)
		if (targets) {
			this.attackTarget = targets[0];
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
		if (this.currentSpriteFrame == this.sprite.framesAmount) {
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
			return this.sprite.frameChangeRate === this.currentFrameChangeValue
		}
	}
	private count = 0;
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
		this.count++;
		if (isAnimationRestarted) {
			this.count = 0;
			this.playShotAudio();
			this.createShotAnimaton();
			if (this.specialEffect) {
				const targetsInAttackRadius = this.getTargetsInAOE();
				this.specialEffect(targetsInAttackRadius ? targetsInAttackRadius : []);
			}
			else
				this.attackTarget.currentHp = this.attackTarget.currentHp - this.attackDamage;
			if (this.attackTarget.currentHp <= 0) {
				this.onEnemyKilled();
			}
		}
	}
	private getTargetsInAOE() {
		const xPos = this.attackTarget!.imageCenter.centerX - (this.attackSprite!.pxWidth / 2) + this.attackTarget!.moveDirX * (this.attackSprite!.pxWidth / 4);
		const yPos = this.attackTarget!.imageCenter.centerY - (this.attackSprite!.pxHeight / 2) + this.attackTarget!.moveDirY * (this.attackSprite!.pxHeight / 4);
		const attackCircleRadius = new Path2D();
		attackCircleRadius.arc(xPos, yPos, this.attackSprite!.displayX, 0, 2 * Math.PI);
		return this.getAttackTargetInRadius(attackCircleRadius);
	}

	private createShotAnimaton() {
		let currentFrameChangeValue = 0;
		let currentSpriteFrame = 0;
		const xPos = this.attackTarget!.imageCenter.centerX - (this.attackSprite!.pxWidth / 2) + this.attackTarget!.moveDirX * (this.attackSprite!.pxWidth / 4);
		const yPos = this.attackTarget!.imageCenter.centerY - (this.attackSprite!.pxHeight / 2) + this.attackTarget!.moveDirY * (this.attackSprite!.pxHeight / 4);
		const index = this.fireAnimations.length - 1;
		const attackSprite = this.attackSprite!;
		const shotAnimation = {
			drawExplosion: () => {
				if (currentFrameChangeValue % attackSprite.frameChangeRate == 0)
					currentSpriteFrame++;
				this.context.drawImage(attackSprite.image, currentSpriteFrame * attackSprite.pxWidth, 0,
					attackSprite.pxWidth,
					attackSprite.pxHeight, xPos, yPos, attackSprite.displayX, attackSprite.displayY);
				currentFrameChangeValue++;
			},
			tryRemoveAnimation: () => {
				if (currentFrameChangeValue === attackSprite.framesAmount * attackSprite.frameChangeRate)
					this.fireAnimations.splice(index, 1);
			}
		}

		this.fireAnimations.push(shotAnimation);
	}


	private playShotAudio() {
		if (this.fireAudio) {
			this.fireAudio.play().catch(e => console.error(e));
		}
	}

	private onEnemyKilled() {
		if (this.attackTarget === null)
			throw new Error('Attack target is null - cannot be possible');
		const target = this.attackTarget;
		this.attackTarget.setUnitDead();
		this.removeTargetForTowers(target);
		this.rewardForKill(target.deathReward);
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
	'supremeLaserCannonPlus' | 'slowTower';

export type DefaultTowerType = {
	[keyof in TowerType]: ITowerInitializer
}

export interface ITower extends ITowerInitializer {
	positionY: number;
	positionX: number;
	towerId: number;
	getAttackTargetInRadius(searchRadius: Path2D): Enemy[] | undefined;
	removeTargetForTowers(target: Enemy): void;
	rewardForKill(amount: number): void;
}

export interface ITowerInitializer {
	type: TowerType;
	specialEffect?: (attackTarget: Enemy[]) => void;
	fireAudio?: string;
	installationAudio: string;
	upgradeAudio?: string;
	attackDamage?: number;
	attackRadius?: number;
	price: number;
	name: string;
	sprite: Sprite;
	attackSprite?: Sprite;
	upgradeType?: TowerType;
}

export type TowerInitializerKeys = keyof ITowerInitializer;
