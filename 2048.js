const GRID_SIZE = 4;
const EMPTY = " ";
const MIN_SWIPE = 30;
const MAX_HISTORY = 50;
const BEST_SCORE_KEY = "best-score-2048";
const LEGACY_BEST_KEY = "1";
const THEME_KEY = "theme-2048";
const MOVE_ANIMATION_MS = 170;

const tilePalettes = {
  classic: new Map([
    ["2", { background: "#eee4da", color: "#776e65" }],
    ["4", { background: "#ede0c8", color: "#776e65" }],
    ["8", { background: "#f2b179", color: "#f9f6f2" }],
    ["16", { background: "#f59563", color: "#f9f6f2" }],
    ["32", { background: "#f67c5f", color: "#f9f6f2" }],
    ["64", { background: "#f65e3b", color: "#f9f6f2" }],
    ["128", { background: "#edcf72", color: "#f9f6f2" }],
    ["256", { background: "#edcc61", color: "#f9f6f2" }],
    ["512", { background: "#edc850", color: "#f9f6f2" }],
    ["1024", { background: "#edc53f", color: "#f9f6f2" }],
    ["2048", { background: "#edc22e", color: "#f9f6f2" }],
  ]),
  dark: new Map([
    ["2", { background: "#4d5361", color: "#eef2ff" }],
    ["4", { background: "#5a6378", color: "#eef2ff" }],
    ["8", { background: "#6a4f8d", color: "#f7f2ff" }],
    ["16", { background: "#7546a1", color: "#f9f3ff" }],
    ["32", { background: "#8d3f9c", color: "#fff1ff" }],
    ["64", { background: "#a13e93", color: "#fff1fa" }],
    ["128", { background: "#b64a7f", color: "#fff3f6" }],
    ["256", { background: "#c85e66", color: "#fff5f4" }],
    ["512", { background: "#d2784d", color: "#fff8f2" }],
    ["1024", { background: "#db9540", color: "#fffaf2" }],
    ["2048", { background: "#e6b232", color: "#1e1a14" }],
  ]),
  ocean: new Map([
    ["2", { background: "#d6edf6", color: "#1c5b73" }],
    ["4", { background: "#c3e3f2", color: "#1c5b73" }],
    ["8", { background: "#95d2ec", color: "#184f65" }],
    ["16", { background: "#72c3e6", color: "#174a5d" }],
    ["32", { background: "#4eb4df", color: "#113a4a" }],
    ["64", { background: "#33a0d2", color: "#f1fbff" }],
    ["128", { background: "#2f8fc0", color: "#f1fbff" }],
    ["256", { background: "#2e7dad", color: "#f1fbff" }],
    ["512", { background: "#2b6d99", color: "#f1fbff" }],
    ["1024", { background: "#2a5f89", color: "#f1fbff" }],
    ["2048", { background: "#24547b", color: "#f1fbff" }],
  ]),
};

const gridContainer = document.getElementsByClassName("grid-container")[0];
const resultOverlay = document.getElementsByClassName("result")[0];
const resultText = document.getElementsByClassName("font-result")[0];
const playText = document.getElementById("play");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("Best-score");
const themeSelect = document.getElementById("theme-select");
const milestoneCard = document.getElementById("milestone-card");
const milestoneTitle = document.getElementById("milestone-title");
const milestoneMessage = document.getElementById("milestone-message");

let value = createEmptyBoard();
let add = 0;
let bestScore = getStoredBestScore();
let gameOver = false;
let highestCelebratedTile = 0;
let gameHistory = [];
let currentTheme = "classic";
let touchStartX = null;
let touchStartY = null;
let milestoneTimeoutId = null;
let isAnimating = false;
let animationTimeoutId = null;
let animationFrameId = null;

function getStoredTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  if (!theme || !(theme in tilePalettes)) return "classic";
  return theme;
}

function setTheme(theme, { persist = true } = {}) {
  if (!(theme in tilePalettes)) theme = "classic";
  currentTheme = theme;

  document.body.dataset.theme = theme;
  if (themeSelect) themeSelect.value = theme;

  if (persist) localStorage.setItem(THEME_KEY, theme);

  if (isAnimating) clearAnimatedArtifacts();
  renderBoard();
}

function initThemeSelector() {
  setTheme(getStoredTheme(), { persist: false });

  if (!themeSelect) return;
  themeSelect.addEventListener("change", (event) => {
    setTheme(event.target.value);
  });
}

function createEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => EMPTY),
  );
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function toTileId(row, col) {
  return String(row * GRID_SIZE + (col + 1));
}

function keyFromPos(row, col) {
  return `${row}-${col}`;
}

function getStoredBestScore() {
  const modern = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
  const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY) || 0);
  return Math.max(
    Number.isFinite(modern) ? modern : 0,
    Number.isFinite(legacy) ? legacy : 0,
  );
}

function persistBestScore() {
  localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  localStorage.setItem(LEGACY_BEST_KEY, String(bestScore));
}

function updateScoreUI() {
  scoreElement.textContent = add;
  bestScoreElement.textContent = bestScore;
}

function getTileAppearance(num) {
  const activePalette = tilePalettes[currentTheme] || tilePalettes.classic;
  const preset = activePalette.get(String(num));
  if (preset) return preset;

  const power = Math.log2(num);
  if (currentTheme === "dark") {
    const lightness = Math.max(20, 46 - (power - 11) * 2);
    return {
      background: `hsl(282, 42%, ${lightness}%)`,
      color: "#fff8ff",
    };
  }

  if (currentTheme === "ocean") {
    const lightness = Math.max(24, 56 - (power - 11) * 2);
    return {
      background: `hsl(201, 58%, ${lightness}%)`,
      color: lightness > 44 ? "#114057" : "#f1fbff",
    };
  }

  const lightness = Math.max(16, 34 - (power - 11) * 2);
  return {
    background: `hsl(38, 26%, ${lightness}%)`,
    color: "#f9f6f2",
  };
}

function clearAnimatedArtifacts() {
  if (animationTimeoutId) {
    clearTimeout(animationTimeoutId);
    animationTimeoutId = null;
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  gridContainer
    .querySelectorAll(".moving-tile")
    .forEach((tile) => tile.remove());

  gridContainer
    .querySelectorAll(".tile-hidden")
    .forEach((tile) => tile.classList.remove("tile-hidden"));

  isAnimating = false;
}

function renderBoard({ spawnedCell = null, mergedCells = [] } = {}) {
  gridContainer.querySelectorAll(".tile").forEach((tile) => tile.remove());

  const mergedSet = new Set(
    mergedCells.map(([row, col]) => keyFromPos(row, col)),
  );

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = value[row][col];
      if (cell === EMPTY) continue;

      const tile = document.createElement("div");
      const appearance = getTileAppearance(cell);
      tile.className = "tile";
      tile.id = toTileId(row, col);
      tile.textContent = String(cell);
      tile.style = `--x: ${row}; --y: ${col}; background: ${appearance.background}; color: ${appearance.color};`;

      if (spawnedCell && spawnedCell.row === row && spawnedCell.col === col) {
        tile.classList.add("tile-new");
      }

      if (mergedSet.has(keyFromPos(row, col))) {
        tile.classList.add("tile-merged");
      }

      gridContainer.appendChild(tile);
    }
  }
}

function logicalToActual(direction, fixed, logicalIndex) {
  switch (direction) {
    case "left":
      return { row: fixed, col: logicalIndex };
    case "right":
      return { row: fixed, col: GRID_SIZE - 1 - logicalIndex };
    case "up":
      return { row: logicalIndex, col: fixed };
    case "down":
      return { row: GRID_SIZE - 1 - logicalIndex, col: fixed };
    default:
      return { row: fixed, col: logicalIndex };
  }
}

function getEmptyCells() {
  const cells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (value[row][col] === EMPTY) cells.push([row, col]);
    }
  }

  return cells;
}

function spawnRandomTile() {
  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) return null;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const spawnedValue = Math.random() < 0.1 ? 4 : 2;
  value[row][col] = spawnedValue;

  return { row, col, value: spawnedValue };
}

