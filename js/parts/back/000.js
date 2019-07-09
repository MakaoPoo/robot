(function() {
  const PartsType = "back";
  const PartsId = "000";
  const PartsName = "Mk-2";

  class Back000 {
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
          imagePos: {x: 0, y: 0, w: 40, h: 80},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 4, y: 35}
        },
        {
          imagePos: {x: 40, y: 0, w: 40, h: 80},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 4, y: 35}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const back = new Transform(0, 0, 0, 1);

      unitData.setJointTransform('back', back);
    }

    getImageList(unitData) {
      const backTransform = unitData.getJointTransform('back');

      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(backTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [0, 0]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Back000;
})();
