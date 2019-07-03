class Stage {
  id
  imageSrc
  vtxList

  constructor() {
    this.id = "000";
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
          {x: 0, y: 774},
          {x: 248, y: 774},
          {x: 433, y: 682},
          {x: 688, y: 682},
          {x: 688, y: 898},
          {x: 954, y: 898},
          {x: 1046, y: 806},
          {x: 1208, y: 806},
          {x: 1525, y: 965},
          {x: 1662, y: 965},
          {x: 1662, y: 482},
          {x: 1920, y: 482},
          {x: 1920, y: 0},
          {x: 0, y: 0},
        ]
      }
    ];

    return staticObjList;
  }
}
