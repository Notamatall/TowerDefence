export default class Page1 {
	init() {
		document.body.appendChild(this.component());
		document.body.appendChild(this.button());
	}

	component() {
		const element = document.createElement('div');

		// Lodash, currently included via a script, is required for this line to work
		element.innerHTML = _.join(['Hello', 'webpack'], ' ');
		return element;
	}


	button() {
		const button = document.createElement('div');

		button.innerHTML = 'Go to page 2';
		button.style.border = 'solid black';

		button.style.background = 'purple';
		button.style.width = 'fit-content';

		button.onclick = () => {
			window.location.href = 'index2.html';
		}
		return button;
	}

}

const page1 = new Page1();
page1.init();