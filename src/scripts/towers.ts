import { IImageAsset } from "@/types";
import { ImagePath } from "@/types/imagePath";
import Sprite from "@/types/sprite";
import { DefaultTowerType, ITower, ITowerInitializer, TowerType } from "@/types/towersTypes";
import Utilities, { KeyImageType } from "@/utilities/utilities";

import singleBarrelFire from '@/audio/shot-dry-strong_F_minor.wav'
import doubleBarrelFire from '@/audio/doubleBarrel.wav'
import smallLaser from '@/audio/smallLaser.wav'
import advancedLaser from '@/audio/advancedLaser.wav'
import supremeLaser from '@/audio/supremeLaser.wav'
import supremeLaserPlus from '@/audio/supremeLaserPlus.wav'
import multiBarrelFire from '@/audio/multiBarrelFire.wav'

class TowerTemplates {

	async init(towerTileWidth: number, towerTileHeight: number) {

		const defaultTowers: DefaultTowerType = {
			platform: {
				type: 'platform',
				price: 50,
				name: 'Platform',
				itemImageSrc: ImagePath.platform,
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 0, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 })
			},
			singleBarrelCannon: {
				type: 'singleBarrelCannon',
				framesAmount: 8,
				frameRate: 7,
				attackDamage: 30,
				attackRadius: 180,
				itemImageSrc: ImagePath.singleBarrelCannon,
				fireAudio: singleBarrelFire,
				price: 200,
				upgradeType: 'doubleBarrelCannon',
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				name: 'Single barrel cannon'
			},
			doubleBarrelCannon: {
				type: 'doubleBarrelCannon',
				framesAmount: 8,
				frameRate: 6,
				attackDamage: 50,
				attackRadius: 190,
				itemImageSrc: ImagePath.doubleBarrelCannon,
				fireAudio: doubleBarrelFire,
				upgradeType: 'doubleBarrelCannonPlus',
				price: 350,
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				name: 'Double barrel cannon'
			},
			doubleBarrelCannonPlus: {
				type: 'doubleBarrelCannonPlus',
				framesAmount: 8,
				frameRate: 5,
				attackDamage: 70,
				attackRadius: 210,
				itemImageSrc: ImagePath.doubleBarrelCannonPlus,
				fireAudio: doubleBarrelFire,
				upgradeType: 'tripleBarrelCannon',
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 500,
				name: 'Double barrel cannon +'
			},
			tripleBarrelCannon: {
				type: 'tripleBarrelCannon',
				framesAmount: 8,
				frameRate: 5,
				attackDamage: 100,
				attackRadius: 210,
				itemImageSrc: ImagePath.tripleBarrelCannon,
				fireAudio: multiBarrelFire,
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 8, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 750,
				name: 'Triple barrel cannon'
			},
			simpleLaserCannon: {
				type: 'simpleLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 45,
				attackRadius: 240,
				itemImageSrc: ImagePath.simpleLaserCannon,
				fireAudio: smallLaser,
				upgradeType: 'advancedLaserCannon',
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 300,
				name: 'Simple laser cannon'
			},
			advancedLaserCannon: {
				type: 'advancedLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 65,
				attackRadius: 250,
				itemImageSrc: ImagePath.advancedLaserCannon,
				fireAudio: advancedLaser,
				upgradeType: 'supremeLaserCannon',
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 500,
				name: 'Advanced laser cannon'
			},
			supremeLaserCannon: {
				type: 'supremeLaserCannon',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 100,
				attackRadius: 270,
				itemImageSrc: ImagePath.supremeLaserCannon,
				fireAudio: supremeLaser,
				upgradeType: 'supremeLaserCannonPlus',
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 780,
				name: 'Supreme laser cannon'
			},
			supremeLaserCannonPlus: {
				type: 'supremeLaserCannonPlus',
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 140,
				attackRadius: 270,
				itemImageSrc: ImagePath.supremeLaserCannonPlus,
				fireAudio: supremeLaserPlus,
				sprite: new Sprite({ xFramesStart: 0, yFramesStart: 0, framesAmount: 11, pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128 }),
				price: 1000,
				name: 'Supreme laser cannon +'
			}
		}

		const towersKeyImage: KeyImageType<TowerType> = getKeyImageFromDefault(defaultTowers);
		const towerLoadedImages = await Promise.all(Utilities.loadImages<TowerType>(towersKeyImage));
		assignLoadedImages(towerLoadedImages, defaultTowers);
		//	const result = await Promise.all(checkAudioLoaded(defaultTowers));
		this.list = defaultTowers;

		function getKeyImageFromDefault(defaultTowers: DefaultTowerType) {
			const keysImages: KeyImageType<TowerType> = {} as KeyImageType<TowerType>;

			for (const key in defaultTowers) {
				const tower: ITower = defaultTowers[key];
				keysImages[tower.type] = Utilities.createImage(tower.itemImageSrc, towerTileWidth, towerTileHeight);
			}
			return keysImages;
		}

		function assignLoadedImages(loadedImages: IImageAsset<TowerType>[], initializedTowers: DefaultTowerType) {
			for (const imageAsset of loadedImages)
				initializedTowers[imageAsset.key].sprite.image = imageAsset.img;
		}
	}

	list: DefaultTowerType = {} as DefaultTowerType;

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