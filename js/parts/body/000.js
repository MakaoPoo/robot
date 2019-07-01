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

    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();
      this.joint = {
        arm: {x: 9, y: -11},
        shld: {x: 9, y: -25},
        leg: {x: 2, y: 9},
        back: {x: 22, y: -32}
      };

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
          pivot: {x: 40, y: 45}
        }
      ];

      return vtxList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Body000;
})();
