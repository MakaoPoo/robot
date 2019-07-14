(function() {
  const MotionId = "000001";
  const MotionName = "ステップ";

  class Motion000001 {
    static initMotionState(unitData) {
      const spec = unitData.spec;

      unitData.motion.option = {
        dash: true
      }

      unitData.state.maxSpeed = {x: spec.stepSpeed, y: 0};
      unitData.state.dash = true;
    }

    static updateState(unitData) {
      const motion = unitData.motion;
      const speed = unitData.state.speed;
      const input = unitData.input;
      const spec = unitData.spec;

      const stepFrame = 20;

      console.log(motion.frame);
      if(motion.frame == 0) {
      }

      speed.y = 0;

      const deceleration = (spec.stepSpeed - 4) / stepFrame;
      let stepSpeed = spec.stepSpeed - motion.frame * deceleration;

      if(input.getLongPressKeyFrame('left') != motion.frame
      && input.getLongPressKeyFrame('right') != motion.frame) {
        motion.option.dash = false;
      }

      if(motion.option.dash && stepSpeed < spec.dashSpeed) {
        stepSpeed = spec.dashSpeed;
      }

      if(motion.option.dirLeft) {
        speed.x = -stepSpeed;
      } else {
        speed.x = stepSpeed;
      }

      if(motion.frame == stepFrame) {
        unitData.state.dash = motion.option.dash;
        unitData.setMotion('000000');
      }

      if(input.getKeyFlag('up') && !input.getKeyFlag('down')) {
        unitData.state.dash = true;
        if(!motion.option.dash) {
          speed.y = -spec.jumpSpeed;
        }
        unitData.setMotion('000000');
      }

    }

    static attachTransform(unitData) {
      const motion = unitData.motion;

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

      this.getDashTransform(unitData, transformList);

      unitData.setJointTransform('body', transformList.body);
      unitData.setJointTransform('armR', transformList.armR);
      unitData.setJointTransform('armL', transformList.armL);
      unitData.setJointTransform('shldR', transformList.shldR);
      unitData.setJointTransform('shldL', transformList.shldL);
      unitData.setJointTransform('legR', transformList.legR);
      unitData.setJointTransform('legL', transformList.legL);
      unitData.setJointTransform('back', transformList.back);

      motion.frame += 1;
    }

    static getDashTransform(unitData, transformList) {
      transformList.body.y = -10;

      const frontSpeed = unitData.getFrontSpeed();

      if(frontSpeed >= 0) {
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
      } else {
        transformList.shldL.x = 5;
        transformList.armL.x = 20;

        transformList.legR.x = -20;
        transformList.legR.y = -5;
        transformList.legR.rotate = -10;

        transformList.legL.x = -5;
        transformList.legL.rotate = -40;
      }
    }

  }

  MOTION_CLASS_LIST[MotionId] = Motion000001;
})();