function applyMove(direction) {
  const nextBoard = createEmptyBoard();
  const movements = [];
  const mergedCells = [];
  let scoreGain = 0;
  let moved = false;

  for (let fixed = 0; fixed < GRID_SIZE; fixed++) {
    const lineTokens = [];

    for (let logical = 0; logical < GRID_SIZE; logical++) {
      const pos = logicalToActual(direction, fixed, logical);
      const cellValue = value[pos.row][pos.col];
      if (cellValue !== EMPTY) {
        lineTokens.push({
          value: cellValue,
          from: { row: pos.row, col: pos.col },
        });
      }
    }

    const mergedTokens = [];
    for (let i = 0; i < lineTokens.length; i++) {
      const current = lineTokens[i];
      const next = lineTokens[i + 1];

      if (next && current.value === next.value) {
        const mergedValue = current.value * 2;
        mergedTokens.push({
          value: mergedValue,
          origins: [current.from, next.from],
        });
        scoreGain += mergedValue;
        i++;
      } else {
        mergedTokens.push({
          value: current.value,
          origins: [current.from],
        });
      }
    }

    for (let logical = 0; logical < mergedTokens.length; logical++) {
      const token = mergedTokens[logical];
      const destination = logicalToActual(direction, fixed, logical);
      const isMerged = token.origins.length > 1;

      nextBoard[destination.row][destination.col] = token.value;

      if (isMerged) {
        mergedCells.push([destination.row, destination.col]);
      }

      for (const origin of token.origins) {
        const fromMoved =
          origin.row !== destination.row || origin.col !== destination.col;

        if (fromMoved || isMerged) {
          movements.push({
            from: { row: origin.row, col: origin.col },
            to: { row: destination.row, col: destination.col },
            value: value[origin.row][origin.col],
          });
        }

        if (fromMoved) moved = true;
      }

      if (isMerged) moved = true;
    }
  }

  value = nextBoard;
  return { moved, scoreGain, movements, mergedCells };
}

function animateMove(movements, onComplete) {
  if (movements.length === 0) {
    onComplete();
    return;
  }

  isAnimating = true;
  const movingTiles = [];

  for (const movement of movements) {
    const fromTile = document.getElementById(
      toTileId(movement.from.row, movement.from.col),
    );

    if (!fromTile) continue;

    fromTile.classList.add("tile-hidden");

    const movingTile = fromTile.cloneNode(true);
    const appearance = getTileAppearance(movement.value);
    movingTile.id = "";
    movingTile.textContent = String(movement.value);
    movingTile.classList.remove("tile-hidden", "tile-new", "tile-merged");
    movingTile.classList.add("moving-tile");
    movingTile.style = `--x: ${movement.from.row}; --y: ${movement.from.col}; background: ${appearance.background}; color: ${appearance.color};`;
    movingTile.dataset.toRow = String(movement.to.row);
    movingTile.dataset.toCol = String(movement.to.col);

    gridContainer.appendChild(movingTile);
    movingTiles.push(movingTile);
  }

  if (movingTiles.length === 0) {
    clearAnimatedArtifacts();
    onComplete();
    return;
  }

  // Force layout so the browser has a definite "from" position before transitioning to "to".
  // This makes slide animations reliable across engines.
  void movingTiles[0].offsetWidth;

  animationFrameId = requestAnimationFrame(() => {
    for (const movingTile of movingTiles) {
      movingTile.style.setProperty("--x", movingTile.dataset.toRow);
      movingTile.style.setProperty("--y", movingTile.dataset.toCol);
    }
  });

  animationTimeoutId = setTimeout(() => {
    clearAnimatedArtifacts();
    onComplete();
  }, MOVE_ANIMATION_MS + 26);
}

function getMaxTile() {
  let maxTile = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (value[row][col] !== EMPTY) {
        maxTile = Math.max(maxTile, value[row][col]);
      }
    }
  }

  return maxTile;
}

function noMovesLeft() {
  if (getEmptyCells().length > 0) return false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = value[row][col];

      if (col < GRID_SIZE - 1 && current === value[row][col + 1]) return false;
      if (row < GRID_SIZE - 1 && current === value[row + 1][col]) return false;
    }
  }

  return true;
}

function showResultOverlay(message, buttonText = "Try Again") {
  resultText.textContent = message;
  playText.textContent = buttonText;
  gridContainer.style = `opacity: ${50}%`;
  resultOverlay.style = `opacity: ${100}%; visibility: visible;`;
  gameOver = true;
}

function hideResultOverlay() {
  gridContainer.style = `opacity: ${100}%`;
  resultOverlay.style = `opacity: ${0}%; visibility: hidden;`;
}

function hideMilestoneCard() {
  milestoneCard.classList.remove("visible");
  if (milestoneTimeoutId) {
    clearTimeout(milestoneTimeoutId);
    milestoneTimeoutId = null;
  }
}

