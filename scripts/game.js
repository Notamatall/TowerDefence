const canvas = document.getElementById("canvas");
const ctx = this.canvas.getContext("2d");

const mapTemplate = new Image(896, 640);
mapTemplate.src = "../sprites/terrain.png";

const towerImage = new Image(1024, 128);
towerImage.src = `../sprites/Red/Weapons/turret_01_mk1.png`;

configureMap(screen.width, screen.height, 128, 128);

const demonImageList = [];
const towerList = [];
const demonsList = [];
for (let index = 0; index < 6; index++) {
  demonImageList.push(new Image(256, 256));
  demonImageList[index].src = `../sprites/demon/Walk${index + 1}.png`;
}

mapTemplate.onload = () => {
  onTowerClick();
  createDemons();

  function animate() {



    requestAnimationFrame(animate);


    drawMap(128, 384);
    ctx.fillStyle = "red";


    ctx.drawImage(towerImage, 0, 0, 128, 128, xPos - 64, yPos - 64, 128, 128);
    // ctx.drawImage(image, pX, pY, getByX, getByY, offsetX, offsetY, totalX, totalY);


    for (const tower of towerList)
      tower.update();
    for (const demon of demonsList)
      demon.update();



  }
  animate();
};


let xPos = 0;
let yPos = 0;
canvas.onmousemove = function (e) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(128, 384);

  xPos = e.x;
  yPos = e.y;


};



function createDemons() {
  for (let index = 0; index < 10; index++) {
    const turnArray = Array.from(turnPlaceList);
    demonsList.push(new Enemy({
      id: index,
      x: -128 * (index + 1),
      y: 128,
      startFrame: 0,
      framesAmount: 3,
      frameRate: 10,
      height: 128,
      width: 128,
      startDirX: 1,
      startDirY: 0,
      moveSpeed: 1,
      totalHP: 500,
      turnArray
    }));
    demonsList[index].id = index;
  }
}

function onTowerClick() {
  let towerId = 0;
  canvas.onclick = (e) => {
    const tower = new Tower({
      id: towerId++,
      x: e.x - 64,
      y: e.y - 64,
      startFrame: 0,
      framesAmount: 7,
      frameRate: 5,
      width: 128,
      height: 128,
      attackRadius: 150,
      attackDamage: 25
    });
    towerList.push(tower);
  }

}
