import mapImage from '../sprites/terrain.png';

export interface IImageAsset {
	img: HTMLImageElement;
	key: string
}

export enum ImagePath {
	map = mapImage
}