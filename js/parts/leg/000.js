(function() {
  const PartsType = "leg";
  const PartsId = "000";
  const PartsName = "ゼータ";

  class Leg000 {
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

  PARTS_CLASS_LIST[PartsType][PartsId] = Leg000;
})();
