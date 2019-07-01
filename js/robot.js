let scale = 5;
let unitData;
let stageData;

const Engine = Matter.Engine;
const Render  = Matter.Render;
const Runner  = Matter.Runner;
const World  = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  canvas: $('#wireframe')[0],
  engine: engine,
  options: {
    width: 1920,
    height: 1080,
    background: 'transparent',
    wireframeBackground: 'transparent',
    wireframes: true
  }
});

Render.run(render);  //ステージを配置させる記述？

Engine.run(engine);  //物理エンジンを実行？

class Unit {
  parts
  partsIdList
  transform
  state
  movingBody
  bodyList

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

const addStageBodies = function() {
  const matterBodyList = [];

  const bodyList = stageData.vtxList.bodyList;
  for(const body of bodyList) {
    for(let i = 0; i < body.length - 1; i++) {
      const linePos1 = body[i];
      const linePos2 = body[i + 1];

      const difX = linePos1.x - linePos2.x;
      const difY = linePos1.y - linePos2.y;

      const width = Math.sqrt(difX * difX + difY * difY);

      const posX = (linePos1.x + linePos2.x) / 2;
      const posY = (linePos1.y + linePos2.y) / 2;

      const rad = Math.atan2(difY, difX);

      const deg = Math.abs(rad * 180 / Math.PI);

      let friction = 0;
      if(deg < 45) {
        friction = 1;
      }

      const matterBody = Bodies.rectangle(posX, posY, width, 20, {
        isStatic: true,
        restitution: 0,
        friction: 1,
        frictionStatic: 1
      });
      Matter.Body.rotate(matterBody, rad);
      matterBodyList.push(matterBody);
    }
  }

  World.add(world, matterBodyList);
}

const addUnitBody = function(unitData) {

}

let rect1, rect2, cstr, comp;

$(function() {
  unitData = new Unit();
  stageData = new Stage();

  unitData.movingBody = Bodies.circle(500, 0, 30, {
    restitution: 0, friction: 1, frictionStatic: 1, mass: 10
  });
  unitData.movingBody.collisionFilter = {
    group: 0,
    category: 2,
    mask: 1
  }

  World.add(world, [unitData.movingBody]);

  addStageBodies()

  addUnitBody(unitData);

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
  const velY = unitData.movingBody.velocity.y;
  if(keyList['a']) {
    // Body.setVelocity(unitData.movingBody, {x: -5, y: velY});
    Body.applyForce(unitData.movingBody, {x: unitData.movingBody.position.x, y: unitData.movingBody.position.y}, {x: -0.02, y: 0});
  }
  if(keyList['d']) {
    // Body.setVelocity(unitData.movingBody, {x: 5, y: velY});
    Body.applyForce(unitData.movingBody, {x: unitData.movingBody.position.x, y: unitData.movingBody.position.y}, {x: 0.02, y: 0});
  }

  const velX = unitData.movingBody.velocity.x;
  if(keyList['w']) {
    // Body.setVelocity(unitData.movingBody, {x: velX, y: -5});
    Body.applyForce(unitData.movingBody, {x: unitData.movingBody.position.x, y: unitData.movingBody.position.y}, {x: 0, y: -0.02});
  }
  if(keyList['s']) {
    // Body.setVelocity(unitData.movingBody, {x: velX, y: 5});
    Body.applyForce(unitData.movingBody, {x: unitData.movingBody.position.x, y: unitData.movingBody.position.y}, {x: 0, y: 0.02});
  }
  // Body.setAngle(unitData.movingBody, 0);

  unitData.transform.body.x = unitData.movingBody.position.x;
  unitData.transform.body.y = unitData.movingBody.position.y;

  // unitData.transform.body.rotate = unitData.movingBody.angle * 180 / Math.PI;

  draw();

  requestAnimationFrame(mainLoop);
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
  drawWeapon(ctx, unitData, 0, new Transform(0, 0, 0));
  drawArmL(ctx, unitData, 0, new Transform());
  drawShldL(ctx, unitData, 0, new Transform());
  drawWeapon(ctx, unitData, 1, new Transform(0, 0, 0));

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


}

const drawImage = function(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
  if(image != null) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}
