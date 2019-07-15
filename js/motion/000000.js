(function() {
  const MotionId = "000000";
  const MotionName = "移動";

  class Motion000000 {
    static initMotionState(unitData) {
      const spec = unitData.spec;

      unitData.motion.option = {
      }

      if(unitData.state.dash) {
        unitData.state.maxSpeed = {x: spec.dashSpeed, y: spec.jumpSpeed};
      } else {
        unitData.state.maxSpeed = {x: spec.walkSpeed, y: spec.jumpSpeed};
      }
    }

    static updateState(unitData) {
      const spec = unitData.spec;

      if(unitData.state.dash) {
        unitData.state.maxSpeed = {x: spec.dashSpeed, y: spec.jumpSpeed};
      } else {
        unitData.state.maxSpeed = {x: spec.walkSpeed, y: spec.jumpSpeed};
      }

      this.updateForKey(unitData);
    }

    static updateForKey(unitData) {
      const state = unitData.state;
      const spec = unitData.spec;
      const input = unitData.input;

      const leftKey = input.getKeyFlag('left');
      const rightKey = input.getKeyFlag('right');
      const upKey = input.getKeyFlag('up');
      const downKey = input.getKeyFlag('down');

      if(leftKey && rightKey) {
        let breakAccel;
        if(unitData.isGround() && !unitData.isDash()) {
          breakAccel = spec.walkAccel;
        } else {
          breakAccel = spec.dashAccel;
        }
        if(state.speed.x > 1) {
          state.accel.x -= breakAccel;
        }
        if(state.speed.x < -1) {
          state.accel.x += breakAccel;
        }
        if(Math.abs(state.speed.x) < 5) {
          state.dash = false;
        }
      } else {
        if(leftKey) {
          if(unitData.isGround() && !unitData.isDash()) {
            state.accel.x -= spec.walkAccel;
          } else {
            state.accel.x -= spec.dashAccel;
            if(unitData.isDash()) {
              state.accel.y -= GRAVITY / 2;
            }
          }
        } else if(rightKey) {
          if(unitData.isGround() && !unitData.isDash()) {
            state.accel.x += spec.walkAccel;
          } else {
            state.accel.x += spec.dashAccel;
            if(unitData.isDash()) {
              state.accel.y -= GRAVITY / 2;
            }
          }
        } else {
          if(unitData.isGround() && Math.abs(state.speed.x) < 0.5) {
            state.dash = false;
          }
        }
      }

      if(upKey && !downKey) {
        if(!unitData.isDash() && unitData.isGround() && input.getLongPressKeyFrame('up') == 0) {
          state.accel.y -= spec.jumpSpeed;
        }

        if(!leftKey && !rightKey) {
          if(state.speed.x > 1) {
            state.accel.x -= spec.dashAccel;
          }
          if(state.speed.x < -1) {
            state.accel.x += spec.dashAccel;
          }
          if(Math.abs(state.speed.x) < 5) {
            state.dash = false;
          }

        }

        state.ground.flag = false;
        state.accel.y -= GRAVITY + 1;
      } else if(downKey && !upKey) {
        // state.accel.y += 2 - GRAVITY;
      }

      if(!upKey && !unitData.isDash()) {
        const attractionSpeed = state.ground.attraction * Math.abs(state.speed.x);
        if(state.speed.y > 0 && state.speed.y < attractionSpeed) {
          state.speed.y = attractionSpeed;
        }
      }

      state.speed.y += GRAVITY;
    }

    static attachTransform(unitData) {
      const spec = unitData.spec;

      const transformList = {
        body: new Transform(0, 0, 0, 1),
        armR: new Transform(10, 0, 50, 1),
        armL: new Transform(10, 0, 50, 1),
        shldR: new Transform(0, 0, -20, 1),
        shldL: new Transform(0, 0, -20, 1),
        legR: new Transform(0, 0, 0, 1),
        legL: new Transform(0, 0, 0, 1),
        back: new Transform(0, 0, 0, 1)
      }

      if(unitData.state.dash) {
        this.getDashTransform(unitData, transformList);
      } else {
        if(unitData.state.ground.flag) {
          const animSpeed = 9 - Math.floor(spec.walkSpeed / 5);
          unitData.motion.option.animSpeed = animSpeed;
          this.getWalkTransform(unitData, transformList);
          unitData.motion.moveFrame = loopIncrement(unitData.motion.moveFrame, animSpeed * 4);
        } else {
          this.getFlowTransform(unitData, transformList);
        }
      }

      unitData.setJointTransform('body', transformList.body);
      unitData.setJointTransform('armR', transformList.armR);
      unitData.setJointTransform('armL', transformList.armL);
      unitData.setJointTransform('shldR', transformList.shldR);
      unitData.setJointTransform('shldL', transformList.shldL);
      unitData.setJointTransform('legR', transformList.legR);
      unitData.setJointTransform('legL', transformList.legL);
      unitData.setJointTransform('back', transformList.back);

      // const aimX = unitData.input.mouse.x - unitData.transform.x;
      // const aimY = unitData.input.mouse.y - unitData.transform.y;
      // let aimRotate = getDeg(Math.atan2(aimY, aimX)) - 90;
      // if(!unitData.state.dirLeft) {
      //   aimRotate *= -1;
      // }
      // aimRotate -= 20;
      //
      // const rotateArm = rotateVec(15, 0, getDeg(Math.atan2(aimY, aimX)));
      // armR.x = 5 -Math.abs(rotateArm.x);
      // armR.y = -10 + rotateArm.y;
      // armR.rotate = aimRotate;
      // shldR.x = 8 -Math.abs(rotateArm.x) * 0.5;
      // shldR.y = -5 + rotateArm.y * 0.5;
      // shldR.rotate = -10 - rotateArm.y * 1.5;
    }

    static getFlowTransform(unitData, transformList) {
      transformList.body.y = -10;

      transformList.armR.x = 10;
      transformList.armR.y = -5;
      transformList.armR.rotate = 30;
      transformList.armL.x = 10;
      transformList.armL.y = -5;
      transformList.armL.rotate = 30;

      const frontSpeed = unitData.getFrontSpeed();
      const accelDir = unitData.getFrontAccel();

      if(frontSpeed >= 1) {
        transformList.legR.x = -5;
        transformList.legR.y = -5;
        transformList.legR.rotate = -80;

        transformList.legL.x = 10;
        transformList.legL.y = -5;
        transformList.legL.rotate = -100;

      } else if(frontSpeed <= -1) {
        transformList.legR.x = -15;
        transformList.legR.y = -5;
        transformList.legR.rotate = -40;

        transformList.legL.x = 0;
        transformList.legL.y = -5;
        transformList.legL.rotate = -60;

      } else {
        transformList.legR.x = -10;
        transformList.legR.y = -5;
        transformList.legR.rotate = -60;

        transformList.legL.x = 5;
        transformList.legL.y = -5;
        transformList.legL.rotate = -80;

      }
    }

    static getDashTransform(unitData, transformList) {
      transformList.body.y = -10;

      const frontSpeed = unitData.getFrontSpeed();
      const accelDir = unitData.getFrontAccel();

      if(accelDir > 0 || (accelDir == 0 && frontSpeed >= 6)) {
        transformList.shldR.x = 5;
        transformList.armR.x = 15;
        transformList.shldL.x = 5;
        transformList.armL.x = 15;

        transformList.legR.x = 20;
        transformList.legR.y = 0;
        transformList.legR.rotate = -140;

        transformList.legL.x = 0;
        transformList.legL.y = 10;
        transformList.legL.rotate = -120;
      } else if(accelDir == -1 || (accelDir == 0 && frontSpeed <= -6)) {
        transformList.shldL.x = 5;
        transformList.armL.x = 20;

        transformList.legR.x = -20;
        transformList.legR.y = -5;
        transformList.legR.rotate = -10;

        transformList.legL.x = -5;
        transformList.legL.rotate = -40;
      } else {
        transformList.armR.x = 10;
        transformList.armR.y = -5;

        transformList.armL.x = 15;
        transformList.armL.y = -5;

        transformList.legR.x = -10;
        transformList.legR.y = -5;
        transformList.legR.rotate = -60;

        transformList.legL.x = 5;
        transformList.legL.y = -5;
        transformList.legL.rotate = -80;
      }
    }

    static getStandTransform(unitData, transformList) {
      const unitAngle = unitData.state.ground.angle * (unitData.isLeft()? 1: -1) / 2;

      transformList.body.rotate = unitAngle;

      if(unitAngle > 0) {
        transformList.legR.x = 5;
        transformList.legL.x = -5;
      } else {
        transformList.legR.x = -5;
        transformList.legL.x = 5;
      }

      transformList.legR.rotate = unitAngle;
      transformList.legL.rotate = unitAngle;
    }

    static getWalkTransform(unitData, transformList) {
      const frontAccel = unitData.getFrontAccel();

      if(frontAccel == 0) {
        this.getStandTransform(unitData, transformList);
        unitData.motion.moveFrame = 0;

      } else {
        const moveFrame = unitData.motion.moveFrame;
        const animSpeed = unitData.motion.option.animSpeed;

        const unitAngle = unitData.state.ground.angle * (unitData.isLeft()? 1: -1);
        transformList.armR = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(10, 0, 50, 1)},
          {frame: animSpeed * 1, transform: new Transform(-10, -5, 70, 1)},
          {frame: animSpeed * 2, transform: new Transform(10, 0, 50, 1)},
          {frame: animSpeed * 3, transform: new Transform(30, -10, 20, 1)},
          {frame: animSpeed * 4, transform: new Transform(10, 0, 50, 1)},
        ], moveFrame);

        transformList.armL = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(10, 0, 50, 1)},
          {frame: animSpeed * 1, transform: new Transform(30, -10, 20, 1)},
          {frame: animSpeed * 2, transform: new Transform(10, 0, 50, 1)},
          {frame: animSpeed * 3, transform: new Transform(-10, -5, 70, 1)},
          {frame: animSpeed * 4, transform: new Transform(10, 0, 50, 1)},
        ], moveFrame);

        transformList.shldR = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, -20, 1)},
          {frame: animSpeed * 1, transform: new Transform(-5, -5, -20, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, -20, 1)},
          {frame: animSpeed * 3, transform: new Transform(10, -5, -20, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, -20, 1)},
        ], moveFrame);

        transformList.shldL = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, -20, 1)},
          {frame: animSpeed * 1, transform: new Transform(10, -5, -20, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, -20, 1)},
          {frame: animSpeed * 3, transform: new Transform(-5, -5, -20, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, -20, 1)},
        ], moveFrame);

        if(frontAccel > 0) {
          transformList.body = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, unitAngle/2, 1)},
            {frame: animSpeed * 1, transform: new Transform(0, -10, unitAngle/2, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, unitAngle/2, 1)},
            {frame: animSpeed * 3, transform: new Transform(0, -15, unitAngle/2, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, unitAngle/2, 1)},
          ], moveFrame);

          transformList.legR = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 1, transform: new Transform(25, -10, -80, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 3, transform: new Transform(-25, -5, 60, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
          ], moveFrame);

          transformList.legL = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 1, transform: new Transform(-25, 0, 60, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 3, transform: new Transform(25, -10, -80, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
          ], moveFrame);
        } if(frontAccel < 0) {
          transformList.body = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, unitAngle/2, 1)},
            {frame: animSpeed * 1, transform: new Transform(0, -5, unitAngle/2, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, unitAngle/2, 1)},
            {frame: animSpeed * 3, transform: new Transform(0, -5, unitAngle/2, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, unitAngle/2, 1)},
          ], moveFrame);

          transformList.legR = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 1, transform: new Transform(20, -10, -30, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 3, transform: new Transform(-20, 5, 0, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
          ], moveFrame);

          transformList.legL = complementMotion([
            {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 1, transform: new Transform(-20, 5, 0, 1)},
            {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
            {frame: animSpeed * 3, transform: new Transform(20, -10, -30, 1)},
            {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
          ], moveFrame);
        }

      }

      return transformList;
    }

  }

  MOTION_CLASS_LIST[MotionId] = Motion000000;
})();
