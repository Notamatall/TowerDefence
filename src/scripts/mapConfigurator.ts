import Utilities from "@/utilities/utilities";
import { CanvasBuilder } from "./canvasBuilder";
import Configurator from './configurator';
import { IImageAsset, IMenuItem, MapConfigurationOptions } from "@/types";
import { IMapTemplateCell } from "./mapTemplates/mapTemplates";
import { IMenuOption } from "@/types/index"
import { Dictionary } from "lodash";
import { Towers } from "./towers";
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
		this.offsetHeight = screen.height - document.body.scrollHeight;
		this.menuOptions = options.menuOptions;

		// defineTurnPlaces();
	}
	//constants
	private readonly toRadiance = Math.PI / 180;

	//properties
	private menuOptions: IMenuOption[];
	private mapName: string;
	private defaultTileWidth: number;
	private defaultTileHeight: number;
	private mapImageWidth: number;
	private mapImageHeight: number;
	private mapImageSrc: string;
	private mapTemplate: IMapTemplateCell[][];

	private innerMapImage: HTMLImageElement | null = null
	private environmentX: number;
	private environmentY: number;
	private offsetHeight: number;
	private isMenuItemPicked: boolean = false;
	private pickedMenuItem: IMenuItem | null = null;
	private menuItems: IMenuItem[] = [];

	get mapImage(): HTMLImageElement {
		if (this.innerMapImage === null)
			throw new Error(`Map image for ${this.mapName} was not loaded correctly`);
		return this.innerMapImage;
	}

	async configureMap(): Promise<void> {
		await this.loadMapImage();
		await this.createMenu();
		this.registerOnMouseMoveHandlerForMenuItems();
	}

	private async loadMapImage(): Promise<void> {
		const mapImage = Utilities.createImage(this.mapImageWidth, this.mapImageHeight, this.mapImageSrc);
		const mapTemplatePromise = Utilities.loadImages({ mapImage });
		const imageAsset = await Promise.all(mapTemplatePromise);
		this.innerMapImage = imageAsset[0].img;
	}

	private async loadMenuItemsImages(): Promise<void> {
		let keyValueList: Dictionary<HTMLImageElement> = {};
		for (let index = 0; index < this.menuOptions.length; index++) {
			const option = this.menuOptions[index];
			const menuItemImage = Utilities.createImage(this.defaultTileWidth, this.defaultTileHeight, option.itemImageSrc);
			keyValueList[option.name] = menuItemImage;
		}
		const promises = Utilities.loadImages(keyValueList);
		const imageAssets = await Promise.all(promises);

		for (let index = 0; index < imageAssets.length; index++) {
			const option = this.menuOptions[index];
			this.menuItems.push({
				towerId: option.towerId,
				itemImage: imageAssets[index].img
			})
		}

	}

	drawMap() {
		for (let i = 0; i < this.mapTemplate.length; i++)
			for (let j = 0; j < this.mapTemplate[i].length; j++) {
				let cell = this.mapTemplate[i][j];
				this.drawRotatedImage(this.mapImage,
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

	drawRotatedImage(image: HTMLImageElement,
		xDraw: number,
		yDraw: number,
		pX: number,
		pY: number,
		getByX: number,
		getByY: number,
		offsetX: number,
		offsetY: number,
		totalX: number,
		totalY: number,
		angle?: number) {

		this.context.save();
		this.context.translate(xDraw, yDraw);
		if (angle)
			this.context.rotate(angle * this.toRadiance);
		this.context.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
		this.context.restore();
	}

	async createMenu() {
		await this.loadMenuItemsImages();
		Utilities.tryCatchWrapper(() => {

			const menuPlaceholder = document.createElement('i');
			menuPlaceholder.classList.add(...['fa-solid', 'fa-shop', 'game__menu-placeholder']);

			const gameMenu = document.createElement('div');

			gameMenu.id = 'game__menu';

			menuPlaceholder.onclick = () => {
				if (gameMenu.style.display === 'flex')
					gameMenu.style.display = 'none';
				else
					gameMenu.style.display = 'flex';
			}

			gameMenu.onmouseenter = () => {
				this.isMenuItemPicked = false;
				this.pickedMenuItem = null
			};

			gameMenu.onmousemove = (e) => {
				this.setCursorCoordinates(e);
			};

			for (let index = 0; index < this.menuOptions.length; index++) {
				const option = this.menuOptions[index];
				const wrapper = getMenuItemWrapper();
				const title = getMenuItemTitle(option.name);
				const img = getMenuItemImg(option.itemImageSrc);
				const price = getMenuItemPrice(option.price);
				addChildsToWrapper(wrapper, title, img, price);

				wrapper.onclick = (e: MouseEvent) => this.onMenuItemClickHandler(e, this.menuItems[index])
				gameMenu.appendChild(wrapper);
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
				const priceHolderElemnt = document.createElement('span');
				coinIconElement.classList.add(...['fa-solid', 'fa-coins']);
				priceHolderElemnt.innerText = price.toString();

				gameMenuItemPrice.appendChild(priceHolderElemnt)
				gameMenuItemPrice.appendChild(coinIconElement)

				return gameMenuItemPrice;
			}

			function addChildsToWrapper(wrapper: HTMLDivElement, ...args: HTMLDivElement[]) {
				for (let index = 0; index < args.length; index++) {
					const element = args[index];
					wrapper.appendChild(element);
				}
			}

			this.canvasContainer.appendChild(menuPlaceholder);
			menuPlaceholder.appendChild(gameMenu);
		});
	}

	private onMenuItemClickHandler(event: MouseEvent, menuItem: IMenuItem) {
		event.stopImmediatePropagation();
		// if (this.isMenuItemPicked)
		// 	return;
		this.pickedMenuItem = menuItem;
		this.isMenuItemPicked = true;
	}


	protected registerOnMouseMoveHandlerForMenuItems() {
		const onMouseMove = (e: MouseEvent) => {
			if (!this.isMenuItemPicked)
				this.pickedMenuItem = null;
			this.setCursorCoordinates(e);
		}

		this.registerMouseMoveEventHandler(onMouseMove);
	}

	tryDrawPicked() {

		if (this.pickedMenuItem) {

			const centeredX = this.cursorX - (this.defaultTileWidth / 2);
			const centeredY = this.cursorY - (this.defaultTileHeight / 2);

			this.context.globalAlpha = 0.7;
			this.context.drawImage(this.pickedMenuItem.itemImage, 0, 0, 128, 128, centeredX, centeredY, 128, 128);
			this.context.globalAlpha = 1;

			function tryGetPickedRadius(towerId: number) {
				switch (towerId) {
					case Towers.singleBarrelCannon.id:
						return Towers.singleBarrelCannon.attackRadius;
					case Towers.simpleLaserCannon.id:
						return Towers.simpleLaserCannon.attackRadius;
					default:
						return null;
				}
			}

			const radius = tryGetPickedRadius(this.pickedMenuItem.towerId);

			if (radius) {
				this.drawRadius('rgba(252, 22, 555, 0.1)',
					centeredX + (this.defaultTileWidth / 2),
					centeredY + (this.defaultTileHeight / 2),
					radius);
			}
		}
	}

	private drawRadius(color: string, xDraw: number, yDraw: number, radius: number) {

		this.context.strokeStyle = 'green';
		this.context.fillStyle = color;
		this.context.beginPath();

		this.context.roundRect(xDraw - radius, yDraw - radius, radius * 2, radius * 2, 360);
		this.context.stroke();
		this.context.fill();
	}


	// drawMenu() {
	// 	const menuXStart = screen.width / 2.5;
	// 	const menuYStart = screen.height - (this.offsetHeight * 2.5 - scrollY);
	// 	const textAdditionHeight = 15;

	// 	for (let index = 0; index < 3; index++) {
	// 		tryDetectMenuHover.call(this, menuXStart, menuYStart, index);
	// 		ctx.drawImage(menuItemsList[index].image, 0, 0, defaultTileWidth, defaultTileHeight, menuXStart + index * defaultTileWidth, menuYStart, defaultTileWidth, defaultTileHeight);
	// 		drawPrice(menuXStart, menuYStart, index, textAdditionHeight);
	// 	}

	// 	function tryDetectMenuHover(this:MapConfigurator, menuXStart:number, menuYStart:number, index:number) {
	// 		const rect = new Path2D();
	// 		const textAdditionHeight = 30;
	// 		rect.rect(menuXStart + this.defaultTileWidth * index, menuYStart, this.defaultTileWidth, defaultTileHeight + textAdditionHeight);
	// 		if (ctx.isPointInPath(rect, cursorX, cursorY) && !isPicked && (userStatsProxy.userMoney - menuItemsList[index].price >= 0)) {
	// 			ctx.fillStyle = '#cc0e0e61';
	// 			menuHoverItem = menuItemsList[index].image;
	// 		}
	// 		else
	// 			ctx.fillStyle = '#00000061';
	// 		ctx.fill(rect);
	// 	}


	// }

}



// const hpContainer = document.getElementById('game__hp-container');
// const moneyContainer = document.getElementById('game__money-container');
// const hpMoneyContainer = document.getElementById('game__hp-money-bar');

// const soundContainer = document.getElementById('game__sound-icon');

// soundContainer.style.backgroundImage = 'url(../sprites/icon-mute.png)';
// let sound = true;

// soundContainer.onclick = () => {
//   sound = !sound;
//   if (sound)
//     soundContainer.style.backgroundImage = 'url(../sprites/icon-unmute.png)';
//   else
//     soundContainer.style.backgroundImage = 'url(../sprites/icon-mute.png)';

// }


// const c = function (index, angle?:number, dirX?:number, dirY?:number, order?:number) {
//   return { index: index, angle: angle, dirX: dirX, dirY: dirY, order: order }
// }

// const map = [
//   [c(2), c(1), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
//   [c(3, 90), c(3, 90), c(4, 90, 0, 1, 1), c(0), c(0), c(0), c(0), c(4, 0, 1, 0, 4), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 5), c(0), c(0)],
//   [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
//   [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
//   [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
//   [c(2), c(1), c(4, 270, 1, 0, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 3), c(0), c(0), c(0), c(4, 270, 1, 0, 6), c(3, 90), c(3, 90)],
//   [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
//   [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
//   [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
// ];
// const body = document.body;
// const turnPlaceList = [];

// const toDegrees = 180 / Math.PI;

// var handler = {
//   get: function (target, name) {
//     return name in target ? target[name] : null;
//   },

//   set: function (obj, prop, value) {

//     obj[prop] = value;
//     if (prop == 'userLife') {
//       hpContainer.innerText = `HP: ${obj[prop]} ♥ ♥ `;
//       return true;
//     }
//     else
//       if (prop == 'userMoney') {
//         moneyContainer.innerText = `Bank: ${obj[prop]} $  `;
//         return true;
//       }


//     return false;
//   }
// };

// const userStatsProxy = new Proxy({}, handler);
// userStatsProxy.userLife = 100;
// userStatsProxy.userMoney = 1000;
// let defaultTileWidth;
// let defaultTileHeight;



// const defineTurnPlaces = () => {
//   for (let mapRow = 0; mapRow < map.length; mapRow++)
//     for (let mapCol = 0; mapCol < map[mapRow].length; mapCol++)
//       if (map[mapRow][mapCol].dirX || map[mapRow][mapCol].dirY) {
//         const cell = map[mapRow][mapCol];
//         const dirY = cell.dirY;
//         const dirX = cell.dirX;
//         const order = cell.order;
//         turnPlaceList.push({
//           x: defaultTileWidth * mapCol,
//           y: defaultTileHeight * mapRow,
//           dirX: dirX ? dirX : 0,
//           dirY: dirY ? dirY : 0,
//           order: order
//         });
//       }

//   if (turnPlaceList.length > 0)
//     turnPlaceList.sort((a, b) => a.order - b.order);

// }



// const drawFlippedImage = (image, xDraw, yDraw, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY) => {
//   ctx.save();
//   ctx.translate(xDraw, yDraw);
//   ctx.scale(-1, 1);
//   ctx.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
//   ctx.restore();
// }


// const drawRadius = (color, x, y, radius) => {
//   ctx.strokeStyle = color;
//   ctx.beginPath();
//   ctx.roundRect(x - radius, y - radius, radius * 2, radius * 2, 360);
//   ctx.stroke();
// }

// function drawPrice(menuXStart, menuYStart, index, textAdditionHeight) {
//   ctx.font = "18px monospace";
//   ctx.fillStyle = 'gold';
//   ctx.fillText(`${menuItemsList[index].price}$`, menuXStart + index * defaultTileWidth + menuItemsList[index].length, menuYStart + defaultTileHeight + textAdditionHeight);
// }

// // function drawCurrentMoneyBar() {

// //   ctx.fillStyle = '#00000061';
// //   ctx.fillRect(body.clientWidth - 150 + scrollX, 30 + window.scrollY, 80, 60);
// //   ctx.font = "18px monospace";
// //   ctx.fillStyle = 'gold';
// //   ctx.fillText(userStatsProxy.userMoney + '$', body.clientWidth - 140 + scrollX, window.scrollY + 50);
// //   ctx.fillStyle = 'pink';
// //   ctx.fillText(userStatsProxy.userLife + '%♥', body.clientWidth - 140 + scrollX, window.scrollY + 80);
// // }
