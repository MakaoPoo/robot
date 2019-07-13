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
  motion
  input
  imageList
  hitboxList

  constructor() {
    this.parts = partsListTemplate();
    this.partsIdList = partsListTemplate(
      "000", //ボディ
      "000", //アーム
      "000", //ショルダー
      "001", //レッグ
      "001", //バック
      "000"  //ウェポン
    );

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
      accel: {x: 0, y: 0},
      frameSplitSpeed: {x: 0, y: 0},
      maxSpeed: {x: 15, y: 15},
      dirLeft: true,
      ground: {
        flag: false,
        angle: 0,
        attraction: 0
      },
      walkType: 'flow',
    }

    this.motion = {
      moveFrame: 0,
      frame: 0,
      id: null,
      dash: false,
      cancel: {}
    };

    this.input = new Input();

    this.imageList = [];
    this.hitboxList = [];
  }

  setMotion(name, id) {
    this.motion.name = name;
    if(id != null) {
      this.motion.id = id;
    }
  }

  advanceMotion() {
    this.motion.frame += 1;
  }

  matchMotion(motionList) {
    for(const motionName of motionList) {
      if(this.motion.name == motionName) {
        return true;
      }
    }

    return false;
  }

  isLeft() {
    return this.state.dirLeft;
  }

  getFrontSpeed() {
    const dirNum = (this.isLeft()? -1: 1);

    return this.state.speed.x * dirNum;
  }

  getAccelDir() {
    const dirNum = (this.isLeft()? -1: 1);

    if(this.state.accel.x == 0) {
      return 0;
    }

    return Math.sign(this.state.accel.x) * dirNum;
  }

  restSpeed() {
    const state = this.state;

    if(state.speed.x >= state.maxSpeed.x) {
      state.speed.x = state.maxSpeed.x;
    }
    if(state.speed.x <= -state.maxSpeed.x) {
      state.speed.x = -state.maxSpeed.x;
    }

    if(state.speed.y >= FALL_MAX_SPEED) {
      state.speed.y = FALL_MAX_SPEED;
    }
    if(state.speed.y <= -state.maxSpeed.y) {
      state.speed.y = -state.maxSpeed.y;
    }
  }

  isGround() {
    return this.state.ground.flag;
  }

  isDash() {
    return this.state.dash;
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
    if(this.transform.x > this.input.getMouseX()) {
      this.state.dirLeft = true;
    }
    if(this.transform.x < this.input.getMouseX()) {
      this.state.dirLeft = false;
    }
  }

  updateUnitState() {
    const state = this.state;
    const input = this.input;
    state.accel = {x: 0, y: 0};

    if(input.isPressDoubleKey('left')) {
      state.accel.x = -100;
      state.dash = true;
    }
    if(input.isPressDoubleKey('right')) {
      state.accel.x = 100;
      state.dash = true;
    }

    const leftKey = input.getKeyFlag('left');
    const rightKey = input.getKeyFlag('right');

    if(leftKey && rightKey) {
      const breakAccel = 0.2 + (this.isGround()? 0.8: 0);
      if(state.speed.x > 1) {
        state.accel.x -= breakAccel;
      }
      if(state.speed.x < -1) {
        state.accel.x += breakAccel;
      }
      if(Math.abs(state.speed.x) < 5) {
        state.dash = false;
      }
    } else {
      if(leftKey) {
        if(this.isGround()) {
          state.accel.x -= 1;
        } else {
          state.accel.x -= 0.5;
          if(this.isDash()) {
            state.accel.y -= 0.5;
          }
        }
      } else if(rightKey) {
        if(this.isGround()) {
          state.accel.x += 1;
        } else {
          state.accel.x += 0.5;
          if(this.isDash()) {
            state.accel.y -= 0.5;
          }
        }
      } else {
        if(this.isGround() && Math.abs(state.speed.x) < 0.5) {
          state.dash = false;
        }
      }
    }

    if(input.getKeyFlag('up') && !input.getKeyFlag('down')) {
      if(!this.isDash() && this.isGround() && input.getLongPressKeyFrame('up') == 0) {
        state.accel.y -= 15;
      }

      if(!leftKey && !rightKey) {
        if(state.speed.x > 1) {
          state.accel.x -= 0.5;
        }
        if(state.speed.x < -1) {
          state.accel.x += 0.5;
        }
        if(Math.abs(state.speed.x) < 5) {
          state.dash = false;
        }

      }

      state.ground.flag = false;
      // state.dash = false;
      state.accel.y -= GRAVITY + 1;
    } else if(input.getKeyFlag('down') && !input.getKeyFlag('up')) {
      // state.accel.y += 2 - GRAVITY;
    }

    state.speed.y += state.accel.y + GRAVITY;

    if(!input.getKeyFlag('up') && !this.isDash()) {
      const attractionSpeed = state.ground.attraction * Math.abs(state.speed.x);
      if(state.speed.y > 0 && state.speed.y < attractionSpeed) {
        state.speed.y = attractionSpeed;
      }
    }

    if(unitData[0].state.speed.x * unitData[0].state.accel.x <= 0) {
      const friction = (unitData[0].isGround())? GROUND_FRICTION: AIR_FRICTION;
      if(Math.abs(unitData[0].state.speed.x) <= friction) {
        unitData[0].state.speed.x = 0;
      } else {
        if(unitData[0].state.speed.x > 0) {
          unitData[0].state.speed.x -= friction;
        } else {
          unitData[0].state.speed.x += friction;
        }
      }
    }

    if(Math.abs(state.speed.x) < MIN_SPEED
    && Math.abs(state.speed.x + state.accel.x) < MIN_SPEED
    && state.speed * state.accel.x < 0) {
      state.speed.x = 0;
    } else {
      state.speed.x += state.accel.x;
    }

    this.restSpeed();

    ATTACH_MOTION['move'](this);

    for(const type in this.parts) {
      const partsData = this.parts[type];
      if(!partsData.updatePartsState) {
        continue;
      }

      partsData.updatePartsState(this);

    }

    input.advanceFrame();
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
        const isLeft = this.isLeft()? 0: 1;

        this.addImage(partsData, partsImage.id[isLeft], partsImage.transform, partsImage.zIndex[isLeft]);
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

  getJointGlobalTransform(jointName) {
    const joint = this.jointList[jointName];

    let parentJoint = new Transform(0, 0, 0, 1);
    if(joint.parent) {
      parentJoint = this.getJointGlobalTransform(joint.parent);
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

  getJointTransform(jointName) {
    return this.jointList[jointName].transform;
  }

  setJointTransform(jointName, transform) {
    this.jointList[jointName].transform = transform;
  }
}

$(window).resize(function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = 1920;
  $canvas[0].height = 1080;

});

$(function() {
  $('p').text('bbb');
  loadGameData();

  loading(function() {
    let partsComplete = 0;

    for(const partsType in ALL_PARTS_NUMS) {
      const partsNums = ALL_PARTS_NUMS[partsType];
      console.log(Object.keys(PARTS_CLASS_LIST[partsType]).length + ' / ' + partsNums);
      if(Object.keys(PARTS_CLASS_LIST[partsType]).length == partsNums) {
        partsComplete += 1;
      }
    }

    for(let i = 0; i < ALL_MOTION_NUMS; i++) {
      console.log(Object.keys(ATTACH_MOTION).length + ' / ' + ALL_MOTION_NUMS);
      if(Object.keys(ATTACH_MOTION).length == ALL_MOTION_NUMS + 1) {
        partsComplete += 1;
      }
    }
    console.log(partsComplete);

    if(partsComplete == 6 + 1) {
      return true;
    }

    return false;
  },
  function() {
    mainFunc();
  });
});

const mainFunc = function() {
  unitData.push(new Unit());
  stageData = new STAGE_CLASS_LIST['000']();

  $(window).resize();

  const $canvas = $('#mainCanvas');
  $canvas[0].requestPointerLock = $canvas[0].requestPointerLock || $canvas[0].mozRequestPointerLock || $canvas[0].webkitRequestPointerLock;

  mainLoop();
}

$('#mainCanvas').on('click', function() {
  if(document.pointerLockElement === null) {
    $(this)[0].requestPointerLock();
  }
});

$(document).on('keydown', function(e) {
  const input = unitData[playerId].input;

  if(input.getKeyCodeFlag(e.key)) {
    return;
  }

  input.keyPress(e.key);
});

$(document).on('keyup', function(e) {
  const input = unitData[playerId].input;

  input.keyUp(e.key);

});

$(document).on('mousemove', function(e) {
  if(unitData[playerId]) {
    if(document.pointerLockElement === $('#mainCanvas')[0]) {
      const input = unitData[playerId].input;
      e = e.originalEvent;

      input.moveMouse(e.movementX, e.movementY);
    }
  }
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
  unitData[0].state.ground.attraction = 0;
  unitData[0].state.frameSplitSpeed = {
    x: unitData[0].state.speed.x / FRAME_SPLIT,
    y: unitData[0].state.speed.y / FRAME_SPLIT
  }

  for(let frame = 0; frame < FRAME_SPLIT; frame ++) {
    advanceOneFrame();
  }

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
    horizonDist: collisionR,
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
    horizonDist: groundR,
    angle: null,
    attraction: 0,
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

    if(collision.angle > 180 - ROOF_BORDER_ANGLE) {
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
    unitData[0].state.ground.attraction = ground.attraction;
    unitData[0].state.ground.flag = true;
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
      const lineAngle = getDeg(Math.atan2(obj.vec.y, obj.vec.x));
      obj.angle = lineAngle;
      if(Math.abs(obj.angle) <= FLOOR_BORDER_ANGLE) {
        hitCheckLineObj(obj, ground);
      } else {
        hitCheckLineObj(obj, collision);
      }
    }
  }
}

const hitCheckLineObj = function(obj, hitboxData) {
  let d;
  let dist = null;

  const cVec1 = {x: hitboxData.hitCircle.x - obj.pos1.x, y: hitboxData.hitCircle.y - obj.pos1.y};
  const cVec2 = {x: hitboxData.hitCircle.x - obj.pos2.x, y: hitboxData.hitCircle.y - obj.pos2.y};
  const dotObjCv1 = getDot(obj.vec, cVec1);
  const dotObjCv2 = getDot(obj.vec, cVec2);

  if(dotObjCv1 * dotObjCv2 <= 0) {
    d = Math.abs(getCrossZ(obj.vec, cVec1)) / obj.length;
  } else {
    const r1 = getDot(cVec1, cVec1);
    const r2 = getDot(cVec2, cVec2);

    if(r1 < r2) {
      d = Math.sqrt(r1);
      dist = Math.abs(dotObjCv1 / obj.length);
    } else {
      d = Math.sqrt(r2);
      dist = Math.abs(dotObjCv2 / obj.length);
    }
  }

  if(d < hitboxData.hitCircle.r) {
    const attraction = Math.abs(Math.tan(getRad(obj.angle)));
    if('attraction' in hitboxData && hitboxData.attraction < attraction) {
      hitboxData.attraction = attraction;
    }
  }

  if(d < hitboxData.shortestD || Math.abs(d - hitboxData.shortestD) < 0.01) {
    if(dist == null) {
      hitboxData.flag = true;
      hitboxData.shortestD = d;
      hitboxData.horizonDist = null;
      hitboxData.nearestNvec = obj.nVec;
      hitboxData.angle = obj.angle;
    }else {
      if(hitboxData.horizonDist != null && dist < hitboxData.horizonDist) {
        hitboxData.flag = true;
        hitboxData.shortestD = d;
        hitboxData.horizonDist = dist;
        hitboxData.nearestNvec = obj.nVec;
        hitboxData.angle = obj.angle;
      }
    }
  }
}

const draw = function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  drawStage(ctx);

  unitData[0].imageList.sort(function(a, b) {
    if(a.zIndex < b.zIndex) {
      return (unitData[0].isLeft()? 1: -1);
    }
    if(a.zIndex > b.zIndex) {
      return (unitData[0].isLeft()? -1: 1);
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
    if(!unitData[0].isLeft()) {
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
  ctx.arc(unitData[0].input.getMouseX(), unitData[0].input.getMouseY(), 25, 0, Math.PI * 2, false);
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
  if(image != null && image.width != 0) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}
