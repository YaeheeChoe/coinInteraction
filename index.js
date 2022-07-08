//init
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const coinPool = [];
const mouse = {
  x: null,
  y: null,
};
const gravity = 9.81;
const resistance = 0.02;
var cur = 0;

//add events
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener("click", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  if (coinPool.length < 30) {
    coinPool.push(new Coin(coinPool.length));
  }
});
// define coin animation
class Coin {
  constructor(id) {
    this.id = id;
    this.x = mouse.x;
    this.y = mouse.y;
    this.elasticity = -2;
    this.forceX = 0;
    this.forceY = gravity;
    this.m = 15;
    this.size = 15;
    this.color = "blue";
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  freefall(dt) {
    this.y += dt * resistance * gravity;
  }
  rigidbody(dt) {
    if (this.y > canvas.height - this.size) {
      this.y = canvas.height - this.size;
    }
    if (this.x > canvas.width - this.size) {
      this.x = canvas.width - this.size;
    }
    for (let i = 0; i < coinPool.length; i++) {
      if (i == this.id) {
        continue;
      }
      if (
        this.y < coinPool[i].y + this.size &&
        this.y > coinPool[i].y - this.size &&
        this.x < coinPool[i].x + this.size &&
        this.x > coinPool[i].x - this.size
      ) {
        this.forceY *= this.elasticity;
        this.forceX *= this.elasticity;
      }
    }
  }
  update(dt) {
    this.freefall(dt);
    this.rigidbody(dt);
    this.y += dt * resistance * this.forceY;
    this.x += dt * resistance * this.forceX;
    if (this.forceY < gravity) {
      this.forceY += resistance * dt;
    }
    if (this.forceX > 0) {
      this.forceX -= resistance * dt;
    }
    if (this.forceX < 0) {
      this.forceX += resistance * dt;
    }
    if (this.forceX < 0.1 && this.forceX > -0.1) {
      this.forceX = 0;
    }
    this.draw();
  }
}

function coinMove(dt) {
  for (let i = 0; i < coinPool.length; i++) {
    coinPool[i].update(dt);
  }
}
function animate(t) {
  ctx.fillStyle = "RGBA(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  dt = t - cur;
  cur = t;
  coinMove(dt);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
