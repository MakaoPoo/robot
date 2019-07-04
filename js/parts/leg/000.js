(function() {
  const PartsType = "leg";
  const PartsId = "000";
  const PartsName = "ゼータ";

  class Leg000 {
    id
    name
    imageSrc
    vtxList
    groundR

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
      const speed = unitData.state.speed;

      const speedX = Math.abs(speed.x);
      let legAngleR = 0;
      let legAngleL = 0;
      let legX = 0;

      if(speedX == 0) {
        legX = 0;
        legAngleR = -60;
        legAngleL = -80;
      } else {
        if((Math.sign(speed.x) < 0) == unitData.state.dirLeft) {
          legX = 10;
          legAngleR = -140;
          legAngleL = -120;
        } else {
          legX = -10;
          legAngleR = -10;
          legAngleL = -30;
        }
      }

      if(unitData.state.ground.flag && speedX == 0) {
        legX = 0;

        const groundLegAngle = unitData.state.ground.angle * (unitData.state.dirLeft? 1: -1);
        legAngleR = groundLegAngle;
        legAngleL = groundLegAngle;
      }

      // unitData.transform.legR.x = legX;
      unitData.transform.legR.rotate = legAngleR;
      // unitData.transform.legL.x = legX;
      unitData.transform.legL.rotate = legAngleL;
    }

    getImageList(unitData) {
      const legRTransform = unitData.getLegRPartsTransform();
      const legLTransform = unitData.getLegLPartsTransform();

      const imageList = [
        {
          id: 0,
          transform: addTransform(legRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: 1
        },
        {
          id: 0,
          transform: addTransform(legLTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: -1
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Leg000;
})();
