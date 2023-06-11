import { IImageAsset } from "@/types";
import { ImagePath } from "@/types/imagePath";
import Sprite from "@/types/sprite";
import { DefaultTowerType, ITower, ITowerInitializer, TowerInitializerKeys, TowerType } from "@/types/towersTypes";
import Utilities, { KeyImageType } from "@/utilities/utilities";

import singleBarrelFire from '@/audio/singleBarrelFire.wav'
import doubleBarrelFire from '@/audio/doubleBarrel.wav'
import smallLaser from '@/audio/smallLaser.wav'
import advancedLaser from '@/audio/advancedLaser.wav'
import supremeLaser from '@/audio/supremeLaser.wav'
import supremeLaserPlus from '@/audio/supremeLaserPlus.wav'
import multiBarrelFire from '@/audio/multiBarrelFire.wav'

class TowerTemplates {

	list: DefaultTowerType = {} as DefaultTowerType;

	async init() {

		const defaultTowers: DefaultTowerType = {
			platform: {
				type: 'platform',
				price: 50,
				name: 'Platform',
				installationAudio: ImagePath.platformInstalled,
				sprite: new Sprite({ imageSrc: ImagePath.platform, frameChangeRate: 0, xFramesStart: 0, yFramesStart: 0, framesAmount: 0, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 })
			},
			singleBarrelCannon: {
				type: 'singleBarrelCannon',
				attackDamage: 30,
				attackRadius: 180,
				fireAudio: singleBarrelFire,
				price: 200,
				upgradeType: 'doubleBarrelCannon',
				installationAudio: ImagePath.towerInstalled,
				sprite: new Sprite({
					frameChangeRate: 7, imageSrc: ImagePath.singleBarrelCannon, xFramesStart: 0,
					yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128
				}),
				attackSprite: new Sprite({
					imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0,
					framesAmount: 9, frameChangeRate: 2,
					pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92
				}),
				name: 'Single barrel cannon'
			},
			doubleBarrelCannon: {
				type: 'doubleBarrelCannon',
				attackDamage: 50,
				attackRadius: 190,
				fireAudio: doubleBarrelFire,
				upgradeType: 'doubleBarrelCannonPlus',
				installationAudio: ImagePath.towerInstalled,
				price: 350,
				attackSprite: new Sprite({
					imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0,
					framesAmount: 9, frameChangeRate: 2,
					pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({ frameChangeRate: 6, imageSrc: ImagePath.doubleBarrelCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				name: 'Double barrel cannon'
			},
			doubleBarrelCannonPlus: {
				type: 'doubleBarrelCannonPlus',
				installationAudio: ImagePath.towerInstalled,
				attackDamage: 70,
				attackRadius: 210,
				fireAudio: multiBarrelFire,
				upgradeType: 'tripleBarrelCannon',
				attackSprite: new Sprite({
					imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0,
					framesAmount: 9, frameChangeRate: 2, pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({
					imageSrc: ImagePath.doubleBarrelCannonPlus, xFramesStart: 0,
					yFramesStart: 0, frameChangeRate: 5, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128
				}),
				price: 500,
				name: 'Double barrel cannon +'
			},
			tripleBarrelCannon: {
				type: 'tripleBarrelCannon',
				attackDamage: 100,
				attackRadius: 210,
				fireAudio: multiBarrelFire,
				installationAudio: ImagePath.towerInstalled,
				attackSprite: new Sprite({
					imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0, framesAmount: 9, frameChangeRate: 2,
					pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({
					imageSrc: ImagePath.tripleBarrelCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, frameChangeRate: 5,
					pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128
				}),
				price: 750,
				name: 'Triple barrel cannon'
			},
			simpleLaserCannon: {
				type: 'simpleLaserCannon',
				attackDamage: 45,
				attackRadius: 240,
				fireAudio: smallLaser,
				installationAudio: ImagePath.towerInstalled,
				upgradeType: 'advancedLaserCannon',
				attackSprite: new Sprite({ imageSrc: ImagePath.energy, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, frameChangeRate: 2, pxHeight: 83, pxWidth: 63, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.simpleLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, frameChangeRate: 6, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 300,
				name: 'Simple laser cannon'
			},
			advancedLaserCannon: {
				type: 'advancedLaserCannon',
				attackDamage: 65,
				attackRadius: 250,
				fireAudio: advancedLaser,
				installationAudio: ImagePath.towerInstalled,
				upgradeType: 'supremeLaserCannon',
				attackSprite: new Sprite({
					imageSrc: ImagePath.energy, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, frameChangeRate: 2,
					pxHeight: 83, pxWidth: 63, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({
					imageSrc: ImagePath.advancedLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, frameChangeRate: 6,
					pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128
				}),
				price: 500,
				name: 'Advanced laser cannon'
			},
			supremeLaserCannon: {
				type: 'supremeLaserCannon',

				attackDamage: 100,
				attackRadius: 270,
				fireAudio: supremeLaser,
				installationAudio: ImagePath.towerInstalled,
				upgradeType: 'supremeLaserCannonPlus',
				attackSprite: new Sprite({
					imageSrc: ImagePath.blueRing, xFramesStart: 0, yFramesStart: 0, framesAmount: 18,
					frameChangeRate: 2, pxHeight: 200, pxWidth: 200, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({
					imageSrc: ImagePath.supremeLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11,
					frameChangeRate: 6, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128
				}),
				price: 780,
				name: 'Supreme laser cannon'
			},
			supremeLaserCannonPlus: {
				type: 'supremeLaserCannonPlus',
				attackDamage: 140,
				attackRadius: 270,
				fireAudio: supremeLaserPlus,
				installationAudio: ImagePath.towerInstalled,
				attackSprite: new Sprite({
					imageSrc: ImagePath.blueRing, xFramesStart: 0, yFramesStart: 0, framesAmount: 18, frameChangeRate: 2,
					pxHeight: 200, pxWidth: 200, dispayX: 92, dispayY: 92
				}),
				sprite: new Sprite({ imageSrc: ImagePath.supremeLaserCannonPlus, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, frameChangeRate: 6, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 1000,
				name: 'Supreme laser cannon +'
			}
		}

		const images = getKeyImageFromDefault(defaultTowers);
		await Utilities.loadImages(images);
		setUpdateSound(defaultTowers);
		this.list = defaultTowers;


		function getKeyImageFromDefault(defaultTowers: DefaultTowerType) {
			const imagesList = <KeyImageType<TowerType>>{}
			for (const key in defaultTowers) {
				const tower: ITowerInitializer = defaultTowers[key];
				const spritesKeys = Object.keys(tower).filter(key => key.toLowerCase().includes('sprite'));
				spritesKeys.forEach(spriteKey => {
					const img = Utilities.createImage((tower[spriteKey] as Sprite).imageSrc);
					imagesList[`${key}_${spriteKey}`] = img;
					(tower[spriteKey] as Sprite).image = img;
				})
			}
			return imagesList;
		}

		function setUpdateSound(defaultTowers: DefaultTowerType) {
			for (const key in defaultTowers) {
				(defaultTowers[key] as ITowerInitializer).upgradeAudio = ImagePath.upgradeAudio;
			}
		}


	}

	isPlatform(type: TowerType) {
		return this.list.platform.type == type;
	}

	getTowerByType(type: TowerType): undefined | ITowerInitializer {
		return Object.entries(this.list).find(tower => tower[1].type === type)?.[1];
	}

	getTowerRadiusByType(towerType: TowerType): number | undefined {
		for (const key in this.list) {
			const tower: ITowerInitializer = this.list[key];
			if (tower.type === towerType)
				return tower.attackRadius
		}
		throw new Error("Tower with type was not found");
	}

	getTowerPriceByType(towerType: TowerType): number {
		for (const key in this.list) {
			const tower: ITower = this.list[key];
			if (tower.type === towerType)
				return tower.price
		}
		throw new Error("Tower with type was not found");
	}
}

const Towers: TowerTemplates = new TowerTemplates();


export default Towers;