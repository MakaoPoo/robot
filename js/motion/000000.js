(function() {
  const MotionId = "000000";
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
        getWalkTransform(unitData, transformList);
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

  const getDashTransform = function(unitData, transformList) {
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

  const getStandTransform = function(unitData, transformList) {
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

  const getWalkTransform = function(unitData, transformList) {
    const animSpeed = 8;
    const frontAccel = unitData.getFrontAccel();

    if(frontAccel == 0) {
      getStandTransform(unitData, transformList);
      unitData.motion.moveFrame = 0;

    } else {
      const unitAngle = unitData.state.ground.angle * (unitData.isLeft()? 1: -1);
      transformList.armR = complementMotion([
        {frame: animSpeed * 0, transform: new Transform(10, 0, 50, 1)},
        {frame: animSpeed * 1, transform: new Transform(-10, -5, 70, 1)},
        {frame: animSpeed * 2, transform: new Transform(10, 0, 50, 1)},
        {frame: animSpeed * 3, transform: new Transform(30, -10, 20, 1)},
        {frame: animSpeed * 4, transform: new Transform(10, 0, 50, 1)},
      ], unitData.motion.moveFrame);

      transformList.armL = complementMotion([
        {frame: animSpeed * 0, transform: new Transform(10, 0, 50, 1)},
        {frame: animSpeed * 1, transform: new Transform(30, -10, 20, 1)},
        {frame: animSpeed * 2, transform: new Transform(10, 0, 50, 1)},
        {frame: animSpeed * 3, transform: new Transform(-10, -5, 70, 1)},
        {frame: animSpeed * 4, transform: new Transform(10, 0, 50, 1)},
      ], unitData.motion.moveFrame);

      transformList.shldR = complementMotion([
        {frame: animSpeed * 0, transform: new Transform(0, 0, -20, 1)},
        {frame: animSpeed * 1, transform: new Transform(-5, -5, -20, 1)},
        {frame: animSpeed * 2, transform: new Transform(0, 0, -20, 1)},
        {frame: animSpeed * 3, transform: new Transform(10, -5, -20, 1)},
        {frame: animSpeed * 4, transform: new Transform(0, 0, -20, 1)},
      ], unitData.motion.moveFrame);

      transformList.shldL = complementMotion([
        {frame: animSpeed * 0, transform: new Transform(0, 0, -20, 1)},
        {frame: animSpeed * 1, transform: new Transform(10, -5, -20, 1)},
        {frame: animSpeed * 2, transform: new Transform(0, 0, -20, 1)},
        {frame: animSpeed * 3, transform: new Transform(-5, -5, -20, 1)},
        {frame: animSpeed * 4, transform: new Transform(0, 0, -20, 1)},
      ], unitData.motion.moveFrame);

      if(frontAccel > 0) {
        transformList.body = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, unitAngle/2, 1)},
          {frame: animSpeed * 1, transform: new Transform(0, -10, unitAngle/2, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, unitAngle/2, 1)},
          {frame: animSpeed * 3, transform: new Transform(0, -15, unitAngle/2, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, unitAngle/2, 1)},
        ], unitData.motion.moveFrame);

        transformList.legR = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 1, transform: new Transform(25, -10, -80, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 3, transform: new Transform(-25, -5, 60, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
        ], unitData.motion.moveFrame);

        transformList.legL = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 1, transform: new Transform(-25, 0, 60, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 3, transform: new Transform(25, -10, -80, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
        ], unitData.motion.moveFrame);
      } if(frontAccel < 0) {
        transformList.body = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, unitAngle/2, 1)},
          {frame: animSpeed * 1, transform: new Transform(0, -5, unitAngle/2, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, unitAngle/2, 1)},
          {frame: animSpeed * 3, transform: new Transform(0, -5, unitAngle/2, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, unitAngle/2, 1)},
        ], unitData.motion.moveFrame);

        transformList.legR = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 1, transform: new Transform(20, -10, -30, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 3, transform: new Transform(-20, 5, 0, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
        ], unitData.motion.moveFrame);

        transformList.legL = complementMotion([
          {frame: animSpeed * 0, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 1, transform: new Transform(-20, 5, 0, 1)},
          {frame: animSpeed * 2, transform: new Transform(0, 0, 0, 1)},
          {frame: animSpeed * 3, transform: new Transform(20, -10, -30, 1)},
          {frame: animSpeed * 4, transform: new Transform(0, 0, 0, 1)},
        ], unitData.motion.moveFrame);
      }

      unitData.motion.moveFrame = loopIncrement(unitData.motion.moveFrame, animSpeed * 4);
    }

    return transformList;
  }

  ATTACH_MOTION[MotionId] = attachMotion;
})();
