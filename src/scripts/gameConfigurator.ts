import { GameConfigurationOptions, ILevelMap, IUserStats, UserStatsKey } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasBuilder } from './canvasBuilder';
import Configurator from './configurator';
import { Tower, ITower, TowerType } from '@/types/towersTypes';
import Towers from './towers';
import Enemies from './enemies';
import Enemy, { IEnemy } from '@/types/enemyTypes';


export default class GameConfigurator extends Configurator {
	constructor(canvasContext: CanvasBuilder) {
		super(canvasContext);
	}
	private maps: ILevelMap[] = [];
	private currentMap!: MapConfigurator;
	private userStatsProxy: IUserStats | null = null;
	private platformList: Tower[] = [];
	private towersList: Tower[] = [];
	private enemiesList: Enemy[] = [];
	count: number = 0;
	public async configureGame(options: GameConfigurationOptions): Promise<void> {
		this.setMaps(options.maps);
		await Towers.init(this.currentMap.tileWidth, this.currentMap.tileHeight);
		await Enemies.init()
		await this.currentMap.configureMap();
		this.registerUserStatsProxy(this.currentMap);
		this.registerOnCanvasClick();
		this.enemiesList.push(new Enemy(3, this.createEnemy(Enemies.list.dragon, -1000, 1000), this.canvasAccessor));
		this.enemiesList.push(new Enemy(1, this.createEnemy(Enemies.list.jinn, 0, 128), this.canvasAccessor));
		this.enemiesList.push(new Enemy(2, this.createEnemy(Enemies.list.lizard, -128, 128), this.canvasAccessor));

		this.enemiesList.push(new Enemy(4, this.createEnemy(Enemies.list.smallDragon, -256, 128), this.canvasAccessor));
		this.enemiesList.push(new Enemy(5, this.createEnemy(Enemies.list.medusa, -512, 128), this.canvasAccessor));
		this.enemiesList.push(new Enemy(6, this.createEnemy(Enemies.list.demon, -256, 128), this.canvasAccessor));
		this.enemiesList.push(new Enemy(7, this.createEnemy(Enemies.list.demonBoss, 0, 128), this.canvasAccessor));

	}

	public startGame() {
		this.animate();
	}


	private createEnemy(enemyInitializer, posX, posY) {

		const enemy: IEnemy = {
			...enemyInitializer,
			dealDamage: (damage) => this.dealDamage(damage),
			releseEnemyAfterPass: (enemyId) => this.releseEnemyAfterPass(enemyId),
			turnPositions: Array.from(this.currentMap.turnPlaces),
			positionX: posX,
			positionY: posY,
			moveDirX: 1,
			moveDirY: 0
		}
		return enemy;
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
		this.drawPlatforms();
		this.drawTowers();
		this.currentMap.tryDrawPickedMenuItem();
		for (const demon of this.enemiesList)
			demon.update();

	}

	private drawPlatforms() {
		for (const platform of this.platformList)
			this.context.drawImage(platform.itemImage, 0, 0,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight,
				platform.xLocation,
				platform.yLocation,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight);
	}

	private drawTowers() {
		for (const tower of this.towersList)
			this.context.drawImage(tower.itemImage, 0, 0,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight,
				tower.xLocation,
				tower.yLocation,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight);
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

			if (this.currentMap.pickedMenuItem === null)
				return;

			if (this.isEnoughMoney() === false)
				return;

			if (Towers.isPlatform(this.currentMap.pickedMenuItem.type)) {
				if (this.currentMap.canBuildOnTile(clickIndexX, clickIndexY) && this.isPlatformBuildOnTile(tileStartXCoordinate, tileStartYCoordinate) === false) {
					this.payPriceForNewItem();
					this.platformList.push(new Tower(this.currentMap.pickedMenuItem, tileStartXCoordinate, tileStartYCoordinate));
				}
				return;
			}

			if (this.isPlatformWithoutTower(clickIndexX, clickIndexY, tileStartXCoordinate, tileStartYCoordinate)) {
				this.payPriceForNewItem();
				this.createTower(this.currentMap.pickedMenuItem, tileStartXCoordinate, tileStartYCoordinate);
			}
		}

		this.addMouseClickEventHandler(clickEvenHandler)
	}

	private createTower(towerTemplate: ITower, tileStartXCoordinate: number, tileStartYCoordinate: number) {
		this.towersList.push(new Tower(towerTemplate, tileStartXCoordinate, tileStartYCoordinate))
	}

	private isPlatformWithoutTower(clickIndexX: number, clickIndexY: number, tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.currentMap.canBuildOnTile(clickIndexX, clickIndexY)
			&& this.isPlatformBuildOnTile(tileStartXCoordinate, tileStartYCoordinate)
			&& !this.isTowerBuildOnTile(tileStartXCoordinate, tileStartYCoordinate);
	}


	private isTowerBuildOnTile(tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.towersList.find(platform => platform.xLocation == tileStartXCoordinate && platform.yLocation == tileStartYCoordinate) !== undefined;
	}

	private payPriceForNewItem() {
		if (this.isUserStatsProxyNull(this.userStatsProxy))
			throw new Error('User stats proxy is null');

		if (this.isPickedMenuItemNull(this.currentMap.pickedMenuItem))
			throw new Error('PickedMenuItem is null');

		const pickedItemPrice = Towers.getTowerPriceByType(this.currentMap.pickedMenuItem.type);
		this.userStatsProxy.userCoins = this.userStatsProxy.userCoins - pickedItemPrice;
	}

	private isPlatformBuildOnTile(tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.platformList.find(platform => platform.xLocation == tileStartXCoordinate && platform.yLocation == tileStartYCoordinate) !== undefined;
	}

	private isEnoughMoney() {
		if (this.isUserStatsProxyNull(this.userStatsProxy))
			throw new Error('User stats proxy is null');

		if (this.isPickedMenuItemNull(this.currentMap.pickedMenuItem))
			throw new Error('PickedMenuItem is null');

		if (isEnoughtToBuyPicked(this.userStatsProxy.userCoins, this.currentMap.pickedMenuItem.type))
			return true;

		function isEnoughtToBuyPicked(currentBalance: number, pickedItemType: TowerType) {
			return (currentBalance - Towers.getTowerPriceByType(pickedItemType)) >= 0;
		}
		return false;
	}

	private isUserStatsProxyNull(proxy: IUserStats | null): proxy is null {
		return proxy === null;
	}

	private isPickedMenuItemNull(pickedMenuItem: ITower | null): pickedMenuItem is null {
		return pickedMenuItem === null;
	}

	private dealDamage(damage: number): void {
		if (_.isNull(this.userStatsProxy))
			throw new Error("UserStatsProxy is null");

		this.userStatsProxy.userHP = this.userStatsProxy.userHP - damage;
	}

	private releseEnemyAfterPass(enemyId: number): void {
		this.enemiesList.splice(this.enemiesList.findIndex(enemy => enemy.enemyId === enemyId), 1);
	}
	//end of class
};




