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

const FRAME_SPLIT = 10;

const getDot = function(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

const getCrossZ = function(vec1, vec2) {
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

const getRad = function(deg) {
  return deg * Math.PI / 180;
}

const rotateVec = function(x, y, deg) {
    const rotateX = Math.cos(getRad(deg)) * x - Math.sin(getRad(deg)) * y;
    const rotateY = Math.sin(getRad(deg)) * x + Math.cos(getRad(deg)) * y;

    return {x: rotateX, y: rotateY};
}
