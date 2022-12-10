
class Tower extends SpriteGeneralInfo {
  constructor({ x, y, startFrame, framesAmount, frameRate, height, width, attackRadius }) {
    super(x, y, startFrame, framesAmount, frameRate, height, width);
    this.attackRadius = attackRadius;
  }
  angle = 0;
  attackRadius = 150;
  attackTarget = null;
  animate() {
    this.changeFrameCount++;
    this.tryChangeAnimationFrame();
    return this.tryRestartAnimation();
  }

  tryChangeAnimationFrame() {
    if (this.frameRate == this.changeFrameCount) {
      this.frame++;
      this.changeFrameCount = 0;
    }
  }

  tryRestartAnimation() {
    if (this.frame > this.framesAmount) {
      this.frame = this.startFrame;
      return true;
    }
    return false;
  }

  update() {
    if (this.target)
      this.attack();
  }


  attack() {
    if (Math.abs(tower.target.x + tower.target.width * 0.5 - tower.x) > tower.radius
      || Math.abs(tower.target.y + tower.target.height * 0.5 - tower.y) > tower.radius) {
      const dead = tower.target;
      for (const t of towerList) {
        if (this.target === dead) {
          this.target = null;
          tower.frame = tower.startFrame;

        }

      }
    }
    else {
      tower.angle = Math.atan2(tower.target.y + tower.target.height / 2 - tower.y, tower.target.x + tower.target.width / 2 - tower.x);
      tower.angle = tower.angle * (180 / Math.PI);

      if (tower.animate()) {
        tower.target.currentHp = tower.target.currentHp - 25;
        if (tower.target.currentHp <= 0) {
          const dead = tower.target;
          for (const t of towerList) {
            if (t.target === dead) {
              t.frame = t.startFrame;
              t.target = null;
              t.animate()
            }
          }
          demonsList.splice(demonsList.findIndex(demon => demon.id == dead.id), 1);
        }

      }

    }
  }




}
