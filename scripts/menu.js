const menuRulesButton = document.getElementById('menu-rules');
menuRulesButton.onclick = (event) => onRulesButtonClick(event);

const onRulesButtonClick = function (event) {
window.location.href = 'rules.html';
}

const menuGameButton = document.getElementById('menu-game');
menuGameButton.onclick = (event) => onGameButtonClick(event);

function onGameButtonClick(event) {
window.location.href = 'game.html';
}
