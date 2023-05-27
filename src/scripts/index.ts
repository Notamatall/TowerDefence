import { IAppOptions } from "@/types";
import Utilities from "@/utilities/utilities";
class App {
	constructor() {
		this.loadHtmlCanvas();
	}

	context!: CanvasRenderingContext2D;
	canvas!: HTMLCanvasElement;
	private loadHtmlCanvas() {
		Utilities.tryCatchWrapper(() => {
			const canvas = document.querySelector('canvas');

			if (canvas === null)
				throw new Error('canvas was not found')

			const context = canvas.getContext('2d');

			if (context === null)
				throw new Error('canvcontextas was not found')

			this.context = context;
			this.canvas = canvas;

		});
	}
}


const app = new App();
export default app;