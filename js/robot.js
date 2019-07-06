let scale = 5;
let unitData = [];
let playerId = 0;
let stageData;

class Unit {
  parts
  partsIdList
  transform
  joint
  state
  input
  imageList
  hitboxList

  constructor() {
    this.parts = partsListTemplate();
    this.partsIdList = partsListTemplate("000", "000", "000", "000", "000", "000");

    for(const partsType in this.partsIdList) {
      const partsId = this.partsIdList[partsType];
      if(!PARTS_CLASS_LIST[partsType][partsId]) {
        continue;
      }
      this.parts[partsType] = new PARTS_CLASS_LIST[partsType][partsId]();
    }

    this.transform = new Transform(128, 128, 0, 1)

    this.jointList = {};

    for(const partsType in this.parts) {
      const parts = this.parts[partsType];
      for(const jointName in parts.joint) {
        const joint = parts.joint[jointName];
        this.jointList[jointName] = {
          pos: {x: joint.x, y: joint.y},
          parent: joint.parent,
          transform: new Transform(0, 0, 0, 1),
        }
      }
    }

    this.state = {
      pos: {x: 0, y: 0},
      speed: {x: 0, y: 0},
      frameSplitSpeed: {x: 0, y: 0},
      maxSpeed: {x: 15, y: 15},
      dirLeft: true,
      ground: {
        flag: false,
        angle: 0
      }
    }

    this.input = {
      mouse: { x: 0, y: 0 },
      keyList: {}
    }

    this.imageList = [];
    this.hitboxList = [];
  }

  setPartsId(type, id) {
    this.partsIdList[type] = id;
    this.parts[type] = new PARTS_CLASS_LIST[type][id]();
  }

  setAllPartsId(idList) {
    for(const type in idList) {
      const id = idList[type];
      this.partsIdList[type] = id;
      this.parts[type] = new PARTS_CLASS_LIST[type][id]();
    }
  }

  dirTurn() {
    if(this.transform.x > this.input.mouse.x) {
      this.state.dirLeft = true;
    }
    if(this.transform.x < this.input.mouse.x) {
      this.state.dirLeft = false;
    }
  }

  updateUnitState() {
    if(this.input.keyList['a'] && !this.input.keyList['d']) {
      this.state.speed.x -= 2;
      this.state.speed.y -= 0.5;

    } else if(this.input.keyList['d'] && !this.input.keyList['a']) {
      this.state.speed.x += 2;
      this.state.speed.y -= 0.5;
    }

    if(this.state.speed.x >= this.state.maxSpeed.x) {
      this.state.speed.x = this.state.maxSpeed.x;
    }
    if(this.state.speed.x <= -this.state.maxSpeed.x) {
      this.state.speed.x = -this.state.maxSpeed.x;
    }

    if(this.input.keyList['w'] && !this.input.keyList['s']) {
      this.state.speed.y -= 2;

      const deceleration = 0.5;
      if(Math.abs(unitData[0].state.speed.x) <= deceleration) {
        unitData[0].state.speed.x = 0;
      } else {
        if(unitData[0].state.speed.x > 0) {
          unitData[0].state.speed.x -= deceleration;
        } else {
          unitData[0].state.speed.x += deceleration;
        }
      }
    } else if(this.input.keyList['s'] && !this.input.keyList['w']) {
      this.state.speed.y += 2;
    }

    if(this.state.speed.y >= FALL_MAX_SPEED) {
      this.state.speed.y = FALL_MAX_SPEED;
    }
    if(this.state.speed.y <= -this.state.maxSpeed.y) {
      this.state.speed.y = -this.state.maxSpeed.y;
    }

    for(const type in this.parts) {
      const partsData = this.parts[type];
      if(!partsData.updatePartsState) {
        continue;
      }

      partsData.updatePartsState(this);

    }
  }

  updateImageList() {
    this.imageList = [];

    for(const type in this.parts) {
      const partsData = this.parts[type];
      if(!partsData.getImageList) {
        continue;
      }
      const partsImageList = partsData.getImageList(this);

      for(const partsImage of partsImageList) {
        this.addImage(partsData, partsImage.id, partsImage.transform, partsImage.zIndex);
      }
    }
  }

  addImage(partsData, imageId, transform, zIndex) {
    const imageData = {
      imageSrc: partsData.imageSrc,
      imagePos: partsData.vtxList[imageId].imagePos,
      pivot: partsData.vtxList[imageId].pivot,
      transform: transform,
      zIndex: zIndex
    }
    this.imageList.push(imageData);
  }

  getJointTransform(jointName) {
    const joint = this.jointList[jointName];

    let parentJoint = new Transform(0, 0, 0, 1);
    if(joint.parent) {
      parentJoint = this.getJointTransform(joint.parent);
    }

    const scale = parentJoint.scale * joint.transform.scale;
    const rotate = parentJoint.rotate + joint.transform.rotate;

    const rotatePos = rotateVec(joint.pos.x + joint.transform.x, joint.pos.y + joint.transform.y, parentJoint.rotate);

    return {
      x: parentJoint.x + rotatePos.x * parentJoint.scale,
      y: parentJoint.y + rotatePos.y * parentJoint.scale,
      rotate: rotate,
      scale: joint.transform.scale
    }

  }

