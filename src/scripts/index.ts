import '../styles/index.css';
const menuControlButton = document.getElementById('menu-control');
if (menuControlButton != null)
	menuControlButton.onclick = () => onControlButtonClick();

const onControlButtonClick = function () {
	window.location.href = 'control.html';
}

const menuGameButton = document.getElementById('menu-game');
if (menuGameButton !== null)
	menuGameButton.onclick = () => onGameButtonClick();

function onGameButtonClick() {
	window.location.href = 'game.html';
}