const iconMap = {
  "slice of pizza": "Pizza", "radish": "Radish", "mitten": "Mitten", "musical note": "MusicNote",
  "slice of bread": "BreadSlice", "ice-cream cone": "IceCream", "flag": "Flag", "doughnut": "Doughnut",
  "cracker": "Crackers", "book": "Book", "watermelon": "Watermelon", "butterfly": "Butterfly",
  "snake": "Snake", "ring": "Ring", "paintbrush": "Brush", "crown": "Crown"
};

const centerHotspots = [
  { name: "slice of pizza", cx: 536, cy: 769, w: 120, h: 45 }, { name: "radish", cx: 91, cy: 302, w: 45, h: 62 },
  { name: "mitten", cx: 200, cy: 775, w: 108, h: 96 }, { name: "musical note", cx: 241, cy: 439, w: 60, h: 65 },
  { name: "slice of bread", cx: 562, cy: 692, w: 67, h: 59 }, { name: "ice-cream cone", cx: 94, cy: 677, w: 74, h: 122 },
  { name: "flag", cx: 600, cy: 258, w: 100, h: 262 }, { name: "doughnut", cx: 284, cy: 559, w: 61, h: 46 },
  { name: "cracker", cx: 117, cy: 143, w: 45, h: 45 }, { name: "book", cx: 59, cy: 448, w: 79, h: 40 },
  { name: "watermelon", cx: 463, cy: 435, w: 67, h: 77 }, { name: "butterfly", cx: 458, cy: 163, w: 80, h: 57 },
  { name: "snake", cx: 595, cy: 575, w: 40, h: 160 }, { name: "ring", cx: 359, cy: 40, w: 38, h: 57 },
  { name: "paintbrush", cx: 298, cy: 718, w: 60, h: 84 }
];

const objectsToFind = centerHotspots.map(obj => ({
  name: obj.name, x: obj.cx - obj.w / 2, y: obj.cy - obj.h / 2, w: obj.w, h: obj.h
}));

let score = 0;
let timeLeft = 180;
let timer;
let gameActive = false;
let confettiAnimationId = null;

function setupGame() {
  const list = document.getElementById('object-list');
  const imageContainer = document.querySelector('.left-panel');
  list.innerHTML = ''; 
  imageContainer.querySelectorAll('.hotspot, .answer-icon').forEach(el => el.remove());

  objectsToFind.forEach((obj) => {
    const hotspot = document.createElement('div');
    hotspot.classList.add('hotspot');
    hotspot.style.top = `${obj.y}px`;
    hotspot.style.left = `${obj.x}px`;
    hotspot.style.width = `${obj.w}px`;
    hotspot.style.height = `${obj.h}px`;
    hotspot.dataset.name = obj.name;
    imageContainer.appendChild(hotspot);

    hotspot.addEventListener('click', () => {
      if (hotspot.classList.contains('found')) return;
      hotspot.classList.add('found');
      score++;
      revealColoredIcon(obj);
      const iconInList = document.querySelector(`.icon-container[data-name="${obj.name}"]`);
      if (iconInList) {
        iconInList.classList.add('found');
      }
      checkWin();
    });

    const iconFile = iconMap[obj.name] || obj.name;
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    iconContainer.dataset.name = obj.name;
    const img = document.createElement('img');
    img.src = `Temp/${iconFile}.png`;
    img.alt = obj.name;
    img.classList.add('draggable-icon');
    const tickMark = document.createElement('div');
    tickMark.classList.add('tick-mark');
    tickMark.textContent = '✔';
    iconContainer.appendChild(img);
    iconContainer.appendChild(tickMark);
    list.appendChild(iconContainer);
  });
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `⏱️ ${minutes}:${seconds}`;
  timeLeft--;
  if (timeLeft < 0) {
    endGame();
  }
}

