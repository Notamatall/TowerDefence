import { CanvasBuilder } from "./canvasBuilder";

export default class Configurator {
	constructor(canvasBuilder: CanvasBuilder) {
		this.canvasBuilder = canvasBuilder
	}

	private readonly canvasBuilder: CanvasBuilder;
	private mouseMoveEventHandlers: ((ev: MouseEvent) => any | null)[] = [];
	private mouseClickHandlers: ((ev: MouseEvent) => any | null)[] = [];

	protected addMouseMoveEventHandler(mouseMoveEventHandler: (ev: MouseEvent) => any | null) {
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

	protected addMouseClickEventHandler(clickEventHandler: (ev: MouseEvent) => any | null) {
		this.mouseClickHandlers.push(clickEventHandler);
		this.canvasBuilder.canvas.addEventListener('click', clickEventHandler);
	}

	protected removeMouseClickEventHandler(clickEventHandlerToRemove: (ev: MouseEvent) => any | null) {
		const indexToRemove = this.mouseClickHandlers.findIndex(eventHandler => eventHandler === clickEventHandlerToRemove);
		if (indexToRemove) {
			this.mouseClickHandlers.slice(indexToRemove, 1);
		}
		this.canvasBuilder.canvas.removeEventListener('mousemove', clickEventHandlerToRemove);
	}

	protected setCursorCoordinates(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect();
		this.cursorX = event.clientX - rect.left;
		this.cursorY = event.clientY - rect.top;
	}

	protected get canvasAccessor(): CanvasBuilder {
		return this.canvasBuilder;
	}

	protected get canvasContainer(): HTMLElement {
		return this.canvasBuilder.canvasContainer;
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