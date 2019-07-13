(function() {
  const StageId = "000";
  const StageName = "ビル";

  class Stage {
    constructor() {
      this.id = StageId;
      this.name = StageName
      this.imageSrc = new Image();
      this.staticObjList = this.getStaticObjList(this.getDefStaticObjList());

      this.loadImage();
    }

    loadImage() {
      const src = "resource/stage/000.png";
      this.imageSrc.src = src;
      this.imageSrc.onload = function() {
      }
    }

    getStaticObjList(defObjectList) {
      const staticObjList = [];

      for(const defObj of defObjectList) {
        if(defObj.type == 'connected_line') {
          for(let i = 0; i < defObj.lineList.length - 1; i++) {
            const pos1 = defObj.lineList[i];
            const pos2 = defObj.lineList[i + 1];

            const vec = {
              x: pos2.x - pos1.x,
              y: pos2.y - pos1.y
            };

            const length = Math.sqrt(vec.x*vec.x + vec.y*vec.y);

            const nx = -(pos1.y - pos2.y);
            const ny = (pos1.x - pos2.x);

            const nLength = Math.sqrt(nx*nx + ny*ny);

            const nVec = {
              x: nx / nLength,
              y: ny / nLength
            }

            const staticObj = {
              type: 'line',
              pos1: pos1,
              pos2: pos2,
              vec: vec,
              length: length,
              nVec: nVec
            }

            staticObjList.push(staticObj);
          }
        }
      }

      return staticObjList;
    }

    getDefStaticObjList() {
      const staticObjList = [
        {
          type: 'connected_line',
          lineList: [
            {x: 0, y: 0},
            {x: 0, y: 764},
            {x: 248, y: 764},
            {x: 433, y: 672},
            {x: 688, y: 672},
            {x: 688, y: 888},
            {x: 954, y: 888},
            {x: 1046, y: 796},
            {x: 1208, y: 796},
            {x: 1525, y: 955},
            {x: 1662, y: 955},
            {x: 1662, y: 472},
            {x: 1920, y: 472},
            {x: 1920, y: 0},
            {x: 0, y: 0},
          ]
        },
        // {
        //   type: 'connected_line',
        //   lineList: [
        //     {x: 700, y: 650},
        //     {x: 700, y: 645},
        //     {x: 900, y: 500},
        //     {x: 995, y: 200},
        //     {x: 1000, y: 200},
        //     {x: 1000, y: 645},
        //     {x: 995, y: 650},
        //     {x: 700, y: 650}
        //   ]
        // },
        // {
        //   type: 'connected_line',
        //   lineList: [
        //     {x: 100, y: 50},
        //     {x: 700, y: 50},
        //     {x: 700, y: 55},
        //     {x: 200, y: 150},
        //     {x: 100, y: 650},
        //     {x: 100, y: 50},
        //   ]
        // }
      ];

      return staticObjList;
    }
  }

  STAGE_CLASS_LIST[StageId] = Stage;
})();
