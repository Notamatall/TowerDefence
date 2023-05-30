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

	startGame() {
		this.animate();
	}

	private animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.currentMap.drawMap()
		this.currentMap.tryDrawPicked();
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



	// onClick(e) {
	// 	var rect = this.canvas.getBoundingClientRect();
	// 	const clickIndexY = Math.round((e.clientY - rect.top - this.currentMap.tileHeight / 2) / this.currentMap.tileHeight);
	// 	const clickIndexX = Math.round((e.clientX - rect.left - this.currentMap.tileWidth / 2) / this.currentMap.tileWidth);
	// 	const offsetX = clickIndexX * this.currentMap.tileWidth;
	// 	const offsetY = clickIndexY * this.currentMap.tileHeight;

	// 	if (this.currentMap.pickedMenuItem != null) {
	// 		this.currentMap.isMenuItemPicked = true;
	// 		return;
	// 	}

	// 	if (this.currentMap.isMenuItemPicked) {
	// 		if (!isEnoughMoney()) {
	// 			return;
	// 		}

	// 		if (menuHoverItem == platformImage) {
	// 			if (map[clickIndexY][clickIndexX].index == 0
	// 				&& !platformList?.find(platform => platform.x == offsetX && platform.y == offsetY)) {
	// 				payPriceForNewItem();
	// 				platformList.push({ x: offsetX, y: offsetY });
	// 			}
	// 			return;
	// 		}


	// 		const towerData = getTowerInitValues();

	// 		if (isPlatformWithoutTower(clickIndexX, clickIndexY, offsetX, offsetY)) {
	// 			payPriceForNewItem();
	// 			createTower({
	// 				image: menuHoverItem,
	// 				offsetX: offsetX,
	// 				offsetY: offsetY,
	// 				startFrame: towerData.startFrame,
	// 				framesAmount: towerData.framesAmount,
	// 				frameRate: towerData.frameRate,
	// 				width: defaultTileWidth,
	// 				height: defaultTileHeight,
	// 				attackDamage: towerData.attackDamage,
	// 				attackRadius: towerData.attackRadius,
	// 			})
	// 		}
	// 	}
	// }

};




