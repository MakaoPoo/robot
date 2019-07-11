(function() {
  const MotionId = "move";
  const MotionName = "移動";

  const attachMotion = function(unitData) {
    const speed = unitData.state.speed;
    const speedX = Math.abs(speed.x);

    const body = new Transform(0, 0, 0, 1);

    unitData.setJointTransform('body', body);

    const armR = new Transform(0, 0, 0, 1);
    const armL = new Transform(0, 0, 0, 1);

    armL.x = 10;
    armL.rotate = 50;
    armR.x = 10;
    armR.rotate = 50;

    // const aimX = unitData.input.mouse.x - unitData.transform.x;
    // const aimY = unitData.input.mouse.y - unitData.transform.y;
    // let aimRotate = getDeg(Math.atan2(aimY, aimX)) - 90;
    // if(!unitData.state.dirLeft) {
    //   aimRotate *= -1;
    // }
    //
    // const rotateArm = rotateVec(10, 0, getDeg(Math.atan2(aimY, aimX)));
    // armR.x = -Math.abs(rotateArm.x);
    // armR.y = -10 + rotateArm.y;
    // armR.rotate = aimRotate;
    //
    unitData.setJointTransform('armR', armR);
    unitData.setJointTransform('armL', armL);

    const shldR = new Transform(0, 0, 0, 1);
    const shldL = new Transform(0, 0, 0, 1);

    shldR.rotate = -10;
    shldL.rotate = -10;

    unitData.setJointTransform('shldR', shldR);
    unitData.setJointTransform('shldL', shldL);

    const back = new Transform(0, 0, 0, 1);

    unitData.setJointTransform('back', back);
  }

  ATTACH_MOTION[MotionId] = attachMotion;
})();
