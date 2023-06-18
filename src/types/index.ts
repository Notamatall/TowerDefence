import MapConfigurator from '@/scripts/mapConfigurator';
import { IMapTemplateCell } from '@/scripts/mapTemplates/mapTemplates';
import { TowerType } from './towersTypes';


export interface IImageAsset<T> {
	img: HTMLImageElement;
	key: T
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
	menuOptions: TowerType[];
	defaultUserStats: IUserStats;
	spawnPoint: Coordinate;
}

export interface Coordinate {
	x: number;
	y: number;
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

export interface IUserStats {
	userHP: number,
	userCoins: number
}


export interface TurnPosition {
	xTurnStart: number;
	yTurnStart: number;
	dirX: number;
	dirY: number;
	order: number;
}


export type UserStatsKey = keyof IUserStats; 