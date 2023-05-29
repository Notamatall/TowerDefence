import { GameConfigurationOptions, ILevelMap } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasBuilder } from './canvasBuilder';
import Configurator from './configurator';

export default class GameConfigurator extends Configurator {
	constructor(canvasContext: CanvasBuilder) {
		super(canvasContext);
	}

	currentMap!: MapConfigurator;
	maps: ILevelMap[] = [];

	public async configureGame(options: GameConfigurationOptions): Promise<void> {
		this.setMaps(options.maps);
		await this.currentMap.configureMap();
		//this.context.drawImage(this.currentMap.mapImage, 0, 160, 288, 160, 250, 250, 288, 160);
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
		requestAnimationFrame(this.animate.bind(this));
		this.currentMap.drawMap()
		this.currentMap.tryDrawPicked();
	}


	startGame() {
		this.animate();
	}

};




