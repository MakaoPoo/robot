let scale = 5;

let unitData = unitDataTemplate();


$(window).resize(function() {
    const $canvas = $('#mainCanvas');
    $canvas[0].width = $canvas.width();
    $canvas[0].height = $canvas.height();

});

$(function() {
  unitData.body = PARTS_CLASS_LIST.body["000"].initPartsData();
  unitData.leg = PARTS_CLASS_LIST.leg["000"].initPartsData();

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas.width();
  $canvas[0].height = $canvas.height();

  mainLoop();
});

const mainLoop = function(){

  draw();

  requestAnimationFrame(mainLoop);
}

const draw = function() {

  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas[0].width;
  const ctx = $canvas[0].getContext('2d');

  const drawOption = {
    dx: 0, dy: 0,
    scale: 1,
    rotate: 0
  }
  drawParts(ctx, {dx: 0, dy: 0}, unitData.body, 0);
  drawParts(ctx, {dx: 0, dy: 64}, unitData.leg, 0);
}

const drawParts = function(ctx, drawOption, partsData, vtxId) {

  const imageVtx = partsData.vtxList[vtxId].image;

  drawImage(ctx, partsData.image,
    imageVtx.x, imageVtx.y, imageVtx.w, imageVtx.h,
    drawOption.dx, drawOption.dy,
    imageVtx.w, imageVtx.h);

  if(DRAW_HITBOX) {
    const hitboxVtx = partsData.vtxList[vtxId].hitbox;
    drawHitbox(ctx, drawOption, hitboxVtx);
  }
}

const drawImage = function(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
  if(image != null) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}

const drawHitbox = function(ctx, drawOption, vtx) {
  const hx = drawOption.dx + vtx.x;
  const hy = drawOption.dy + vtx.y;

  ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
  ctx.strokeStyle = "rgba(0, 0, 255, 0.7)";
  ctx.fillRect(hx, hy, vtx.w, vtx.h);
  ctx.strokeRect(hx, hy, vtx.w, vtx.h);
}
