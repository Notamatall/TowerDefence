import MapConfigurator from '@/scripts/mapConfigurator';
import { IMapTemplateCell } from '@/scripts/mapTemplates/mapTemplates';
import { TowerType } from './towersTypes';
import { EnemyType } from './enemyTypes';


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
	waves: Wave[];
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

export class WaveEnemy {
	static createWaveEnemy(
		enemyType: EnemyType,
		amount: number,
		spawnDistanceX: number = 0,
		spawnDistanceY: number = 0,
		spawnBetweenUnitX: number = 0,
		spawnBetweenUnitY: number = 0
	) {
		const waveEnemy = new WaveEnemy();
		waveEnemy.amount = amount;
		waveEnemy.enemyType = enemyType;
		waveEnemy.spawnDistanceX = spawnDistanceX;
		waveEnemy.spawnDistanceY = spawnDistanceY;
		waveEnemy.spawnBetweenUnitX = spawnBetweenUnitX;
		waveEnemy.spawnBetweenUnitY = spawnBetweenUnitY;
		return waveEnemy;
	}

	spawnDistanceX: number = 0;
	spawnDistanceY: number = 0;
	spawnBetweenUnitX: number = 0;
	spawnBetweenUnitY: number = 0;
	enemyType!: EnemyType;
	amount!: number;
}


export class Wave {
	static createWave(enemies: WaveEnemy[], afterWaveDelay = 10) {
		const wave = new Wave();
		wave.afterWaveDelay = afterWaveDelay;
		wave.waveEnemies = enemies;
		return wave;
	}

	waveEnemies: WaveEnemy[] = [];
	afterWaveDelay!: number;
}

export type UserStatsKey = keyof IUserStats; 