(function() {
  const PartsType = "back";
  const PartsId = "001";
  const PartsName = "ソードインパルス";

  class Back001 {
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
          pivot: {x: 3, y: 26}
        },
        {
          imagePos: {x: 80, y: 0, w: 48, h: 64},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 3, y: 26}
        },
        {
          imagePos: {x: 0, y: 64, w: 256, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 182, y: 20}
        },
        {
          imagePos: {x: 256, y: 64, w: 256, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 233, y: 19}
        },
        {
          imagePos: {x: 0, y: 112, w: 512, h: 48},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 234, y: 19}
        },
      ];

      return vtxList;
    }

    updatePartsState(unitData) {

    }

    getImageList(unitData) {
      const backTransform = unitData.getJointGlobalTransform('back');
      const handRTransform = unitData.getJointGlobalTransform('handR');
      const handLTransform = unitData.getJointGlobalTransform('handL');

      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(backTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [0, 0]
        },
        // {
        //   id: [2, 2],
        //   transform: addTransform(backTransform, new Transform(8, -5, -130, 0.6)),
        //   mirror: false,
        //   zIndex: [150, 150]
        // },
        // {
        //   id: [2, 2],
        //   transform: addTransform(backTransform, new Transform(8, -5, -130, 0.6)),
        //   mirror: false,
        //   zIndex: [-150, -150]
        // },
        // {
        //   id: [4, 4],
        //   transform: addTransform(handLTransform, new Transform(0, 0, -45, 0.8)),
        //   mirror: false,
        //   zIndex: [-190, -190]
        // },
        {
          id: [3, 3],
          transform: addTransform(handRTransform, new Transform(0, 0, -30, 0.8)),
          mirror: false,
          zIndex: [190, 190]
        },
        {
          id: [3, 3],
          transform: addTransform(handLTransform, new Transform(0, 0, -10, 0.8)),
          mirror: false,
          zIndex: [-190, -190]
        },
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Back001;
})();
