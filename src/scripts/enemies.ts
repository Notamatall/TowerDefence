import Enemy, { DefaultEnemyType, EnemyType, IEnemy, IEnemyInitializer } from "@/types/enemyTypes";
import Utilities, { KeyImageType } from "@/utilities/utilities";
import { ImagePath } from '@/types/imagePath';
import { IImageAsset } from "@/types";
import Sprite from "@/types/sprite";

class EnemiesTemplates {
	list: DefaultEnemyType = {} as DefaultEnemyType;

	async init() {
		const defaultEnemies: DefaultEnemyType = {
			demon: {
				name: 'Lower demon',
				type: 'demon',
				frameChangeRate: 10,
				moveSpeed: 1,
				totalHP: 900,
				deathReward: 75,
				damageOnPass: 5,
				enemyImgSrc: ImagePath.demonMove,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256,
					pxWidth: 256, dispayX: 256, dispayY: 256, uniqueXCorrelation: -40, uniqueYCorrelation: 20,
					hpBarXCorrelation: 65,
					hpBarYCorrelation: 45
				})
			},
			demonBoss: {
				name: 'Demon boss',
				type: 'demonBoss',
				frameChangeRate: 5,
				moveSpeed: 1,
				totalHP: 2500,
				deathReward: 400,
				damageOnPass: 25,
				enemyImgSrc: ImagePath.demonBoss,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 160,
					framesAmount: 12, pxWidth: 288, pxHeight: 160, dispayX: 288,
					dispayY: 160, uniqueYCorrelation: 60, rotated: true,
					hpBarXCorrelation: 25,
					hpBarYCorrelation: 30
				})
			},
			medusa: {
				name: 'Medusa',
				type: 'medusa',
				frameChangeRate: 10,
				moveSpeed: 1,
				totalHP: 1000,
				deathReward: 300,
				damageOnPass: 20,
				enemyImgSrc: ImagePath.medusaMove,
				sprite: new Sprite({
					xFramesStart: 0,
					yFramesStart: 0, framesAmount: 4, pxHeight: 128,
					pxWidth: 128, dispayX: 128, dispayY: 128,
					hpBarXCorrelation: 35,
					hpBarYCorrelation: 50
				})
			},
			smallDragon: {
				name: 'Small dragon',
				type: 'smallDragon',
				frameChangeRate: 10,
				moveSpeed: 1,
				totalHP: 700,
				deathReward: 100,
				damageOnPass: 10,
				enemyImgSrc: ImagePath.smallDragonMove,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 0, framesAmount: 4,
					pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128,
					hpBarXCorrelation: 35,
					hpBarYCorrelation: 35
				})
			},
			dragon: {
				name: 'Dragon boss',
				type: 'dragon',
				frameChangeRate: 10,
				moveSpeed: 3,
				totalHP: 1500,
				deathReward: 200,
				damageOnPass: 20,
				enemyImgSrc: ImagePath.dragonMove,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 0, framesAmount: 5, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueYCorrelation: 30,
					hpBarXCorrelation: 10,
					hpBarYCorrelation: 25
				})
			},
			jinn: {
				name: 'Jinn ',
				type: 'jinn',
				frameChangeRate: 10,
				moveSpeed: 1.8,
				totalHP: 200,
				deathReward: 20,
				damageOnPass: 3,
				enemyImgSrc: ImagePath.jinnMove,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 0, framesAmount: 4, pxHeight: 128,
					pxWidth: 128, dispayX: 128, dispayY: 128, uniqueXCorrelation: -20,
					hpBarXCorrelation: 45,
					hpBarYCorrelation: 50
				})
			},
			lizard: {
				name: 'Lizard',
				type: 'lizard',
				frameChangeRate: 3,
				moveSpeed: 2,
				totalHP: 400,
				deathReward: 60,
				damageOnPass: 5,
				enemyImgSrc: ImagePath.lizardMove,
				sprite: new Sprite({
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueXCorrelation: -20,
					hpBarXCorrelation: 40,
					hpBarYCorrelation: 40
				})
			},
		} as DefaultEnemyType;


		const enemiesKeyImage: KeyImageType<EnemyType> = getKeyImageFromDefault(defaultEnemies);
		const enemiesLoadedImages = await Promise.all(Utilities.loadImages<EnemyType>(enemiesKeyImage));
		assignLoadedImages(enemiesLoadedImages, defaultEnemies);
		this.list = defaultEnemies;

		function getKeyImageFromDefault(defaultEnemies: DefaultEnemyType) {
			const keysImages = <KeyImageType<EnemyType>>{};

			for (const key in defaultEnemies) {
				const enemy: IEnemyInitializer = defaultEnemies[key];
				keysImages[enemy.type] = Utilities.createImage(enemy.enemyImgSrc);
			}
			return keysImages;
		}
		function assignLoadedImages(loadedImages: IImageAsset<EnemyType>[], initializedTowers: DefaultEnemyType) {
			for (const imageAsset of loadedImages) {
				initializedTowers[imageAsset.key].sprite.image = imageAsset.img;
			}
		}
	}
}

const enemyTemplate = new EnemiesTemplates();
export default enemyTemplate;