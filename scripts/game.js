const canvas = document.getElementById("canvas");
const ctx = this.canvas.getContext("2d");

const mapTemplate = createImage(896, 640, '../sprites/terrain.png');
const simplePlasmaTowerImage = createImage(1408, 128, '../sprites/Red/Weapons/turret_02_mk1.png');
const simpleCannonTowerImage = createImage(1024, 128, ' ../sprites/Red/Weapons/turret_01_mk1.png');
const platformImage = createImage(768, 640, ' ../sprites/Red/Towers/towers_walls_blank.png');

const smPlasmaCannonAudio = new Audio('../audio/smPlasmaCannonAudio.mp3');
const smCannonAudio = new Audio('../audio/smCannonAudio.mp3');

const offsetHeight = screen.height - document.body.scrollHeight;

const demonImageList = [];
const towerList = [];
const platformList = [];
const demonsList = [];

makeCanvasReadKeyboardClick();
configureMap({
  mapWidth: screen.width,
  mapHeight: screen.height,
  tileWidth: 128,
  tileHeight: 128
});
initDemonImages();

mapTemplate.onload = () => {
  createDemons(15);

  canvas.onclick = onClick;
  canvas.onmousemove = onMouseMove;
  canvas.onkeydown = onKeyDown;
  onscroll = onScroll;
  onanimationend = onAnimationEnd;

  function animate() {

    requestAnimationFrame(animate);

    drawMap(128, 384);

    for (const platform of platformList)
      ctx.drawImage(platformImage, 0, 0, defaultTileHeight, defaultTileHeight, platform.x, platform.y, defaultTileHeight, defaultTileHeight);

    for (const demon of demonsList)
      demon.update();

    for (const tower of towerList)
      tower.update();

    drawMenu();
    tryDrawPicked();

    if (demonsList.length === 0)
      createDemons(10);
  }

  animate();
};


let menuHoverItem;
const menuItemsList = [
  { image: simplePlasmaTowerImage, price: 350, length: 64 - (4 * 10.6 / 2) },
  { image: simpleCannonTowerImage, price: 250, length: 64 - (4 * 10.6 / 2) },
  { image: platformImage, price: 50, length: 64 - (3 * 10.6 / 2) }];

function drawMenu() {
  const menuXStart = screen.width / 2.5;
  const menuYStart = screen.height - (offsetHeight * 2.5 - scrollY);
  const textAdditionHeight = 15;
  // drawCurrentMoneyBar();
  for (let index = 0; index < 3; index++) {
    tryDetectMenuHover(menuXStart, menuYStart, index);
    ctx.drawImage(menuItemsList[index].image, 0, 0, defaultTileWidth, defaultTileHeight, menuXStart + index * defaultTileWidth, menuYStart, defaultTileWidth, defaultTileHeight);
    drawPrice(menuXStart, menuYStart, index, textAdditionHeight);
  }
}

function tryDetectMenuHover(menuXStart, menuYStart, index) {
  const rect = new Path2D();
  const textAdditionHeight = 30;
  rect.rect(menuXStart + defaultTileWidth * index, menuYStart, defaultTileWidth, defaultTileHeight + textAdditionHeight);
  if (ctx.isPointInPath(rect, cursorX, cursorY) && !isPicked && (userStatsProxy.userMoney - menuItemsList[index].price >= 0)) {
    ctx.fillStyle = '#cc0e0e61';
    menuHoverItem = menuItemsList[index].image;
  }
  else
    ctx.fillStyle = '#00000061';
  ctx.fill(rect);
}

let isPicked = false;
function tryDrawPicked() {
  if (isPicked) {
    const centeredX = cursorX - (defaultTileWidth / 2);
    const centeredY = cursorY - (defaultTileHeight / 2);

    ctx.globalAlpha = 0.4;
    ctx.drawImage(menuHoverItem, 0, 0, 128, 128, centeredX, centeredY, 128, 128);
    ctx.globalAlpha = 1;

    const towerData = getTowerInitValues();
    if (towerData) {
      drawRadius('rgba(137, 11, 11, 0.600)', centeredX + (defaultTileWidth / 2), centeredY + (defaultTileHeight / 2), towerData.attackRadius);
    }
  }
}


let cursorX = 0;
let cursorY = 0;


onMouseMove = (e) => {

  if (!isPicked)
    menuHoverItem = null;

  var rect = canvas.getBoundingClientRect();
  cursorX = e.clientX - rect.left;
  cursorY = e.clientY - rect.top;

}

