(function() {
  const PartsType = "arm";
  const PartsId = "000";
  const PartsName = "ステイメン";

  class Arm000 {
    id
    name
    imageSrc
    vtxList

    constructor() {
      this.id = PartsId;
      this.name = PartsName;
      this.imageSrc = new Image();
      this.vtxList = this.getVtxList();
      this.joint = {
        handR: {x: 0, y: 37, parent: 'armR'},
        handL: {x: 0, y: 37, parent: 'armL'},
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
          imagePos: {x: 0, y: 0, w: 32, h: 72},
          hitbox: {x: 5, y: 17, w: 15, h: 48},
          pivot: {x: 11, y: 21}
        },
        {
          imagePos: {x: 32, y: 0, w: 32, h: 72},
          hitbox: {x: 5, y: 17, w: 15, h: 48},
          pivot: {x: 11, y: 21}
        }
      ];

      return vtxList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Arm000;
})();
