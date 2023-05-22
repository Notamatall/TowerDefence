export default class Page2 {
	init() {
		document.body.appendChild(this.component());
		document.body.appendChild(this.button());
	}
	component() {
		// const mapTemplate = this.createImage(896, 640, '');
		const image = document.createElement('img');
		image.src = './sprites/terrain.png';
		document.body.appendChild(image);
		const element = document.createElement('div');
		element.innerHTML = 'Hello' + 'sexyLady';
		return element;
	}

	// createImage(width: number,
	// 	height: number,
	// 	src: string) {
	// 	const image = new Image(width, height);
	// 	image.src = src;
	// 	return image;
	// }

	button() {
		const button = document.createElement('div');

		button.innerHTML = 'Go to page 1';
		button.style.border = 'solid black';

		button.style.background = 'purple';
		button.style.width = 'fit-content';

		button.onclick = () => {
			window.location.href = 'index.html';
		}
		return button;
	}


}
const page2 = new Page2();
page2.init();