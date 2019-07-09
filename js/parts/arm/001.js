(function() {
  const PartsType = "arm";
  const PartsId = "001";
  const PartsName = "デスティニー";

  class Arm001 {
    id
    name
    imageSrc
    vtxList
    joint

    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();
      this.joint = {
        handR: {x: 0, y: 37, parent: 'armR'},
        handL: {x: 0, y: 37, parent: 'armL'},
      };

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
          imagePos: {x: 0, y: 0, w: 32, h: 72},
          hitbox: {x: 5, y: 17, w: 15, h: 48},
          pivot: {x: 15, y: 21}
        },
        {
          imagePos: {x: 32, y: 0, w: 32, h: 72},
          hitbox: {x: 5, y: 17, w: 15, h: 48},
          pivot: {x: 15, y: 21}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const speed = unitData.state.speed;

      const speedX = Math.abs(speed.x);
      const armR = new Transform(0, 0, 0, 1);
      const armL = new Transform(0, 0, 0, 1);

      const aimX = unitData.input.mouse.x - unitData.transform.x;
      const aimY = unitData.input.mouse.y - unitData.transform.y;
      let aimRotate = getDeg(Math.atan2(aimY, aimX)) - 90;
      if(!unitData.state.dirLeft) {
        aimRotate *= -1;
      }

      const rotateArm = rotateVec(10, 0, getDeg(Math.atan2(aimY, aimX)));
      armR.x = -Math.abs(rotateArm.x);
      armR.y = -10 + rotateArm.y;
      armR.rotate = aimRotate;

      if(speedX == 0) {
        armL.x = 10;
        armL.rotate = 50;
      } else {
        armL.x = 15;
        armL.y = -5;
        armL.rotate = 20;
      }

      unitData.setJointTransform('armR', armR);
      unitData.setJointTransform('armL', armL);
    }

    getImageList(unitData) {
      const armRTransform = unitData.getJointTransform('armR');
      const armLTransform = unitData.getJointTransform('armL');

      const imageList = [
        {
          id: [1, 0],
          transform: addTransform(armRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [200, 200]
        },
        {
          id: [0, 1],
          transform: addTransform(armLTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [-200, -200]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Arm001;
})();
