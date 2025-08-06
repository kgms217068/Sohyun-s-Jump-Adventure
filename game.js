const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 반응형 세로 화면 꽉 채우기
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 배경
const bg = new Image();
bg.src = 'assets/images/bg1.jpg?v=' + Date.now();

// 캐릭터
const playerImg = new Image();
playerImg.src = 'assets/images/sohyun.png?v=' + Date.now();

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  vy: 0,
  gravity: 0.5,
  jumpPower: -12,
  onGround: false,
  direction: "right" // left 또는 right
};

// 발판
let platforms = [
  { x: 100, y: canvas.height - 100, width: 200, height: 20 },
  { x: 200, y: canvas.height - 250, width: 150, height: 20 },
  { x: 50, y: canvas.height - 400, width: 100, height: 20 },
];

// 버튼 입력
let leftPressed = false;
let rightPressed = false;

document.getElementById("leftBtn").addEventListener("mousedown", () => { leftPressed = true; });
document.getElementById("leftBtn").addEventListener("mouseup", () => { leftPressed = false; });
document.getElementById("rightBtn").addEventListener("mousedown", () => { rightPressed = true; });
document.getElementById("rightBtn").addEventListener("mouseup", () => { rightPressed = false; });

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") leftPressed = true;
  if (e.code === "ArrowRight") rightPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") leftPressed = false;
  if (e.code === "ArrowRight") rightPressed = false;
});

// 발판 그리기
function drawPlatforms() {
  ctx.fillStyle = "gray";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

// 충돌 체크
function checkPlatformCollision(player, platform) {
  if (
    player.vy > 0 &&
    player.y + player.height > platform.y &&
    player.y + player.height < platform.y + platform.height &&
    player.x + player.width > platform.x &&
    player.x < platform.x + platform.width
  ) {
    player.y = platform.y - player.height;
    player.vy = player.jumpPower;
    player.onGround = true;
  }
}

// 캐릭터 그리기 (좌우 반전 포함)
function drawPlayer() {
  ctx.save();
  if (player.direction === "left") {
    ctx.translate(player.x + player.width / 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(playerImg, -player.width / 2, player.y, player.width, player.height);
  } else {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }
  ctx.restore();
}

// 메인 업데이트
function update() {
  const moveSpeed = 3;

  if (leftPressed) {
    player.x -= moveSpeed;
    player.direction = "left";
  }
  if (rightPressed) {
    player.x += moveSpeed;
    player.direction = "right";
  }

  player.vy += player.gravity;
  player.y += player.vy;
  player.onGround = false;

  platforms.forEach(p => checkPlatformCollision(player, p));

  // 그리기
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();

  requestAnimationFrame(update);
}

// 이미지가 다 로드된 후 시작
let imagesLoaded = 0;
function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) update();
}
bg.onload = checkImagesLoaded;
playerImg.onload = checkImagesLoaded;
