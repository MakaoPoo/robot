(function() {
  const PartsType = "body";
  const PartsId = "000";
  const PartsName = "ノーマル";

  class Body000 {
    id
    name
    imageSrc
    vtxList
    joint
    collisionR

    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();
      this.joint = {
        body: {x: 0, y: 0, parent: null},
        armR: {x: 4, y: 1, parent: 'body'},
        armL: {x: 4, y: 1, parent: 'body'},
        shldR: {x: 6, y: -13, parent: 'body'},
        shldL: {x: 6, y: -13, parent: 'body'},
        legR: {x: 2, y: 21, parent: 'body'},
        legL: {x: 2, y: 21, parent: 'body'},
        back: {x: 22, y: -20, parent: 'body'}
      };
      this.collisionR = 27;

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
          imagePos: {x: 0, y: 0, w: 64, h: 64},
          hitbox: {x: 14, y: 14, w: 45, h: 42},
          pivot: {x: 40, y: 33}
        }
      ];

      return vtxList;
    }

    updatePartsState(unitData) {
      const body = new Transform(0, 0, 0, 1);

      unitData.setJointTransform('body', body);
    }

    getImageList(unitData) {
      const bodyTransform = unitData.getJointTransform('body');
      const imageList = [
        {
          id: [0, 0],
          transform: addTransform(bodyTransform, new Transform(0, 0, 0, 1)),
          zIndex: [0, 0]
        }
      ];

      return imageList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Body000;
})();
