import { GameConfigurationOptions, ILevelMap, IUserStats, UserStatsKey, Wave } from '@/types';
import MapConfigurator from './mapConfigurator';
import { CanvasBuilder } from './canvasBuilder';
import Configurator from './configurator';
import { Tower, ITower, ITowerInitializer } from '@/types/towersTypes';
import Towers from './towers';
import Enemies from './enemies';
import Enemy, { IEnemy, IEnemyInitializer } from '@/types/enemyTypes';
import Utilities from '@/utilities/utilities';
import audioController from './audioController';
import { isEmpty } from 'lodash';
import { ImagePath } from '@/types/imagePath';


export default class GameConfigurator extends Configurator {
	constructor(canvasContext: CanvasBuilder) {
		super(canvasContext);
	}
	private maps: ILevelMap[] = [];
	private currentMap!: MapConfigurator;
	private currentLevel: number = 1;
	private delayBetweenWaves: number = 0;
	private userStatsProxy: IUserStats | null = null;
	private platformList: Tower[] = [];
	private towersList: Tower[] = [];
	private isChangingMap: boolean = false;
	private enemiesList: Enemy[] = [];
	private towerSellUpgradeElement!: HTMLDivElement;
	private gateLoadAnimation!: HTMLImageElement;
	private sellTowerEvent: ((e: MouseEvent) => void) | null = null;
	private upgradeTowerEvent: ((e: MouseEvent) => void) | null = null;

	public async configureGame(options: GameConfigurationOptions): Promise<void> {
		this.setMaps(options.maps);
		await this.loadGatesAnimation();
		await Towers.init();
		await Enemies.init()
		this.registerOnMouseMoveEventHandlerForMap()
		this.registerOnCanvasClick();
		this.registerEscape();
		this.setTowerMenuElement();
		this.registerSellUpgradeMenuHandlers();
		this.configureMainMenuHandlers();
	}
	public async startGame() {
		await this.animate();
	}

	private async animate() {
		await this.tryChangeMapWave();
		requestAnimationFrame(this.animate.bind(this));
		if (this.isChangingMap) {
			console.log('here')
			this.drawMapChangeAnimation();
			return;
		}
		this.currentMap.drawMap()
		if (this.isNoDelay()) {
			this.drawPlatforms();
			this.drawTowers();
			this.drawEnemies();
			this.currentMap.tryDrawPickedMenuItem();
		} else {
			console.log(this.delayBetweenWaves)
		}
	}

	private registerOnMouseMoveEventHandlerForMap() {
		const onMouseMove = (e: MouseEvent) => {
			this.setCursorCoordinates(e);
		}
		this.addMouseMoveEventHandler(onMouseMove);
	}

	registerSellUpgradeMenuHandlers() {
		document.addEventListener('wheel', () => {
			this.towerSellUpgradeElement.style.display = 'none';
		});

		window.onscroll = () => {
			this.towerSellUpgradeElement.style.display = 'none';
		}
	}

	private async loadGatesAnimation() {
		const gatesImage = Utilities.createImage(ImagePath.gates, 160, 160);
		const gatesAnimationPromise = Utilities.loadImages({ gatesImage });
		const imageAsset = await Promise.all(gatesAnimationPromise);
		this.gateLoadAnimation = imageAsset[0].img;
	}

	setTowerMenuElement() {
		const towerSellUpgradeElement = document.getElementById('game__update-tower-menu');
		if (towerSellUpgradeElement === null)
			throw new Error('Tower upgrade menu does not exist');
		this.towerSellUpgradeElement = towerSellUpgradeElement as HTMLDivElement;
	}



	private hideOverlay() {
		const hpContainer = (document.getElementsByClassName('game__hp-money-container')[0] as HTMLDivElement);
		hpContainer.style.display = 'none';

		const gameMenuPlaceHolder = (document.getElementsByClassName('game__menu-placeholder')[0] as HTMLDivElement);
		gameMenuPlaceHolder.style.display = 'none';

		const gameMenuIcon = document.getElementById('game__main-menu-icon')!;
		gameMenuIcon.style.display = 'none';
	}

