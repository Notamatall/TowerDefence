import { IMenuOption } from "@/types";
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
	Towers.getMenuOption(Towers.list.platform),
	Towers.getMenuOption(Towers.list.singleBarrelCannon),
	Towers.getMenuOption(Towers.list.doubleBarrelCannon),
	Towers.getMenuOption(Towers.list.simpleLaserCannon),
	Towers.getMenuOption(Towers.list.advancedLaserCannon),
]