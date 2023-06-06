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
	private towerSellUpgradeElement!: HTMLDivElement;
	private sellTowerEvent: ((e: MouseEvent) => void) | null = null;
	private upgradeTowerEvent: ((e: MouseEvent) => void) | null = null;


	public async configureGame(options: GameConfigurationOptions): Promise<void> {
		this.setMaps(options.maps);
		await Towers.init(this.currentMap.tileWidth, this.currentMap.tileHeight);
		await Enemies.init()
		await this.currentMap.configureMap();
		this.registerUserStatsProxy(this.currentMap);
		this.registerOnCanvasClick();
		this.registerEscape();
		this.setTowerMenuElement();
		for (let index = 0; index < 15; index++) {
			this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.medusa, -2000 - 256 * index, 128), this.canvasAccessor));
		}

		for (let index = 0; index < 15; index++) {
			this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.lizard, -1000 - 256 * index, 128), this.canvasAccessor));
		}
		setInterval(() => {

			console.log(this.count)
			this.count = 0;
		}, 1000)
		//this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demonBoss, -128, 128), this.canvasAccessor));
		//this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.lizard, -128, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.dragon, -128, 128), this.canvasAccessor));

		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.smallDragon, -256, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.medusa, -512, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demon, -256, 128), this.canvasAccessor));
		// this.enemiesList.push(new Enemy(this.createEnemy(Enemies.list.demonBoss, 0, 128), this.canvasAccessor));

	}

	setTowerMenuElement() {
		const towerSellUpgradeElement = document.getElementById('game__update-tower-menu');
		if (towerSellUpgradeElement === null)
			throw new Error('Tower upgrade menu does not exist');
		this.towerSellUpgradeElement = towerSellUpgradeElement as HTMLDivElement;
	}

	public startGame() {
		this.animate();
	}

	private configureEnemiesByLevel() {
		// mostersLevelOne
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

	private registerEscape() {
		window.addEventListener('keydown', (e) => {
			if (e.code === 'Escape') {
				this.currentMap.pickedMenuItem = null;
			}
		})
	}

	private count = 0;
	private animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.currentMap.drawMap()
		this.drawPlatforms();
		this.drawTowers();

		this.count++;

		this.drawEnemies();
		this.currentMap.tryDrawPickedMenuItem();
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
			tower.update();
	}

	private drawEnemies() {
		for (const enemy of this.enemiesList)
			enemy.update();
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

	private handleTowerSellUpdate(coordinates: {
		clickIndexX: number;
		clickIndexY: number;
		tileStartXCoordinate: number;
		tileStartYCoordinate: number;
	}) {
		const sellButton = this.towerSellUpgradeElement.firstElementChild as HTMLButtonElement;
		const upgradeButton = this.towerSellUpgradeElement.lastElementChild as HTMLButtonElement;

		if (this.isPlatformWithTower(coordinates.clickIndexX, coordinates.clickIndexY, coordinates.tileStartXCoordinate, coordinates.tileStartYCoordinate)) {
			const towerToSellUpgrade = this.getTowerBuildOnTile(coordinates.tileStartXCoordinate, coordinates.tileStartYCoordinate);
			if (towerToSellUpgrade !== undefined) {
				setUpgradeSellMenuAroundTowerSelected(towerToSellUpgrade, this.towerSellUpgradeElement)

				if (_.isNull(sellButton) || _.isNull(upgradeButton))
					throw new Error("Buttons were not found");

				const sellTower = (e: MouseEvent) => {
					const sellingPercent = 0.75;
					this.userStatsProxy!.userCoins = this.userStatsProxy!.userCoins + towerToSellUpgrade.towerPrice * sellingPercent;
					this.removeTower(towerToSellUpgrade.towerId);
					sellButton.removeEventListener('click', sellTower, false)
					this.towerSellUpgradeElement.style.display = 'none';
				}

				const newUpgradeTowerEvent = (e: MouseEvent) => {
					if (towerToSellUpgrade.towerUpgradeType) {
						const price = Towers.getTowerPriceByType(towerToSellUpgrade.towerUpgradeType);
						if (this.isEnoughMoneyForPurchase(price)) {
							towerToSellUpgrade.upgrade();
							this.userStatsProxy!.userCoins = this.userStatsProxy!.userCoins - towerToSellUpgrade.towerPrice;
						}
					}
				}

				this.upgradeTowerEvent = newUpgradeTowerEvent;
				upgradeButton.addEventListener("click", newUpgradeTowerEvent, false);

				this.sellTowerEvent = sellTower;
				sellButton.addEventListener("click", sellTower, false);

				function setUpgradeSellMenuAroundTowerSelected(selectedTower: Tower, menu: HTMLDivElement) {
					menu.style.left = selectedTower.positionX + 'px';
					menu.style.top = selectedTower.positionY - 20 + 'px';
					menu.style.display = 'flex'
				}
			}
		}
	}


	private registerOnCanvasClick() {
		const clickEvenHandler = (e: MouseEvent) => {
			const coordinates = getMapCoordinatesByMouseClick(e, this.currentMap);
			this.clearSellUpgradeEvents();
			this.closeSellUpgradeMenu();
			if (this.currentMap.pickedMenuItem === null) {
				this.handleTowerSellUpdate(coordinates);
				return;
			}
			if (this.isEnoughMoneyForPurchase(Towers.getTowerPriceByType(this.currentMap.pickedMenuItem.type)) === false)
				return;

			if (Towers.isPlatform(this.currentMap.pickedMenuItem.type)) {
				if (this.currentMap.canBuildOnTile(coordinates.clickIndexX, coordinates.clickIndexY) &&
					this.isPlatformBuildOnTile(coordinates.tileStartXCoordinate, coordinates.tileStartYCoordinate) === false) {
					this.payPriceForNewItem();
					const platform = this.getTowerFromTemplate(this.currentMap.pickedMenuItem,
						coordinates.tileStartXCoordinate,
						coordinates.tileStartYCoordinate);
					this.addPlatform(platform);
				}
				return;
			}

			if (this.isPlatformWithoutTower(coordinates.clickIndexX, coordinates.clickIndexY, coordinates.tileStartXCoordinate, coordinates.tileStartYCoordinate)) {
				this.payPriceForNewItem();
				const tower = this.getTowerFromTemplate(this.currentMap.pickedMenuItem, coordinates.tileStartXCoordinate, coordinates.tileStartYCoordinate);
				this.addTower(tower);
			}
		}
		function getMapCoordinatesByMouseClick(e: MouseEvent, currentMap: MapConfigurator) {
			const clickIndexY = currentMap.getClickedMapIndexY(e.clientY);
			const clickIndexX = currentMap.getClickedMapIndexX(e.clientX);
			const tileStartXCoordinate = clickIndexX * currentMap.tileWidth;
			const tileStartYCoordinate = clickIndexY * currentMap.tileHeight;
			return {
				clickIndexX,
				clickIndexY,
				tileStartXCoordinate,
				tileStartYCoordinate,
			}
		}
		this.addMouseClickEventHandler(clickEvenHandler)
	}
	listAllEventListeners() {
		const upgradeButton = this.towerSellUpgradeElement.firstElementChild as HTMLButtonElement;
		const allElements = Array.prototype.slice.call(upgradeButton)


		const types: any[] = [];

		for (let ev in window) {

			if (/^on/.test(ev)) types[types.length] = ev;
		}

		let elements: any[] = [];
		for (let i = 0; i < allElements.length; i++) {
			const currentElement = allElements[i];
			for (let j = 0; j < types.length; j++) {
				if (typeof currentElement[types[j]] === 'function') {
					elements.push({
						"node": currentElement,
						"type": types[j],
						"func": currentElement[types[j]].toString(),
					});
				}
			}
		}

		return elements.sort(function (a, b) {
			return a.type.localeCompare(b.type);
		});
	}

	private clearSellUpgradeEvents() {
		const sellButton = this.towerSellUpgradeElement.firstElementChild as HTMLButtonElement;
		const upgradeButton = this.towerSellUpgradeElement.lastElementChild as HTMLButtonElement;
		if (this.upgradeTowerEvent)
			upgradeButton.removeEventListener('click', this.upgradeTowerEvent, false);

		if (this.sellTowerEvent)
			sellButton.removeEventListener('click', this.sellTowerEvent, false);
	}

	private closeSellUpgradeMenu() {
		this.towerSellUpgradeElement.style.display = 'none';
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

	removeTower(towerId: number) {
		this.towersList.splice(this.towersList.findIndex(tower => tower.towerId === towerId), 1);
	}

	upgradeTower(towerToUpgrade: Tower, upgradeTemplate: ITowerInitializer) {
		const upgradedTower = this.getTowerFromTemplate(upgradeTemplate, towerToUpgrade.positionX, towerToUpgrade.positionY);
		this.addTower(upgradedTower);
		this.removeTower(towerToUpgrade.towerId);
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

	private isPlatformWithTower(clickIndexX: number, clickIndexY: number, tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.currentMap.canBuildOnTile(clickIndexX, clickIndexY)
			&& this.isPlatformBuildOnTile(tileStartXCoordinate, tileStartYCoordinate)
			&& this.isTowerBuildOnTile(tileStartXCoordinate, tileStartYCoordinate);
	}

	private isTowerBuildOnTile(tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.towersList.find(platform => platform.positionX == tileStartXCoordinate && platform.positionY == tileStartYCoordinate) !== undefined;
	}

	private getTowerBuildOnTile(tileStartXCoordinate: number, tileStartYCoordinate: number) {
		return this.towersList.find(platform => platform.positionX == tileStartXCoordinate && platform.positionY == tileStartYCoordinate);
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

	private isEnoughMoneyForPurchase(purchasePrice: number) {
		if (this.isUserStatsProxyNull(this.userStatsProxy))
			throw new Error('User stats proxy is null');

		const currentBalance = this.userStatsProxy.userCoins;
		return currentBalance - purchasePrice >= 0;
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




