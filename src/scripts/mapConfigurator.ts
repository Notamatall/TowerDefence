import Utilities from "@/utilities/utilities";
import { CanvasBuilder } from "./canvasBuilder";
import Configurator from './configurator';
import { Coordinate, IUserStats, MapConfigurationOptions, TurnPosition } from "@/types";
import { IMapTemplateCell } from "./mapTemplates/mapTemplates";
import Towers from "./towers";
import { TowerType, ITowerInitializer } from "@/types/towersTypes";
export default class MapConfigurator extends Configurator {
	constructor(canvasContext: CanvasBuilder, options: MapConfigurationOptions) {
		super(canvasContext);
		this.mapName = options.mapName;
		this.defaultTileHeight = options.defaultTileHeight;
		this.defaultTileWidth = options.defaultTileWidth;
		this.mapImageHeight = options.mapImageHeight;
		this.mapImageWidth = options.mapImageWidth;
		this.mapImageSrc = options.mapImageSrc;
		this.mapTemplate = options.mapTemplate;
		this.environmentY = options.environmentY;
		this.environmentX = options.environmentX;
		this.menuOptions = options.menuOptions;
		this.mapDefaultUserStats = options.defaultUserStats;
		this.spawnPoint = options.spawnPoint;
		this.defineTurnPlaces();
	}

	//properties
	private menuOptions: TowerType[];
	private mapAvailableTowers: ITowerInitializer[] = [];
	private mapName: string;
	private defaultTileWidth: number;
	private defaultTileHeight: number;
	private mapImageWidth: number;
	private mapImageHeight: number;
	private mapImageSrc: string;
	private mapTemplate: IMapTemplateCell[][];
	private mapTurnPlaces: TurnPosition[] = []

	private innerMapImage: HTMLImageElement | null = null
	private environmentX: number;
	private environmentY: number;

	private currentHpElement: HTMLSpanElement | null = null;
	private currentCoinsElement: HTMLSpanElement | null = null;
	private mapDefaultUserStats: IUserStats;
	private spawnPoint: Coordinate;

	public pickedMenuItem: ITowerInitializer | null = null;

	get enemiesSpawnPoint() {
		return this.spawnPoint;
	}
	get turnPlaces() {
		return this.mapTurnPlaces;
	}

	get isMenuItemPicked(): boolean {
		return this.pickedMenuItem !== null;
	}

	get defaultUserStats() {
		return this.mapDefaultUserStats;
	}

	get hpElement() {
		return this.currentHpElement;
	}

	get coinsElement() {
		return this.currentCoinsElement;
	}

	get tileWidth() {
		return this.defaultTileWidth;
	}

	get tileHeight() {
		return this.defaultTileHeight;
	}

	get mapImage(): HTMLImageElement {
		if (this.innerMapImage === null)
			throw new Error(`Map image for ${this.mapName} was not loaded correctly`);
		return this.innerMapImage;
	}

	public async configureMap(): Promise<void> {
		this.setMapTowers();
		await this.loadMapImage();
		await this.createMenu();
		this.registerOnMouseMoveEventHandlerForMap();
		this.configureHpMoneyContainer();
	}

	public canBuildOnTile(indexX: number, indexY: number): boolean {
		return this.mapTemplate[indexY][indexX].index === 0;
	}

	public drawMap() {
		for (let i = 0; i < this.mapTemplate.length; i++)
			for (let j = 0; j < this.mapTemplate[i].length; j++) {
				let cell = this.mapTemplate[i][j];
				Utilities.drawRotatedImage(this.context, this.mapImage,
					this.defaultTileWidth * j + this.defaultTileWidth / 2,
					i * this.defaultTileHeight + this.defaultTileHeight / 2,
					cell.index * this.environmentX,
					this.environmentY,
					this.defaultTileWidth,
					this.defaultTileHeight,
					-(this.defaultTileWidth / 2),
					-(this.defaultTileHeight / 2),
					this.defaultTileWidth,
					this.defaultTileHeight,
					cell.angle);
			}
	}

