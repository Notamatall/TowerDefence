import { Coordinate, IUserStats, MapConfigurationOptions, Wave, WaveEnemy } from "@/types";
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
const menuItems: TowerType[] = ['platform', 'singleBarrelCannon', 'simpleLaserCannon', 'slowTower']
const firstLevelUserStats: IUserStats = {
	userHP: 100,
	userCoins: 1200
}

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

const firstLevelWaves: Wave[] = [
	Wave.createWave([
		WaveEnemy.createWaveEnemy('jinn', 13, -200, 0, -180, 0),
	], 15),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('lizard', 8, -200, 0, -350, 0),
		WaveEnemy.createWaveEnemy('jinn', 11, -(8 * 250), 0, -230, 0),
	], 5),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('jinn', 11, -200, 0, -230, 0),
		WaveEnemy.createWaveEnemy('lizard', 8, -(11 * 250), 0, -250, 0),
		WaveEnemy.createWaveEnemy('robot', 3, -(3 * 250), 0, -1000, 0),
	], 5),
]


export const firstLevelOptions: MapConfigurationOptions = {
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
	defaultUserStats: firstLevelUserStats,
	spawnPoint: getSpawnPoint(firstLevelTemplate, -200, 0),
	waves: firstLevelWaves
}

const secondLevelTemplate: IMapTemplateCell[][] = [
	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(3, 0, 0, 1, 0), c(2)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(1), c(0), c(4, 0, 0, 1, 4), c(3, 90), c(3, 90), c(4, 90, -1, 0, 3), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(4, 270, 0, -1, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, -1, 0, 1), c(0)],
	[c(2), c(1), c(4, 0, 0, 1, 6), c(4, 180, -1, 0, 5), c(0), c(0), c(0), c(4, 0, 1, 0, 9), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 10), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
	[c(2), c(1), c(4, 270, 1, 0, 7), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 8), c(0), c(0), c(0), c(4, 270, 1, 0, 11), c(3, 90), c(3, 90)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2)],
];

const secondLevelUserStats: IUserStats = {
	userHP: 100,
	userCoins: 1600
}

const secondLevelWaves: Wave[] = [
	Wave.createWave([
		WaveEnemy.createWaveEnemy('smallDragon', 15, 0, 0, 0, -300),
	], 10),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('smallDragon', 15, 0, 0, 0, -350),
		WaveEnemy.createWaveEnemy('medusa', 12, 0, -(6 * 250), 0, -600),
	], 5),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('smallDragon', 15, 0, 0, 0, -400),
		WaveEnemy.createWaveEnemy('medusa', 12, 0, -1000, 0, -600),
		WaveEnemy.createWaveEnemy('dragon', 8, 0, -500, 0, -1400),
	], 5),
]

export const secondLevelOptions: MapConfigurationOptions = {
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
	defaultUserStats: secondLevelUserStats,
	spawnPoint: getSpawnPoint(secondLevelTemplate, 0, -200),
	waves: secondLevelWaves
}

const thirdLevelTemplate: IMapTemplateCell[][] = [
	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(1), c(2)],
	[c(2), c(0), c(0), c(0), c(0), c(1), c(0), c(1), c(0), c(0), c(0), c(0), c(4, 0, 1, 0, 13), c(3, 90), c(3, 90), c(3, 90), c(3, 90)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(1), c(2)],
	[c(2), c(1), c(0), c(4, 0, 1, 0, 9), c(3, 90), c(3, 90), c(4, 90, 0, 1, 10), c(0), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(1), c(2)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(0), c(0), c(1), c(0), c(0), c(3, 0), c(0), c(1), c(1), c(2)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(3, 0), c(1), c(0), c(0), c(0), c(0), c(3, 0), c(0), c(0), c(1), c(2)],
	[c(2), c(1), c(0), c(3, 0), c(0), c(0), c(4, 270, 1, 0, 11), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 12), c(0), c(0), c(1), c(2)],
	[c(2), c(1), c(0), c(4, 270, 0, -1, 8), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 90, -1, 0, 7), c(0), c(1), c(2)],
	[c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(3), c(0), c(1), c(2)],
	[c(2), c(0), c(4, 0, 1, 0, 3), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 4), c(0), c(3), c(0), c(1), c(2)],
	[c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(3), c(0), c(3), c(0), c(1), c(2)],
	[c(2), c(1), c(3), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(4, 270, 1, 0, 5), c(3, 90), c(4, 180, 0, -1, 6), c(0), c(1), c(2)],
	[c(2), c(0), c(4, 270, 0, -1, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 90, -1, 0, 1), c(0), c(0), c(0), c(2), c(2)],
	[c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(2), c(3, 0, 0, -1, 0), c(2), c(2), c(2), c(2), c(2)],
];

const thirdLevelUserStats: IUserStats = {
	userHP: 100,
	userCoins: 2400
}
const thirdLevelWaves: Wave[] = [
	Wave.createWave([
		WaveEnemy.createWaveEnemy('jinn', 15, 0, 0, 0, 350),
		WaveEnemy.createWaveEnemy('demon', 7, 0, 450, 0, 800),
	], 10),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('jinn', 15, 0, 0, 0, 500),
		WaveEnemy.createWaveEnemy('medusa', 15, 0, 1000, 0, 800),
		WaveEnemy.createWaveEnemy('demon', 15, 0, 450, 0, 600),
	], 5),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('smallDragon', 15, 0, 0, 0, 400),
		WaveEnemy.createWaveEnemy('dragon', 6, 0, 2000, 0, 1400),
		WaveEnemy.createWaveEnemy('demon', 15, 0, 250, 0, 650),
		WaveEnemy.createWaveEnemy('lizard', 15, 0, 1300, 0, 250),
	], 5),
	Wave.createWave([
		WaveEnemy.createWaveEnemy('medusa', 15, 0, 0, 0, 600),
		WaveEnemy.createWaveEnemy('dragon', 8, 0, 1000, 0, 550),
		WaveEnemy.createWaveEnemy('robot', 6, 0, 1400, 0, 900),
		WaveEnemy.createWaveEnemy('demon', 15, 0, 250, 0, 650),
		WaveEnemy.createWaveEnemy('demonBoss', 15, 0, 1700, 0, 700),
	], 5),
]

export const thirdLevelOptions: MapConfigurationOptions = {
	mapName: 'Level two',
	defaultTileHeight: 128,
	defaultTileWidth: 128,
	mapImageHeight: 896,
	mapImageWidth: 640,
	mapImageSrc: ImagePath.terrain,
	mapTemplate: thirdLevelTemplate,
	environmentX: 128,
	environmentY: 0,
	menuOptions: menuItems,
	defaultUserStats: thirdLevelUserStats,
	spawnPoint: getSpawnPoint(thirdLevelTemplate, 0, 200),
	waves: thirdLevelWaves
}

function getSpawnPoint(mapTemplate: IMapTemplateCell[][], addByX: number, addByY: number): Coordinate {
	const rowLength = mapTemplate[0].length;
	const flatColumnIndex = mapTemplate.flat(1).findIndex(cell => cell.order === 0);
	const mapRow = Math.floor(flatColumnIndex / rowLength);
	const mapColumn = flatColumnIndex % rowLength;
	return { y: mapRow * 128 + addByY, x: mapColumn * 128 + addByX }
}