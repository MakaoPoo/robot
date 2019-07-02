class Stage {
  id
  imageSrc
  vtxList

  constructor() {
    this.id = "000";
    this.imageSrc = new Image();
    this.objList = this.getObjList();

    this.loadImage();
  }

  loadImage() {
    const src = "resource/stage/000.png";
    this.imageSrc.src = src;
    this.imageSrc.onload = function() {
    }
  }

  getObjList() {
    const objList = [
      {
        type: 'line',
        lineList: [
          {x: -100, y: 774},
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
          {x: 2020, y: 482}
        ]
      }
    ];

    return objList;
  }
}
