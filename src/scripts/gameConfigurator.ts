import { GameConfigurationOptions, IImageAsset, ILevelMap, ImagePath } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasContext } from './canvas';
import Configurator from './configurator';

export default class GameConfigurator extends Configurator {
	constructor(canvasContext: CanvasContext) {
		super(canvasContext);
	}

	currentMap!: MapConfigurator;
	maps: ILevelMap[] = [];

	public async configureGame(options: GameConfigurationOptions) {
		this.setMaps(options.maps);
		await this.currentMap.loadMapImage();

		this.context.drawImage(this.currentMap.mapImage, 0, 160, 288, 160, 250, 250, 288, 160);
	}

	private setMaps(maps: ILevelMap[]) {
		this.maps = maps;
		setDefaultMap.call(this);
		function setDefaultMap(this) {
			const firstLevelMap = this.maps.find(levelMap => levelMap.level == 1);
			if (_.isNil(firstLevelMap))
				throw new Error('Default map is not defined');
			this.currentMap = firstLevelMap.map;
		}
	}

	private animate() {
		requestAnimationFrame(this.animate);
	}

	startGame() {
		this.animate();
	}

};






		// const platformImage = Utilities.createImage(768, 640, ' ../sprites/Red/Towers/towers_walls_blank.png');

		// const simplePlasmaTowerImage = Utilities.createImage(1408, 128, '../sprites/Red/Weapons/turret_02_mk1.png');
		// const demonBossImage = Utilities.createImage(3456, 320, '../sprites/demonBoss/demonBoss288_160.png');
		// private createTowersImages() {
		// 	const simpleCannonTowerImage = Utilities.createImage(1024, 128, ' ../sprites/Red/Weapons/turret_01_mk1.png');
		// }