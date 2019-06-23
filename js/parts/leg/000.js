(function() {
    const PartsType = "leg";
    const PartsId = "000";
    const PartsName = "ゼータ";

    class Leg000 {
      static initPartsData = function() {
        const partsData = {
          id: PartsId,
          name: PartsName,
          image: new Image(),
          vtxList: Leg000.getVtxList()

        }

        Leg000.loadImage(partsData.image);

        return partsData;
      }

      static loadImage = function(image) {
        const src = "resource/parts/" + PartsType + "/" + PartsId +".png";
        image.src = src;
        image.onload = function() {
        }
      }

      static getVtxList = function() {
        const vtxList = [
          {
            image: {x: 0, y: 0, w: 64, h: 32},
            hitbox: {x: 12, y: 10, w: 46, h: 18}
          }
        ];

        return vtxList;
      }
    }

    PARTS_CLASS_LIST[PartsType][PartsId] = Leg000;
})();
