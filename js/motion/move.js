(function() {
  const MotionId = "move";
  const MotionName = "移動";

  const attachMotion = function(unitData) {
    const speed = unitData.state.speed;
    const speedX = Math.abs(speed.x);

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
      unitData.state.maxSpeed = {x: 15, y: 15};
    } else {
      unitData.state.maxSpeed = {x: 6, y: 15};
    }

    if(unitData.state.dash) {
      getDashTransform(unitData, transformList);
    } else {
      if(unitData.state.ground.flag) {
        if(speedX == 0) {
          getStandTransform(unitData, transformList);

          unitData.motion.moveFrame = 0;
        } else {

          getWalkTransform(unitData, transformList);

          unitData.motion.moveFrame = (unitData.motion.moveFrame + 1) % 32;
        }
      } else {
        getFlowTransform(unitData, transformList);
      }
    }


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

    unitData.setJointTransform('body', transformList.body);
    unitData.setJointTransform('armR', transformList.armR);
    unitData.setJointTransform('armL', transformList.armL);
    unitData.setJointTransform('shldR', transformList.shldR);
    unitData.setJointTransform('shldL', transformList.shldL);
    unitData.setJointTransform('legR', transformList.legR);
    unitData.setJointTransform('legL', transformList.legL);
    unitData.setJointTransform('back', transformList.back);
  }

  const getFlowTransform = function(unitData, transformList) {
    transformList.body.y = -10;

    transformList.armR.x = 10;
    transformList.armR.y = -5;
    transformList.armR.rotate = 30;
    transformList.armL.x = 10;
    transformList.armL.y = -5;
    transformList.armL.rotate = 30;

    transformList.legR.x = -5;
    transformList.legR.y = -10;
    transformList.legR.rotate = -60;

    transformList.legL.x = 0;
    transformList.legL.y = -5;
    transformList.legL.rotate = -100;
  }

  const getDashTransform = function(unitData, transformList) {
    transformList.body.y = -10;

    if(unitData.isForwardMove()) {
      transformList.shldR.x = 5;
      transformList.armR.x = 15;
      transformList.shldL.x = 5;
      transformList.armL.x = 15;

      transformList.legR.x = 20;
      transformList.legR.y = -5;
      transformList.legR.rotate = -140;

      transformList.legL.x = 0;
      transformList.legL.rotate = -120;
    } else {
      transformList.shldL.x = 5;
      transformList.armL.x = 20;

      transformList.legR.x = -25;
      transformList.legR.y = -5;
      transformList.legR.rotate = -10;

      transformList.legL.x = -5;
      transformList.legL.rotate = -40;
    }
  }

  const getStandTransform = function(unitData, transformList) {
    const groundLegAngle = unitData.state.ground.angle * (unitData.state.dirLeft? 1: -1);
    if(groundLegAngle > 0) {
      transformList.legR.x = 5;
      transformList.legL.x = -5;
    } else {
      transformList.legR.x = -5;
      transformList.legL.x = 5;
    }
    transformList.legR.rotate = groundLegAngle;
    transformList.legL.rotate = groundLegAngle;
  }

  const getWalkTransform = function(unitData, transformList) {
    transformList.armR = complementMotion({
      0: new Transform(10, 0, 50, 1),
      8: new Transform(-10, -5, 70, 1),
      16: new Transform(10, 0, 50, 1),
      24: new Transform(30, -10, 20, 1),
      32: new Transform(10, 0, 50, 1),
    }, unitData.motion.moveFrame);

    transformList.armL = complementMotion({
      0: new Transform(10, 0, 50, 1),
      8: new Transform(30, -10, 20, 1),
      16: new Transform(10, 0, 50, 1),
      24: new Transform(-10, -5, 70, 1),
      32: new Transform(10, 0, 50, 1),
    }, unitData.motion.moveFrame);

    transformList.shldR = complementMotion({
      0: new Transform(0, 0, -20, 1),
      8: new Transform(-5, -5, -20, 1),
      16: new Transform(0, 0, -20, 1),
      24: new Transform(10, -5, -20, 1),
      32: new Transform(0, 0, -20, 1),
    }, unitData.motion.moveFrame);

    transformList.shldL = complementMotion({
      0: new Transform(0, 0, -20, 1),
      8: new Transform(10, -5, -20, 1),
      16: new Transform(0, 0, -20, 1),
      24: new Transform(-5, -5, -20, 1),
      32: new Transform(0, 0, -20, 1),
    }, unitData.motion.moveFrame);

    if(unitData.isForwardMove()) {
      transformList.body = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(0, -15, 0, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(0, -10, 0, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);

      transformList.legR = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(-25, -5, 60, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(25, -10, -80, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);

      transformList.legL = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(25, -10, -80, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(-25, 0, 60, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);
    } else {
      transformList.body = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(0, -5, 0, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(0, -5, 0, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);

      transformList.legR = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(20, -10, -30, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(-20, 5, 0, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);

      transformList.legL = complementMotion({
        0: new Transform(0, 0, 0, 1),
        8: new Transform(-20, 5, 0, 1),
        16: new Transform(0, 0, 0, 1),
        24: new Transform(20, -10, -30, 1),
        32: new Transform(0, 0, 0, 1),
      }, unitData.motion.moveFrame);
    }

    return transformList;
  }

  ATTACH_MOTION[MotionId] = attachMotion;
})();
