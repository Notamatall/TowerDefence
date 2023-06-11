import { IImageAsset } from "@/types";

export type KeyImageType<T> = {
	[key in keyof T]: HTMLImageElement
};

export default class Utilities {

	static readonly toRadiance = Math.PI / 180;
	static readonly toDegrees = 180 / Math.PI;

	static createImage(src: string, height?: number, width?: number) {
		const image = new Image(width, height);
		image.src = src;
		return image;
	}

	static loadImages<T>(images: KeyImageType<T>): Promise<IImageAsset<T>>[] {
		const promisesList: Promise<IImageAsset<T>>[] =
			Object.entries<HTMLImageElement>(images).map((imageObj) => waitForImageToLoad(imageObj[1], imageObj[0] as T));

		function waitForImageToLoad(imageElement: HTMLImageElement, key: T): Promise<IImageAsset<T>> {
			return new Promise((
				resolve: (obj: IImageAsset<T>) => void,
				reject: (message: string) => void
			) => {
				imageElement.onload = () => resolve({ img: imageElement, key: key });
				imageElement.onerror = () => reject(`${key} load was not successful`);
			})
		}

		return promisesList;
	}


	static drawFlippedImage(context: CanvasRenderingContext2D,
		image: HTMLImageElement,
		xDrawPosition: number,
		yDrawPosition: number,
		sourceX: number,
		sourceY: number,
		getByX: number,
		getByY: number,
		offsetX: number,
		offsetY: number,
		totalX: number,
		totalY: number) {
		context.save();
		context.translate(xDrawPosition, yDrawPosition);
		context.scale(-1, 1);
		context.drawImage(image, sourceX, sourceY, getByX, getByY, -offsetX, offsetY, totalX, totalY);
		context.restore();
	}


	static drawRotatedImage(context: CanvasRenderingContext2D,
		image: HTMLImageElement,
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

		context.save();
		context.translate(xDraw, yDraw);
		if (angle)
			context.rotate(angle * this.toRadiance);
		context.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
		context.restore();
	}

	// const drawRotatedImage = (image, xDraw, yDraw, pX, pY, angle, getByX, getByY, offsetX, offsetY, totalX, totalY) => {
	// 	ctx.save();
	// 	ctx.translate(xDraw, yDraw);
	// 	ctx.rotate(angle * toRadiance);
	// 	ctx.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
	// 	ctx.restore();
	// }




	static tryCatchWrapper(context: () => any) {
		try {
			return context();
		}
		catch (error) {
			console.error(error)
		}
	}
}
