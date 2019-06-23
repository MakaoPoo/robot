(function() {
    const PartsType = "body";
    const PartsId = "000";
    const PartsName = "ノーマル";

    class Body000 {
      static initPartsData = function() {
        const partsData = {
          id: PartsId,
          name: PartsName,
          image: new Image(),
          vtxList: Body000.getVtxList()

        }

        Body000.loadImage(partsData.image);

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
            image: {x: 0, y: 0, w: 64, h: 64},
            hitbox: {x: 14, y: 14, w: 45, h: 42}
          }
        ];

        return vtxList;
      }
    }

    PARTS_CLASS_LIST[PartsType][PartsId] = Body000;
})();
