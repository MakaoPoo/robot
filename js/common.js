const partsListTemplate = function(body, arm, shld, leg, back, weapon) {
  const partsData = {
    body: body,
    arm: arm,
    shld: shld,
    leg: leg,
    back: back,
    weapon: weapon
  }

  return partsData;
}

class Transform {
  constructor(x, y, rotate, scale) {
    this.x = 0;
    this.y = 0;
    this.rotate = 0;
    this.scale = 1;

    this.setTransform(x, y, rotate, scale);
  }

  setTransform(x, y, rotate, scale) {
    if(x != null) {
      this.x = x;
    }
    if(y != null) {
      this.y = y;
    }
    if(rotate != null) {
      this.rotate = rotate;
    }
    if(scale != null) {
      this.scale = scale;
    }
  }
}

class Input {
  constructor() {
    this.config = {
      left: 'a',
      right: 'd',
      up: 'w',
      down: 's',
    }

    this.mouse = {
      x: 1920 / 2, y: 1080 / 2,
      minX: 0, minY: 0,
      maxX: 1920, maxY: 1080};
    this.keyList = {};
    this.keyDouble = {
      id: null,
      flag: false
    };
    this.keyDoubleFrame = {
      id: null,
      frame: 0,
    };
  }

  getMouse() {
    return this.mouse;
  }
  getMouseX() {
    return this.mouse.x;
  }
  getMouseY() {
    return this.mouse.y;
  }
  setMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }
  moveMouse(x, y) {
    this.mouse.x += x;
    if(this.mouse.x < this.mouse.minX) {
      this.mouse.x = this.mouse.minX;
    }
    if(this.mouse.x > this.mouse.maxX) {
      this.mouse.x = this.mouse.maxX;
    }

    this.mouse.y += y;
    if(this.mouse.y < this.mouse.minY) {
      this.mouse.y = this.mouse.minY;
    }
    if(this.mouse.y > this.mouse.maxY) {
      this.mouse.y = this.mouse.maxY;
    }
  }

  advanceFrame() {
    for(const keyCode in this.keyList) {
      const key = this.keyList[keyCode];
      if(key.flag) {
        key.frame += 1;
      }
    }

    this.keyDoubleFrame.frame -= 1;
    this.keyDouble.id = null;
  }

  keyPress(keyCode) {
    if(!(keyCode in this.keyList)) {
      this.keyList[keyCode] = {
        flag: false,
        frame: 0
      }
    }

    this.keyList[keyCode].flag = true;
    this.keyList[keyCode].frame = 0;

    if(this.keyDoubleFrame.id == keyCode && this.keyDoubleFrame.frame > 0){
      this.keyDouble.id = keyCode;
      this.keyDouble.flag = true;
      this.keyDoubleFrame.frame = 0;

    } else {
      this.keyDoubleFrame.id = keyCode;
      this.keyDoubleFrame.frame = KEY_DOUBLE_FRAME;
    }
  }

  keyUp(keyCode) {
    if(!(keyCode in this.keyList)) {
      this.keyList[keyCode] = {
        flag: false,
        frame: 0
      }
    }

    this.keyList[keyCode].flag = false;
    this.keyList[keyCode].frame = 0;
  }

  getKeyCodeFlag(keyCode) {
    if(keyCode in this.keyList) {
      return this.keyList[keyCode].flag;
    }

    return false;
  }

  getKeyFlag(configKey) {
    const keyCode = this.config[configKey];
    if(keyCode in this.keyList) {
      return this.keyList[keyCode].flag;
    }

    return false;
  }

  getLongPressKeyFrame(configKey) {
    const keyCode = this.config[configKey];

    if(keyCode in this.keyList) {
      if(this.keyList[keyCode].flag) {
        return this.keyList[keyCode].frame;
      }
    }

    return -1;
  }

  isPressDoubleKey(configKey) {
    const keyCode = this.config[configKey];
    return (this.keyDouble.flag && this.keyDouble.id == keyCode);

  }
}

class Interface {
  constructor() {
    this.pointer = {
      id: 2,
      imageSrc: new Image()
    }

    this.loadImage();
  }

  loadImage() {
    this.pointer.imageSrc.src = "resource/pointer.png";
  }

  getPointerImage() {
    if(this.pointer.imageSrc.width == 0) {
      return null;
    }

    const id = this.pointer.id;
    const imageSrc = this.pointer.imageSrc;

    const pointerW = 64;
    const pointerH = 64;
    const numX = Math.floor(imageSrc.width / pointerW);
    const numY = Math.floor(imageSrc.height / pointerH);

    const imageData = {
      imageSrc: imageSrc,
      x: (id % numX) * pointerW,
      y: (Math.floor(id / numX) % numY) * pointerH,
      width: pointerW,
      height: pointerH
    }
    return imageData;
  }
}

