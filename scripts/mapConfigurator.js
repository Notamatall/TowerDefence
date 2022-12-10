class MapConfigurator {
  constructor(mapTemplate, mapWidth, mapHeight, map, tileWidth, tileHeight) {

    this.mapTemplate = mapTemplate;
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    this.map = map;
    this.tileHeight = tileHeight;
    this.tileWidth = tileWidth;

    for (let mapRow = 0; mapRow < map.length; mapRow++)
      for (let mapCol = 0; mapCol < map[mapRow].length; mapCol++)
        if (map[mapRow][mapCol].dirX || map[mapRow][mapCol].dirY) {
          const cell = map[mapRow][mapCol];
          const dirY = cell.dirY;
          const dirX = cell.dirX;
          const order = cell.order;
          this.turnPlaceList.push({
            x: tileWidth * mapCol,
            y: tileHeight * mapRow,
            dirX: dirX ? dirX : 0,
            dirY: dirY ? dirY : 0,
            order: order
          });
        }

    if (this.turnPlaceList.length > 0)
      this.turnPlaceList.sort((a, b) => a.order - b.order);

  }

  turnPlaceList = [];
  toRadiance = Math.PI / 180;
  turnPlace;

  tileWidth;
  tileHeight;

  mapTemplate;
  map;


  drawMap(environmentX, environmentY) {
    const map = this.map;
    for (let i = 0; i < map.length; i++)
      for (let j = 0; j < map[i].length; j++) {
        let cell = map[i][j];
        this.drawRotatedImage(this.mapTemplate, this.tileWidth * j + this.tileWidth / 2, i * 128 + this.tileHeight / 2, cell.index * environmentX, environmentY, cell.angle, this.tileWidth, this.tileHeight, -(this.tileWidth / 2), -(this.tileHeight / 2), this.tileWidth, this.tileHeight);

        if (cell.over) {
          cell = cell.over;
          this.drawRotatedImage(this.mapTemplate, this.tileWidth * j + this.tileWidth / 2, i * 128 + this.tileHeight / 2, cell.index * environmentX, environmentY, cell.angle, this.tileWidth, this.tileHeight, -(this.tileWidth / 2), -(this.tileHeight / 2), this.tileWidth, this.tileHeight);
        }
      }
  }

  drawFlippedImage(image, width, height) {
    ctx.save();
    ctx.translate(width, height);
    ctx.scale(-1, 1);
    mapConfigurator.ctx.drawImage(image, 0, 0, 256, 256, -192, 0, 256, 256);
    ctx.restore();
  }

  drawRotatedImage(image, xDraw, yDraw, pX, pY, angle, getByX, getByY, offsetX, offsetY, totalX, totalY) {

    ctx.save();
    ctx.translate(xDraw, yDraw);
    ctx.rotate(angle * this.toRadiance);
    ctx.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);
    ctx.restore();

  }

  getTurnPlaceList() {
    return this.turnPlaceList;
  }
}