  setJointTransform(jointName, transform) {
    this.jointList[jointName].transform = transform;
  }
}

$(window).resize(function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas.width();
  $canvas[0].height = $canvas.height();

});

$(function() {
  unitData.push(new Unit());
  stageData = new Stage();

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas.width();
  $canvas[0].height = $canvas.height();

  const $wireframe = $('#wireframe');
  $wireframe[0].width = $canvas.width();
  $wireframe[0].height = $canvas.height();
  $wireframe.css('left', 0);
  $wireframe.css('top', 0);

  mainLoop();
});

$(document).on('keydown', function(e) {
  if(!e) e = window.event;
  if(unitData[playerId].input.keyList[e.key]) {
    return;
  }
  unitData[playerId].input.keyList[e.key] = true;
});

$(document).on('keyup', function(e) {
  if(!e) e = window.event;

  unitData[playerId].input.keyList[e.key] = false;
});

$(document).on('mousemove', function(e) {
  unitData[playerId].input.mouse.x = e.pageX;
  unitData[playerId].input.mouse.y = e.pageY;
});

const mainLoop = function(){
  unitData[0].dirTurn();

  unitData[0].updateUnitState();

  advanceFrame();

  unitData[0].updateImageList();

  draw();

  requestAnimationFrame(mainLoop);
  // setTimeout(mainLoop, 100);
}

const advanceFrame = function() {
  unitData[0].state.ground.flag = false;
  unitData[0].state.ground.angle = FLOOR_BORDER_ANGLE;
  unitData[0].state.frameSplitSpeed = {
    x: unitData[0].state.speed.x / FRAME_SPLIT,
    y: unitData[0].state.speed.y / FRAME_SPLIT
  }

  for(let frame = 0; frame < FRAME_SPLIT; frame ++) {
    advanceOneFrame();
  }

  let deceleration = 0.1;
  if(unitData[0].state.ground.flag) {
    deceleration = 1;
  }

  if(Math.abs(unitData[0].state.speed.x) <= deceleration) {
    unitData[0].state.speed.x = 0;
  } else {
    if(unitData[0].state.speed.x > 0) {
      unitData[0].state.speed.x -= deceleration;
    } else {
      unitData[0].state.speed.x += deceleration;
    }
  }

  unitData[0].state.speed.y += 1;
}

const advanceOneFrame = function() {
  unitData[0].transform.x += unitData[0].state.frameSplitSpeed.x;
  unitData[0].transform.y += unitData[0].state.frameSplitSpeed.y;

  const unitTransform = unitData[0].transform;
  const legJoint = unitData[0].parts.body.joint.legR;

  const collisionR = unitData[0].parts.body.collisionR;
  const groundR = unitData[0].parts.leg.groundR;

  const collision = {
    shortestD: collisionR,
    nearestNvec: null,
    horizonDist: null,
    angle: null,
    flag: false,
    hitCircle: {
      x: unitTransform.x,
      y: unitTransform.y,
      r: collisionR
    }
  }

  const ground = {
    shortestD: groundR,
    nearestNvec: null,
    horizonDist: null,
    angle: null,
    flag: false,
    hitCircle: {
      x: unitTransform.x + legJoint.x,
      y: unitTransform.y + legJoint.y,
      r: groundR
    }
  }

  hitCheck(collision, ground);

  if(collision.flag) {
    let pushX = collision.nearestNvec.x * (collision.hitCircle.r - collision.shortestD);
    let pushY = collision.nearestNvec.y * (collision.hitCircle.r - collision.shortestD);

    if(collision.angle > 90 + FLOOR_BORDER_ANGLE) {
      pushX = 0;
      pushY /= -Math.cos(getRad(collision.angle));
    }

    unitData[0].transform.x += pushX;
    unitData[0].transform.y += pushY;

    if(unitData[0].state.speed.x * pushX < -1) {
      unitData[0].state.speed.x += pushX;
    }
    if(unitData[0].state.speed.y * pushY < -1) {
      unitData[0].state.speed.y += pushY;
    }
  }
  if(ground.flag) {
    unitData[0].state.ground.angle = ground.angle;
    const pushY = ground.nearestNvec.y * (ground.hitCircle.r - ground.shortestD);
    unitData[0].transform.y += pushY / Math.cos(getRad(unitData[0].state.ground.angle));

    if(unitData[0].state.speed.y > 1) {
      unitData[0].state.speed.y += pushY;
    }
  }
}

const hitCheck = function(collision, ground) {
  for(const obj of stageData.staticObjList) {
    if(obj.type == 'line') {
      hitCheckLineObj(obj, collision, ground);
    }
  }
}

