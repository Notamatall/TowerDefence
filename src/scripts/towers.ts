
export class Towers {

	static readonly singleBarrelCannon: ITower = {
		id: 1,
		startFrame: 0,
		framesAmount: 7,
		frameRate: 5,
		attackDamage: 30,
		attackRadius: 275,
	}

	static readonly simpleLaserCannon: ITower = {
		id: 2,
		startFrame: 0,
		framesAmount: 10,
		frameRate: 5,
		attackDamage: 50,
		attackRadius: 300,
	}

}

export interface ITower {
	id: number;
	startFrame: number;
	framesAmount: number;
	frameRate: number;
	attackDamage: number;
	attackRadius: number;
}