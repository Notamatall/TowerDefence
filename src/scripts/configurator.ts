import { CanvasBuilder } from "./canvasBuilder";

export default class Configurator {

	constructor(canvasBuilder: CanvasBuilder) {
		this.canvasBuilder = canvasBuilder
	}

	private readonly canvasBuilder: CanvasBuilder;
	private mouseMoveEventHandlers: ((ev: MouseEvent) => any | null)[] = [];

	protected registerMouseMoveEventHandler(mouseMoveEventHandler: (ev: MouseEvent) => any | null) {
		this.mouseMoveEventHandlers.push(mouseMoveEventHandler);
		this.canvasBuilder.canvas.addEventListener('mousemove', mouseMoveEventHandler);
	}

	protected removeMouseMoveEventHandler(mouseMoveEventHandlerToRemove: (ev: MouseEvent) => any | null) {
		const indexToRemove = this.mouseMoveEventHandlers.findIndex(eventHandler => eventHandler === mouseMoveEventHandlerToRemove);
		if (indexToRemove) {
			this.mouseMoveEventHandlers.slice(indexToRemove, 1);
		}
		this.canvasBuilder.canvas.removeEventListener('mousemove', mouseMoveEventHandlerToRemove);
	}

	protected setCursorCoordinates(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect();
		this.cursorX = event.clientX - rect.left;
		this.cursorY = event.clientY - rect.top;
	}

	protected get canvas(): HTMLCanvasElement {
		return this.canvasBuilder.canvas;
	}

	protected get context(): CanvasRenderingContext2D {
		return this.canvasBuilder.context;
	}

	protected get cursorX(): number {
		return this.canvasBuilder.cursorX;
	}

	protected set cursorX(newCursorXValue: number) {
		this.canvasBuilder.cursorX = newCursorXValue;
	}

	protected get cursorY(): number {
		return this.canvasBuilder.cursorY;
	}

	protected set cursorY(newCursorYValue: number) {
		this.canvasBuilder.cursorY = newCursorYValue;
	}
}