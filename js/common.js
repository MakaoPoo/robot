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

const PARTS_ID_LENGTH = 3;

const ALL_PARTS_NUMS = partsListTemplate(1, 1, 1, 1, 1, 1);

const PARTS_CLASS_LIST = partsListTemplate({}, {}, {}, {}, {}, {});

const DRAW_HITBOX = true;

const FRAME_SPLIT = 20;

const FLOOR_BORDER_ANGLE = 50;

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
