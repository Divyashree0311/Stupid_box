const grid = document.getElementById("grid");
const livesText = document.getElementById("lives");
const hintText = document.getElementById("hint");
const levelText = document.getElementById("level");
const streakText = document.getElementById("streak");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

let level = 1;
let gridSize = 3; // starts at 3x3
let lives = 3;
let streak = 0;
let safeBox;
let gameOver = false;

function startLevel() {
  grid.innerHTML = "";
  gameOver = false;
  lives = 3;

  livesText.innerText = lives;
  levelText.innerText = level;
  streakText.innerText = streak;

  hintText.innerText =
    level <= 3
      ? `Level ${level}: Choose carefully`
      : `Level ${level}: Master Mode 🔥`;

  grid.style.gridTemplateColumns = `repeat(${gridSize}, minmax(50px, 1fr))`;

  const totalBoxes = gridSize * gridSize;
  safeBox = Math.floor(Math.random() * totalBoxes);

  for (let i = 0; i < totalBoxes; i++) {
    const box = document.createElement("div");
    box.className = "box";
    box.innerText = "❓";
    box.addEventListener("click", () => handleClick(i, box));
    grid.appendChild(box);
  }
}

function handleClick(index, box) {
  if (gameOver || box.classList.contains("trap")) return;

  clickSound.play();

  if (index === safeBox) {
    box.classList.add("safe");
    box.innerText = "💰";
    winSound.play();

    streak++;
    hintText.innerText = randomReward();
    gameOver = true;

    setTimeout(nextLevel, 1200);
    return;
  }

  box.classList.add("trap");
  box.innerText = "💣";
  lives--;
  livesText.innerText = lives;

  giveDirectionHint(index);

  if (lives === 0) {
    loseSound.play();
    hintText.innerText = "💀 Game Over! Streak reset.";
    streak = 0;
    gameOver = true;
    revealSafe();
  }
}

function giveDirectionHint(clickedIndex) {
  const rowClicked = Math.floor(clickedIndex / gridSize);
  const colClicked = clickedIndex % gridSize;
  const rowSafe = Math.floor(safeBox / gridSize);
  const colSafe = safeBox % gridSize;

  let direction = "";
  if (rowSafe < rowClicked) direction += "⬆️ ";
  if (rowSafe > rowClicked) direction += "⬇️ ";
  if (colSafe < colClicked) direction += "⬅️ ";
  if (colSafe > colClicked) direction += "➡️ ";

  hintText.innerText = `Hint: Safe is ${direction}`;
}

function revealSafe() {
  const boxes = document.querySelectorAll(".box");
  boxes[safeBox].classList.add("safe");
  boxes[safeBox].innerText = "💰";
}

/* 🔒 GRID SIZE CAPPED AT LEVEL 3 */
function nextLevel() {
  level++;

  if (level === 2) gridSize = 4;
  else if (level === 3) gridSize = 5;
  else gridSize = 5; // 🔒 NEVER increase beyond 5x5

  startLevel();
}

function restartGame() {
  level = 1;
  gridSize = 3;
  streak = 0;
  startLevel();
}

function randomReward() {
  const rewards = [
    "🧠 Lucky Brain +1",
    "🔥 Instinct Boost!",
    "🔮 Sixth Sense Activated",
    "⚡ Reflex Upgrade",
    "🎯 Perfect Guess!"
  ];
  return rewards[Math.floor(Math.random() * rewards.length)];
}

startLevel();
