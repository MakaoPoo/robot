(function() {
  const PartsType = "weapon";
  const PartsId = "000";
  const PartsName = "スーパードッズライフル";

  class Weapon000 {
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
          imagePos: {x: 0, y: 0, w: 48, h: 160},
          pivot: {x: 43, y: 33}
        },
        {
          imagePos: {x: 48, y: 0, w: 64, h: 80},
          pivot: {x: 43, y: 33}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const handR = new Transform(0, 0, 0, 0.8);

      unitData.setJointTransform('handR', handR);
    }

    getImageList(unitData) {
      const handRTransform = unitData.getJointTransform('handR');

      const imageList = [
        {
          id: 0,
          transform: addTransform(handRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: 1.5
        },
        {
          id: 1,
          transform: addTransform(handRTransform, new Transform(0, 0, 0, 1)),
          mirror: false,
          zIndex: 1.5
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Weapon000;
})();
