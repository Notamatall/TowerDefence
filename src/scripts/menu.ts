const menuRulesButton = document.getElementById('menu-rules');
if (menuRulesButton != null)
	menuRulesButton.onclick = () => onRulesButtonClick();

const onRulesButtonClick = function () {
	window.location.href = 'rules.html';
}

const menuGameButton = document.getElementById('menu-game');
if (menuGameButton !== null)
	menuGameButton.onclick = () => onGameButtonClick();

function onGameButtonClick() {
	window.location.href = 'game.html';
}
export { };
