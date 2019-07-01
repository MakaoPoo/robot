(function() {
  const PartsType = "leg";
  const PartsId = "000";
  const PartsName = "ゼータ";

  class Leg000 {
    id
    name
    imageSrc
    vtxList

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
          imagePos: {x: 0, y: 0, w: 64, h: 32},
          hitbox: {x: 12, y: 10, w: 46, h: 18},
          pivot: {x: 43, y: 9}
        }
      ];

      return vtxList;
    }
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Leg000;
})();
