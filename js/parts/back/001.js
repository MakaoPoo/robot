(function() {
  const PartsType = "back";
  const PartsId = "001";
  const PartsName = "ソードインパルス";

  class Back001 {
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
          imagePos: {x: 0, y: 0, w: 80, h: 64},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 4, y: 26}
        },
        {
          imagePos: {x: 80, y: 0, w: 48, h: 64},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 4, y: 26}
        },
        {
          imagePos: {x: 0, y: 64, w: 256, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 182, y: 20}
        },
        {
          imagePos: {x: 256, y: 64, w: 256, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 231, y: 19}
        },
        {
          imagePos: {x: 0, y: 112, w: 512, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 232, y: 19}
        },
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const back = new Transform(0, 0, 0, 1);

      unitData.setJointTransform('back', back);
    }

    getImageList(unitData) {
      const backTransform = unitData.getJointTransform('back');
      const handLTransform = unitData.getJointTransform('handL');

      const imageList = [
        {
          id: 0,
          transform: addTransform(backTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: 0
        },
        {
          id: 2,
          transform: addTransform(backTransform, new Transform(8, -5, -130, 0.6)),
          mirror: false,
          zIndex: 0.5
        },
        {
          id: 2,
          transform: addTransform(backTransform, new Transform(8, -5, -130, 0.6)),
          mirror: false,
          zIndex: -0.5
        },
        {
          id: 4,
          transform: addTransform(handLTransform, new Transform(0, 0, 0, 0.8)),
          mirror: false,
          zIndex: -1.5
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Back001;
})();
