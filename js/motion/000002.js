(function() {
  const MotionId = "000002";
  const MotionName = "サーベル斬撃";

  class Motion000002 {
    static initMotionState(unitData) {
      const spec = unitData.spec;
      const state = unitData.state;

      const mouse = unitData.input.getMouse();

      const rotateX = mouse.x - unitData.transform.x;
      const rotateY = mouse.y - unitData.transform.y;
      const unitRotate = Math.atan2(rotateY, rotateX);

      unitData.motion.option = {
        unitRotate: unitRotate
      }

      unitData.state.maxSpeed = {x: spec.dashSpeed, y: spec.jumpSpeed};
      unitData.state.dash = true;
    }

    static updateState(unitData) {
      const motion = unitData.motion;
      const speed = unitData.state.speed;
      const input = unitData.input;
      const spec = unitData.spec;

      const totalFrame = 30;

      speed.x *= 0.95;
      speed.y *= 0.95;

      if(motion.frame == totalFrame) {
        unitData.state.dash = false
        unitData.setMotion('000000');
      }

    }

    static attachTransform(unitData) {
      const motion = unitData.motion;

      const transformList = {
        body: new Transform(0, 0, 0, 1),
        armR: new Transform(0, 0, 0, 1),
        armL: new Transform(0, 0, 0, 1),
        shldR: new Transform(0, 0, 0, 1),
        shldL: new Transform(0, 0, 0, 1),
        legR: new Transform(0, 0, 0, 1),
        legL: new Transform(0, 0, 0, 1),
        back: new Transform(0, 0, 0, 1)
      }

      if(motion.frame <= 2) {
        this.getSlash1Transform(unitData, transformList);

      } else if(motion.frame <= 4) {
        this.getSlash2Transform(unitData, transformList);

      } else {
        this.getSlash3Transform(unitData, transformList);

      }

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

    static getSlash1Transform(unitData, transformList) {
      transformList.body.y = -10;
      transformList.body.rotate = 5;

      transformList.armR = new Transform(20, -15, -130, 1);
      transformList.armL = new Transform(5, 0, 60, 1);

      unitData.setJointTransform('handR', new Transform(0, 0, -60, 1));

      transformList.shldR = new Transform(5, -5, -25, 1);
      transformList.shldL = new Transform(-5, 0, -20, 1);

      transformList.legR = new Transform(-20, -5, -30, 1);
      transformList.legL = new Transform(15, 5, -140, 1);
    }

    static getSlash2Transform(unitData, transformList) {
      transformList.body.y = -5;

      transformList.armR = new Transform(-25, -5, 110, 1);
      transformList.armL = new Transform(20, -5, 35, 1);

      transformList.shldR = new Transform(-10, 0, -40, 1);
      transformList.shldL = new Transform(10, 0, -20, 1);

      transformList.legR = new Transform(-20, -5, -30, 1);
      transformList.legL = new Transform(15, 5, -140, 1);
    }

    static getSlash3Transform(unitData, transformList) {
      transformList.body.y = -5;
      transformList.body.rotate = -5;

      transformList.armR = new Transform(-20, 5, 35, 1);
      transformList.armL = new Transform(25, -10, 30, 1);

      transformList.shldR = new Transform(-10, 0, -50, 1);
      transformList.shldL = new Transform(10, 0, -20, 1);

      transformList.legR = new Transform(-20, 0, -10, 1);
      transformList.legL = new Transform(15, 10, -140, 1);
    }

  }

  MOTION_CLASS_LIST[MotionId] = Motion000002;
})();
