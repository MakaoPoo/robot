(function() {
  const PartsType = "leg";
  const PartsId = "001";
  const PartsName = "エピオン";

  class Leg001 {
    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();
      this.groundR = 22;

      this.loadImage();
    }

    loadImage() {
      const src = "resource/parts/" + PartsType + "/" + PartsId +".png";
      this.imageSrc.src = src;
      this.imageSrc.onload = function() {
      }
    }

    getVtxList() {
      const vtxList = [
        {
          imagePos: {x: 0, y: 0, w: 64, h: 32},
          hitbox: {x: 12, y: 10, w: 46, h: 18},
          pivot: {x: 43, y: 9}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      // const speed = unitData.state.speed;
      //
      // const speedX = Math.abs(speed.x);
      // let legR = new Transform(0, 0, 0, 1);
      // let legL = new Transform(0, 0, 0, 1);
      //
      // if(speedX == 0) {
      //   legR.x = -5;
      //   legR.rotate = -70;
      //   legL.x = 5;
      //   legL.rotate = -80;
      //   unitData.setJointTransform('body', new Transform(0, -10, 0, 1));
      // } else {
      //   if((Math.sign(speed.x) < 0) == unitData.state.dirLeft) {
      //     legR.x = 20;
      //     legR.y = -5;
      //     legR.rotate = -140;
      //     legL.x = 0;
      //     legL.rotate = -120;
      //     unitData.setJointTransform('body', new Transform(0, -10, 0, 1));
      //   } else {
      //     legR.x = -20;
      //     legR.y = -5;
      //     legR.rotate = -10;
      //     legL.x = 0;
      //     legL.rotate = -50;
      //     unitData.setJointTransform('body', new Transform(0, -10, 0, 1));
      //   }
      // }
      //
      // if(unitData.state.ground.flag && speedX == 0) {
      //   unitData.setJointTransform('body', new Transform(0, 0, 0, 1));
      //   const groundLegAngle = unitData.state.ground.angle * (unitData.state.dirLeft? 1: -1);
      //   if(groundLegAngle > 0) {
      //     legR.x = 5;
      //     legL.x = -5;
      //   } else {
      //     legR.x = -5;
      //     legL.x = 5;
      //   }
      //   legR.rotate = groundLegAngle;
      //   legL.rotate = groundLegAngle;
      // }
      //
      // unitData.setJointTransform('legR', legR);
      // unitData.setJointTransform('legL', legL);
    }

    getImageList(unitData) {
      const legRTransform = unitData.getJointGlobalTransform('legR');
      const legLTransform = unitData.getJointGlobalTransform('legL');

      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(legRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [100, 100]
        },
        {
          id: [0, 0],
          transform: addTransform(legLTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [-100, -100]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Leg001;
})();