function endGame() {
  if (!gameActive) return;
  gameActive = false;
  clearInterval(timer);
  const endScreen = document.getElementById('end-screen');
  const endMessage = document.getElementById('end-message');
  
  endMessage.classList.remove('win-message');
  
  endScreen.classList.remove('hidden');
  document.getElementById('score-value').textContent = score;
  let message = '';
  
  if (score === objectsToFind.length) {
    message = "Kola Mass Sarae!";
    endMessage.classList.add('win-message');
    launchConfetti();
  } else if (score >= 11) {
    message = "Good Job!";
  } else {
    message = "Better Luck Next Time";
  }
  endMessage.textContent = message;
}

function checkWin() {
  if (!gameActive) return;
  if (score === objectsToFind.length) {
    endGame();
  }
}

function launchConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 }
    });

    if (Date.now() < end) {
      confettiAnimationId = requestAnimationFrame(frame);
    }
  }

  frame(); // start the loop
}

function revealColoredIcon(obj) {
  const imageContainer = document.querySelector('.left-panel');
  const smoke = document.createElement('div');
  smoke.classList.add('smoke-effect');
  smoke.style.backgroundImage = 'url(Temp/smoke-effect.gif)';
  const smokeSize = 150;
  smoke.style.left = (obj.x + obj.w / 2 - smokeSize / 2) + 'px';
  smoke.style.top = (obj.y + obj.h / 2 - smokeSize / 2) + 'px';
  imageContainer.appendChild(smoke);

  const iconFile = iconMap[obj.name] || obj.name;
  const img = document.createElement('img');
  img.src = `Temp/Ans/${iconFile}C.png`;
  img.classList.add('answer-icon');
  img.style.width = obj.w + 'px';
  img.style.height = obj.h + 'px';
  img.style.top = obj.y + 'px';
  img.style.left = obj.x + 'px';
  imageContainer.appendChild(img);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      img.classList.add('reveal');
      launchMagicEffect(obj.x + obj.w / 2, obj.y + obj.h / 2);
    });
  });
  
  setTimeout(() => {
    smoke.remove();
  }, 1000);
}

function launchMagicEffect(x, y) {
  const puzzleRect = document.getElementById('puzzle-image').getBoundingClientRect();
  const originX = (puzzleRect.left + x) / window.innerWidth;
  const originY = (puzzleRect.top + y) / window.innerHeight;

  confetti({
    particleCount: 30, spread: 60, startVelocity: 25,
    scalar: 0.7, gravity: 0.3, origin: { x: originX, y: originY },
    shapes: ['star'], colors: ['#ffd700', '#ffeca0', '#ffffff', '#fff4a3']
  });
}

function resetGame() {
  // Add this line to stop any ongoing confetti from the previous game
  if (typeof confetti !== "undefined") {
    confetti.reset();
  }
  
  if (confettiAnimationId) {
	  cancelAnimationFrame(confettiAnimationId);
	  confettiAnimationId = null;
	}

  const endScreen = document.getElementById('end-screen');
  endScreen.classList.add('hidden');
  
  // Reset variables
  score = 0;
  timeLeft = 180;
  clearInterval(timer); // Stop any existing timer

  // Re-build the game board
  setupGame();

  // Start the new timer
  updateTimer(); // Update display immediately
  gameActive = true; 
  timer = setInterval(updateTimer, 1000);
}


// --- GAME START LOGIC ---
const startButton = document.getElementById('start-button');
const startOverlay = document.getElementById('start-overlay');
const gameContainer = document.querySelector('.game-container');
const backgroundMusic = document.getElementById('bg-music');
const playAgainButton = document.getElementById('play-again-button');

setupGame();

startButton.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  gameContainer.classList.remove('blurry');
  if (backgroundMusic) {
    backgroundMusic.play().catch(error => console.error("Music playback failed:", error));
  }
  gameActive = true;
  timer = setInterval(updateTimer, 1000);
});

playAgainButton.addEventListener('click', resetGame);
