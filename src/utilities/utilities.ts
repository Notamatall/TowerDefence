import { IImageAsset } from "@/types";

export default class Utilities {
	static createImage(width: number,
		height: number,
		src: string) {
		const image = new Image(width, height);
		image.src = src;
		return image;
	}

	static loadImages(images: { [keyof: string]: HTMLImageElement }): Promise<IImageAsset>[] {
		const promisesList: Promise<IImageAsset>[] =
			Object.entries(images)
				.map((imageObj) => waitForImageToLoad(imageObj[1], imageObj[0]));

		function waitForImageToLoad(imageElement: HTMLImageElement, key: string): Promise<IImageAsset> {
			return new Promise((
				resolve: (obj: IImageAsset) => void,
				reject: (message: string) => void
			) => {
				imageElement.onload = () => resolve({ img: imageElement, key: key });
				imageElement.onerror = () => reject(`${key} load was not successful`);
			})
		}

		return promisesList;
	}



	static tryCatchWrapper(context: () => any) {
		try {
			return context();
		}
		catch (error) {
			console.error(error)
		}
	}
}
