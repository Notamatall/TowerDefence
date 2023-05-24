export default class Utilities {

	static createImage(width: number,
		height: number,
		src: string) {
		const image = new Image(width, height);
		image.src = src;
		return image;
	}
}