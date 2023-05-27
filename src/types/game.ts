import mapImage from '@/assets/sprites/terrain.png';

export interface IImageAsset {
	img: HTMLImageElement;
	key: string
}

export class ImagePath {
	static map = mapImage;
}