const hitCheckLineObj = function(obj, collision, ground) {
  const lineAngle = getDeg(Math.atan2(obj.vec.y, obj.vec.x));

  if(Math.abs(lineAngle) <= FLOOR_BORDER_ANGLE) {
    //---------------------------------------------------------
    const cVec1 = {x: ground.hitCircle.x - obj.pos1.x, y: ground.hitCircle.y - obj.pos1.y};
    const cVec2 = {x: ground.hitCircle.x - obj.pos2.x, y: ground.hitCircle.y - obj.pos2.y};
    let d;

    if(getDot(obj.vec, cVec1) * getDot(obj.vec, cVec2) <= 0) {
      d = Math.abs(getCrossZ(obj.vec, cVec1)) / obj.length;
    } else {
      const r1 = getDot(cVec1, cVec1);
      const r2 = getDot(cVec2, cVec2);
      d = Math.sqrt(r1 < r2? r1: r2);
    }
    if(d < ground.hitCircle.r) {
      unitData[0].state.ground.flag = true;
      ground.flag = true;
      if(d < ground.shortestD) {
        ground.shortestD = d;
        ground.nearestNvec = obj.nVec;
        ground.angle = lineAngle;
      }
    }
  } else {
    //---------------------------------------------------------
    const cVec1 = {x: collision.hitCircle.x - obj.pos1.x, y: collision.hitCircle.y - obj.pos1.y};
    const cVec2 = {x: collision.hitCircle.x - obj.pos2.x, y: collision.hitCircle.y - obj.pos2.y};
    let d;

    if(getDot(obj.vec, cVec1) * getDot(obj.vec, cVec2) <= 0) {
      d = Math.abs(getCrossZ(obj.vec, cVec1)) / obj.length;
    } else {
      const r1 = getDot(cVec1, cVec1);
      const r2 = getDot(cVec2, cVec2);
      d = Math.sqrt(r1 < r2? r1: r2);
    }
    if(d < collision.hitCircle.r) {
      collision.flag = true;
      if(d < collision.shortestD) {
        collision.shortestD = d;
        collision.nearestNvec = obj.nVec;
        collision.angle = lineAngle;
      }
    }
  }

}

const draw = function() {
  console.log(unitData[0].state.speed.x + ", " + unitData[0].state.speed.y);

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  drawStage(ctx);

  unitData[0].imageList.sort(function(a, b) {
    if(a.zIndex < b.zIndex) {
      return (unitData[0].state.dirLeft? 1: -1);
    }
    if(a.zIndex > b.zIndex) {
      return (unitData[0].state.dirLeft? -1: 1);
    }

    return 0;
  });

  const unitTransform = unitData[0].transform;
  for(const image of unitData[0].imageList) {
    const imageSrc = image.imageSrc;
    const transform = image.transform;
    const imagePos = image.imagePos;
    const pivot = image.pivot;

    const imageX = -pivot.x;
    const imageY = -pivot.y;
    const imageW = image.imagePos.w;
    const imageH = image.imagePos.h;

    ctx.save();
    ctx.translate(unitTransform.x, unitTransform.y);
    ctx.rotate(getRad(unitTransform.rotate));
    ctx.scale(unitTransform.scale, unitTransform.scale);
    if(!unitData[0].state.dirLeft) {
      ctx.scale(-1, 1);
    }
    ctx.translate(transform.x, transform.y);
    ctx.rotate(getRad(transform.rotate));
    ctx.scale(transform.scale, transform.scale);

    drawImage(ctx, imageSrc,
      imagePos.x, imagePos.y, imagePos.w, imagePos.h,
      imageX, imageY, imageW, imageH
    );

    ctx.restore();

  }

  ctx.strokeStyle = "#f00";
  ctx.beginPath();
  ctx.arc(unitData[0].input.mouse.x, unitData[0].input.mouse.y, 25, 0, Math.PI * 2, false);
  ctx.stroke();

  if(DRAW_HITBOX) {
    const legJoint = unitData[0].parts.body.joint.legR;
    const collisionR = unitData[0].parts.body.collisionR;
    const groundR = unitData[0].parts.leg.groundR;
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.arc(unitTransform.x, unitTransform.y, collisionR, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(unitTransform.x + legJoint.x, unitTransform.y + legJoint.y, groundR, 0, Math.PI * 2, false);
    ctx.stroke();
  }
}

const drawStage = function(ctx) {
  ctx.drawImage(stageData.imageSrc, 0, 0);

  if(DRAW_HITBOX) {
    for(const obj of stageData.staticObjList) {
      if(obj.type == 'line') {
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(obj.pos1.x, obj.pos1.y);
        ctx.lineTo(obj.pos2.x, obj.pos2.y);
        ctx.stroke();

        const nx = (obj.pos1.x + obj.pos2.x) / 2;
        const ny = (obj.pos1.y + obj.pos2.y) / 2;

        ctx.strokeStyle = "#0f0";
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx + obj.nVec.x * 50, ny + obj.nVec.y * 50);
        ctx.stroke();
      }
    }
  }
}

const drawImage = function(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
  if(image != null) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}
