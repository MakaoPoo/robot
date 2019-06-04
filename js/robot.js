let bodyImage;
let legImage;
let shoulderImage;

let scale = 5;

$(function() {
  const $canvas = $('#mainCanvas');
  $canvas[0].width = $canvas.width();
  $canvas[0].height = $canvas.height();

  bodyImage = new Image();
  bodyImage.src = "resource/body.png";

  draw();
});

const draw = function() {

  const $canvas = $('#mainCanvas');
  const ctx = $canvas[0].getContext('2d');

  drawImage(ctx, bodyImage, 0, 0, 64, 64);
  requestAnimationFrame(draw);
}

const drawImage = function(ctx, image, x, y, width, height) {
  if(image != null) {
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width * scale, height * scale);
  }
}
