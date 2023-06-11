import { DefaultEnemyType, EnemyType, IEnemyInitializer } from "@/types/enemyTypes";
import Utilities, { KeyImageType } from "@/utilities/utilities";
import { ImagePath } from '@/types/imagePath';
import Sprite from "@/types/sprite";

class EnemiesTemplates {
	list: DefaultEnemyType = {} as DefaultEnemyType;

	async init() {
		const defaultEnemies: DefaultEnemyType = {
			demon: {
				name: 'Lower demon',
				type: 'demon',
				moveSpeed: 2,
				totalHP: 900,
				deathReward: 75,
				damageOnPass: 5,
				deathSprite: new Sprite({
					imageSrc: ImagePath.demonDeath, frameChangeRate: 12,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256,
					pxWidth: 256, dispayX: 256, dispayY: 256,
					uniqueXCorrelation: -40, uniqueYCorrelation: 20, rotatedXcorrelation: 64
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.demonMove, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256,
					pxWidth: 256, dispayX: 256, dispayY: 256, uniqueXCorrelation: -40, uniqueYCorrelation: 20,
					hpBarXCorrelation: 65, hpBarYCorrelation: 45, rotatedXcorrelation: 64
				}),
			},
			robot: {
				name: 'Robot',
				type: 'robot',
				moveSpeed: 1.5,
				totalHP: 900,
				deathReward: 75,
				damageOnPass: 5,
				deathSprite: new Sprite({
					imageSrc: ImagePath.robotDeath, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 96,
					pxWidth: 96, dispayX: 192, dispayY: 192, uniqueXCorrelation: -40,
					uniqueYCorrelation: 65, rotatedXcorrelation: -25
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.robotWalk, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 96,
					pxWidth: 96, dispayX: 192, dispayY: 192, uniqueXCorrelation: -40, uniqueYCorrelation: 65,
					hpBarXCorrelation: 20, hpBarYCorrelation: -20, rotatedXcorrelation: -25
				}),
			},
			demonBoss: {
				name: 'Demon boss',
				type: 'demonBoss',
				moveSpeed: 1,
				totalHP: 2500,
				deathReward: 400,
				damageOnPass: 25,
				deathSprite: new Sprite({
					imageSrc: ImagePath.demonBoss, frameChangeRate: 8,
					xFramesStart: 0, yFramesStart: 640,
					framesAmount: 22, pxWidth: 288, pxHeight: 160, dispayX: 288,
					dispayY: 160, uniqueYCorrelation: 60, rotated: true,
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.demonBoss, frameChangeRate: 5,
					xFramesStart: 0, yFramesStart: 160,
					framesAmount: 12, pxWidth: 288, pxHeight: 160, dispayX: 288,
					dispayY: 160, uniqueYCorrelation: 60, rotated: true,
					hpBarXCorrelation: 25, hpBarYCorrelation: 30
				})
			},
			medusa: {
				name: 'Medusa',
				type: 'medusa',
				moveSpeed: 1,
				totalHP: 1000,
				deathReward: 300,
				damageOnPass: 20,
				deathSprite: new Sprite({
					imageSrc: ImagePath.medusaDeath, xFramesStart: 0, frameChangeRate: 12,
					yFramesStart: 0, framesAmount: 6, pxHeight: 128,
					pxWidth: 128, dispayX: 128, dispayY: 128,
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.medusaMove, xFramesStart: 0, frameChangeRate: 10,
					yFramesStart: 0, framesAmount: 4, pxHeight: 128,
					pxWidth: 128, dispayX: 128, dispayY: 128,
					hpBarXCorrelation: 35, hpBarYCorrelation: 50
				})
			},
			smallDragon: {
				name: 'Small dragon',
				type: 'smallDragon',
				moveSpeed: 1,
				totalHP: 700,
				deathReward: 100,
				damageOnPass: 10,
				deathSprite: new Sprite({
					imageSrc: ImagePath.smallDragonDeath, frameChangeRate: 12,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 4, pxHeight: 128, pxWidth: 128,
					dispayX: 128, dispayY: 128
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.smallDragonMove, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 4,
					pxHeight: 128, pxWidth: 128, dispayX: 128, dispayY: 128,
					hpBarXCorrelation: 35, hpBarYCorrelation: 35
				})
			},
			dragon: {
				name: 'Dragon boss',
				type: 'dragon',
				moveSpeed: 2,
				totalHP: 1100,
				deathReward: 200,
				damageOnPass: 20,
				deathSprite: new Sprite({
					imageSrc: ImagePath.dragonDeath, frameChangeRate: 15,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 5, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueXCorrelation: 30,
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.dragonMove, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 5, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueYCorrelation: 30,
					hpBarXCorrelation: 10, hpBarYCorrelation: 25
				})
			},
			jinn: {
				name: 'Jinn ',
				type: 'jinn',
				moveSpeed: 1.8,
				totalHP: 200,
				deathReward: 20,
				damageOnPass: 3,
				deathSprite: new Sprite({
					imageSrc: ImagePath.jinnDeath, frameChangeRate: 15,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 128, pxWidth: 128,
					dispayX: 128, dispayY: 128, uniqueXCorrelation: -20, rotatedXcorrelation: 20
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.jinnMove, frameChangeRate: 10,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 4, pxHeight: 128,
					pxWidth: 128, dispayX: 128, dispayY: 128, uniqueXCorrelation: -20,
					hpBarXCorrelation: 45, hpBarYCorrelation: 50, rotatedXcorrelation: 20
				})
			},
			lizard: {
				name: 'Lizard',
				type: 'lizard',
				moveSpeed: 2,
				totalHP: 400,
				deathReward: 60,
				damageOnPass: 5,
				deathSprite: new Sprite({
					imageSrc: ImagePath.lizardDeath, frameChangeRate: 15,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueXCorrelation: -20,
				}),
				moveSprite: new Sprite({
					imageSrc: ImagePath.lizardMove, frameChangeRate: 4,
					xFramesStart: 0, yFramesStart: 0, framesAmount: 6, pxHeight: 256, pxWidth: 256,
					dispayX: 256, dispayY: 256, uniqueXCorrelation: -20,
					hpBarXCorrelation: 40, hpBarYCorrelation: 40
				})
			},
		} as DefaultEnemyType;

		const enemiesKeyImage: KeyImageType<EnemyType> = getKeyImageFromDefault(defaultEnemies);
		await Promise.all(Utilities.loadImages<string>(enemiesKeyImage));
		this.list = defaultEnemies;

		function getKeyImageFromDefault(defaultEnemies: DefaultEnemyType) {
			const imagesList = <KeyImageType<EnemyType>>{}
			for (const key in defaultEnemies) {
				const enemy: IEnemyInitializer = defaultEnemies[key];
				const spritesKeys = Object.keys(enemy).filter(key => key.toLowerCase().includes('sprite'));
				spritesKeys.forEach(spriteKey => {
					const img = Utilities.createImage((enemy[spriteKey] as Sprite).imageSrc);
					imagesList[`${key}_${spriteKey}`] = img;
					(enemy[spriteKey] as Sprite).image = img;
				})
			}
			return imagesList;
		}
	}
}

const enemyTemplate = new EnemiesTemplates();
export default enemyTemplate;