	public tryDrawPickedMenuItem() {

		if (this.pickedMenuItem) {

			const centeredX = this.cursorX - (this.defaultTileWidth / 2);
			const centeredY = this.cursorY - (this.defaultTileHeight / 2);

			this.context.globalAlpha = 0.7;
			this.context.drawImage(this.pickedMenuItem.sprite.image, 0, 0, 128, 128, centeredX, centeredY, 128, 128);
			this.context.globalAlpha = 1;

			const radius = Towers.getTowerRadiusByType(this.pickedMenuItem.type);
			if (radius) {
				this.drawRadius('rgba(252, 22, 555, 0.1)',
					centeredX + (this.defaultTileWidth / 2),
					centeredY + (this.defaultTileHeight / 2),
					radius);
			}
		}
	}


	public getClickedMapIndexY(mousePosY: number): number {
		const canvasRect = this.canvas.getBoundingClientRect();
		const clickIndexY = Math.round((mousePosY - canvasRect.top - this.tileHeight / 2) / this.tileHeight);
		return clickIndexY;
	}

	public getClickedMapIndexX(mousePosX: number): number {
		const canvasRect = this.canvas.getBoundingClientRect();
		const clickIndexX = Math.round((mousePosX - canvasRect.left - this.tileWidth / 2) / this.tileWidth);
		return clickIndexX;
	}

	private async loadMapImage(): Promise<void> {
		const mapImage = Utilities.createImage(this.mapImageSrc, this.mapImageWidth, this.mapImageHeight);
		const mapTemplatePromise = Utilities.loadImages({ mapImage });
		const imageAsset = await Promise.all(mapTemplatePromise);
		this.innerMapImage = imageAsset[0].img;
	}

	private setMapTowers() {
		this.menuOptions.forEach(option => this.mapAvailableTowers.push(Towers.list[option]));
	}

	private async createMenu() {
		Utilities.tryCatchWrapper(() => {

			const menuPlaceholder = getMenuPlaceholder.call(this);
			if (menuPlaceholder === null)
				throw new Error('Menu placeholder was not found');

			const shopIcon = getShopIcon();
			const gameMenu = getGameMenu.call(this);
			createMenuItems.call(this);

			function createMenuItems(this: MapConfigurator) {
				for (let index = 0; index < this.mapAvailableTowers.length; index++) {
					const tower = this.mapAvailableTowers[index];
					const wrapper = getMenuItemWrapper();
					const title = getMenuItemTitle(tower.name);
					const img = getMenuItemImg(tower.sprite.imageSrc);
					const price = getMenuItemPrice(tower.price);
					addChildsToWrapper(wrapper, title, img, price);
					wrapper.onclick = (e: MouseEvent) => this.onMenuItemClickHandler(e, this.mapAvailableTowers[index])
					gameMenu.appendChild(wrapper);
				}
			}
			function getMenuPlaceholder(this: MapConfigurator) {
				const menuPlaceholder = document.createElement('div');
				menuPlaceholder.classList.add('game__menu-placeholder');
				menuPlaceholder.onmousemove = (e) => {
					this.setCursorCoordinates(e);
				};
				return menuPlaceholder;
			}

			function getGameMenu(this: MapConfigurator) {
				const gameMenu = document.createElement('div');
				gameMenu.classList.add('game__menu');
				return gameMenu;
			}

			function getShopIcon(): HTMLElement {

				const shopIcon = document.createElement('i');
				//shopIcon.src = '../assets/icons/shop.png'
				shopIcon.classList.add(...['game__menu-shop-icon', 'fa-solid', 'fa-chess-rook']);
				shopIcon.onclick = () => {
					if (gameMenu.style.display === 'flex')
						gameMenu.style.display = 'none';
					else
						gameMenu.style.display = 'flex';
				}
				return shopIcon
			}

			function getMenuItemWrapper(): HTMLDivElement {
				const gameMenuItemWrapper = document.createElement('div');
				gameMenuItemWrapper.classList.add('game__menu-item-wrapper');
				return gameMenuItemWrapper;
			}

			function getMenuItemTitle(title: string): HTMLDivElement {
				const gameMenuItemTitle = document.createElement('div');
				gameMenuItemTitle.classList.add('game__menu-item-title');
				gameMenuItemTitle.innerText = title;
				return gameMenuItemTitle;
			}

			function getMenuItemImg(img: string): HTMLDivElement {
				const gameMenuItemImg = document.createElement('div');
				gameMenuItemImg.classList.add('game__menu-item-img');
				gameMenuItemImg.style.background = `url(${img})`;
				return gameMenuItemImg;
			}

			function getMenuItemPrice(price: number): HTMLDivElement {
				const gameMenuItemPrice = document.createElement('div');
				gameMenuItemPrice.classList.add('game__menu-item-price');
				const coinIconElement = document.createElement('i');
				const priceHolderElement = document.createElement('span');
				coinIconElement.classList.add(...['fa-solid', 'fa-coins']);
				priceHolderElement.innerText = price.toString();

				gameMenuItemPrice.appendChild(priceHolderElement)
				gameMenuItemPrice.appendChild(coinIconElement)

				return gameMenuItemPrice;
			}

			function addChildsToWrapper(wrapper: HTMLDivElement, ...args: HTMLDivElement[]) {
				for (let index = 0; index < args.length; index++) {
					const element = args[index];
					wrapper.appendChild(element);
				}
			}

			menuPlaceholder.appendChild(shopIcon);
			menuPlaceholder.appendChild(gameMenu);
			this.canvasContainer.appendChild(menuPlaceholder);
		});
	}

