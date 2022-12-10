
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
  [c(2), c(2), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0), c(0)]
];

const turnPlaceList = [];
const toRadiance = Math.PI / 180;
const toDegrees = 180 / Math.PI;

let mapTileWidth;
let mapTileHeight;


const configureMap = (mapWidth, mapHeight, tileWidth, tileHeight) => {
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  mapTileHeight = tileHeight;
  mapTileWidth = tileWidth;

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
          x: mapTileWidth * mapCol,
          y: mapTileHeight * mapRow,
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
      drawRotatedImage(mapTemplate, mapTileWidth * j + mapTileWidth / 2, i * 128 + mapTileHeight / 2, cell.index * environmentX, environmentY, cell.angle, mapTileWidth, mapTileHeight, -(mapTileWidth / 2), -(mapTileHeight / 2), mapTileWidth, mapTileHeight);

      if (cell.over) {
        cell = cell.over;
        drawRotatedImage(mapTemplate, mapTileWidth * j + mapTileWidth / 2, i * 128 + mapTileHeight / 2, cell.index * environmentX, environmentY, cell.angle, mapTileWidth, mapTileHeight, -(mapTileWidth / 2), -(mapTileHeight / 2), mapTileWidth, mapTileHeight);
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
