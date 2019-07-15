(function() {
  const PartsType = "back";
  const PartsId = "000";
  const PartsName = "Mk-2";

  class Back000 {
    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();

      this.saberAnim = 0;

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
        },
        {
          imagePos: {x: 80, y: 0, w: 48, h: 16},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 24, y: 7}
        },
        {
          imagePos: {x: 0, y: 88, w: 152, h: 24},
          hitbox: {x: 4, y: 31, w: 22, h: 40},
          pivot: {x: 144, y: 11}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      this.saberAnim = (this.saberAnim + 1) % 5;

      // const handR = new Transform(0, 0, -10, 1);
      // unitData.setJointTransform('handR', handR);
      //
      // const handL = new Transform(0, 0, -20, 1);
      // unitData.setJointTransform('handL', handL);
    }

    getImageList(unitData) {
      const backTransform = unitData.getJointGlobalTransform('back');
      const handRTransform = unitData.getJointGlobalTransform('handR');
      const handLTransform = unitData.getJointGlobalTransform('handL');

      const min = 0.9, max = 1.1;
      const saberScale = min + this.saberAnim / 4 * (max - min);

      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(backTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [0, 0]
        },
        {
          id: [2, 2],
          transform: addTransform(handRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: [190, 190]
        },
        {
          id: [3, 3],
          transform: addTransform(handRTransform, new Transform(-20, 0, 0, saberScale)),
          mirror: false,
          zIndex: [189, 191]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Back000;
})();
