export default class Sprite {
	constructor(spriteInfo: ISpriteInitializer) {
		this.xFramesStart = spriteInfo.xFramesStart;
		this.yFramesStart = spriteInfo.yFramesStart;
		this.pxHeight = spriteInfo.pxHeight;
		this.pxWidth = spriteInfo.pxWidth;
		this.framesAmount = spriteInfo.framesAmount - 1;
		this.displayX = spriteInfo.dispayX ? spriteInfo.dispayX : this.pxWidth / 2;
		this.displayY = spriteInfo.dispayY ? spriteInfo.dispayY : this.pxHeight / 2;
		this.image = spriteInfo.image ? spriteInfo.image : new Image();
		this.uniqueXCorrelation = spriteInfo.uniqueXCorrelation ? spriteInfo.uniqueXCorrelation : 0;
		this.uniqueYCorrelation = spriteInfo.uniqueYCorrelation ? spriteInfo.uniqueYCorrelation : 0;
		this.hpBarYCorrelation = spriteInfo.hpBarYCorrelation ? spriteInfo.hpBarYCorrelation : 0;
		this.hpBarXCorrelation = spriteInfo.hpBarXCorrelation ? spriteInfo.hpBarXCorrelation : 0;
		this.uniqueYCorrelation = spriteInfo.uniqueYCorrelation ? spriteInfo.uniqueYCorrelation : 0;
		this.rotated = spriteInfo.rotated ? spriteInfo.rotated : false;
	}

	readonly displayX: number;
	readonly displayY: number;
	readonly framesAmount: number;
	readonly pxHeight: number;
	readonly pxWidth: number;
	readonly xFramesStart: number;
	readonly yFramesStart: number;
	readonly uniqueXCorrelation: number;
	readonly uniqueYCorrelation: number;
	readonly hpBarYCorrelation: number;
	readonly hpBarXCorrelation: number;
	readonly rotated: boolean;
	image: HTMLImageElement;
}


export interface ISpriteInitializer {
	xFramesStart: number;
	yFramesStart: number;
	uniqueXCorrelation?: number;
	uniqueYCorrelation?: number;
	hpBarXCorrelation?: number;
	hpBarYCorrelation?: number;
	framesAmount: number;
	pxHeight: number;
	pxWidth: number;
	dispayX?: number;
	dispayY?: number;
	image?: HTMLImageElement;
	rotated?: boolean;
}