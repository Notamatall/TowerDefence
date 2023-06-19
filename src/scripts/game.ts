import '@/styles/game.css';
import '@/styles/game.scss';
import { CanvasBuilder } from './canvasBuilder';
import GameConfigurator from './gameConfigurator';
import { firstLevelOptions, secondLevelOptions } from './mapTemplates/mapTemplates';

const app = new CanvasBuilder();

const game = new GameConfigurator(app);

game.configureGame({
	levels:
		[
			{ level: 1, mapOptions: firstLevelOptions },
			{ level: 2, mapOptions: secondLevelOptions },
			{ level: 3, mapOptions: secondLevelOptions },
		]
}
).then(() =>
	game.startGame()
);

