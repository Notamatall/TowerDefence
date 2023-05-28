import { CanvasContext } from "./canvas";

export default class Configurator {

	constructor(canvasContext: CanvasContext) {
		this.canvasContext = canvasContext
	}
	private readonly canvasContext: CanvasContext;

	protected get canvas(): HTMLCanvasElement {
		return this.canvasContext.canvas;
	}

	protected get context(): CanvasRenderingContext2D {
		return this.canvasContext.context;
	}
}