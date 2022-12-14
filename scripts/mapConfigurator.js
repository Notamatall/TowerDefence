const hpContainer = document.getElementById('game__hp-container');
const moneyContainer = document.getElementById('game__money-container');
const hpMoneyContainer = document.getElementById('game__hp-money-bar');

const c = function (index, angle = null, dirX = null, dirY = null, order = null) {
  return { index: index, angle: angle, dirX: dirX, dirY: dirY, order: order }
}

const map = [
  [c(2), c(1), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
  [c(3, 90), c(3, 90), c(4, 90, 0, 1, 1), c(0), c(0), c(0), c(0), c(4, 0, 1, 0, 4), c(3, 90), c(3, 90), c(3, 90), c(4, 90, 0, 1, 5), c(0), c(0)],
  [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
  [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
  [c(2), c(0), c(3), c(0), c(0), c(0), c(0), c(3), c(0), c(0), c(0), c(3), c(0), c(0)],
  [c(2), c(1), c(4, 270, 1, 0, 2), c(3, 90), c(3, 90), c(3, 90), c(3, 90), c(4, 180, 0, -1, 3), c(0), c(0), c(0), c(4, 270, 1, 0, 6), c(3, 90), c(3, 90)],
  [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
  [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
  [c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)],
];
const body = document.body;
const turnPlaceList = [];
const toRadiance = Math.PI / 180;
const toDegrees = 180 / Math.PI;

var handler = {
  get: function (target, name) {
    return name in target ? target[name] : null;
  },

  set: function (obj, prop, value) {

    obj[prop] = value;
    if (prop == 'userLife') {
      hpContainer.innerText = `HP: ${obj[prop]} ♥ ♥ `;
      return true;
    }
    else
      if (prop == 'userMoney') {
        moneyContainer.innerText = `Bank: ${obj[prop]} $  `;
        return true;
      }


    return false;
  }
};

const userStatsProxy = new Proxy({}, handler);
userStatsProxy.userLife = 100;
userStatsProxy.userMoney = 1000;
let defaultTileWidth;
let defaultTileHeight;

const configureMap = ({ mapWidth, mapHeight, tileWidth, tileHeight }) => {
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  defaultTileHeight = tileHeight;
  defaultTileWidth = tileWidth;
  defineTurnPlaces();
}


const defineTurnPlaces = () => {
  for (let mapRow = 0; mapRow < map.length; mapRow++)
    for (let mapCol = 0; mapCol < map[mapRow].length; mapCol++)
      if (map[mapRow][mapCol].dirX || map[mapRow][mapCol].dirY) {
        const cell = map[mapRow][mapCol];
        const dirY = cell.dirY;
        const dirX = cell.dirX;
        const order = cell.order;
        turnPlaceList.push({
          x: defaultTileWidth * mapCol,
          y: defaultTileHeight * mapRow,
          dirX: dirX ? dirX : 0,
          dirY: dirY ? dirY : 0,
          order: order
        });
      }

  if (turnPlaceList.length > 0)
    turnPlaceList.sort((a, b) => a.order - b.order);

}

const drawMap = (environmentX, environmentY) => {
  for (let i = 0; i < map.length; i++)
    for (let j = 0; j < map[i].length; j++) {
      let cell = map[i][j];
      drawRotatedImage(mapTemplate, defaultTileWidth * j + defaultTileWidth / 2, i * defaultTileHeight + defaultTileHeight / 2, cell.index * environmentX, environmentY, cell.angle, defaultTileWidth, defaultTileHeight, -(defaultTileWidth / 2), -(defaultTileHeight / 2), defaultTileWidth, defaultTileHeight);

      if (cell.over) {
        cell = cell.over;
        drawRotatedImage(mapTemplate, defaultTileWidth * j + defaultTileWidth / 2, i * defaultTileHeight + defaultTileHeight / 2, cell.index * environmentX, environmentY, cell.angle, defaultTileWidth, defaultTileHeight, -(defaultTileWidth / 2), -(defaultTileHeight / 2), defaultTileWidth, defaultTileHeight);
      }
    }
}

const drawFlippedImage = (image, width, height) => {
  ctx.save();
  ctx.translate(width, height);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, 256, 256, -192, 0, 256, 256);
  ctx.restore();
}

const drawRotatedImage = (image, xDraw, yDraw, pX, pY, angle, getByX, getByY, offsetX, offsetY, totalX, totalY) => {
  ctx.save();
  ctx.translate(xDraw, yDraw);
  ctx.rotate(angle * toRadiance);
  ctx.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
  ctx.restore();
}

const drawRadius = (color, x, y, radius) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - radius, y - radius, radius * 2, radius * 2, 360);
  ctx.stroke();
}

function drawPrice(menuXStart, menuYStart, index, textAdditionHeight) {
  ctx.font = "18px monospace";
  ctx.fillStyle = 'gold';
  ctx.fillText(`${menuItemsList[index].price}$`, menuXStart + index * defaultTileWidth + menuItemsList[index].length, menuYStart + defaultTileHeight + textAdditionHeight);
}

// function drawCurrentMoneyBar() {

//   ctx.fillStyle = '#00000061';
//   ctx.fillRect(body.clientWidth - 150 + scrollX, 30 + window.scrollY, 80, 60);
//   ctx.font = "18px monospace";
//   ctx.fillStyle = 'gold';
//   ctx.fillText(userStatsProxy.userMoney + '$', body.clientWidth - 140 + scrollX, window.scrollY + 50);
//   ctx.fillStyle = 'pink';
//   ctx.fillText(userStatsProxy.userLife + '%♥', body.clientWidth - 140 + scrollX, window.scrollY + 80);
// }
