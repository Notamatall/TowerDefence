import { ICanvasContextOptions } from "@/types";
import Utilities from "@/utilities/utilities";
class CanvasBuilder {
	constructor(options: ICanvasContextOptions) {
		this.loadHtmlCanvas();
		this.appendCanvasToContainer(options.containerId);
		this.canvas.width = screen.width;
		this.canvas.height = screen.height;
	}

	context!: CanvasRenderingContext2D;
	canvas!: HTMLCanvasElement;

	cursorX!: number;
	cursorY!: number;

	private appendCanvasToContainer(containerId: string) {
		Utilities.tryCatchWrapper(() => {
			const container = document.getElementById(containerId)
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