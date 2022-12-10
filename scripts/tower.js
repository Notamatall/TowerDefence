
class Tower extends SpriteGeneralInfo {
  constructor({ id, x, y, startFrame, framesAmount, frameRate, height, width, attackRadius, attackDamage }) {
    super(id, x, y, startFrame, framesAmount, frameRate, height, width);
    this.attackRadius = attackRadius;
    this.attackDamage = attackDamage;
  }
  angle = 0;
  attackDamage = 0;
  attackRadius = 150;
  attackattackTarget = null;

  animate() {
    this.changeFrameCount++;
    this.tryChangeAnimationFrame();
    return this.tryRestartAnimation();
  }

  tryChangeAnimationFrame() {
    if (this.frameRate == this.changeFrameCount) {
      this.currentFrame++;
      this.changeFrameCount = 0;
    }
  }

  tryRestartAnimation() {
    if (this.currentFrame == this.framesAmount) {
      this.currentFrame = this.startFrame;
      return true;
    }
    return false;
  }

  update() {
    if (this.attackTarget != null)
      this.attack();
    else if (this.attackTarget == null) {
      this.searchAttackTarget();
    }

    const spriteStartAngle = 90;
    this.drawRadius();

    drawRotatedImage(towerImage, this.center.x, this.center.y, this.currentFrame * this.width, 0, this.angle + spriteStartAngle, this.width, 128, -(this.width / 2), -(this.height / 2), 128, 128);
  }

  drawRadius() {
    ctx.strokeStyle = 'rgba(137, 11, 11, 0.350)';
    ctx.beginPath();
    ctx.roundRect(this.center.x - this.attackRadius, this.center.y - this.attackRadius, this.attackRadius * 2, this.attackRadius * 2, 360);
    ctx.stroke();
  }

  attack() {

    if (this.isInAttackRadius()) {
      this.attackTarget = null;
      this.currentFrame = this.startFrame;
    }
    else
      this.fireAndRotate();

  }


  isInAttackRadius() {
    if (Math.abs(this.attackTarget.x + this.attackTarget.width * 0.5 - this.center.x) > this.attackRadius
      || Math.abs(this.attackTarget.y + this.attackTarget.height * 0.5 - this.center.y) > this.attackRadius) {
      return true;
    }
    return false;
  }
  fireAndRotate() {
    this.angle = this.getAngleToattackTarget();
    if (this.animate()) {
      this.attackTarget.currentHp = this.attackTarget.currentHp - this.attackDamage;
      if (this.attackTarget.currentHp <= 0) {
        const target = this.attackTarget;
        demonsList.splice(demonsList.findIndex(demon => demon.id == this.attackTarget.id), 1);
        for (const tower of towerList) {
          if (tower.attackTarget == target) {
            tower.currentFrame = tower.startFrame;
            tower.attackTarget = null;
            tower.animate()
          }
        }
      }
    }
  }
  searchAttackTarget() {
    for (const demon of demonsList) {
      if (Math.abs(demon.x + demon.width * 0.5 - this.center.x) < this.attackRadius
        && Math.abs(demon.y + demon.height * 0.5 - this.center.y) < this.attackRadius) {

        this.attackTarget = demon;
        this.currentFrame = this.startFrame;
      }
    }
  }

  getAngleToattackTarget() {

    let angle = Math.atan2(this.attackTarget.center.y - this.center.y, this.attackTarget.center.x - this.center.x);

    return angle * (180 / Math.PI);
  }

}
