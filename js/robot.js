let scale = 5;
let unitData = {};
let stageData;

class Unit {
  constructor() {
    this.parts = partsListTemplate();
    this.partsIdList = partsListTemplate(
      "000", //ボディ
      "000", //アーム
      "001", //ショルダー
      "000", //レッグ
      "000", //バック
      "001"  //ウェポン
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

    this.spec = {
      walkSpeed: 6,
      dashSpeed: 15,
      jumpSpeed: 15,
      stepSpeed: 20,
      walkAccel: 2,
      dashAccel: 0.5,
      jumpAccel: 0.5
    }

    this.state = {
      pos: {x: 0, y: 0},
      speed: {x: 0, y: 0},
      accel: {x: 0, y: 0},
      frameSplitSpeed: {x: 0, y: 0},
      maxSpeed: {x: 0, y: 0},
      dirLeft: true,
      ground: {
        flag: false,
        angle: 0,
        attraction: 0
      },
      dash: false,
      walkType: 'walk',
    }

    this.motion = {
      moveFrame: 0,
      frame: 0,
      id: '000000',
      option: {},
      type: {},
      cancel: {}
    };

    this.input = new Input();

    this.interface = new Interface();

    this.imageList = [];
    this.hitboxList = [];
  }

  getMotionId() {
    return this.motion.id;
  }

  setMotion(id, option) {
    if(this.motion.id != id) {
      this.motion.frame = 0;
      this.motion.option = {};
    }
    this.motion.id = id;

    MOTION_CLASS_LIST[this.motion.id].initMotionState(this);
  }

  resetMotion(id, option) {
    this.motion.id = id;
    this.motion.frame = 0;
    this.motion.option = {};

    MOTION_CLASS_LIST[this.motion.id].initMotionState(this);
  }

  advanceMotion() {
    this.motion.frame += 1;
  }

  matchMotion(motionList) {
    for(const motionId of motionList) {
      if(this.motion.id == motionId) {
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

  getFrontAccel() {
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
    const spec = this.spec;
    const input = this.input;
    state.accel = {x: 0, y: 0};

    if(input.getLongPressKeyFrame('attack1') == 0 && this.getMotionId() == '000000') {
      this.resetMotion('000002');
    }

    if(input.isPressDoubleKey('left')) {
      this.resetMotion('000001');
      this.motion.option.dirLeft = true;
    }
    if(input.isPressDoubleKey('right')) {
      this.resetMotion('000001');
      this.motion.option.dirLeft = false;
    }

    if(this.motion.id != null) {
      MOTION_CLASS_LIST[this.motion.id].updateState(this);
    }

    if(state.speed.x * state.accel.x <= 0) {
      const friction = (this.isGround())? GROUND_FRICTION: AIR_FRICTION;
      if(Math.abs(state.speed.x) <= friction) {
        state.speed.x = 0;
      } else {
        if(state.speed.x > 0) {
          state.speed.x -= friction;
        } else {
          state.speed.x += friction;
        }
      }
    }

    if(Math.abs(state.speed.x) < MIN_SPEED
    && Math.abs(state.speed.x + state.accel.x) < MIN_SPEED
    && state.speed * state.accel.x <= 0) {
      state.speed.x = 0;
    } else {
      state.speed.x += state.accel.x;
    }

    state.speed.y += state.accel.y;

    this.restSpeed();

    if(this.motion.id != null) {
      MOTION_CLASS_LIST[this.motion.id].attachTransform(this);
    }

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
  loadGameData();

  loading(function() {
    let dataComplete = 0;

    for(const partsType in ALL_PARTS_NUMS) {
      const partsNums = ALL_PARTS_NUMS[partsType];
      console.log(Object.keys(PARTS_CLASS_LIST[partsType]).length + ' / ' + partsNums);
      if(Object.keys(PARTS_CLASS_LIST[partsType]).length == partsNums) {
        dataComplete += 1;
      }
    }

    for(let i = 0; i < ALL_MOTION_NUMS; i++) {
      console.log(Object.keys(MOTION_CLASS_LIST).length + ' / ' + ALL_MOTION_NUMS);
      if(Object.keys(MOTION_CLASS_LIST).length == ALL_MOTION_NUMS + 1) {
        dataComplete += 1;
      }
    }
    console.log(dataComplete);

    if(dataComplete == 6) {
      return true;
    }

    return false;
  },
  function() {
    mainFunc();
  });
});

$(window).on("beforeunload", function(e) {
  if(userId) {
    fireDB.collection('connected-users').doc(userId).delete();
  }

  peer.close();

  return true;
});

const mainFunc = function() {
  settingFirebase();

  $(window).resize();

  const $canvas = $('#mainCanvas');
  $canvas[0].requestPointerLock = $canvas[0].requestPointerLock || $canvas[0].mozRequestPointerLock || $canvas[0].webkitRequestPointerLock;

  mainLoop();
}

let fireDB;
let userId = null;
let peer = null;
const connectPeerList = {};
let room = null;

const settingFirebase = function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCSWbnyqm93KHO5sumdATEHZJdum5EPN1Q",
    authDomain: "robot-game1240.firebaseapp.com",
    databaseURL: "https://robot-game1240.firebaseio.com",
    projectId: "robot-game1240",
    storageBucket: "robot-game1240.appspot.com",
    messagingSenderId: "674008149375",
    appId: "1:674008149375:web:66f506b480fa938d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  fireDB = firebase.firestore();

  peer = new Peer(userId, {
    key: '40af87a6-ce27-49cf-aee0-970f0d1737ee'
  });

  peer.on('open', function() {
    userId = peer.id;

    room = peer.joinRoom("test", {
      mode: 'mesh'
    });
    room.on('open', function() {
      console.log(room.connections);
      unitData[userId] = new Unit();

      for(const id in room.connections) {
        unitData[id] = new Unit();
      }

      room.on('data', function(data) {
        const id = data.src;
        if(!unitData[id]) {
          unitData[id] = new Unit();
        }
        if(data.data.input) {
          for(const key in data.data.input) {
            unitData[id].input[key] = data.data.input[key];
          }
          for(const key in data.data.transform) {
            unitData[id].transform[key] = data.data.transform[key];
          }
        }
      });

      room.on('peerJoin', function(id) {
        if(!unitData[id]) {
          unitData[id] = new Unit();
        }
      });

      room.on('peerLeave', function(id) {
        if(unitData[id]) {
          delete unitData[id]
        }
      });
    });

    // fireDB.collection('connected-users').doc(userId).set({
    //   name: "makapoo"
    // }).then(function(data) {
    //   localStorage.removeItem('userId', userId);
    //
    //   // connectAnother();
    //
    //   console.log(userId);
    //
    // });
  });


  // unitData.push(new Unit());
  stageData = new STAGE_CLASS_LIST['000']();
}

const connectAnother = function() {
  fireDB.collection("connected-users").onSnapshot(function(col) {
    console.log("Current data: ", col.docs);

    for(const doc of col.docs) {
      if(!(unitData[doc.id]) && doc.id != userId) {
        unitData[doc.id] = new Unit();
      }

      if(!connectPeerList[doc.id]) {
        console.log(peer);
        peer.connect(doc.id);

        peer.on('connection',function(connPeer) {
          connectPeerList[doc.id] = connPeer;

          connectPeerList[doc.id].on('data', function(data) {
            console.log('Received', data);
          });

          connectPeerList[doc.id].on('close', function() {
            delete connectPeerList[doc.id];
          });

        });
      }
    }

    if(Object.keys(unitData).length != col.docs.length) {
      for(const userId in unitData) {
        let existDB = false;

        for(const doc of col.docs) {
          if(doc.id == userId) {
            existDB = true;
            break;
          }
        }

        if(!existDB) {
          delete unitData[userId]
        }
      }
    }

  });
}

const peerList = [];

$('#mainCanvas').on('click', function() {
  if(document.pointerLockElement === null) {
    $(this)[0].requestPointerLock();
  }
});

$('#mainCanvas').on('mousedown', function(e) {
  if(document.pointerLockElement === null) {
    return;
  }

  if(userId == null || !unitData[userId]) {
    return;
  }

  const input = unitData[userId].input;

  let mouseCode = null;
  if(e.button == 0) {
    mouseCode = 'mouseL';
  } else if(e.button == 1) {
    mouseCode = 'mouseC';
  } else if(e.button == 2) {
    mouseCode = 'mouseR';
  }

  if(mouseCode != null) {
    if(input.getKeyCodeFlag('mouseL')) {
      return;
    }

    input.keyPress(mouseCode);
  }

});

$('#mainCanvas').on('mouseup', function(e) {
  if(document.pointerLockElement === null) {
    return;
  }

  if(userId == null || !unitData[userId]) {
    return;
  }

  const input = unitData[userId].input;

  let mouseCode = null;
  if(e.button == 0) {
    mouseCode = 'mouseL';
  } else if(e.button == 1) {
    mouseCode = 'mouseC';
  } else if(e.button == 2) {
    mouseCode = 'mouseR';
  }

  if(mouseCode != null) {
    input.keyUp(mouseCode);
  }

});

$(document).on('keydown', function(e) {
  if(userId == null || !unitData[userId]) {
    return;
  }

  const input = unitData[userId].input;

  if(input.getKeyCodeFlag(e.key)) {
    return;
  }

  input.keyPress(e.key);

});

$(document).on('keyup', function(e) {
  if(userId == null || !unitData[userId]) {
    return;
  }

  const input = unitData[userId].input;
  input.keyUp(e.key);

});

$(document).on('mousemove', function(e) {
  if(userId == null || !unitData[userId]) {
    return;
  }

  if(document.pointerLockElement === $('#mainCanvas')[0]) {
    const input = unitData[userId].input;
    e = e.originalEvent;
    input.moveMouse(e.movementX, e.movementY);
  }

});

$('#punicon').on('touchstart', function(e) {
  if(userId == null || !unitData[userId]) {
    return;
  }

  const input = unitData[userId].input;

  const $punicon = $('#punicon');
  const $lever = $('#punicon_lever');
  const $movable = $('#punicon_movable_circle');

  const puniconLeft = $punicon.offset().left;
  const puniconTop = $punicon.offset().top;

  const centerX = $punicon.width() / 2;
  const centerY = $punicon.height() / 2;

  const movableR = $movable.width() / 2;

  const leverWidth = $lever.width();
  const leverHeight = $lever.height();

  const moveLever = function(e) {
    let touchX = e.touches[0].pageX - puniconLeft - centerX;
    let touchY = e.touches[0].pageY - puniconTop - centerY;

    if(touchX * touchX + touchY * touchY > movableR * movableR) {
      const touchRad = Math.atan2(touchY, touchX);

      touchX = movableR * Math.cos(touchRad);
      touchY = movableR * Math.sin(touchRad);
    }

    const leverX = touchX - leverWidth / 2;
    const leverY = touchY - leverHeight / 2;

    $lever.css('transform', 'translate('+ leverX +'px, '+ leverY +'px)')

    let keyList = {a: -1, d: -1, w: -1, s: -1};

    if(touchX * touchX + touchY * touchY > movableR * movableR * 0.25) {
      if(Math.abs(touchX / touchY) > 0.5) {
        if(touchX < 0) {
          if(!input.getKeyCodeFlag('a')) {
            keyList['a'] = 1;
          } else {
            keyList['a'] = 0;
          }
        }

        if(touchX > 0) {
          if(!input.getKeyCodeFlag('d')) {
            keyList['d'] = 1;
          } else {
            keyList['d'] = 0;
          }
        }

      }

      if(Math.abs(touchY / touchX) > 0.5) {
        if(touchY < 0) {
          if(!input.getKeyCodeFlag('w')) {
            keyList['w'] = 1;
          } else {
            keyList['w'] = 0;
          }
        }

        if(touchY > 0) {
          if(!input.getKeyCodeFlag('s')) {
            keyList['s'] = 1;
          } else {
            keyList['s'] = 0;
          }
        }

      }
    }

    for(const keyCode in keyList) {
      const keyFlag = keyList[keyCode];
      if(keyFlag == 1) {
        input.keyPress(keyCode);
      }
      if(keyFlag == -1) {
        input.keyUp(keyCode);
      }
    }

  };

  moveLever(e);

  $('html').on('touchmove.punicon', function(e) {
    moveLever(e);

  });
  $('html').on('touchend.punicon', function(e) {
    $lever.css('transform', 'translate(-50%, -50%)')

    input.keyUp('d');
    input.keyUp('a');
    input.keyUp('w');
    input.keyUp('s');

    $('html').off('touchmove.punicon');
    $('html').off('touchend.punicon');
  });

  return false;
});

const mainLoop = function(){
  if(room && userId != null) {
    for(const id in room.connections) {
      room.send({
        transform: unitData[userId].transform,
        input: unitData[userId].input
      });
    }
  }

  for(const id in unitData) {
    unitData[id].dirTurn();
    unitData[id].updateUnitState();
  }

  advanceFrame();

  for(const id in unitData) {
    unitData[id].updateImageList();
  }

  draw();

  requestAnimationFrame(mainLoop);
  // setTimeout(mainLoop, 50);
}

const advanceFrame = function() {
  for(const id in unitData) {
    unitData[id].state.ground.flag = false;
    unitData[id].state.ground.angle = FLOOR_BORDER_ANGLE;
    unitData[id].state.ground.attraction = 0;
    unitData[id].state.frameSplitSpeed = {
      x: unitData[id].state.speed.x / FRAME_SPLIT,
      y: unitData[id].state.speed.y / FRAME_SPLIT
    }
  }

  for(let frame = 0; frame < FRAME_SPLIT; frame ++) {
    for(const id in unitData) {
      advanceOneFrame(unitData[id]);
    }
  }

}

const advanceOneFrame = function(unitData) {
  unitData.transform.x += unitData.state.frameSplitSpeed.x;
  unitData.transform.y += unitData.state.frameSplitSpeed.y;

  const unitTransform = unitData.transform;
  const legJoint = unitData.parts.body.joint.legR;

  const collisionR = unitData.parts.body.collisionR;
  const groundR = unitData.parts.leg.groundR;

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

    unitData.transform.x += pushX;
    unitData.transform.y += pushY;

    if(unitData.state.speed.x * pushX < -1) {
      unitData.state.speed.x += pushX;
    }
    if(unitData.state.speed.y * pushY < -1) {
      unitData.state.speed.y += pushY;
    }
  }
  if(ground.flag) {
    unitData.state.ground.attraction = ground.attraction;
    unitData.state.ground.flag = true;
    unitData.state.ground.angle = ground.angle;
    const pushY = ground.nearestNvec.y * (ground.hitCircle.r - ground.shortestD);
    unitData.transform.y += pushY / Math.cos(getRad(unitData.state.ground.angle));

    if(unitData.state.speed.y > 1) {
      unitData.state.speed.y += pushY;
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

const effect = new Image();
effect.src = "resource/beam.png";
let efX, efY;

const drawUnit = function(ctx, unitData) {
  unitData.imageList.sort(function(a, b) {
    if(a.zIndex < b.zIndex) {
      return (unitData.isLeft()? 1: -1);
    }
    if(a.zIndex > b.zIndex) {
      return (unitData.isLeft()? -1: 1);
    }

    return 0;
  });

  const unitTransform = unitData.transform;
  for(const image of unitData.imageList) {
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
    if(!unitData.isLeft()) {
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
}

const drawUnitHitbox = function(ctx, unitData) {
  const legJoint = unitData.parts.body.joint.legR;
  const collisionR = unitData.parts.body.collisionR;
  const groundR = unitData.parts.leg.groundR;
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.arc(unitTransform.x, unitTransform.y, collisionR, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(unitTransform.x + legJoint.x, unitTransform.y + legJoint.y, groundR, 0, Math.PI * 2, false);
  ctx.stroke();
}

const kisekiSetFrame = 1;
let kisekiNum = 20 / kisekiSetFrame;

let kiseki = [];
let kisekiHeight = [];

for(let i = 0; i <= kisekiNum; i++) {
  kiseki.push({start: {x: 0, y: 0}, end: {x: 0, y: 0}});
  kisekiHeight.push(effect.height*i/kisekiNum);
}

let kisekiFrame = 0;

const draw = function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  drawStage(ctx);

  for(const id in unitData) {
    drawUnit(ctx, unitData[id]);
  }

  if(unitData[userId]) {
    kisekiFrame = (kisekiFrame + 1) % kisekiSetFrame;
    if(kisekiFrame == 0) {
      for(let i = 0; i < kiseki.length - 1; i++) {
        kiseki[i] = kiseki[i + 1];
      }
    }

    const sbX = unitData[userId].transform.x - 150;
    const sbY = unitData[userId].transform.y - 70;
    kiseki[kiseki.length - 1] = {
      start: {x: sbX, y: sbY},
      end: {x: sbX + 130 , y: sbY + 85}
    }

    drawPathImage(ctx, effect,
      kisekiHeight,
      kiseki
    );
  }

  if(userId != null && unitData[userId]) {
    if(unitData[userId].motion.id == '000002') {
      ctx.save();
      if(unitData[userId].motion.frame >= 4) {
        if(unitData[userId].motion.frame <= 8) {
          efX = unitData[userId].transform.x - 80;
          efY = unitData[userId].transform.y - 40;
        }

        const alphaFrame = (unitData[userId].motion.frame - 3);
        let alpha = (1.0 - alphaFrame* 0.05) / (alphaFrame);
        if(alpha < 0.05) {
          alpha = 0;
        }
        ctx.globalAlpha = alpha * 1;
        if(effect.width != 0) {

          const width = effect.width * (0.8 - alpha * 0.2);
          const height = effect.height * (0.7 - alpha * 0.2);

          drawImage(ctx, effect,
            0, 0, effect.width, effect.height,
            efX - width / 2, efY - height / 2, width, height
          );
        }

      }

      ctx.restore();
    }

    const pointerImage = unitData[userId].interface.getPointerImage();

    if(pointerImage) {
      drawImage(ctx, pointerImage.imageSrc,
        pointerImage.x, pointerImage.y,
        pointerImage.width, pointerImage.height,
        unitData[userId].input.getMouseX() - pointerImage.width,
        unitData[userId].input.getMouseY() - pointerImage.height,
        pointerImage.width * 2, pointerImage.height * 2
      );
    }

  }

  if(DRAW_HITBOX) {
    for(const id in unitData) {
      drawUnitHitbox(ctx, unitData[id]);
    }
  }
}

const drawPathImage = function(ctx, image, pointList, lineList) {
  if(pointList.length != lineList.length) {
    return;
  }

  for(let i = 0; i < pointList.length - 1; i++) {
    const line1 = lineList[i];
    const line2 = lineList[i + 1];
    const point = {
      start: pointList[i],
      end: pointList[i + 1]
    }

    const halfCenterPos = [
      getCenterPos(line1.start, line2.end),
      getCenterPos(line2.start, line1.end)
    ];

    const centerPos = getCenterPos(halfCenterPos[0], halfCenterPos[1]);

    drawSkewImage(ctx, image, point, line1.start, line1.end, centerPos, 0);
    drawSkewImage(ctx, image, point, line1.end, line2.end, centerPos, 1);
    drawSkewImage(ctx, image, point, line2.end, line2.start, centerPos, 2);
    drawSkewImage(ctx, image, point, line2.start, line1.start, centerPos, 3);
  }

}

const drawSkewImage = function(ctx, image, point, pos1, pos2, posC, areaNum) {
  const vecEdge = getVector(pos1, pos2);
  const vec1C = getVector(pos1, posC);
  const vec2C = getVector(pos2, posC);
  const verVec1Length = getCrossZ(vecEdge, vec1C) / vecEdge.length;
  const skew = getDot(vecEdge, vec1C) / vecEdge.length - vecEdge.length / 2;

  ctx.save();

  ctx.beginPath();

  const len1 = vec2C.length;
  const len2 = vec1C.length;
  const lenC = vecEdge.length;

  const triCenter = {
    x: (pos1.x * len1 + pos2.x * len2 + posC.x * lenC) / (len1 + len2 + lenC),
    y: (pos1.y * len1 + pos2.y * len2 + posC.y * lenC) / (len1 + len2 + lenC)
  }

  const expand = 0.005;
  const vecT1 = getVecNoLength(triCenter, pos1);
  const vecT2 = getVecNoLength(triCenter, pos2);
  const vecTC = getVecNoLength(triCenter, posC);

  ctx.moveTo(pos1.x + vecT1.x * expand, pos1.y + vecT1.y * expand);
  ctx.lineTo(posC.x + vecTC.x * expand, posC.y + vecTC.y * expand);
  ctx.lineTo(pos2.x + vecT2.x * expand, pos2.y + vecT2.y * expand);
  ctx.closePath();
  ctx.clip();

  ctx.translate(pos1.x, pos1.y);
  ctx.rotate(Math.atan2(vecEdge.y, vecEdge.x));

  const imageAreaHeight = point.end - point.start;

  switch(areaNum) {
    case 0:
    ctx.transform(vecEdge.length / image.width, 0, 2 * skew / imageAreaHeight, verVec1Length / imageAreaHeight * 2, 0, 0);
    ctx.translate(0, -point.start);
    break;

    case 1:
    ctx.transform(vecEdge.length / imageAreaHeight, 0, 2 * skew / image.width, verVec1Length / image.width * 2, 0, 0);
    ctx.rotate(getRad(-90));
    ctx.translate(-image.width, -point.start);
    break;

    case 2:
    ctx.transform(vecEdge.length / image.width, 0, 2 * skew / imageAreaHeight, verVec1Length / imageAreaHeight * 2, 0, 0);
    ctx.rotate(getRad(-180));
    ctx.translate(-image.width, -point.end);
    break;

    case 3:
    ctx.transform(vecEdge.length / imageAreaHeight, 0, 2 * skew / image.width, verVec1Length / image.width * 2, 0, 0);
    ctx.rotate(getRad(-270));
    ctx.translate(0, -point.end);
    break;
  }

  drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
  ctx.restore();
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
