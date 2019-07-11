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
  x
  y
  rotate
  scale

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

const ALL_PARTS_NUMS = partsListTemplate(1, 2, 2, 2, 2, 1);
const PARTS_ID_LENGTH = 3;

const PARTS_CLASS_LIST = partsListTemplate({}, {}, {}, {}, {}, {});

const ALL_MOTION_NUMS = 1;
const MOTION_ID_LENGTH = 6;

const ATTACH_MOTION = {};

// const DRAW_HITBOX = true;
const DRAW_HITBOX = false;

const FRAME_SPLIT = 20;

const FLOOR_BORDER_ANGLE = 50;
const ROOF_BORDER_ANGLE = 20;

const MIN_SPEED = 10;

const AIR_FRICTION = 0.5;
const GROUND_FRICTION = 1;

const GRAVITY = 1;

const KEY_DOUBLE_FRAME = 12;

const FALL_MAX_SPEED = 25;

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
  const frameList = Object.keys(motionList);
  let frame1, frame2;

  for(let i = 0; i < frameList.length - 1; i++) {
    const frame1 = frameList[i];
    const frame2 = frameList[i + 1];

    if(frame1 == frame) {
      return motionList[frame1];
    }

    if(frame1 < frame && frame < frame2) {
      const transform1 = motionList[frame1];
      const transform2 = motionList[frame2];
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
