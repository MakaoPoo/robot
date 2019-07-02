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
        arm: {x: 9, y: 1},
        shld: {x: 9, y: -13},
        leg: {x: 2, y: 21},
        back: {x: 22, y: -20}
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
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Body000;
})();
