export default class Utilities {
	static createImage(width: number,
		height: number,
		src: string) {
		const image = new Image(width, height);
		image.src = src;
		return image;
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
