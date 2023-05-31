import { GameConfigurationOptions, ILevelMap, IMenuItem, IMenuOption, IUserStats, UserStatsKey } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasBuilder } from './canvasBuilder';
import Configurator from './configurator';

export default class GameConfigurator extends Configurator {
	constructor(canvasContext: CanvasBuilder) {
		super(canvasContext);
	}
	private maps: ILevelMap[] = [];
	private currentMap!: MapConfigurator;
	private userStatsProxy: IUserStats | null = null;


	public async configureGame(options: GameConfigurationOptions): Promise<void> {
		this.setMaps(options.maps);
		await this.currentMap.configureMap();
		this.registerUserStatsProxy(this.currentMap);
		this.registerOnCanvasClick();

		//this.context.drawImage(this.currentMap.mapImage, 0, 160, 288, 160, 250, 250, 288, 160);
	}

	public startGame() {
		this.animate();
	}


	private registerUserStatsProxy(currentMap: MapConfigurator) {
		const userStats: IUserStats = {} as IUserStats;
		var handler = function (this: GameConfigurator) {
			const hpElement = currentMap.hpElement;
			const coinsElement = currentMap.coinsElement;

			if (coinsElement === null)
				throw new Error('Coins element is null');
			if (hpElement === null)
				throw new Error('HpElement element is null');

			return {
				get: function (target: IUserStats, name: string) {
					return name in target ? target[name] : null;
				},
				set: function (obj: IUserStats, prop: UserStatsKey, value: number) {
					obj[prop] = value;
					if (prop == 'userHP') {
						hpElement.innerText = `${obj[prop]}`;
						return true;
					}
					else
						if (prop == 'userCoins') {
							coinsElement.innerText = `${obj[prop]}`;
							return true;
						}
					return false;
				}
			};
		}

		this.userStatsProxy = new Proxy(userStats, handler.call(this));
		this.userStatsProxy.userCoins = currentMap.defaultUserStats.userCoins;
		this.userStatsProxy.userHP = currentMap.defaultUserStats.userHP;
	}


	private animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.currentMap.drawMap()
		this.currentMap.tryDrawPickedMenuItem();
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

	private registerOnCanvasClick() {
		const clickEvenHandler = (e: MouseEvent) => {
			const clickIndexY = this.currentMap.getClickedMapIndexY(e.clientY);
			const clickIndexX = this.currentMap.getClickedMapIndexX(e.clientX);
			const tileStartXCoordinate = clickIndexX * this.currentMap.tileWidth;
			const tileStartYCoordinate = clickIndexY * this.currentMap.tileHeight;
			if (this.currentMap.isMenuItemPicked) {
				if (this.isEnoughMoney() === false) {
					return;
				}

			}

			this.addMouseClickEventHandler(clickEvenHandler)





			// if (this.currentMap.pickedMenuItem != null) {
			// 	this.currentMap.isMenuItemPicked = true;
			// 	return;
			// }


			// 	if (menuHoverItem == platformImage) {
			// 		if (map[clickIndexY][clickIndexX].index == 0
			// 			&& !platformList?.find(platform => platform.x == offsetX && platform.y == offsetY)) {
			// 			payPriceForNewItem();
			// 			platformList.push({ x: offsetX, y: offsetY });
			// 		}
			// 		return;
			// 	}


			// 	const towerData = getTowerInitValues();

			// 	if (isPlatformWithoutTower(clickIndexX, clickIndexY, offsetX, offsetY)) {
			// 		payPriceForNewItem();
			// 		createTower({
			// 			image: menuHoverItem,
			// 			offsetX: offsetX,
			// 			offsetY: offsetY,
			// 			startFrame: towerData.startFrame,
			// 			framesAmount: towerData.framesAmount,
			// 			frameRate: towerData.frameRate,
			// 			width: defaultTileWidth,
			// 			height: defaultTileHeight,
			// 			attackDamage: towerData.attackDamage,
			// 			attackRadius: towerData.attackRadius,
			// 		})
			// 	}
			// }
		}

	}

	private isEnoughMoney() {
		if (this.IsUserStatsProxyNull(this.userStatsProxy))
			throw new Error('User stats proxy is null');

		if (this.IsPickedMenuItemNull(this.currentMap.pickedMenuItem))
			throw new Error('PickedMenuItem is null');

		if (isEnoughtToBuyPicked(this.userStatsProxy.userCoins, this.currentMap.menuOptionsList, this.currentMap.pickedMenuItem))
			return true;

		function isEnoughtToBuyPicked(currentBalance: number, menuItems: IMenuOption[], pickedItem: IMenuItem) {
			return currentBalance - menuItems.find(item => item.towerId === pickedItem.towerId)!.price >= 0;
		}
		return false;
	}

	private IsUserStatsProxyNull(proxy: IUserStats | null): proxy is null {
		return proxy === null;
	}

	private IsPickedMenuItemNull(pickedMenuItem: IMenuItem | null): pickedMenuItem is null {
		return pickedMenuItem === null;
	}


	//end of class
};