function showMilestoneCard(tile) {
  milestoneTitle.textContent = `🎉 ${tile} reached!`;
  milestoneMessage.textContent =
    tile === 2048
      ? "Awesome move! You unlocked 2048 — now keep the streak alive."
      : `New milestone unlocked: ${tile}. Keep climbing!`;

  milestoneCard.classList.add("visible");

  if (milestoneTimeoutId) clearTimeout(milestoneTimeoutId);
  milestoneTimeoutId = setTimeout(hideMilestoneCard, 2600);
}

function checkMilestoneCelebration() {
  const maxTile = getMaxTile();
  if (maxTile < 2048) return;

  let milestone = 2048;
  while (milestone * 2 <= maxTile) milestone *= 2;

  if (milestone > highestCelebratedTile) {
    highestCelebratedTile = milestone;
    showMilestoneCard(milestone);
  }
}

function saveGameState() {
  const snapshot = {
    value: cloneBoard(value),
    add,
    highestCelebratedTile,
    gameOver,
  };

  gameHistory.push(snapshot);
  if (gameHistory.length > MAX_HISTORY) gameHistory.shift();
}

function undo() {
  if (isAnimating || gameHistory.length === 0) return;

  const previousState = gameHistory.pop();
  value = cloneBoard(previousState.value);
  add = previousState.add;
  highestCelebratedTile = previousState.highestCelebratedTile || 0;
  gameOver = previousState.gameOver || false;

  hideMilestoneCard();
  if (!gameOver) hideResultOverlay();

  renderBoard();
  updateScoreUI();
}

function tryMove(direction) {
  if (gameOver || isAnimating) return;

  saveGameState();
  const result = applyMove(direction);

  if (!result.moved) {
    gameHistory.pop();
    return;
  }

  add += result.scoreGain;
  if (add > bestScore) {
    bestScore = add;
    persistBestScore();
  }

  const spawnedCell = spawnRandomTile();
  updateScoreUI();

  animateMove(result.movements, () => {
    renderBoard({
      spawnedCell,
      mergedCells: result.mergedCells,
    });
    checkMilestoneCelebration();

    if (noMovesLeft()) {
      showResultOverlay("You Lose", "Try Again");
    }
  });
}

function reset() {
  clearAnimatedArtifacts();

  value = createEmptyBoard();
  add = 0;
  gameOver = false;
  highestCelebratedTile = 0;
  gameHistory = [];

  hideResultOverlay();
  hideMilestoneCard();

  spawnRandomTile();
  spawnRandomTile();

  renderBoard();
  updateScoreUI();
}

function handleKeyboardInput(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
    return;
  }

  const directionByKey = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  const direction = directionByKey[event.key];
  if (!direction) return;

  event.preventDefault();
  tryMove(direction);
}

function handleTouchStart(event) {
  if (event.touches.length !== 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  event.preventDefault();
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (touchStartX === null || touchStartY === null) return;

  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const shortSwipe =
    Math.abs(deltaX) < MIN_SWIPE && Math.abs(deltaY) < MIN_SWIPE;

  if (shortSwipe) {
    const target =
      event.target instanceof Element
        ? event.target
        : document.elementFromPoint(touchEndX, touchEndY);
    const button = target ? target.closest("button") : null;

    if (button) {
      if (button.id === "reset" || button.classList.contains("play-again")) {
        reset();
      } else if (button.id === "undo") {
        undo();
      } else if (button.id === "continue-play") {
        hideMilestoneCard();
      }
    }

    touchStartX = null;
    touchStartY = null;
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    tryMove(deltaX > 0 ? "right" : "left");
  } else {
    tryMove(deltaY > 0 ? "down" : "up");
  }

  touchStartX = null;
  touchStartY = null;
}

document.addEventListener("keydown", handleKeyboardInput);
document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchmove", handleTouchMove, { passive: false });
document.addEventListener("touchend", handleTouchEnd, { passive: false });

document.getElementById("reset").addEventListener("click", reset);
document
  .getElementsByClassName("play-again")[0]
  .addEventListener("click", reset);
document.getElementById("undo").addEventListener("click", undo);
document
  .getElementById("continue-play")
  .addEventListener("click", hideMilestoneCard);

gridContainer.style.setProperty("--move-duration", `${MOVE_ANIMATION_MS}ms`);
persistBestScore();
initThemeSelector();
reset();