	private configureHpMoneyContainer() {
		const hpMoneyContainer = creatHpMoneyBarContainer();
		const moneyContainer = createMoneyContainer.call(this);
		const hpContainer = createHpContainer.call(this);

		function creatHpMoneyBarContainer(): HTMLDivElement {
			const hpMoneyContainer = document.createElement('div');
			hpMoneyContainer.classList.add('game__hp-money-container');
			return hpMoneyContainer;
		}

		function createMoneyContainer(this: MapConfigurator) {
			const moneyContainer = document.createElement('div');
			moneyContainer.classList.add('game__money-container');

			const coinIconElement = document.createElement('i');
			coinIconElement.classList.add(...['fa-solid', 'fa-coins', 'game__money-container-coin']);
			moneyContainer.appendChild(coinIconElement);

			const coinsElement = document.createElement('span');
			this.currentCoinsElement = coinsElement;
			moneyContainer.appendChild(coinsElement);

			return moneyContainer;
		}

		function createHpContainer(this: MapConfigurator) {
			const moneyContainer = document.createElement('div');
			moneyContainer.classList.add('game__hp-container');

			const heartIconElement = document.createElement('i');
			heartIconElement.classList.add(...['fa-solid', 'fa-heart', 'game__hp-container-heart']);
			moneyContainer.appendChild(heartIconElement);

			const hpElement = document.createElement('span');
			this.currentHpElement = hpElement;
			moneyContainer.appendChild(hpElement);
			return moneyContainer;
		}

		hpMoneyContainer.appendChild(moneyContainer);
		hpMoneyContainer.appendChild(hpContainer);
		this.canvasContainer.appendChild(hpMoneyContainer);
	}

	private onMenuItemClickHandler(event: MouseEvent, menuItem: ITowerInitializer) {
		event.stopImmediatePropagation();
		this.pickedMenuItem = menuItem;
	}

	private registerOnMouseMoveEventHandlerForMap() {
		const onMouseMove = (e: MouseEvent) => {
			this.setCursorCoordinates(e);
		}

		this.addMouseMoveEventHandler(onMouseMove);
	}

	private drawRadius(color: string, xDraw: number, yDraw: number, radius: number) {

		this.context.strokeStyle = 'green';
		this.context.fillStyle = color;
		this.context.beginPath();

		this.context.roundRect(xDraw - radius, yDraw - radius, radius * 2, radius * 2, 360);
		this.context.stroke();
		this.context.fill();
	}

	private defineTurnPlaces() {
		for (let mapRow = 0; mapRow < this.mapTemplate.length; mapRow++)
			for (let mapCol = 0; mapCol < this.mapTemplate[mapRow].length; mapCol++)
				if (this.mapTemplate[mapRow][mapCol].dirX || this.mapTemplate[mapRow][mapCol].dirY) {
					const cell = this.mapTemplate[mapRow][mapCol];
					const dirY = cell.dirY;
					const dirX = cell.dirX;
					const order = cell.order;
					this.mapTurnPlaces.push({
						xTurnStart: this.defaultTileWidth * mapCol + this.defaultTileWidth / 2,
						yTurnStart: this.defaultTileHeight * mapRow + this.defaultTileHeight / 2,
						dirX: dirX ? dirX : 0,
						dirY: dirY ? dirY : 0,
						order: order!
					});
				}

		if (this.mapTurnPlaces.length > 0)
			this.mapTurnPlaces.sort((a, b) => a.order - b.order);
	}
}