const loading = function(conditionsFunc, doneFunc) {
  if(conditionsFunc()) {
    doneFunc();
  } else {
    setTimeout(function() {
      loading(conditionsFunc, doneFunc)
    }, 500);
  }
}

const ALL_PARTS_NUMS = partsListTemplate(1, 2, 2, 2, 2, 1);
const PARTS_ID_LENGTH = 3;
const PARTS_CLASS_LIST = partsListTemplate({}, {}, {}, {}, {}, {});

const ALL_MOTION_NUMS = 2;
const MOTION_ID_LENGTH = 6;
const ATTACH_MOTION = {};

const ALL_STAGE_NUMS = 1;
const STAGE_ID_LENGTH = 3;
const STAGE_CLASS_LIST = {};

const loadGameData = function() {
  for(const partsType in ALL_PARTS_NUMS){
    const partsNums = ALL_PARTS_NUMS[partsType];

    for(let i = 0; i < partsNums; i++) {
      const id = ('000' + i).slice(-PARTS_ID_LENGTH);
      const script = document.createElement('script');
      script.src = 'js/parts/'+ partsType +'/'+ id +'.js';
      document.body.appendChild(script);
    }
  }

  for(let i = 0; i < ALL_MOTION_NUMS; i++) {
    const id = ('000000' + i).slice(-MOTION_ID_LENGTH);
    const script = document.createElement('script');
    script.src = 'js/motion/'+ id +'.js';
    document.body.appendChild(script);
  }

  for(let i = 0; i < ALL_STAGE_NUMS; i++) {
    const id = ('000' + i).slice(-STAGE_ID_LENGTH);
    const script = document.createElement('script');
    script.src = 'js/stage/'+ id +'.js';
    document.body.appendChild(script);
  }
}

let DRAW_HITBOX = false;
// DRAW_HITBOX = true;

const FRAME_SPLIT = 20;

const FLOOR_BORDER_ANGLE = 50;
const ROOF_BORDER_ANGLE = 20;

const MIN_SPEED = 10;

const AIR_FRICTION = 0.1;
const GROUND_FRICTION = 1;

const GRAVITY = 1;

const KEY_DOUBLE_FRAME = 12;

const FALL_MAX_SPEED = 20;

const getDot = function(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

const getCrossZ = function(vec1, vec2) {
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

const getRad = function(deg) {
  return deg * Math.PI / 180;
}

const getDeg = function(rad) {
  return rad * 180 / Math.PI;
}

const rotateVec = function(x, y, deg) {
  const rotateX = Math.cos(getRad(deg)) * x - Math.sin(getRad(deg)) * y;
  const rotateY = Math.sin(getRad(deg)) * x + Math.cos(getRad(deg)) * y;

  return {x: rotateX, y: rotateY};
}

const addTransform = function(tf1, tf2) {
  const rotate = tf1.rotate + tf2.rotate;
  const scale = tf1.scale * tf2.scale;

  const rotateTf2 = rotateVec(tf2.x, tf2.y, tf1.rotate);

  return {
    x: tf1.x + rotateTf2.x * tf1.scale,
    y: tf1.y + rotateTf2.y * tf1.scale,
    rotate: rotate,
    scale: scale
  }
}

const turnRotate = function(rotate, isLeft) {
  return rotate * (isLeft? 1: -1)
}

const complementMotion = function(motionList, frame) {
  let frame1, frame2;

  for(let i = 0; i < motionList.length - 1; i++) {
    const motion1 = motionList[i];
    const motion2 = motionList[i + 1];

    const frame1 = motion1.frame;
    const frame2 = motion2.frame;

    if(frame1 == frame) {
      return motion1.transform;
    }

    if(frame1 < frame && frame < frame2) {
      const transform1 = motion1.transform;
      const transform2 = motion2.transform;
      const per2 = (frame - frame1) / (frame2 - frame1);
      const per1 = 1 - per2;

      const transform = {
        x: transform1.x * per1 + transform2.x * per2,
        y: transform1.y * per1 + transform2.y * per2,
        rotate: transform1.rotate * per1 + transform2.rotate * per2,
        scale: transform1.scale * per1 + transform2.scale * per2
      }

      return transform;
    }
  }
}

const loopIncrement = function(num, max) {
  return (num + 1) % max;
}
