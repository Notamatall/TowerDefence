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

	async init(towerTileWidth: number, towerTileHeight: number) {

		const defaultTowers: DefaultTowerType = {
			platform: {
				type: 'platform',
				price: 50,
				name: 'Platform',
				sprite: new Sprite({ imageSrc: ImagePath.platform, xFramesStart: 0, yFramesStart: 0, framesAmount: 0, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 })
			},
			singleBarrelCannon: {
				type: 'singleBarrelCannon',
				framesAmount: 8,
				frameRate: 7,
				attackDamage: 30,
				attackRadius: 180,
				fireAudio: singleBarrelFire,
				price: 200,
				upgradeType: 'doubleBarrelCannon',
				sprite: new Sprite({ imageSrc: ImagePath.singleBarrelCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				attackSprite: new Sprite({ imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0, framesAmount: 9, pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92 }),
				name: 'Single barrel cannon'
			},
			doubleBarrelCannon: {
				type: 'doubleBarrelCannon',
				framesAmount: 8,
				frameRate: 6,
				attackDamage: 50,
				attackRadius: 190,
				fireAudio: doubleBarrelFire,
				upgradeType: 'doubleBarrelCannonPlus',
				price: 350,
				attackSprite: new Sprite({ imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0, framesAmount: 9, pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.doubleBarrelCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				name: 'Double barrel cannon'
			},
			doubleBarrelCannonPlus: {
				type: 'doubleBarrelCannonPlus',
				framesAmount: 8,
				frameRate: 5,
				attackDamage: 70,
				attackRadius: 210,
				fireAudio: multiBarrelFire,
				upgradeType: 'tripleBarrelCannon',
				attackSprite: new Sprite({ imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0, framesAmount: 9, pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.doubleBarrelCannonPlus, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 500,
				name: 'Double barrel cannon +'
			},
			tripleBarrelCannon: {
				type: 'tripleBarrelCannon',
				framesAmount: 8,
				frameRate: 5,
				attackDamage: 100,
				attackRadius: 210,
				fireAudio: multiBarrelFire,
				attackSprite: new Sprite({ imageSrc: ImagePath.smallExplosion, xFramesStart: 0, yFramesStart: 0, framesAmount: 9, pxHeight: 109, pxWidth: 111, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.tripleBarrelCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 750,
				name: 'Triple barrel cannon'
			},
			simpleLaserCannon: {
				type: 'simpleLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 45,
				attackRadius: 240,
				fireAudio: smallLaser,
				upgradeType: 'advancedLaserCannon',
				attackSprite: new Sprite({ imageSrc: ImagePath.energy, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 83, pxWidth: 63, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.simpleLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 300,
				name: 'Simple laser cannon'
			},
			advancedLaserCannon: {
				type: 'advancedLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 65,
				attackRadius: 250,
				fireAudio: advancedLaser,
				upgradeType: 'supremeLaserCannon',
				attackSprite: new Sprite({ imageSrc: ImagePath.energy, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 83, pxWidth: 63, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.advancedLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 500,
				name: 'Advanced laser cannon'
			},
			supremeLaserCannon: {
				type: 'supremeLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 100,
				attackRadius: 270,
				fireAudio: supremeLaser,
				upgradeType: 'supremeLaserCannonPlus',
				attackSprite: new Sprite({ imageSrc: ImagePath.blueRing, xFramesStart: 0, yFramesStart: 0, framesAmount: 18, pxHeight: 200, pxWidth: 200, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.supremeLaserCannon, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 780,
				name: 'Supreme laser cannon'
			},
			supremeLaserCannonPlus: {
				type: 'supremeLaserCannonPlus',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 140,
				attackRadius: 270,
				fireAudio: supremeLaserPlus,
				attackSprite: new Sprite({ imageSrc: ImagePath.blueRing, xFramesStart: 0, yFramesStart: 0, framesAmount: 18, pxHeight: 200, pxWidth: 200, dispayX: 92, dispayY: 92 }),
				sprite: new Sprite({ imageSrc: ImagePath.supremeLaserCannonPlus, xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 1000,
				name: 'Supreme laser cannon +'
			}
		}
		const towerImages = await loadTowerImages.call(this, defaultTowers, towerTileWidth, towerTileHeight);
		const attackImages = await loadAttackImages.call(this, defaultTowers, towerTileWidth, towerTileHeight);
		assignLoadedImagesToSprite(towerImages, 'sprite', defaultTowers);
		assignLoadedImagesToSprite(attackImages, 'attackSprite', defaultTowers);
		this.list = defaultTowers;


		function assignLoadedImagesToSprite(loadedImages: IImageAsset<TowerType>[], spriteName: TowerInitializerKeys, initializedTowers: DefaultTowerType) {
			for (const imageAsset of loadedImages)
				(initializedTowers[imageAsset.key][spriteName] as Sprite).image = imageAsset.img;
		}

		async function loadTowerImages(this: TowerTemplates, defaultTowers: DefaultTowerType, towerTileWidth: number, towerTileHeight: number) {
			const towersKeyImage: KeyImageType<TowerType> = this.getKeyImageListForSprite(defaultTowers, 'sprite', towerTileWidth, towerTileHeight);
			const towerImages = await Promise.all(Utilities.loadImages<TowerType>(towersKeyImage));
			return towerImages;
		}

		async function loadAttackImages(this: TowerTemplates, defaultTowers: DefaultTowerType, towerTileWidth: number, towerTileHeight: number) {
			const towersKeyImage: KeyImageType<TowerType> = this.getKeyImageListForSprite(defaultTowers, 'attackSprite', towerTileWidth, towerTileHeight);
			const attackImages = await Promise.all(Utilities.loadImages<TowerType>(towersKeyImage));
			return attackImages;
		}
	}

	private getKeyImageListForSprite(defaultTowers: DefaultTowerType, spriteName: string, towerTileWidth: number, towerTileHeight: number) {
		const keysImages: KeyImageType<TowerType> = {} as KeyImageType<TowerType>;

		for (const key in defaultTowers) {
			const tower: ITowerInitializer = defaultTowers[key];
			if (tower[spriteName] !== undefined)
				keysImages[tower.type] = Utilities.createImage(tower[spriteName].imageSrc, towerTileWidth, towerTileHeight);
		}
		return keysImages;
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