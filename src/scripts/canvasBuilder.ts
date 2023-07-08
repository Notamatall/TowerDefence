import { ICanvasContextOptions } from "@/types";
import Utilities from "@/utilities/utilities";
class CanvasBuilder {
	constructor() {
		this.loadHtmlCanvas();
		this.canvasContainer = this.createCanvasContainer();
		this.appendCanvasToContainer(this.canvasContainer.id);
		this.registerWindowResize();
	}
	registerWindowResize() {
		window.addEventListener('resize', (e) => {
			const mainMenuIcon = document.getElementById('game__main-menu-icon')
			if (mainMenuIcon) {
				const offsetRightMainMenu = 40;
				mainMenuIcon.style.left = window.innerWidth - offsetRightMainMenu + 'px';
			}

			const hpMoneyContainer = document.getElementById('game__hp-money-container')
			if (hpMoneyContainer) {
				const offsetRightHPMoney = 170;
				hpMoneyContainer.style.left = window.innerWidth - offsetRightHPMoney + 'px';
			}
		})
	}

	public context!: CanvasRenderingContext2D;
	public canvas!: HTMLCanvasElement;
	public cursorX!: number;
	public cursorY!: number;
	public globalTowersVolume = 0.1;
	readonly canvasContainer!: HTMLElement;

	private createCanvasContainer() {
		const canvasContainer = document.createElement('div');
		const canvasContainerUniqueId = uniqueId();
		canvasContainer.id = canvasContainerUniqueId;
		canvasContainer.classList.add('game__container');

		function uniqueId() {
			const dateString = Date.now().toString(36);
			const randomness = Math.random().toString(36).substring(2);
			return dateString + randomness;
		};

		document.body.appendChild(canvasContainer);
		return canvasContainer;
	}

	public setCanvasHeight(options: ICanvasContextOptions) {
		this.setCorrectContainerHeight(this.canvasContainer.id, options.height);
		this.canvas.width = options.width;
		this.canvas.height = options.height;
	}

	private setCorrectContainerHeight(containerId: string, height: number) {
		Utilities.tryCatchWrapper(() => {
			const container = document.getElementById(containerId);
			if (container !== null)
				container.style.maxHeight = height + 'px';
			else
				throw new Error('container was not found')
		})

	}

	private getCanvasContainerById(containerId: string) {
		return Utilities.tryCatchWrapper(() => {
			const container = document.getElementById(containerId);
			if (container !== null)
				return container;
			else
				throw new Error('container was not found')
		})
	}

	private appendCanvasToContainer(containerId: string) {
		Utilities.tryCatchWrapper(() => {
			const container = document.getElementById(containerId);
			if (container !== null)
				container.appendChild(this.canvas)
			else
				throw new Error('container was not found')
		})
	}

	private loadHtmlCanvas() {
		Utilities.tryCatchWrapper(() => {
			const canvas = document.createElement('canvas');

			if (canvas === null)
				throw new Error('canvas was not found')

			const context = canvas.getContext('2d');

			if (context === null)
				throw new Error('canvcontextas was not found')


			this.canvas = canvas;
			this.context = context;
		});
	}
}

export { CanvasBuilder };