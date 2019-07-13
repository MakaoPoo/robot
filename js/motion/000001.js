(function() {
  const MotionId = "000001";
  const MotionName = "ステップ";

  const attachMotion = function(unitData) {
    const motion = unitData.motion;
    const speed = unitData.state.speed;

    speed.y = 0;
    unitData.state.maxSpeed = {x: 25, y: 0};

    const input = unitData.input;


    if(input.getLongPressKeyFrame('left') != motion.frame
    && input.getLongPressKeyFrame('right') != motion.frame) {
      motion.option.dash = false;
    }

    let stepSpeed = 25 - motion.frame * 1;
    if(motion.option.dash && stepSpeed < 15) {
      stepSpeed = 15;
    }

    if(motion.option.dirLeft) {
      speed.x = -stepSpeed;
    } else {
      speed.x = stepSpeed;
    }

    motion.moveFrame = 0;

    if(motion.frame == 20) {
      unitData.state.maxSpeed = {x: 15, y: 15};
      unitData.state.dash = motion.option.dash;
      unitData.setMotion(null, {});
    }


    if(input.getKeyFlag('up') && !input.getKeyFlag('down')) {
      unitData.state.maxSpeed = {x: 15, y: 15};
      unitData.state.dash = true;
      if(!motion.option.dash) {
        speed.y = -15;
      }
      unitData.setMotion(null, {});
    }

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

    getDashTransform(unitData, transformList);

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

  const getDashTransform = function(unitData, transformList) {
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

  ATTACH_MOTION[MotionId] = attachMotion;
})();
