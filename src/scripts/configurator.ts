import { CanvasConfigurator } from "./canvasConfigurator";

export default class Configurator {

	constructor(canvasContext: CanvasConfigurator) {
		this.canvasContext = canvasContext
	}
	private readonly canvasContext: CanvasConfigurator;

	protected get canvas(): HTMLCanvasElement {
		return this.canvasContext.canvas;
	}

	protected get context(): CanvasRenderingContext2D {
		return this.canvasContext.context;
	}
}