	private showOverlay() {
		const hpContainer = (document.getElementsByClassName('game__hp-money-container')[0] as HTMLDivElement);
		hpContainer.style.display = 'flex';

		const gameMenuPlaceHolder = (document.getElementsByClassName('game__menu-placeholder')[0] as HTMLDivElement);
		gameMenuPlaceHolder.style.display = 'flex';

		const gameMenuIcon = document.getElementById('game__main-menu-icon')!;
		gameMenuIcon.style.display = 'flex';
	}

	public async tryChangeMapWave() {
		if (this.enemiesList.length === 0) {
			if (isEmpty(this.currentMap?.mapWaves))
				await this.tryInitializeNextMap();
			else {
				const wave = this.currentMap.mapWaves.shift()!;
				this.delayBetweenWaves = wave.afterWaveDelay;
				const delayInterval = function waveDelay(this: GameConfigurator) {
					if (this.delayBetweenWaves === 0) {
						if (delayIntervalId) {
							clearTimeout(delayIntervalId);
							delayIntervalId = null;
						}
					}
					else
						this.delayBetweenWaves--;
				}
				let delayIntervalId: NodeJS.Timer | null = setInterval(delayInterval.bind(this), 1000)
				this.initializeWave(wave);
			}
		}
	}

	private async tryInitializeNextMap() {
		const newMap = this.maps.find(map => map.level === this.currentLevel);
		if (_.isEmpty(newMap))
			console.log('you won');
		else {
			this.currentMap = newMap.map;
			await this.currentMap.configureMap();
			this.initializeUserStatsProxy(this.currentMap);
			this.isChangingMap = true;
			this.hideOverlay();
			setTimeout(() => {
				this.isChangingMap = false;
				this.showOverlay();
			}, 3000);
		}
		this.currentLevel++;
	}

	private clearTowersList() {
		this.towersList = [];
	}

