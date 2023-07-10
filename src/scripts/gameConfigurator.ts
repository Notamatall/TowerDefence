import { GameConfiguratorOptions, IGameLevel, ILevelMap, IUserStats, MapConfigurationOptions, UserStatsKey, Wave } from '@/types';
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
	private timer!: HTMLDivElement;
	private timerValue!: HTMLDivElement;
	private wavesDelayInterval: NodeJS.Timer | null = null;
	private maps: ILevelMap[] = [];
	private mapsTemplates: IGameLevel[] = [];
	private currentMap!: MapConfigurator;
	private currentLevel: number = 0;
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
	private towerToSellUpgrade: Tower | null = null;
	private isUserLost: boolean = false;

	public async configureGame(options: GameConfiguratorOptions): Promise<void> {
		this.setMaps(options);
		this.initializeTimer();
		await this.loadGatesAnimation();
		await Towers.init();
		await Enemies.init()
		this.registerOnMouseMoveEventHandlerForMap()
		this.registerOnCanvasClick();
		this.registerMouseRightClick();
		this.setTowerMenuElement();
		this.registerSellUpgradeMenuHandlers();
		this.configureMainMenuHandlers();
		this.registerWindowResize();
	}

	public async startGame() {
		await this.animate();
	}

	private async animate() {
		await this.tryChangeMapWave();
		this.checkIsUserLost()
		requestAnimationFrame(this.animate.bind(this));

		if (this.isChangingMap) {
			this.drawMapChangeAnimation();
			return;
		}

		if (this.isUserLost) {
			return
		}

		this.currentMap.drawMap()
		this.drawPlatforms();
		this.drawTowers();
		this.currentMap.tryDrawPickedMenuItem();
		this.tryDisplaySelectedTowerRadius();
		if (this.isNoDelay())
			this.drawEnemies();

	}

	registerWindowResize() {
		window.addEventListener('resize', (e) => {
			this.setCorrectMenuLocation();
		})
	}

	private setCorrectMenuLocation() {
		const mainMenuIcon = document.getElementById('game__main-menu-icon')!;
		const hpMoneyContainer = document.getElementById('game__hp-money-container')!;
		const gameTowersIcon = document.getElementById('game__menu-placeholder')!;

		let offsetScreenLeltSide = window.innerWidth;
		if (this.currentMap.mapTemplate[0].length * 128 < window.innerWidth) {
			offsetScreenLeltSide = this.currentMap.mapTemplate[0].length * 128;
			mainMenuIcon.style.position = 'absolute';
			hpMoneyContainer.style.position = 'absolute';
			gameTowersIcon.style.position = 'absolute';
		}
		else {
			mainMenuIcon.style.position = 'fixed';
			hpMoneyContainer.style.position = 'fixed';
			gameTowersIcon.style.position = 'fixed';
		}

		if (mainMenuIcon) {
			const offsetRightMainMenu = 60;
			mainMenuIcon.style.left = offsetScreenLeltSide - offsetRightMainMenu + 'px';
		}


		if (hpMoneyContainer) {
			const offsetRightHPMoney = 200;
			hpMoneyContainer.style.left = offsetScreenLeltSide - offsetRightHPMoney + 'px';
		}
	}
	private tryDisplaySelectedTowerRadius() {
		const tower = this.towerToSellUpgrade;
		if (tower)
			this.drawRadius('rgba(252, 22, 555, 0.1)',
				tower.positionX + (tower.sprite.pxWidth / 2),
				tower.positionY + (tower.sprite.pxHeight / 2),
				tower.towerAttackRadius);
	}

	private registerOnMouseMoveEventHandlerForMap() {
		const onMouseMove = (e: MouseEvent) => {
			this.setCursorCoordinates(e);
		}
		this.addMouseMoveEventHandler(onMouseMove);
	}

	registerSellUpgradeMenuHandlers() {
		document.addEventListener('wheel', () => this.hideSellUpgradeMenu());
		window.onscroll = () => this.hideSellUpgradeMenu()
	}

	private checkIsUserLost() {
		if (this.userStatsProxy!.userHP <= 0) {
			if (this.isUserLost === false)
				this.showUserLostPopup();
			this.isUserLost = true;
		}

	}

	private showUserLostPopup() {
		this.isUserLost = true;
		const lostWindow = document.getElementById('game__lost-windowID');
		if (lostWindow) {
			lostWindow.style.display = 'flex';

			const gameLostButton = document.getElementById('game__lost-button');
			if (gameLostButton)
				gameLostButton.onclick = async () => {
					lostWindow.style.display = 'none';
					await this.restartGame();
				}
		}
	}

	async restartGame() {
		this.currentLevel = 1;
		await this.initCurrentMap(true);
	}

	private hideSellUpgradeMenu() {
		this.towerSellUpgradeElement.style.display = 'none';
		this.towerToSellUpgrade = null;
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

	private initializeTimer() {
		this.timer = document.getElementById('game__timer') as HTMLDivElement;
		this.timerValue = document.getElementById('game__timer-value') as HTMLDivElement;
		this.timer.onmousemove = (e) => {
			this.setCursorCoordinates(e);
		};
	}

	private hideOverlay() {
		const hpMoneyContainer = (document.getElementById('game__hp-money-container') as HTMLDivElement);
		hpMoneyContainer.style.display = 'none';

		const gameMenuPlaceHolder = (document.getElementById('game__menu-placeholder')! as HTMLDivElement);
		gameMenuPlaceHolder.style.display = 'none';

		const gameMenuIcon = document.getElementById('game__main-menu-icon')!;
		gameMenuIcon.style.display = 'none';

		const mainMenu = document.getElementById('game__main-menu')!;
		mainMenu.style.display = 'none';

		const updateTowerMenu = document.getElementById('game__update-tower-menu')!;
		updateTowerMenu.style.display = 'none';
	}

	private showOverlay() {
		const hpMoneyContainer = (document.getElementById('game__hp-money-container') as HTMLDivElement);
		hpMoneyContainer.style.display = 'flex';

		const gameMenuPlaceHolder = (document.getElementById('game__menu-placeholder')! as HTMLDivElement);
		gameMenuPlaceHolder.style.display = 'flex';

		const gameMenuIcon = document.getElementById('game__main-menu-icon')!;
		gameMenuIcon.style.display = 'flex';
	}

	public async tryChangeMapWave() {
		if (this.enemiesList.length === 0 && this.isUserLost === false) {
			if (isEmpty(this.currentMap?.mapWaves))
				await this.tryInitializeNextMap();
			else {
				const wave = this.currentMap.mapWaves.shift()!;
				this.delayBetweenWaves = wave.afterWaveDelay;
				const delayInterval = function waveDelay(this: GameConfigurator) {
					if (this.delayBetweenWaves === -1) {
						if (this.wavesDelayInterval) {
							clearTimeout(this.wavesDelayInterval);
							this.wavesDelayInterval = null;
							this.hideTimer();
						}
					}
					else {
						if (this.isChangingMap === false) {
							this.showTimer();
							this.timerValue.innerText = this.delayBetweenWaves.toString();
							this.delayBetweenWaves--;
						}
					}
				}

				this.wavesDelayInterval = setInterval(delayInterval.bind(this), 1000);
				this.initializeWave(wave);
			}
		}
	}

	private showTimer() {
		this.timer.style.display = 'flex';
	}

	private hideTimer() {
		this.timer.style.display = 'none';
	}

	private async tryInitializeNextMap() {
		this.currentLevel++;
		const newMap = this.maps.find(map => map.level === this.currentLevel);
		if (_.isEmpty(newMap))
			this.openVictoryPage();
		else
			await this.initCurrentMap();
	}

	private openVictoryPage() {
		document.getElementById('game__victory-windowID')!.style.display = 'flex';
		const gameVictoryButton = document.getElementById('game__victory-button');
		if (gameVictoryButton)
			gameVictoryButton.onclick = () => window.open('https://github.com/Notamatall/TowerDefence', '_blank');
	}

	private async initCurrentMap(isRestart: boolean = false) {
		const mapToInit = this.maps.find(map => map.level === this.currentLevel);
		if (_.isEmpty(mapToInit))
			throw new Error('Current map does not exist');
		this.scrollToDefaultPosition();
		this.clearTimerInterval();
		this.setCurrentMap(mapToInit.map, isRestart);
		await this.currentMap.configureMap();
		this.initializeUserStatsProxy(this.currentMap);
		this.isChangingMap = true;
		this.hideOverlay();
		this.clearTowersList();
		this.clearEnemiesList();
		this.towerToSellUpgrade = null;
		this.setCorrectMenuLocation();
		setTimeout(() => {
			this.isChangingMap = false;
			this.showOverlay();
			this.isUserLost = false;
		}, 2000);
	}

	private scrollToDefaultPosition() {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}
	private clearTimerInterval() {
		if (this.wavesDelayInterval)
			clearTimeout(this.wavesDelayInterval);
	}

	private setCurrentMap(mapTemplateToSet: MapConfigurator, isRestart) {
		if (isRestart) {
			this.currentMap = new MapConfigurator(this.canvasAccessor, _.cloneDeep(this.mapsTemplates[this.currentLevel - 1].mapOptions))
		} else
			this.currentMap = mapTemplateToSet;

	}
	private clearTowersList() {
		this.towersList = [];
		this.platformList = [];
	}

	private clearEnemiesList() {
		this.enemiesList = [];
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

			const mainMenuIcon = document.getElementById('game__main-menu-icon')!;
			const mainMenu = document.getElementById('game__main-menu')!;
			const mainMenuCloseButton = document.getElementById('game__main-menu-close-button')!;
			const mainMenuPlayButton = document.getElementById('game__main-menu-play-button')!;
			const mainMenuBackgroundLow = document.getElementById('game__main-menu-background-sound-low')!;
			const mainMenuBackgroundHigh = document.getElementById('game__main-menu-background-sound-high')!;
			const mainMenuTowerHigh = document.getElementById('game__main-menu-tower-sound-high')!;
			const mainMenuTowerLow = document.getElementById('game__main-menu-tower-sound-low')!;
			const backToMainMenu = document.getElementById('game__main-menu-back')!;
			const restartButton = document.getElementById('game__main-menu-restart')!;

			document.onclick = () => {
				if (mainMenu.style.display == 'flex')
					mainMenu.style.display = 'none';
			}

			mainMenu.onclick = (e) => {
				e.stopPropagation();
			}

			mainMenuIcon.onclick = (e) => {
				if (mainMenu.style.display == 'flex')
					mainMenu.style.display = 'none';
				else {
					mainMenu.style.display = 'flex';
					this.hideSellUpgradeMenu();
					e.stopPropagation();
				}

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
				if (this.canvasAccessor.globalTowersVolume - 0.1 >= 0)
					this.canvasAccessor.globalTowersVolume = this.canvasAccessor.globalTowersVolume - 0.1;
				this.towersList.forEach(tower => tower.setAttackVolume())
			}

			mainMenuTowerHigh.onclick = () => {
				if (this.canvasAccessor.globalTowersVolume + 0.1 < 1)
					this.canvasAccessor.globalTowersVolume = this.canvasAccessor.globalTowersVolume + 0.1;
				this.towersList.forEach(tower => tower.setAttackVolume());
			}

			backToMainMenu.onclick = () => {
				window.location.href = 'index.html';
			}

			restartButton.onclick = async () => {
				await this.initCurrentMap(true);
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

	private registerMouseRightClick() {
		window.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			this.currentMap.pickedMenuItem = null;
		})
	}


	isNoDelay() {
		return this.delayBetweenWaves < 0;
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
		this.drawBlackBackground();
		let leftMargin = (window.innerWidth - this.canvas.width) / 2;
		leftMargin = leftMargin > 0 ? leftMargin : 0;
		this.changeAnimationTimer++;
		this.context.drawImage(this.gateLoadAnimation,
			160 * Math.floor(this.changeAnimationTimer / 10),
			0,
			160,
			160,
			window.innerWidth / 2 - (leftMargin + 80),
			window.innerHeight / 2 - 80,
			160,
			160);
		if (this.changeAnimationTimer == 120)
			this.changeAnimationTimer = 0;
	}


	private drawBlackBackground() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}

	private drawTowers() {
		for (const tower of this.towersList)
			tower.update();
	}

	private drawEnemies() {
		for (const enemy of this.enemiesList)
			enemy.update();
	}

	private setMaps(gameOptions: GameConfiguratorOptions) {
		this.mapsTemplates = _.cloneDeep(gameOptions.levels);
		gameOptions.levels.forEach(levelOptions => {
			this.maps.push({
				level: levelOptions.level,
				map: new MapConfigurator(this.canvasAccessor, levelOptions.mapOptions)
			})
		})
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
				this.towerToSellUpgrade = towerToSellUpgrade;

				if (_.isNull(sellButton) || _.isNull(upgradeButton))
					throw new Error("Buttons were not found");

				const sellTower = (e: MouseEvent) => {
					const sellingPercent = 0.75;
					this.userStatsProxy!.userCoins = this.userStatsProxy!.userCoins + towerToSellUpgrade.towerTotalPrice * sellingPercent;
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
						setCorrectUpgradeIcon(upgradeButton, towerToSellUpgrade);
					}
				}

				setCorrectUpgradeIcon(upgradeButton, towerToSellUpgrade);
				upgradeButton.addEventListener("click", newUpgradeTowerEvent, false);
				sellButton.addEventListener("click", sellTower, false);
				this.upgradeTowerEvent = newUpgradeTowerEvent;
				this.sellTowerEvent = sellTower;

				function setUpgradeSellMenuAroundTowerSelected(scrollLeft: number, scrollTop: number, selectedTower: Tower, menu: HTMLDivElement) {
					menu.style.left = (selectedTower.positionX - scrollLeft) - 70 + 'px';
					menu.style.top = (selectedTower.positionY - scrollTop) - 20 + 'px';
					menu.style.display = 'flex'
				}

				function setCorrectUpgradeIcon(upgradeButton: HTMLButtonElement, towerToSellUpgrade: Tower) {
					const upgradeIcon = (upgradeButton.children[0] as HTMLLIElement);
					const upgradePriceContainer = upgradeButton.children.namedItem('upgradeBtn-price-container');
					if (upgradePriceContainer == null)
						throw new Error('upgradeSellMenu price container does not exist');
					if (towerToSellUpgrade.towerUpgradeType === undefined) {
						(upgradePriceContainer as HTMLDivElement).style.display = 'none';
						upgradeIcon.classList.value = 'fa-sharp fa-solid fa-ban';
					}
					else {
						(upgradePriceContainer as HTMLDivElement).style.display = 'block';
						const priceHolder = upgradePriceContainer.children.namedItem('upgradeBtn-price');
						if (priceHolder)
							priceHolder.textContent = Towers.getTowerPriceByType(towerToSellUpgrade.towerUpgradeType).toString();
						upgradeIcon.classList.value = 'fa-solid fa-arrow-up';
					}
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
		this.towerToSellUpgrade = null;
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

	private getAttackTargetInRadius(searchRadius: Path2D): Enemy[] | undefined {
		const enemiesInRadius: Enemy[] = []
		for (const enemy of this.enemiesList) {
			if (this.context.isPointInPath(
				searchRadius,
				enemy.imageCenter.centerX,
				enemy.imageCenter.centerY) && enemy.isTargetable) {
				enemiesInRadius.push(enemy);
			}
		}
		if (enemiesInRadius.length > 0)
			return enemiesInRadius;
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




