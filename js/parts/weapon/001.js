(function() {
  const PartsType = "weapon";
  const PartsId = "001";
  const PartsName = "NT1シールド";

  class Weapon001 {
    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();

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
          imagePos: {x: 0, y: 0, w: 48, h: 80},
          pivot: {x: 23, y: 38}
        },
        {
          imagePos: {x: 48, y: 0, w: 48, h: 80},
          pivot: {x: 23, y: 38}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const handL = new Transform(0, 0, 0, 1.0);

      unitData.setJointTransform('handL', handL);

      // const armL = new Transform(0, 10, 120, 1.0);
      //
      // unitData.setJointTransform('armL', armL);
    }

    getImageList(unitData) {
      const handLTransform = unitData.getJointGlobalTransform('handL');

      const imageList = [
        {
          id: [0, 1],
          transform: addTransform(handLTransform, new Transform(0, -10, 0, 1)),
          mirror: false,
          zIndex: [-210, -210]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Weapon001;
})();
