(function() {
  const PartsType = "shld";
  const PartsId = "001";
  const PartsName = "ウイングゼロ";

  class Shld001 {
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
          imagePos: {x: 0, y: 0, w: 80, h: 48},
          hitbox: {x: 10, y: 13, w: 22, h: 28},
          pivot: {x: 20, y: 24}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {

    }

    getImageList(unitData) {
      const shldRTransform = unitData.getJointGlobalTransform('shldR');
      const shldLTransform = unitData.getJointGlobalTransform('shldL');

      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(shldRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [210, 210]
        },
        {
          id: [0, 0],
          transform: addTransform(shldLTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [-210, -210]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Shld001;
})();
