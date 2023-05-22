
// class Tower extends SpriteGeneralInfo {
//   constructor({ image, id, x, y, startFrame, framesAmount, frameRate, height, width, attackRadius, attackDamage }) {
//     super(id, x, y, startFrame, framesAmount, frameRate, height, width);
//     this.attackRadius = attackRadius;
//     this.attackDamage = attackDamage;
//     this.image = image;
//     this.circle = new Path2D();
//     this.circle.arc(this.center.x, this.center.y, this.attackRadius, 0, 2 * Math.PI);
//   }
//   circle;
//   image;
//   angle = 0;
//   attackDamage = 0;
//   attackRadius = 0;
//   attackattackTarget = null;
//   audioList = [];

//   animate() {
//     this.changeFrameCount++;
//     this.tryChangeAnimationFrame();
//     return this.tryRestartAnimation();
//   }

//   tryChangeAnimationFrame() {
//     if (this.frameRate == this.changeFrameCount) {
//       this.currentFrame++;
//       this.changeFrameCount = 0;
//     }
//   }

//   tryRestartAnimation() {
//     if (this.currentFrame == this.framesAmount) {
//       this.currentFrame = this.startFrame;
//       return true;
//     }
//     return false;
//   }

//   update() {

//     if (this.attackTarget != null)
//       this.attack();
//     else
//       this.searchAttackTarget();
//     const spriteStartAngle = 90;
//     drawRotatedImage(this.image, this.center.x, this.center.y, this.currentFrame * this.width, 0, this.angle + spriteStartAngle, this.width, 128, -(this.width / 2), -(this.height / 2), 128, 128);
//   }


//   attack() {
//     if (!this.isInAttackRadius()) {
//       this.attackTarget = null;
//       this.currentFrame = this.startFrame;
//     }
//     else {
//       this.fireAndRotate();
//     }
//   }

//   isInAttackRadius() {
//     return ctx.isPointInPath(this.circle, this.attackTarget.center.x, this.attackTarget.center.y)
//   }

//   fireAndRotate() {
//     this.angle = this.getAngleToattackTarget();
//     if (this.animate()) {
//       this.playShotAudio();
//       this.attackTarget.currentHp = this.attackTarget.currentHp - this.attackDamage;
//       if (this.attackTarget.currentHp <= 0) {
//         this.onEnemyDeath();
//       }
//     }
//   }

//   onEnemyDeath() {
//     const target = this.attackTarget;
//     userStatsProxy.userMoney = userStatsProxy.userMoney + target.reward;
//     demonsList.splice(demonsList.findIndex(demon => demon.id == this.attackTarget.id), 1);
//     for (const tower of towerList) {
//       if (tower.attackTarget == target) {
//         tower.currentFrame = tower.startFrame;
//         tower.attackTarget = null;
//         tower.animate()
//       }
//     }
//   }

//   searchAttackTarget() {
//     for (const demon of demonsList) {
//       if (ctx.isPointInPath(this.circle, demon.center.x, demon.center.y)) {
//         this.attackTarget = demon;
//         this.currentFrame = this.startFrame;
//         return;
//       }
//     }
//   }

//   getAngleToattackTarget() {
//     let angle = Math.atan2(this.attackTarget.center.y - this.center.y, this.attackTarget.center.x - this.center.x);
//     return angle * (180 / Math.PI);
//   }

//   playShotAudio() {
//     if (sound)
//       switch (this.image) {
//         case simplePlasmaTowerImage:
//           smPlasmaCannonAudio.load()
//           smPlasmaCannonAudio.play().catch(e => e);
//           break;
//         case simpleCannonTowerImage:
//           smCannonAudio.load();
//           smCannonAudio.play().catch(e => e);
//           break;
//         default:
//           break;
//       }
//   }
// }
