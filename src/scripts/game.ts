import '../styles/game.css';
import '@/styles/game.scss';
import { CanvasBuilder } from './canvasBuilder';
import GameConfigurator from './gameConfigurator';
import MapConfigurator from './mapConfigurator';
import { ImagePath } from '@/types/imagePath';
import { firstLevelMenu, firstLevelTemplate, firstLevelUserStats } from './mapTemplates/mapTemplates';

const app = new CanvasBuilder({
	width: screen.width,
	height: screen.availHeight
});

const game = new GameConfigurator(app);
const levelOne = new MapConfigurator(app, {
	mapName: 'Level one',
	defaultTileHeight: 128,
	defaultTileWidth: 128,
	mapImageHeight: 896,
	mapImageWidth: 640,
	mapImageSrc: ImagePath.terrain,
	mapTemplate: firstLevelTemplate,
	environmentX: 128,
	environmentY: 384,
	menuOptions: firstLevelMenu,
	defaultUserStats: firstLevelUserStats
});

game.configureGame({
	maps: [
		{ level: 1, map: levelOne }
	]
}).then(() =>
	game.startGame()
);