onScroll = (e) => {
  hpMoneyContainer.style.top = 35 + scrollY + 'px';
  hpMoneyContainer.style.right = 75 - scrollX + 'px';
}

function createDemons(demonsAmount) {
  for (let index = 0; index < demonsAmount; index++) {
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
      moveSpeed: 10,
      totalHP: 500,
      turnArray: turnArray,
      reward: 75,
      damage: 5
    }));
    demonsList[index].id = index;
  }
}

function onKeyDown(e) {

  if (e.key === "Escape")
    isPicked = false;
}

let towerId = 0;

function onClick(e) {
  var rect = this.getBoundingClientRect();
  const clickIndexY = Math.round((e.clientY - rect.top - defaultTileHeight / 2) / defaultTileHeight);
  const clickIndexX = Math.round((e.clientX - rect.left - defaultTileWidth / 2) / defaultTileWidth);
  const offsetX = clickIndexX * defaultTileWidth;
  const offsetY = clickIndexY * defaultTileHeight;

  if (menuHoverItem != null && !isPicked) {
    isPicked = true;
    return;
  }

  if (isPicked) {
    if (!isEnoughMoney()) {
      return;
    }

    if (menuHoverItem == platformImage) {
      if (map[clickIndexY][clickIndexX].index == 0
        && !platformList?.find(platform => platform.x == offsetX && platform.y == offsetY)) {
        payPriceForNewItem();
        platformList.push({ x: offsetX, y: offsetY });
      }
      return;
    }


    const towerData = getTowerInitValues();

    if (isPlatformWithoutTower(clickIndexX, clickIndexY, offsetX, offsetY)) {
      payPriceForNewItem();
      createTower({
        image: menuHoverItem,
        offsetX: offsetX,
        offsetY: offsetY,
        startFrame: towerData.startFrame,
        framesAmount: towerData.framesAmount,
        frameRate: towerData.frameRate,
        width: defaultTileWidth,
        height: defaultTileHeight,
        attackDamage: towerData.attackDamage,
        attackRadius: towerData.attackRadius,
      })
    }
  }
}

function isEnoughMoney() {

  const userMoney = userStatsProxy.userMoney;
  if (userMoney - menuItemsList.find(item => item.image == menuHoverItem).price >= 0)
    return true;

  if (!moneyContainer.classList.contains('active')) {
    moneyContainer.classList.toggle('active');
  }
  return false;
}

onAnimationEnd = () => {
  moneyContainer.classList.remove('active');
};

function payPriceForNewItem() {
  const itemPrice = menuItemsList.find(item => item.image == menuHoverItem).price;
  userStatsProxy.userMoney = userStatsProxy.userMoney - itemPrice;
}

function getTowerInitValues() {
  let initData = {};
  switch (menuHoverItem) {
    case simplePlasmaTowerImage:
      {
        initData.startFrame = 0;
        initData.framesAmount = 10;
        initData.frameRate = 5;
        initData.attackDamage = 50;
        initData.attackRadius = 300;
      }
      break;
    case simpleCannonTowerImage:
      {
        initData.startFrame = 0;
        initData.framesAmount = 7;
        initData.frameRate = 5;
        initData.attackDamage = 30;
        initData.attackRadius = 275;
      }
      break;
    default:
      initData = null;
      break;
  }
  return initData;
}

function isPlatformWithoutTower(clickIndexX, clickIndexY, offsetX, offsetY) {
  return map[clickIndexY][clickIndexX].index == 0
    && platformList?.find(platform => platform.x == offsetX && platform.y == offsetY)
    && !towerList?.find(tower => tower.x == offsetX && tower.y == offsetY);
}

function createTower({ image, offsetX, offsetY, startFrame, framesAmount, frameRate, width, height, attackRadius, attackDamage }) {
  const tower = new Tower({
    image: image,
    id: towerId++,
    x: offsetX,
    y: offsetY,
    startFrame: startFrame,
    framesAmount: framesAmount,
    frameRate: frameRate,
    width: width,
    height: height,
    attackRadius: attackRadius,
    attackDamage: attackDamage,
  });
  towerList.push(tower);
}


function createImage(width, height, src) {
  const image = new Image(width, height);
  image.src = src;
  return image;
}

function initDemonImages() {
  for (let index = 0; index < 6; index++) {
    demonImageList.push(new Image(256, 256));
    demonImageList[index].src = `../sprites/demon/Walk${index + 1}.png`;
  }
}

function makeCanvasReadKeyboardClick() {
  canvas.tabIndex = 1000;
  canvas.style.outline = "none";
}
