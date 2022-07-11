//init
const canvas = document.getElementById("canvas1");
const img = document.getElementById("coinImg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const coinPool = [];
const mouse = {
  x: null,
  y: null,
};
const gravity = 0.5;
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
    this.elasticity = 0.05;
    this.resistance = 0.001;
    this.forceX = 0;
    this.forceY = gravity;
    this.m = 15;
    this.size = 50;
    this.color = "blue";
    this.speed = 0.1;
  }
  draw() {
    ctx.drawImage(img, this.x, this.y, this.size, this.size);
  }
  freefall(dt) {
    this.y += dt * gravity;
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
        this.size * this.size * 4 >=
        (this.x - coinPool[i].x) * (this.x - coinPool[i].x) +
          (this.y - coinPool[i].y) * (this.y - coinPool[i].y)
      ) {
        this.forceX = (this.x - coinPool[i].x) * this.elasticity;
        this.forceY = (this.y - coinPool[i].y) * this.elasticity;
        console.log("force", this.forceX);
      }
    }
  }
  update(dt) {
    this.freefall(dt);
    this.rigidbody(dt);
    this.y += dt * this.forceY * this.speed;
    this.x += dt * this.forceX * this.speed;

    if (this.forceY < gravity) {
      this.forceY += this.resistance * dt;
    }
    if (this.forceX > 0) {
      this.forceX -= this.resistance * dt;
    }
    if (this.forceX < 0) {
      this.forceX += this.resistance * dt;
    }

    if (this.forceX < 0.2 && this.forceX > -0.2) {
      this.forceX = 0;
    }
    if (this.forceY < 0.2 && this.forceY > -0.2) {
      this.forceY = 0;
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
