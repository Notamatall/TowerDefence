import { IMenuOption } from "@/types";
import { ImagePath } from "@/types/imagePath";
import { Towers } from "../towers";
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

export const firstLevelTemplate: IMapTemplateCell[][] = [
	[c(2), c(1), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(3, 90), c(3, 90), c(4, 90, 0, 1, 1), c(0), c(0), c(0), c(0), c(4, 0, 1, 0, 4), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 5), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(1), c(4, 270, 1, 0, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 3), c(0), c(0), c(0), c(4, 270, 1, 0, 6), c(3, 90), c(3, 90)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
];

export const firstLevelMenu: IMenuOption[] = [
	{
		towerId: Towers.singleBarrelCannon.id,
		itemImageSrc: ImagePath.singleBarrelCannon,
		price: 350,
		name: 'Turret'
	},
	{
		towerId: Towers.simpleLaserCannon.id,
		itemImageSrc: ImagePath.simpleLaserCannon,
		price: 350,
		name: 'Laser Cannon'
	},
	{
		towerId: 0,
		itemImageSrc: ImagePath.platform,
		price: 50,
		name: 'Platform'
	},
	{
		towerId: 3,
		itemImageSrc: ImagePath.supremeLaserCannon,
		price: 700,
		name: 'supreme Laser Cannon'
	},
	{
		towerId: 4,
		itemImageSrc: ImagePath.supremeLaserCannonPlus,
		price: 500,
		name: 'double Barrel Cannon Plus'
	},
]