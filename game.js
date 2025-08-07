const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 배경
const bg = new Image();
bg.src = 'assets/images/bg1.jpeg';

// 캐릭터
const playerImg = new Image();
playerImg.src = 'assets/images/sohyun.png';

const portalImg = new Image();
portalImg.src = 'assets/images/portal.png'; // 실제 파일 경로로 수정


let player = {
  x: 300,//가장 첫번째 발판 위
  y: 600,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 0.4,
  jumpPower: -10,
  onGround: false,
  direction: "right" // left 또는 right
};

// 좌우 이동
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", e => {
  if (e.code === "ArrowLeft") leftPressed = true;
  if (e.code === "ArrowRight") rightPressed = true;
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowLeft") leftPressed = false;
  if (e.code === "ArrowRight") rightPressed = false;
});

// 발판 (수동 지정)
// ~690(69)
const platforms = [
  { x: 80, y: 100, width: 100, height: 10 }, //1
  { x: 140, y: 180, width: 100, height: 10 },//6
  { x: 80, y: 300, width: 100, height: 10 },//6
  { x: 200, y: 450, width: 100, height: 10 }, //2
  { x: 275, y: 400, width: 100, height: 10 },//6
  
  { x: 150, y: 550, width: 100, height: 10 }, //3
  //{ x: 100, y: 480, width: 100, height: 10 },//4
  { x: 80, y: 650, width: 100, height: 10 },//6
  { x: 80, y: 250, width: 100, height: 10 },//6
  

  { x: 300, y: 690, width: 100, height: 10 },//*시작발판*
  
  
];

const items = [
  { x: 120, y: 470, width: 20, height: 20, name: "기쁨" },
  { x: 230, y: 370, width: 20, height: 20, name: "편안함" },
  { x: 70,  y: 270, width: 20, height: 20, name: "설렘" },
];

function drawItems() {
  items.forEach(item => {
    ctx.fillStyle = "gold";
    ctx.fillRect(item.x, item.y, item.width, item.height);

    // 이름도 표시 (감정 이름)
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText(item.name, item.x, item.y - 5);
  });
}
collectedItems = 0;

function checkItemCollection() {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (
      player.x < item.x + item.width &&
      player.x + player.width > item.x &&
      player.y < item.y + item.height &&
      player.y + player.height > item.y
    ) {
      collectedItems++;
      items.splice(i, 1); // 획득하면 리스트에서 제거
    }
  }
}

const portal = {
  x: 300,
  y: 30,
  width: 40,
  height: 40
};

function drawPortal() {
  ctx.drawImage(portalImg, portal.x, portal.y, portal.width, portal.height);
}


function checkPortalClear() {
    if (
        player.x + player.width > portal.x &&
        player.x < portal.x + portal.width &&
        player.y + player.height > portal.y &&
        player.y < portal.y + portal.height
    ) {
        alert("스테이지 클리어!");
        location.replace('main.html');
    }
}
function drawPlayer() {
  ctx.save();
  if (player.direction === "left") {
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerImg,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height
    );
  } else {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }
  ctx.restore();
}



function drawUI() {
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText(`📦 감정 아이템: ${collectedItems}`, 10, 20);
}


// 충돌 검사
function checkCollision(p) {
  if (
    player.vy >= 0 &&
    player.x + player.width > p.x &&
    player.x < p.x + p.width &&
    player.y + player.height >= p.y &&
    player.y + player.height <= p.y + p.height + 5
  ) {
    player.y = p.y - player.height;
    player.vy = player.jumpPower;
    player.onGround = true;
  }
}

let cameraY =0;

function update() {
  // 이동
  if (leftPressed) {
  player.x -= 3;
  player.direction = "left";
}
if (rightPressed) {
  player.x += 3;
  player.direction = "right";
}


  // 중력
  player.vy += player.gravity;
  player.y += player.vy;
  player.onGround = false;

  // 충돌 체크
  for (let p of platforms) checkCollision(p);

  // 카메라가 캐릭터를 따라가도록 설정
  if (player.y < canvas.height / 2) {
    cameraY = canvas.height / 2 - player.y;
  }



  // 그리기
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  ctx.fillStyle = "gray";
  for (let p of platforms) {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }


  drawItems();
checkItemCollection();
drawPortal();
checkPortalClear();
drawUI();
drawPlayer();

  requestAnimationFrame(update);

}

bg.onload = () => {
  playerImg.onload = () => {
    update();
  };
};
