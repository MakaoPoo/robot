class Stage {
  id
  imageSrc
  vtxList

  constructor() {
    this.id = "000";
    this.imageSrc = new Image();
    this.vtxList = this.getVtxList();

    this.loadImage();
  }

  loadImage() {
    const src = "resource/stage/000.png";
    this.imageSrc.src = src;
    this.imageSrc.onload = function() {
    }
  }

  getVtxList() {
    const vtxList = {
      bodyList: [
        [
          {x: 2020, y: 482},
          {x: 1662, y: 482},
          {x: 1662, y: 965},
          {x: 1525, y: 965},
          {x: 1208, y: 806},
          {x: 1046, y: 806},
          {x: 954, y: 898},
          {x: 688, y: 898},
          {x: 688, y: 682},
          {x: 433, y: 682},
          {x: 248, y: 774},
          {x: -100, y: 774}
        ]
      ]
    }

    return vtxList;
  }
}
