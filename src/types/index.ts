import MapConfigurator from '@/scripts/mapConfigurator';
import { IMapTemplateCell } from '@/scripts/mapTemplates/mapTemplates';

export interface IImageAsset {
	img: HTMLImageElement;
	key: string
}


export interface MapConfigurationOptions {
	mapName: string;
	defaultTileWidth: number;
	defaultTileHeight: number;
	mapImageWidth: number;
	mapImageHeight: number;
	mapImageSrc: string;
	mapTemplate: IMapTemplateCell[][];
	environmentX: number;
	environmentY: number;
	menuOptions: IMenuOption[];
	defaultUserStats: IUserStats;
}

export interface ICanvasContextOptions {
	width: number;
	height: number;
}

export interface GameConfigurationOptions {
	maps: ILevelMap[];
}

export interface ILevelMap {
	level: number;
	map: MapConfigurator;
}

export interface IMenuOption {
	towerId: number;
	itemImageSrc: string;
	price: number;
	name: string;
}
export interface IMenuItem {
	towerId: number;
	itemImage: HTMLImageElement;
	price: number;
	name: string;
}
export interface IUserStats {
	userHP: number,
	userCoins: number
}

export type UserStatsKey = keyof IUserStats; 