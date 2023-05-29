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
}

export interface ICanvasContextOptions {
	containerId: string;
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
}