import '../styles/control.css';


const backButton = document.getElementById('control-back__button');

if (backButton === null)
	throw new Error('Back button was not found');

backButton.onclick = () => {

	window.location.href = 'index.html';
}