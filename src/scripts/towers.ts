import { IImageAsset } from "@/types";
import { ImagePath } from "@/types/imagePath";
import { DefaultTowerType, InitializedTowerType, ITower, TowerType } from "@/types/towersTypes";
import Utilities, { KeyImageType } from "@/utilities/utilities";




class TowerTemplates {

	async init(towerTileWidth: number, towerTileHeight: number) {

		const defaultTowers: DefaultTowerType = {
			platform: {
				type: 'platform',
				startFrame: null,
				framesAmount: null,
				frameRate: null,
				attackDamage: null,
				attackRadius: null,
				itemImageSrc: ImagePath.platform,
				price: 50,
				name: 'Platform'
			},
			singleBarrelCannon: {
				type: 'singleBarrelCannon',
				startFrame: 0,
				framesAmount: 7,
				frameRate: 5,
				attackDamage: 30,
				attackRadius: 180,
				itemImageSrc: ImagePath.singleBarrelCannon,
				price: 200,
				name: 'Single barrel cannon'
			},
			doubleBarrelCannon: {
				type: 'doubleBarrelCannon',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 5,
				attackDamage: 50,
				attackRadius: 190,
				itemImageSrc: ImagePath.doubleBarrelCannon,
				price: 350,
				name: 'Double barrel cannon'
			},
			doubleBarrelCannonPlus: {
				type: 'doubleBarrelCannonPlus',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 5,
				attackDamage: 70,
				attackRadius: 210,
				itemImageSrc: ImagePath.doubleBarrelCannonPlus,
				price: 500,
				name: 'Double barrel cannon +'
			},
			tripleBarrelCannon: {
				type: 'tripleBarrelCannon',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 5,
				attackDamage: 100,
				attackRadius: 210,
				itemImageSrc: ImagePath.tripleBarrelCannon,
				price: 750,
				name: 'Triple barrel cannon'
			},
			simpleLaserCannon: {
				type: 'simpleLaserCannon',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 45,
				attackRadius: 240,
				itemImageSrc: ImagePath.simpleLaserCannon,
				price: 300,
				name: 'Simple laser cannon'
			},
			advancedLaserCannon: {
				type: 'advancedLaserCannon',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 65,
				attackRadius: 250,
				itemImageSrc: ImagePath.advancedLaserCannon,
				price: 500,
				name: 'Advanced laser cannon'
			},
			supremeLaserCannon: {
				type: 'supremeLaserCannon',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 100,
				attackRadius: 270,
				itemImageSrc: ImagePath.supremeLaserCannon,
				price: 780,
				name: 'Supreme laser cannon'
			},
			supremeLaserCannonPlus: {
				type: 'supremeLaserCannonPlus',
				startFrame: 0,
				framesAmount: 10,
				frameRate: 6,
				attackDamage: 140,
				attackRadius: 270,
				itemImageSrc: ImagePath.supremeLaserCannonPlus,
				price: 1000,
				name: 'Supreme laser cannon +'
			}
		}
		const initializedTowers: InitializedTowerType = _.merge({} as InitializedTowerType, defaultTowers);
		const towersKeyImage: KeyImageType<TowerType> = getKeyImageFromDefault(defaultTowers);
		const towerLoadedImages = await Promise.all(Utilities.loadImages<TowerType>(towersKeyImage));
		assignLoadedImages(towerLoadedImages, initializedTowers);
		this.list = initializedTowers;

		function getKeyImageFromDefault(defaultTowers: DefaultTowerType) {
			const keysImages: KeyImageType<TowerType> = {} as KeyImageType<TowerType>;

			for (const key in defaultTowers) {
				const tower: ITower = defaultTowers[key];
				keysImages[tower.type] = Utilities.createImage(tower.itemImageSrc, towerTileWidth, towerTileHeight);
			}
			return keysImages;
		}
		function assignLoadedImages(loadedImages: IImageAsset<TowerType>[], initializedTowers: InitializedTowerType) {
			for (const imageAsset of loadedImages)
				initializedTowers[imageAsset.key].itemImage = imageAsset.img;
		}
	}

	list: InitializedTowerType = {} as InitializedTowerType;

	isPlatform(type: TowerType) {
		return this.list.platform.type == type;
	}

	getTowerByType(type: TowerType): undefined | ITower {
		return Object.entries(this.list).find(tower => tower[1].type === type)?.[1];
	}

	getTowerRadiusByType(towerType: TowerType): number | null {
		for (const key in this.list) {
			const tower: ITower = this.list[key];
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