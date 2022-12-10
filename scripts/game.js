const canvas = document.getElementById("canvas");
const ctx = this.canvas.getContext("2d");

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


const mapTemplate = new Image(896, 640);
const towerImage = new Image(1024, 128);
towerImage.src = `../sprites/Red/Weapons/turret_01_mk1.png`;

const mapConfigurator = new MapConfigurator(mapTemplate, screen.width, screen.height, map, 128, 128);
const demonImageList = [];

for (let index = 0; index < 6; index++) {
  demonImageList.push(new Image(128, 128));
  demonImageList[index].src = `../sprites/demon/Walk${index + 1}.png`;
}

mapTemplate.src = "../sprites/terrain.png";


mapTemplate.onload = () => {
  let towerList = [];
  let towerId = 0;

  canvas.onclick = (e) => {
    const tower = new Tower({
      x: e.x,
      y: e.y,
      startFrame: 0,
      framesAmount: 7,
      frameRate: 5,
      width: 128,
      height: 128,
      attackRadius: 150
    });
    towerList.push(tower);
  }

  const demonsList = [];
  for (let index = 0; index < 10; index++) {
    const turnPlaceList = mapConfigurator.getTurnPlaceList();
    demonsList.push(new Enemy(-128 * (index + 1), 128, 0, 5, 10, 128, 128, 1, 0));
    demonsList[index].id = index;
    demonsList[index].turnPlaceList = Array.from(turnPlaceList);
    demonsList[index].hp = 500;
    demonsList[index].currentHp = 500;
  }

  function animate() {

    requestAnimationFrame(animate);

    mapConfigurator.drawMap(128, 384);

    for (const tower of towerList) {
 else {
        if (!tower.target)
          for (const demon of demonsList) {
            if (Math.abs(demon.x + demon.width * 0.5 - tower.x) < tower.radius
              && Math.abs(demon.y + demon.height * 0.5 - tower.y) < tower.radius) {

              tower.target = demon;
              tower.frame = tower.startFrame;
            }
          }
      }

      ctx.strokeStyle = 'rgba(137, 11, 11, 0.350)';
      ctx.beginPath();
      ctx.roundRect(tower.x - tower.radius, tower.y - tower.radius, tower.radius * 2, tower.radius * 2, 360);
      ctx.stroke();



      mapConfigurator.drawRotatedImage(towerImage, tower.x, tower.y, tower.frame * 128, 0, tower.angle + 90, 128, 128, -tower.width / 2, -tower.height / 2, 128, 128);
    }

    for (const demon of demonsList) {
      ctx.drawImage(demonImageList[demon.frame], 0, 0, 256, 256, demon.x, demon.y, 128, 128);
      demon.move(1)
      demon.animate();
      demon.drawHp(ctx);



    }

  }

  animate();
};


