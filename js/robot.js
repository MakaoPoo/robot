let scale = 5;
let unitData = [];
let playerId = 0;
let stageData;

class Unit {
  parts
  partsIdList
  transform
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

    this.transform = {
      unit: new Transform(128, 128, 0, 1),
      body: new Transform(0, 0, 0, 1),
      armR: new Transform(-5, 0, 45),
      armL: new Transform(0, 0, 45),
      shldR: new Transform(-5, 0, -10),
      shldL: new Transform(0, 0, -10),
      legR: new Transform(0, 0, 0),
      legL: new Transform(5, 0, 0),
      back: new Transform(0, 0, 0),
      weapon: new Transform(0, 0, 0, 0.7)
    }

    this.state = {
      pos: {x: 0, y: 0},
      speed: {x: 0, y: 0},
      maxSpeed: {x: 10, y: 10},
      dirLeft: true,
      isGround: false
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
    if(this.transform.unit.x > this.input.mouse.x) {
      this.state.dirLeft = true;
    }
    if(this.transform.unit.x < this.input.mouse.x) {
      this.state.dirLeft = false;
    }
  }

  updateStateByInput() {
    if(this.input.keyList['a'] && !this.input.keyList['d']) {
      this.state.speed.x -= 5;
    } else if(this.input.keyList['d'] && !this.input.keyList['a']) {
      this.state.speed.x += 5;
    }

    if(this.state.speed.x >= this.state.maxSpeed.x) {
      this.state.speed.x = this.state.maxSpeed.x;
    }
    if(this.state.speed.x <= -this.state.maxSpeed.x) {
      this.state.speed.x = -this.state.maxSpeed.x;
    }

    if(this.input.keyList['w'] && !this.input.keyList['s']) {
      this.state.speed.y -= 5;
    } else if(this.input.keyList['s'] && !this.input.keyList['w']) {
      this.state.speed.y += 5;
    }

    if(this.state.speed.y >= this.state.maxSpeed.y) {
      this.state.speed.y = this.state.maxSpeed.y;
    }
    if(this.state.speed.y <= -this.state.maxSpeed.y) {
      this.state.speed.y = -this.state.maxSpeed.y;
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

  getPartsTransform(partsName) {
    switch(partsName) {
      case 'body':
      return this.getBodyPartsTransform();

      case 'armR':
      return this.getArmRPartsTransform();

      case 'armL':
      return ;

      case 'legR':
      return this.getLegRPartsTransform();

      case 'legL':
      return this.getLegLPartsTransform();
    }
  }

  getBodyPartsTransform() {
    const bodyParent = this.getParentTransform('body');
    const bodyTransform = this.transform.body;

    const rotate = bodyParent.rotate + bodyTransform.rotate;
    const scale = bodyParent.scale * bodyTransform.scale;
    const rotateBody = rotateVec(bodyTransform.x, bodyTransform.y, rotate)

    return {
      x: bodyParent.x + rotateBody.x * scale,
      y: bodyParent.y + rotateBody.y * scale,
      rotate: rotate,
      scale: scale
    }
  }

  getArmRPartsTransform() {
    const bodyParent = this.getParentTransform('body');
    const armParent = this.getParentTransform('arm');
    const armRTransform = this.transform.armR;

    const rotate = armParent.rotate + armRTransform.rotate;
    const scale = bodyParent.scale * armRTransform.scale;
    const rotateArmR = rotateVec(armRTransform.x, armRTransform.y, rotate)

    return {
      x: armParent.x + rotateArmR.x * scale,
      y: armParent.y + rotateArmR.y * scale,
      rotate: rotate,
      scale: scale
    }
  }

  getLegRPartsTransform() {
    const bodyParent = this.getParentTransform('body');
    const legParent = this.getParentTransform('leg');
    const legRTransform = this.transform.legR;

    const rotate = legParent.rotate + legRTransform.rotate;
    const scale = bodyParent.scale * legRTransform.scale;
    const rotateLegR = rotateVec(legRTransform.x, legRTransform.y, rotate)

    return {
      x: legParent.x + rotateLegR.x * scale,
      y: legParent.y + rotateLegR.y * scale,
      rotate: rotate,
      scale: scale
    }
  }

  getLegLPartsTransform() {
    const bodyParent = this.getParentTransform('body');
    const legParent = this.getParentTransform('leg');
    const legLTransform = this.transform.legL;

    const rotate = legParent.rotate + legLTransform.rotate;
    const scale = bodyParent.scale * legLTransform.scale;
    const rotateLegL = rotateVec(legLTransform.x, legLTransform.y, rotate)

    return {
      x: legParent.x + rotateLegL.x * scale,
      y: legParent.y + rotateLegL.y * scale,
      rotate: rotate,
      scale: scale
    }
  }

  getParentTransform(partsName) {
    switch(partsName) {
      case 'body':
      return this.transform.unit;

      case 'arm':
      case 'armR':
      case 'armL':
      return this.getArmParentTransform();

      case 'shld':
      case 'shldR':
      case 'shldL':
      return this.getShldParentTransform();

      case 'leg':
      case 'legR':
      case 'legL':
      return this.getLegParentTransform();

      case 'back':
      return this.getBackParentTransform();
    }
  }

  getArmParentTransform() {
    const armJoint = this.parts.body.joint.arm;
    const bodyTransform = this.getPartsTransform('body');

    const rotateArmParent = rotateVec(armJoint.x, armJoint.y, bodyTransform.rotate);

    const armParentPosX = bodyTransform.x + rotateArmParent.x * bodyTransform.scale;
    const armParentPosY = bodyTransform.y + rotateArmParent.y * bodyTransform.scale;

    return {
      x: armParentPosX,
      y: armParentPosY,
      rotate: bodyTransform.rotate,
      scale: bodyTransform.scale
    };
  }

  getShldParentTransform() {
    const shldJoint = this.parts.body.joint.shld;
    const bodyTransform = this.getPartsTransform('body');

    const rotateShldParent = rotateVec(shldJoint.x, shldJoint.y, bodyTransform.rotate);

    const shldParentPosX = bodyTransform.x + rotateShldParent.x * bodyTransform.scale;
    const shldParentPosY = bodyTransform.y + rotateShldParent.y * bodyTransform.scale;

    return {
      x: shldParentPosX,
      y: shldParentPosY,
      rotate: bodyTransform.rotate,
      scale: bodyTransform.scale
    };
  }

  getLegParentTransform() {
    const legJoint = this.parts.body.joint.leg;
    const bodyTransform = this.getPartsTransform('body');

    const rotateLegParent = rotateVec(legJoint.x, legJoint.y, bodyTransform.rotate);

    const legParentPosX = bodyTransform.x + rotateLegParent.x * bodyTransform.scale;
    const legParentPosY = bodyTransform.y + rotateLegParent.y * bodyTransform.scale;

    return {
      x: legParentPosX,
      y: legParentPosY,
      rotate: bodyTransform.rotate,
      scale: bodyTransform.scale
    };
  }

  getBackParentTransform() {
    const backJoint = this.parts.body.joint.back;
    const bodyTransform = this.getPartsTransform('body');

    const rotateBackParent = rotateVec(backJoint.x, backJoint.y, bodyTransform.rotate);

    const backParentPosX = bodyTransform.x + rotateBackParent.x * bodyTransform.scale;
    const backParentPosY = bodyTransform.y + rotateBackParent.y * bodyTransform.scale;

    return {
      x: backParentPosX,
      y: backParentPosY,
      rotate: bodyTransform.rotate,
      scale: bodyTransform.scale
    };
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

  unitData[0].updateStateByInput();

  advanceFrame();

  unitData[0].updateImageList();

  draw();

  requestAnimationFrame(mainLoop);
}

const advanceFrame = function() {
  for(let frame = 0; frame < FRAME_SPLIT; frame ++) {
    advanceOneFrame();
  }

  if(Math.abs(unitData[0].state.speed.x) <= 1) {
    unitData[0].state.speed.x = 0;
  } else {
    if(unitData[0].state.speed.x > 0) {
      unitData[0].state.speed.x -= 1;
    } else {
      unitData[0].state.speed.x += 1;
    }
  }

  unitData[0].state.speed.y += 1;
}

const advanceOneFrame = function() {
  unitData[0].transform.unit.x += unitData[0].state.speed.x / FRAME_SPLIT;

  const unitTransform = unitData[0].transform.unit;
  const legJoint = unitData[0].parts.body.joint.leg;

  const groundHitCircle = {
    x: unitTransform.x + legJoint.x,
    y: unitTransform.y + legJoint.y,
    r: unitData[0].parts.leg.groundR
  }

  let isGround = false;
  let shortestD = groundHitCircle.r;
  let legAngle = 0;

  for(const obj of stageData.staticObjList) {
    if(obj.type == 'line') {
      const lineAngle = getDeg(Math.atan2(obj.vec.y, obj.vec.x));
      if(Math.abs(lineAngle) > 50) {
        continue;
      }

      const cVec1 = {x: groundHitCircle.x - obj.pos1.x, y: groundHitCircle.y - obj.pos1.y};
      const cVec2 = {x: groundHitCircle.x - obj.pos2.x, y: groundHitCircle.y - obj.pos2.y};
      if(getDot(obj.vec, cVec1) * getDot(obj.vec, cVec2) <= 0) {
        const d = Math.abs(getCrossZ(obj.vec, cVec1)) / obj.length;
        if(d < groundHitCircle.r) {
          isGround = true;
          if(d < shortestD) {
            shortestD = d;
            if(Math.abs(unitData[0].state.speed.x) <= 0) {
              legAngle = lineAngle * (unitData[0].state.dirLeft? 1: -1);
            }
          }
        }
      } else {
        const r2 = groundHitCircle.r * groundHitCircle.r;
        if(getDot(cVec1, cVec1) < r2 || getDot(cVec2, cVec2) < r2) {
          isGround = true;
        }
      }
    }
  }

  unitData[0].transform.legL.rotate = legAngle;
  unitData[0].transform.legR.rotate = legAngle;

  if(unitData[0].state.speed.y > 0) {
    if(!isGround) {
      unitData[0].transform.unit.y += unitData[0].state.speed.y / FRAME_SPLIT;
    }
  } else {
    unitData[0].transform.unit.y += unitData[0].state.speed.y / FRAME_SPLIT;
  }
}

const draw = function() {

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  drawStage(ctx);

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
    ctx.translate(transform.x, transform.y);
    if(!unitData[0].state.dirLeft) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(getRad(transform.rotate));
    ctx.scale(transform.scale, transform.scale);

    drawImage(ctx, imageSrc,
      imagePos.x, imagePos.y, imagePos.w, imagePos.h,
      imageX, imageY, imageW, imageH
    );

    ctx.restore();

    // const unitTransform = unitData[0].transform.unit;
    // const legJoint = unitData[0].parts.body.joint.leg;
    // const collisionR = unitData[0].parts.body.collisionR;
    // const groundR = unitData[0].parts.leg.groundR;
    // ctx.strokeStyle = "#0f0";
    // ctx.beginPath();
    // ctx.arc(unitTransform.x, unitTransform.y, collisionR, 0, Math.PI * 2, false);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(unitTransform.x + legJoint.x, unitTransform.y + legJoint.y, groundR, 0, Math.PI * 2, false);
    // ctx.stroke();
  }

  // if(unitData[0].state.dirLeft) {
  //   drawShldR(ctx, unitData, 0, new Transform());
  //   drawArmR(ctx, unitData, 1, new Transform());
  //   drawLegR(ctx, unitData, 0, new Transform());
  //   drawBody(ctx, unitData, 0, new Transform());
  //   drawBack(ctx, unitData, 0, new Transform());
  //   drawLegL(ctx, unitData, 0, new Transform());
  //   drawWeapon(ctx, unitData, 0, new Transform(0, 0, 0));
  //   drawArmL(ctx, unitData, 0, new Transform());
  //   drawShldL(ctx, unitData, 0, new Transform());
  //   drawWeapon(ctx, unitData, 1, new Transform(0, 0, 0));
  // } else {
  //   drawLegL(ctx, unitData, 0, new Transform());
  //   drawBack(ctx, unitData, 0, new Transform());
  //   drawBody(ctx, unitData, 0, new Transform());
  //   drawLegR(ctx, unitData, 0, new Transform());
  //   drawArmR(ctx, unitData, 0, new Transform());
  //   drawShldR(ctx, unitData, 0, new Transform());
  //   drawWeapon(ctx, unitData, 0, new Transform(0, 0, 0));
  //   drawArmL(ctx, unitData, 0, new Transform());
  //   drawShldL(ctx, unitData, 0, new Transform());
  //   drawWeapon(ctx, unitData, 1, new Transform(0, 0, 0));
  // }
  //
}

const drawBody = function(ctx, unitData, vtxId, imageTransform) {
  const bodyData = unitData[0].parts.body;
  const imageVtx = bodyData.vtxList[vtxId].imagePos;
  const pivotVtx = bodyData.vtxList[vtxId].pivot;
  const bodyTransform = unitData[0].transform.body;

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(bodyTransform.x, bodyTransform.y);
  ctx.rotate(getRad(bodyTransform.rotate));
  ctx.scale(bodyTransform.scale, bodyTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, bodyData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = bodyData.vtxList[vtxId].hitbox;
    const hx = imageX + hitboxVtx.x;
    const hy = imageY + hitboxVtx.y;

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
    ctx.strokeRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
  }

  ctx.restore();
}

const drawArmL = function(ctx, unitData, vtxId, imageTransform) {
  drawArm(ctx, unitData, vtxId, imageTransform, true);
}

const drawArmR = function(ctx, unitData, vtxId, imageTransform) {
  drawArm(ctx, unitData, vtxId, imageTransform, false);
}

const drawArm = function(ctx, unitData, vtxId, imageTransform, isLeft) {
  const armData = unitData[0].parts.arm;
  const imageVtx = armData.vtxList[vtxId].imagePos;
  const pivotVtx = armData.vtxList[vtxId].pivot;
  const armTransform = (isLeft)?unitData[0].transform.armL: unitData[0].transform.armR;

  const parentTransform = getArmParentTransform(unitData);

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(parentTransform.x, parentTransform.y);
  ctx.rotate(getRad(parentTransform.rotate));
  ctx.translate(parentTransform.jointX, parentTransform.jointY);
  ctx.translate(armTransform.x, armTransform.y);
  ctx.rotate(getRad(armTransform.rotate));
  ctx.scale(armTransform.scale, armTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, armData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = armData.vtxList[vtxId].hitbox;
    const hx = imageX + hitboxVtx.x;
    const hy = imageY + hitboxVtx.y;

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
    ctx.strokeRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
  }

  ctx.restore();
}

const getArmParentTransform = function(unitData) {
  const bodyData = unitData[0].parts.body;

  const armPosVtx = bodyData.joint.arm;
  const bodyTransform = unitData[0].transform.body;

  const armParentX = bodyTransform.x;
  const armParentY = bodyTransform.y;

  return {jointX: armPosVtx.x * bodyTransform.scale, jointY: armPosVtx.y * bodyTransform.scale,
    x: armParentX, y: armParentY, rotate: bodyTransform.rotate
  };
}

const drawShldL = function(ctx, unitData, vtxId, imageTransform) {
  drawShld(ctx, unitData, vtxId, imageTransform, true);
}

const drawShldR = function(ctx, unitData, vtxId, imageTransform) {
  drawShld(ctx, unitData, vtxId, imageTransform, false);
}

const drawShld = function(ctx, unitData, vtxId, imageTransform, isLeft) {
  const shldData = unitData[0].parts.shld;
  const imageVtx = shldData.vtxList[vtxId].imagePos;
  const pivotVtx = shldData.vtxList[vtxId].pivot;
  const shldTransform = (isLeft)?unitData[0].transform.shldL: unitData[0].transform.shldR;

  const parentTransform = getShldParentTransform(unitData);

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(parentTransform.x, parentTransform.y);
  ctx.rotate(getRad(parentTransform.rotate));
  ctx.translate(parentTransform.jointX, parentTransform.jointY);
  ctx.translate(shldTransform.x, shldTransform.y);
  ctx.rotate(getRad(shldTransform.rotate));
  ctx.scale(shldTransform.scale, shldTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, shldData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = shldData.vtxList[vtxId].hitbox;
    const hx = imageX + hitboxVtx.x;
    const hy = imageY + hitboxVtx.y;

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
    ctx.strokeRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
  }

  ctx.restore();
}

const getShldParentTransform = function(unitData) {
  const bodyData = unitData[0].parts.body;

  const shldPosVtx = bodyData.joint.shld;
  const bodyTransform = unitData[0].transform.body;

  const shldParentX = bodyTransform.x;
  const shldParentY = bodyTransform.y;

  return {jointX: shldPosVtx.x * bodyTransform.scale, jointY: shldPosVtx.y * bodyTransform.scale,
    x: shldParentX, y: shldParentY, rotate: bodyTransform.rotate
  };
}

const drawLegL = function(ctx, unitData, vtxId, imageTransform) {
  drawLeg(ctx, unitData, vtxId, imageTransform, true);
}

const drawLegR = function(ctx, unitData, vtxId, imageTransform) {
  drawLeg(ctx, unitData, vtxId, imageTransform, false);
}

const drawLeg = function(ctx, unitData, vtxId, imageTransform, isLeft) {
  const legData = unitData[0].parts.leg;
  const imageVtx = legData.vtxList[vtxId].imagePos;
  const pivotVtx = legData.vtxList[vtxId].pivot;
  const legTransform = (isLeft)?unitData[0].transform.legL: unitData[0].transform.legR;

  const parentTransform = getLegParentTransform(unitData);

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(parentTransform.x, parentTransform.y);
  ctx.rotate(getRad(parentTransform.rotate));
  ctx.translate(parentTransform.jointX, parentTransform.jointY);
  ctx.translate(legTransform.x, legTransform.y);
  ctx.rotate(getRad(legTransform.rotate));
  ctx.scale(legTransform.scale, legTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, legData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = legData.vtxList[vtxId].hitbox;
    const hx = imageX + hitboxVtx.x;
    const hy = imageY + hitboxVtx.y;

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
    ctx.strokeRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
  }

  ctx.restore();
}

const getLegParentTransform = function(unitData) {
  const bodyData = unitData[0].parts.body;

  const legPosVtx = bodyData.joint.leg;
  const bodyTransform = unitData[0].transform.body;

  const legParentX = bodyTransform.x;
  const legParentY = bodyTransform.y;

  return {jointX: legPosVtx.x * bodyTransform.scale, jointY: legPosVtx.y * bodyTransform.scale,
    x: legParentX, y: legParentY, rotate: bodyTransform.rotate
  };
}

const drawBack = function(ctx, unitData, vtxId, imageTransform) {
  const backData = unitData[0].parts.back;
  const imageVtx = backData.vtxList[vtxId].imagePos;
  const pivotVtx = backData.vtxList[vtxId].pivot;
  const backTransform = unitData[0].transform.back;

  const parentTransform = getBackParentTransform(unitData);

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(parentTransform.x, parentTransform.y);
  ctx.rotate(getRad(parentTransform.rotate));
  ctx.translate(parentTransform.jointX, parentTransform.jointY);
  ctx.translate(backTransform.x, backTransform.y);
  ctx.rotate(getRad(backTransform.rotate));
  ctx.scale(backTransform.scale, backTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, backData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = backData.vtxList[vtxId].hitbox;
    const hx = imageX + hitboxVtx.x;
    const hy = imageY + hitboxVtx.y;

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
    ctx.strokeRect(hx, hy, hitboxVtx.w, hitboxVtx.h);
  }

  ctx.restore();
}

const getBackParentTransform = function(unitData) {
  const bodyData = unitData[0].parts.body;

  const backPosVtx = bodyData.joint.back;
  const bodyTransform = unitData[0].transform.body;

  const backParentX = bodyTransform.x;
  const backParentY = bodyTransform.y;

  return {jointX: backPosVtx.x * bodyTransform.scale, jointY: backPosVtx.y * bodyTransform.scale,
    x: backParentX, y: backParentY, rotate: bodyTransform.rotate
  };
}

const drawWeapon = function(ctx, unitData, vtxId, imageTransform) {
  const weaponData = unitData[0].parts.weapon;
  const imageVtx = weaponData.vtxList[vtxId].imagePos;
  const pivotVtx = weaponData.vtxList[vtxId].pivot;
  const weaponTransform = unitData[0].transform.weapon;

  const parentTransform = getWeaponParentTransform(unitData);

  const imageX = -pivotVtx.x;
  const imageY = -pivotVtx.y;
  const imageW = imageVtx.w;
  const imageH = imageVtx.h;

  ctx.save();
  ctx.translate(parentTransform.x, parentTransform.y);
  ctx.rotate(getRad(parentTransform.rotate));
  ctx.translate(weaponTransform.x, weaponTransform.y);
  ctx.rotate(getRad(weaponTransform.rotate));
  ctx.scale(weaponTransform.scale, weaponTransform.scale);
  ctx.translate(imageTransform.x, imageTransform.y);
  ctx.rotate(getRad(imageTransform.rotate));
  ctx.scale(imageTransform.scale, imageTransform.scale);

  drawImage(ctx, weaponData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    imageX, imageY, imageW, imageH
  );

  ctx.restore();
}

const getWeaponParentTransform = function(unitData) {
  const bodyData = unitData[0].parts.body;
  const armData = unitData[0].parts.arm;

  const armPosVtx = bodyData.joint.arm;
  const bodyTransform = unitData[0].transform.body;

  const handPosVtx = armData.joint.hand;
  const armLTransform = unitData[0].transform.armL;

  const weaponParentRotate = bodyTransform.rotate + armLTransform.rotate;

  const armPos = rotateVec(armPosVtx.x, armPosVtx.y, bodyTransform.rotate);
  const handPos = rotateVec(handPosVtx.x, handPosVtx.y, weaponParentRotate);

  const weaponParentX = bodyTransform.x + armPos.x * bodyTransform.scale + armLTransform.x + handPos.x * armLTransform.scale;
  const weaponParentY = bodyTransform.y + armPos.y * bodyTransform.scale + armLTransform.y + handPos.y * armLTransform.scale;

  return {x: weaponParentX, y: weaponParentY, rotate: weaponParentRotate};
}

const drawParts = function(ctx, drawOption, partsData, vtxId) {

  const imageVtx = partsData.vtxList[vtxId].imagePos;

  drawImage(ctx, partsData.imageSrc,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    drawOption.dx, drawOption.dy,
    imageVtx.w, imageVtx.h
  );

  if(DRAW_HITBOX) {
    const hitboxVtx = partsData.vtxList[vtxId].hitbox;
    drawHitbox(ctx, drawOption, hitboxVtx);
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
