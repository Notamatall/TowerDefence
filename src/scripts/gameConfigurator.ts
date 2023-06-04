import { GameConfigurationOptions, ILevelMap, IUserStats, UserStatsKey } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasBuilder } from './canvasBuilder';
import Configurator from './configurator';
import { Tower, ITower, TowerType, ITowerInitializer } from '@/types/towersTypes';
import Towers from './towers';
import Enemies from './enemies';
import Enemy, { IEnemy, IEnemyInitializer } from '@/types/enemyTypes';


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

		for (let index = 0; index < 15; index++) {
			this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demonBoss, - 256 * index, 128), this.canvasAccessor));

		}

		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.lizard, -128, 128), this.canvasAccessor));

		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.smallDragon, -256, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.medusa, -512, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demon, -256, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demonBoss, 0, 128), this.canvasAccessor));

	}

	public startGame() {
		this.animate();
	}


	private createEnemy(enemyInitializer: IEnemyInitializer, positionX: number, positionY: number) {
		let lastEnemyId = 0;
		if (_.isEmpty(this.enemiesList) === false)
			lastEnemyId = _.last(this.enemiesList)!.enemyId;
		const nextId = lastEnemyId + 1;

		const enemy: IEnemy = {
			...enemyInitializer,
			enemyId: nextId,
			dealDamage: (damage) => this.dealDamage(damage),
			releseEnemyAfterPass: (enemyId) => this.releseEnemyAfterPass(enemyId),
			turnPositions: Array.from(this.currentMap.turnPlaces),
			positionX: positionX,
			positionY: positionY,
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
		//this.drawTowers();
		this.currentMap.tryDrawPickedMenuItem();

		for (const tower of this.towersList)
			tower.update();

		for (const enemy of this.enemiesList)
			enemy.update();

	}

	private drawPlatforms() {
		for (const platform of this.platformList)
			this.context.drawImage(platform.sprite.image, 0, 0,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight,
				platform.positionX,
				platform.positionY,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight);
	}

	private drawTowers() {
		for (const tower of this.towersList)
			this.context.drawImage(tower.sprite.image, 0, 0,
				this.currentMap.tileWidth,
				this.currentMap.tileHeight,
				tower.positionX,
				tower.positionY,
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
					const platform = this.getTowerFromTemplate(this.currentMap.pickedMenuItem, tileStartXCoordinate, tileStartYCoordinate);
					this.addPlatform(platform);
				}
				return;
			}

			if (this.isPlatformWithoutTower(clickIndexX, clickIndexY, tileStartXCoordinate, tileStartYCoordinate)) {
				this.payPriceForNewItem();
				const tower = this.getTowerFromTemplate(this.currentMap.pickedMenuItem, tileStartXCoordinate, tileStartYCoordinate);
				this.addTower(tower);
			}
		}

		this.addMouseClickEventHandler(clickEvenHandler)
	}

	addTower(tower: Tower) {
		this.towersList.push(tower);
	}

	addPlatform(tower: Tower) {
		this.platformList.push(tower);
	}

	private getTowerFromTemplate(towerTemplate: ITowerInitializer, positionX: number, positionY: number): Tower {
		let lastTowerId = 0;
		if (_.isEmpty(this.towersList) === false)
			lastTowerId = _.last(this.towersList)!.towerId;
		const nextId = lastTowerId + 1;
		const towerInitializer: ITower = {
			...towerTemplate,
			getAttackTargetInRadius: (searchRadius) => this.getAttackTargetInRadius(searchRadius),
			removeTargetForTowers: (target) => this.removeTargetForTowers(target),
			positionX: positionX,
			positionY: positionY,
			towerId: lastTowerId + nextId
		}

		return new Tower(towerInitializer, this.canvasAccessor);
	}

	private removeTargetForTowers(target: Enemy) {
		if (_.isNull(this.userStatsProxy))
			throw new Error('User stats cannot be null');

		this.userStatsProxy.userCoins = this.userStatsProxy.userCoins + target.deathReward;
		this.enemiesList.splice(this.enemiesList.findIndex(enemy => enemy.enemyId == target.enemyId), 1);
		for (const tower of this.towersList) {
			if (tower.attackTarget == target) {
				tower.currentFrameChangeValue = 0;
				tower.currentSpriteFrame = 0;
				tower.attackTarget = null;
				tower.animate()
			}
		}
	}

	private getAttackTargetInRadius(searchRadius: Path2D): Enemy | undefined {
		for (const enemy of this.enemiesList) {
			if (this.context.isPointInPath(
				searchRadius,
				enemy.imageCenter.centerX,
				enemy.imageCenter.centerY)) {
				return enemy;
			}
		}
		return undefined;
	}

	private isPlatformWithoutTower(clickIndexX: number, clickIndexY: number, tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.currentMap.canBuildOnTile(clickIndexX, clickIndexY)
			&& this.isPlatformBuildOnTile(tileStartXCoordinate, tileStartYCoordinate)
			&& !this.isTowerBuildOnTile(tileStartXCoordinate, tileStartYCoordinate);
	}

	private isTowerBuildOnTile(tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.towersList.find(platform => platform.positionX == tileStartXCoordinate && platform.positionY == tileStartYCoordinate) !== undefined;
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
		return this.platformList.find(platform => platform.positionX == tileStartXCoordinate && platform.positionY == tileStartYCoordinate) !== undefined;
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

	private isPickedMenuItemNull(pickedMenuItem: ITowerInitializer | null): pickedMenuItem is null {
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




