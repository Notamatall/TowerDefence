import '../styles/game.css';
import '@/styles/game.scss';
import { CanvasBuilder } from './canvasBuilder';
import GameConfigurator from './gameConfigurator';
import MapConfigurator from './mapConfigurator';
import { ImagePath } from '@/types/imagePath';
import { firstLevelMenu, firstLevelTemplate, firstLevelUserStats } from './mapTemplates/mapTemplates';
import myAudioResource from '@/audio/fateOfGalaxy.mp3';

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
const background = new Audio(myAudioResource);
document.body.appendChild(background);
background.muted = true;

const button: HTMLButtonElement = document.getElementById('game__background-audio-btn') as HTMLButtonElement;
console.log(button)

button.addEventListener('click', () => {
	console.log('here')
	background.muted = false;
	background.play();
})




// document.onkeydown = (e) => {
// 	if (e.code == 'Escape')
// }