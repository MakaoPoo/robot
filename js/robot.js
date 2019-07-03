let scale = 5;
let unitData;
let stageData;

class Unit {
  parts
  partsIdList
  transform
  state

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
      body: new Transform(128, 128, 0, 1),
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
      speed: {x: 0, y: 0}
    }

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

}

$(window).resize(function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas.width();
  $canvas[0].height = $canvas.height();

});

$(function() {
  unitData = new Unit();
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

let keyList = {};

$(document).on('keydown', function(e) {
  if(!e) e = window.event;
  if(keyList[e.key]) {
    return;
  }
  keyList[e.key] = true;
  console.log(keyList);
});

$(document).on('keyup', function(e) {
  if(!e) e = window.event;

  keyList[e.key] = false;
  console.log(keyList);
});

const mainLoop = function(){
  // unitData.transform.body.rotate += 1;

  if(keyList['a'] && !keyList['d']) {
    unitData.state.speed.x = -5;
  } else if(keyList['d'] && !keyList['a']) {
    unitData.state.speed.x = 5;
  } else {
    unitData.state.speed.x = 0;
  }

  if(keyList['w'] && !keyList['s']) {
    unitData.state.speed.y -= 5;
  } else if(keyList['s'] && !keyList['w']) {
    unitData.state.speed.y += 5;
  } else {
    // unitData.state.speed.y = 0;
    unitData.state.speed.y += 1;
  }

  if(unitData.state.speed.y >= 10) {
    unitData.state.speed.y = 10;
  }
  if(unitData.state.speed.y <= -10) {
    unitData.state.speed.y = -10;
  }

  advanceFrame();

  draw();

  requestAnimationFrame(mainLoop);
}

const advanceFrame = function() {
  for(let frame = 0; frame < FRAME_SPLIT; frame ++) {

    advanceOneFrame();
  }
}

const advanceOneFrame = function() {
  unitData.transform.body.x += unitData.state.speed.x / FRAME_SPLIT;
  // unitData.transform.body.y += unitData.state.speed.y / FRAME_SPLIT;

  let isGround = false;

  const bodyTransform = unitData.transform.body;
  const legJoint = unitData.parts.body.joint.leg;

  const groundHitCircle = {
    x: bodyTransform.x + legJoint.x,
    y: bodyTransform.y + legJoint.y,
    r: unitData.parts.leg.groundR
  }

  for(const obj of stageData.staticObjList) {
    if(obj.type == 'line') {
      const cVec1 = {x: groundHitCircle.x - obj.pos1.x, y: groundHitCircle.y - obj.pos1.y};
      const cVec2 = {x: groundHitCircle.x - obj.pos2.x, y: groundHitCircle.y - obj.pos2.y};
      if(getDot(obj.vec, cVec1) * getDot(obj.vec, cVec2) <= 0) {
        const d = Math.abs(getCrossZ(obj.vec, cVec1)) / obj.length;
        if(d < groundHitCircle.r) {
          isGround = true;
        }
      } else {
        const r2 = groundHitCircle.r * groundHitCircle.r;
        if(getDot(cVec1, cVec1) < r2 || getDot(cVec2, cVec2) < r2) {
          isGround = true;
        }
      }
    }
  }

  if(unitData.state.speed.y > 0) {
    if(!isGround) {
      unitData.transform.body.y += unitData.state.speed.y / FRAME_SPLIT;
    }
  } else {
    unitData.transform.body.y += unitData.state.speed.y / FRAME_SPLIT;
  }
}

const draw = function() {

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  drawStage(ctx);

  drawShldR(ctx, unitData, 0, new Transform());
  drawArmR(ctx, unitData, 0, new Transform());
  drawLegR(ctx, unitData, 0, new Transform());
  drawBody(ctx, unitData, 0, new Transform());
  drawBack(ctx, unitData, 0, new Transform());
  drawLegL(ctx, unitData, 0, new Transform());
  // drawWeapon(ctx, unitData, 0, new Transform(0, 0, 0));
  // drawArmL(ctx, unitData, 0, new Transform());
  // drawShldL(ctx, unitData, 0, new Transform());
  // drawWeapon(ctx, unitData, 1, new Transform(0, 0, 0));

  const bodyTransform = unitData.transform.body;
  const legJoint = unitData.parts.body.joint.leg;
  const collisionR = unitData.parts.body.collisionR;
  const groundR = unitData.parts.leg.groundR;
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.arc(bodyTransform.x, bodyTransform.y, collisionR, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bodyTransform.x + legJoint.x, bodyTransform.y + legJoint.y, groundR, 0, Math.PI * 2, false);
  ctx.stroke();
}

const drawBody = function(ctx, unitData, vtxId, imageTransform) {
  const bodyData = unitData.parts.body;
  const imageVtx = bodyData.vtxList[vtxId].imagePos;
  const pivotVtx = bodyData.vtxList[vtxId].pivot;
  const bodyTransform = unitData.transform.body;

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
  const armData = unitData.parts.arm;
  const imageVtx = armData.vtxList[vtxId].imagePos;
  const pivotVtx = armData.vtxList[vtxId].pivot;
  const armTransform = (isLeft)?unitData.transform.armL: unitData.transform.armR;

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
  const bodyData = unitData.parts.body;

  const armPosVtx = bodyData.joint.arm;
  const bodyTransform = unitData.transform.body;

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
  const shldData = unitData.parts.shld;
  const imageVtx = shldData.vtxList[vtxId].imagePos;
  const pivotVtx = shldData.vtxList[vtxId].pivot;
  const shldTransform = (isLeft)?unitData.transform.shldL: unitData.transform.shldR;

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
  const bodyData = unitData.parts.body;

  const shldPosVtx = bodyData.joint.shld;
  const bodyTransform = unitData.transform.body;

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
  const legData = unitData.parts.leg;
  const imageVtx = legData.vtxList[vtxId].imagePos;
  const pivotVtx = legData.vtxList[vtxId].pivot;
  const legTransform = (isLeft)?unitData.transform.legL: unitData.transform.legR;

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
  const bodyData = unitData.parts.body;

  const legPosVtx = bodyData.joint.leg;
  const bodyTransform = unitData.transform.body;

  const legParentX = bodyTransform.x;
  const legParentY = bodyTransform.y;

  return {jointX: legPosVtx.x * bodyTransform.scale, jointY: legPosVtx.y * bodyTransform.scale,
    x: legParentX, y: legParentY, rotate: bodyTransform.rotate
  };
}

const drawBack = function(ctx, unitData, vtxId, imageTransform) {
  const backData = unitData.parts.back;
  const imageVtx = backData.vtxList[vtxId].imagePos;
  const pivotVtx = backData.vtxList[vtxId].pivot;
  const backTransform = unitData.transform.back;

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
  const bodyData = unitData.parts.body;

  const backPosVtx = bodyData.joint.back;
  const bodyTransform = unitData.transform.body;

  const backParentX = bodyTransform.x;
  const backParentY = bodyTransform.y;

  return {jointX: backPosVtx.x * bodyTransform.scale, jointY: backPosVtx.y * bodyTransform.scale,
    x: backParentX, y: backParentY, rotate: bodyTransform.rotate
  };
}

const drawWeapon = function(ctx, unitData, vtxId, imageTransform) {
  const weaponData = unitData.parts.weapon;
  const imageVtx = weaponData.vtxList[vtxId].imagePos;
  const pivotVtx = weaponData.vtxList[vtxId].pivot;
  const weaponTransform = unitData.transform.weapon;

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
  const bodyData = unitData.parts.body;
  const armData = unitData.parts.arm;

  const armPosVtx = bodyData.joint.arm;
  const bodyTransform = unitData.transform.body;

  const handPosVtx = armData.joint.hand;
  const armLTransform = unitData.transform.armL;

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
