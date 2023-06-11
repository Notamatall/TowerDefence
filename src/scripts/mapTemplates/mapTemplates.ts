import { IUserStats } from "@/types";
import { EnemyType } from "@/types/enemyTypes";
import { ImagePath } from "@/types/imagePath";
import { TowerType } from "@/types/towersTypes";
function c(index, angle?: number, dirX?: number, dirY?: number, order?: number): IMapTemplateCell {
	return { index: index, angle: angle, dirX: dirX, dirY: dirY, order: order }
}

export interface IMapTemplateCell {
	index: number;
	angle?: number;
	dirX?: number;
	dirY?: number;
	order?: number;
}
const menuItems: TowerType[] = ['platform', 'singleBarrelCannon', 'simpleLaserCannon']
const firstLevelUserStats: IUserStats = {
	userHP: 15,
	userCoins: 20000
}

export const mostersLevelOne: EnemyType[] = ['jinn', 'lizard', 'smallDragon', 'medusa']

const firstLevelTemplate: IMapTemplateCell[][] = [
	[c(2), c(1), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(3, 90, 1, 0, 0), c(3, 90), c(4, 90, 0, 1, 1), c(0), c(0), c(0), c(0), c(4, 0, 1, 0, 4), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 5), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(1), c(4, 270, 1, 0, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 3), c(0), c(0), c(0), c(4, 270, 1, 0, 6), c(3, 90), c(3, 90)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
];


export const firstLevelOptions = {
	mapName: 'Level one',
	defaultTileHeight: 128,
	defaultTileWidth: 128,
	mapImageHeight: 896,
	mapImageWidth: 640,
	mapImageSrc: ImagePath.terrain,
	mapTemplate: firstLevelTemplate,
	environmentX: 128,
	environmentY: 384,
	menuOptions: menuItems,
	defaultUserStats: firstLevelUserStats
}

const secondLevelTemplate: IMapTemplateCell[][] = [
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],

	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],

	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],

	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(3, 0, 0, 1, 0), c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(4, 0, 0, 1, 4), c(3, 90), c(3, 90), c(4, 90, -1, 0, 3), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(4, 270, 0, -1, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, -1, 0, 1), c(0)],
	[c(2), c(1), c(4, 0, 0, 1, 6), c(4, 180, -1, 0, 5), c(0), c(0), c(0), c(4, 0, 1, 0, 9), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 10), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(1), c(4, 270, 1, 0, 7), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 8), c(0), c(0), c(0), c(4, 270, 1, 0, 11), c(3, 90), c(3, 90)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2)],
];

export const secondLevelOptions = {
	mapName: 'Level two',
	defaultTileHeight: 128,
	defaultTileWidth: 128,
	mapImageHeight: 896,
	mapImageWidth: 640,
	mapImageSrc: ImagePath.terrain,
	mapTemplate: secondLevelTemplate,
	environmentX: 128,
	environmentY: 512,
	menuOptions: menuItems,
	defaultUserStats: firstLevelUserStats
}