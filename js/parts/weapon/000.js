(function() {
  const PartsType = "weapon";
  const PartsId = "000";
  const PartsName = "スーパードッズライフル";

  class Weapon000 {
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
  }

  PARTS_CLASS_LIST[PartsType][PartsId] = Weapon000;
})();
