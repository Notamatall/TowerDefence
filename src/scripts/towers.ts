import { IMenuOption } from "@/types";
import { ImagePath } from "@/types/imagePath";

type TowerType = {
	platform: ITower,
	singleBarrelCannon: ITower,
	doubleBarrelCannon: ITower,
	doubleBarrelCannonPlus: ITower,
	tripleBarrelCannon: ITower,
	simpleLaserCannon: ITower,
	advancedLaserCannon: ITower,
	supremeLaserCannon: ITower,
	supremeLaserCannonPlus: ITower,
}

export class Towers {
	static list: TowerType = {
		platform: {
			id: 0,
			startFrame: 0,
			framesAmount: 0,
			frameRate: 0,
			attackDamage: 0,
			attackRadius: null,
			itemImageSrc: ImagePath.platform,
			price: 50,
			name: 'Platform'
		},
		singleBarrelCannon: {
			id: 1,
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
			id: 2,
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
			id: 3,
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
			id: 4,
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
			id: 5,
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
			id: 6,
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
			id: 7,
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
			id: 8,
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

	static getMenuOption(tower: ITower): IMenuOption {
		return {
			towerId: tower.id,
			itemImageSrc: tower.itemImageSrc,
			price: tower.price,
			name: tower.name,
		}
	}

	static getTowerRadiusById(towerId: number) {
		for (const key in Towers.list) {
			const element: ITower = Towers.list[key];
			if (element.id === towerId)
				return element.attackRadius
		}
	}

}

export interface ITower {
	id: number;
	startFrame: number;
	framesAmount: number;
	frameRate: number;
	attackDamage: number;
	attackRadius: number | null;
	itemImageSrc: string;
	price: number;
	name: string;
}