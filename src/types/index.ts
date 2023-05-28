import mapImage from '@/assets/sprites/terrain.png';
import MapConfigurator from '@/scripts/mapConfigurator';

export interface IImageAsset {
	img: HTMLImageElement;
	key: string
}

export class ImagePath {
	static map = mapImage;
}

export interface MapConfigurationOptions {
	defaultTileWidth: number;
	defaultTileHeight: number;
	mapImageWidth: number;
	mapImageHeight: number;
	mapImage: string
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