	private initializeWave(wave: Wave) {
		if (_.isEmpty(wave))
			return;
		const spawnPoin = this.currentMap.enemiesSpawnPoint;

		for (const waveEnemy of wave.waveEnemies)

			for (let index = 0; index < waveEnemy.amount; index++) {
				const enemy = this.createEnemy(
					Enemies.list[waveEnemy.enemyType],
					spawnPoin.x + waveEnemy.spawnBetweenUnitX * index + waveEnemy.spawnDistanceX,
					spawnPoin.y + waveEnemy.spawnBetweenUnitY * index + waveEnemy.spawnDistanceY,
				)
				this.enemiesList.push(enemy);
			}

	}
	private configureMainMenuHandlers() {
		Utilities.tryCatchWrapper(() => {
			const mainMenuIcon = document.getElementById('game__main-menu-icon');
			const mainMenu = document.getElementById('game__main-menu');
			const mainMenuCloseButton = document.getElementById('game__main-menu-close-button');
			const mainMenuPlayButton = document.getElementById('game__main-menu-play-button');
			const mainMenuBackgroundLow = document.getElementById('game__main-menu-background-sound-low');
			const mainMenuBackgroundHigh = document.getElementById('game__main-menu-background-sound-high');
			const mainMenuTowerHigh = document.getElementById('game__main-menu-tower-sound-high');
			const mainMenuTowerLow = document.getElementById('game__main-menu-tower-sound-low');

			if (mainMenuIcon === null)
				throw new Error('main menu icon does not exist');

			if (mainMenu === null)
				throw new Error('main menu does not exist');

			if (mainMenuCloseButton === null)
				throw new Error('mainMenuCloseButton does not exist');

			if (mainMenuBackgroundLow === null)
				throw new Error('mainMenuPlayButton does not exist');

			if (mainMenuBackgroundHigh === null)
				throw new Error('mainMenuPlayButton does not exist');

			if (mainMenuPlayButton === null)
				throw new Error('mainMenuPlayButton does not exist');

			if (mainMenuTowerLow === null)
				throw new Error('mainMenuTowerLow does not exist');

			if (mainMenuTowerHigh === null)
				throw new Error('mainMenuTowerHigh does not exist');

			mainMenuIcon.onclick = () => {
				mainMenu.style.display = 'flex';
			}

			mainMenuCloseButton.onclick = () => {
				mainMenu.style.display = 'none';
			}

			mainMenuPlayButton.onclick = () => {

				if (audioController.currentPlayed)
					audioController.currentPlayed.paused ? audioController.currentPlayed.play() : audioController.currentPlayed.pause();
				else
					audioController.loopBackground();
			}

			mainMenuBackgroundLow.onclick = () => {
				audioController.volumeLower()
			}

			mainMenuBackgroundHigh.onclick = () => {
				audioController.volumeHigher()
			}

			mainMenuTowerLow.onclick = () => {
				this.towersList.forEach(tower => tower.attackVolumeLower())
			}

			mainMenuTowerHigh.onclick = () => {
				this.towersList.forEach(tower => tower.attackVolumeHigher());
			}
		})

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
			deleteEnemy: (enemyId) => this.releseEnemyAfterPass(enemyId),
			turnPositions: Array.from(this.currentMap.turnPlaces),
			positionX: positionX,
			positionY: positionY,
			moveDirX: 1,
			moveDirY: 0
		}
		return new Enemy(enemy, this.canvasAccessor);
	}

	private initializeUserStatsProxy(currentMap: MapConfigurator) {
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


	isNoDelay() {
		return this.delayBetweenWaves === 0;
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
	private changeAnimationTimer = 0;
	private drawMapChangeAnimation() {
		this.changeAnimationTimer++;
		this.context.drawImage(this.gateLoadAnimation,
			160 * Math.floor(this.changeAnimationTimer / 10),
			0,
			160,
			160,
			window.innerWidth / 2 - 80,
			window.innerHeight / 2 - 80,
			160,
			160);
		if (this.changeAnimationTimer == 120)
			this.changeAnimationTimer = 0;
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
				setUpgradeSellMenuAroundTowerSelected(this.canvasContainer.scrollLeft, this.canvasContainer.scrollTop, towerToSellUpgrade, this.towerSellUpgradeElement)
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
				function setUpgradeSellMenuAroundTowerSelected(scrollLeft: number, scrollTop: number, selectedTower: Tower, menu: HTMLDivElement) {

					menu.style.left = (selectedTower.positionX - scrollLeft) + 'px';
					menu.style.top = (selectedTower.positionY - scrollTop) - 20 + 'px';
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
			rewardForKill: (amount) => this.increaseUserCoins(amount),
			positionX: positionX,
			positionY: positionY,
			towerId: lastTowerId + nextId
		}

		return new Tower(towerInitializer, this.canvasAccessor);
	}

	deleteEnemy(enemyId: number) {
		this.enemiesList.splice(this.enemiesList.findIndex(enemy => enemy.enemyId === enemyId), 1);
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

		for (const tower of this.towersList) {
			if (tower.attackTarget == target) {
				tower.currentFrameChangeValue = 0;
				tower.currentSpriteFrame = 0;
				tower.attackTarget = null;
				tower.animate()
			}
		}
	}

	private increaseUserCoins(amount: number) {
		if (_.isNull(this.userStatsProxy))
			throw new Error('User stats cannot be null');

		this.userStatsProxy.userCoins = this.userStatsProxy.userCoins + amount;
	}

	private getAttackTargetInRadius(searchRadius: Path2D): Enemy | undefined {
		for (const enemy of this.enemiesList) {
			if (this.context.isPointInPath(
				searchRadius,
				enemy.imageCenter.centerX,
				enemy.imageCenter.centerY) && enemy.isTargetable) {
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




