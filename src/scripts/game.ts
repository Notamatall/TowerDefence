import '@/styles/game.css';
import '@/styles/game.scss';
import { CanvasBuilder } from './canvasBuilder';
import GameConfigurator from './gameConfigurator';
import MapConfigurator from './mapConfigurator';
import { firstLevelOptions, secondLevelOptions } from './mapTemplates/mapTemplates';

const app = new CanvasBuilder({
	width: secondLevelOptions.mapTemplate[0].length * 128,
	height: secondLevelOptions.mapTemplate.length * 128
});

const game = new GameConfigurator(app);
const levelOne = new MapConfigurator(app, firstLevelOptions);
const levelTwo = new MapConfigurator(app, secondLevelOptions);

game.configureGame({
	maps: [
		{ level: 1, map: levelTwo },
		{ level: 2, map: levelTwo },
		{ level: 3, map: levelOne },
	]
}).then(() =>
	game.startGame()
);

