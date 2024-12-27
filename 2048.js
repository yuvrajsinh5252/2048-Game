let brightness = new Map();
brightness.set("2", 85);
brightness.set("4", 81);
brightness.set("8", 77);
brightness.set("16", 73);
brightness.set("32", 69);
brightness.set("64", 65);
brightness.set("128", 61);
brightness.set("256", 57);
brightness.set("512", 53);
brightness.set("1024", 49);
brightness.set("2048", 45);

let add = 0;

if (localStorage.getItem("1") === null) localStorage.setItem("1", add);

let score = localStorage.getItem("1");
document.getElementById("Best-score").innerHTML = score;

let value = [
  [" ", " ", " ", " "],
  [" ", " ", " ", " "],
  [" ", " ", " ", " "],
  [" ", " ", " ", " "],
];

const grow_keyframes = [
  { opacity: 1, scale: 1 },
  { opacity: 1, scale: 1.1 },
];

let touchStartX = 0;
let touchStartY = 0;
const MIN_SWIPE = 30;

let tilesMoved = false;

let gameHistory = [];
const MAX_HISTORY = 50;

function saveGameState() {
  const state = {
    value: value.map((row) => [...row]),
    add: add,
    tiles: Array.from(document.getElementsByClassName("tile")).map((tile) => ({
      id: tile.id,
      innerHTML: tile.innerHTML,
      style: tile.getAttribute("style"),
    })),
  };
  gameHistory.push(state);
  if (gameHistory.length > MAX_HISTORY) {
    gameHistory.shift();
  }
}

function undo() {
  if (gameHistory.length === 0) return;

  const previousState = gameHistory.pop();

  value = previousState.value.map((row) => [...row]);
  add = previousState.add;

  const tiles = document.getElementsByClassName("tile");
  while (tiles.length > 0) {
    tiles[0].remove();
  }

  const container = document.getElementsByClassName("grid-container")[0];
  previousState.tiles.forEach((tileData) => {
    const tile = document.createElement("div");
    tile.setAttribute("class", "tile");
    tile.setAttribute("id", tileData.id);
    tile.innerHTML = tileData.innerHTML;
    tile.setAttribute("style", tileData.style);
    container.appendChild(tile);
  });

  document.getElementById("score").innerHTML = add;
  get_input();
}

function empty() {
  let temp = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (value[i][j] == " ") return true;
    }
  }
  if (temp === 0) return false;
}

function is_move() {
  let ans = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (value[i][j] === value[i][j + 1] || value[j][i] === value[j + 1][i]) {
        ans = 1;
        return true;
      }
    }
  }
  if (ans === 0) {
    if (!empty()) {
      document.getElementsByClassName("font-result")[0].innerHTML = "You Lose";
      document.getElementsByClassName(
        "grid-container"
      )[0].style = `opacity: ${`${50}%`}`;
      document.getElementsByClassName(
        "result"
      )[0].style = `opacity: ${100}%; visibility: visible;`;
      return false;
    } else return true;
  }
}

function is_win() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (value[i][j] === 2048) {
        document.getElementById("play").innerHTML = "Play Again";
        document.getElementsByClassName(
          "grid-container"
        )[0].style = `opacity: ${`${50}%`}`;
        document.getElementsByClassName(
          "result"
        )[0].style = `opacity: ${100}%; visibility: visible;`;
        return true;
      }
    }
  }
}

function random_num() {
  if (empty()) {
    let ans = false;
    let index_row = Math.floor(Math.random() * 4);
    let index_col = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i == index_row && j == index_col && value[i][j] == " ") {
          let num = Math.floor(Math.random() * 5);
          if (num <= 0.5) num = 4;
          else num = 2;
          value[i][j] = num;

          let g1 = [];
          g1 = document.getElementsByClassName("grid-container");
          let g = document.createElement("div");
          g.setAttribute("class", "tile");
          g.setAttribute("id", `${i * 4 + (j + 1)}`);
          g.innerHTML = num;
          g1[0].appendChild(g);

          document.getElementById(`${i * 4 + (j + 1)}`).innerHTML = num;
          document.getElementById(
            `${i * 4 + (j + 1)}`
          ).style = `--x: ${i};--y: ${j}`;
          return;
        }
      }
    }
    if (ans == false) random_num();
  }
}

function upper_move() {
  tilesMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (value[j][i] == " ") {
        for (let k = j + 1; k < 4; k++) {
          if (value[k][i] != " ") {
            value[j][i] = value[k][i];
            document
              .getElementById(`${k * 4 + (i + 1)}`)
              .setAttribute("id", `${j * 4 + (i + 1)}`);
            document.getElementById(
              `${j * 4 + (i + 1)}`
            ).style = `--x: ${j};--y: ${i}`;
            value[k][i] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
    for (let j = 0; j < 3; j++) {
      if (value[j][i] != " " && value[j][i] == value[j + 1][i]) {
        value[j + 1][i] += value[j][i];
        value[j][i] = " ";
        let elem = document.getElementById(`${(j + 1) * 4 + (i + 1)}`);
        elem.style = `--x: ${j};--y: ${i};`;
        elem.innerHTML = value[j + 1][i];
        elem.animate(grow_keyframes, { duration: 200, iterations: 1 });
        document.getElementById(`${j * 4 + (i + 1)}`).remove();
        add += value[j + 1][i];
        tilesMoved = true;
      }
    }
    for (let j = 0; j < 4; j++) {
      if (value[j][i] == " ") {
        for (let k = j + 1; k < 4; k++) {
          if (value[k][i] != " ") {
            value[j][i] = value[k][i];
            value[k][i] = " ";
            document
              .getElementById(`${k * 4 + (i + 1)}`)
              .setAttribute("id", `${j * 4 + (i + 1)}`);
            document.getElementById(
              `${j * 4 + (i + 1)}`
            ).style = `--x: ${j};--y: ${i}`;
            tilesMoved = true;
            break;
          }
        }
      }
    }
  }
  return tilesMoved;
}

function lower_move() {
  tilesMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 3; j >= 0; j--) {
      if (value[j][i] == " ") {
        for (let k = j - 1; k >= 0; k--) {
          if (value[k][i] != " ") {
            value[j][i] = value[k][i];
            document
              .getElementById(`${k * 4 + (i + 1)}`)
              .setAttribute("id", `${j * 4 + (i + 1)}`);
            document.getElementById(
              `${j * 4 + (i + 1)}`
            ).style = `--x: ${j};--y: ${i}`;
            value[k][i] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
    for (let j = 3; j > 0; j--) {
      if (value[j][i] != " " && value[j][i] == value[j - 1][i]) {
        value[j - 1][i] += value[j][i];
        value[j][i] = " ";
        let elem = document.getElementById(`${(j - 1) * 4 + (i + 1)}`);
        elem.style = `--x: ${j - 1};--y: ${i}`;
        elem.innerHTML = value[j - 1][i];
        elem.animate(grow_keyframes, { duration: 200, iterations: 1 });
        document.getElementById(`${j * 4 + (i + 1)}`).remove();
        add += value[j - 1][i];
        tilesMoved = true;
      }
    }
    for (let j = 3; j >= 0; j--) {
      if (value[j][i] == " ") {
        for (let k = j - 1; k >= 0; k--) {
          if (value[k][i] != " ") {
            value[j][i] = value[k][i];
            document
              .getElementById(`${k * 4 + (i + 1)}`)
              .setAttribute("id", `${j * 4 + (i + 1)}`);
            document.getElementById(
              `${j * 4 + (i + 1)}`
            ).style = `--x: ${j};--y: ${i}`;
            value[k][i] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
  }
  return tilesMoved;
}

function left_move() {
  tilesMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (value[i][j] == " ") {
        for (let k = j + 1; k < 4; k++) {
          if (value[i][k] != " ") {
            value[i][j] = value[i][k];
            document
              .getElementById(`${i * 4 + (k + 1)}`)
              .setAttribute("id", `${i * 4 + (j + 1)}`);
            document.getElementById(
              `${i * 4 + (j + 1)}`
            ).style = `--x: ${i};--y: ${j}`;
            value[i][k] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
    for (let j = 0; j < 3; j++) {
      if (value[i][j] != " " && value[i][j] == value[i][j + 1]) {
        value[i][j + 1] += value[i][j];
        value[i][j] = " ";
        let elem = document.getElementById(`${i * 4 + (j + 2)}`);
        elem.style = `--x: ${i};--y: ${j + 1}`;
        elem.innerHTML = value[i][j + 1];
        elem.animate(grow_keyframes, { duration: 200, iterations: 1 });
        document.getElementById(`${i * 4 + (j + 1)}`).remove();
        add += value[i][j + 1];
        tilesMoved = true;
      }
    }
    for (let j = 0; j < 4; j++) {
      if (value[i][j] == " ") {
        for (let k = j + 1; k < 4; k++) {
          if (value[i][k] != " ") {
            value[i][j] = value[i][k];
            document
              .getElementById(`${i * 4 + (k + 1)}`)
              .setAttribute("id", `${i * 4 + (j + 1)}`);
            document.getElementById(
              `${i * 4 + (j + 1)}`
            ).style = `--x: ${i};--y: ${j}`;
            value[i][k] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
  }
  return tilesMoved;
}

function right_move() {
  tilesMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 3; j >= 0; j--) {
      if (value[i][j] == " ") {
        for (let k = j - 1; k >= 0; k--) {
          if (value[i][k] != " ") {
            value[i][j] = value[i][k];
            document
              .getElementById(`${i * 4 + (k + 1)}`)
              .setAttribute("id", `${i * 4 + (j + 1)}`);
            document.getElementById(
              `${i * 4 + (j + 1)}`
            ).style = `--x: ${i};--y: ${j}`;
            value[i][k] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
    for (let j = 3; j > 0; j--) {
      if (value[i][j] != " " && value[i][j] == value[i][j - 1]) {
        value[i][j - 1] += value[i][j];
        value[i][j] = " ";
        let elem = document.getElementById(`${i * 4 + j}`);
        elem.style = `--x: ${i};--y: ${j - 1}`;
        elem.innerHTML = value[i][j - 1];
        elem.animate(grow_keyframes, { duration: 200, iterations: 1 });
        document.getElementById(`${i * 4 + (j + 1)}`).remove();
        add += value[i][j - 1];
        tilesMoved = true;
      }
    }
    for (let j = 3; j >= 0; j--) {
      if (value[i][j] == " ") {
        for (let k = j - 1; k >= 0; k--) {
          if (value[i][k] != " ") {
            value[i][j] = value[i][k];
            document
              .getElementById(`${i * 4 + (k + 1)}`)
              .setAttribute("id", `${i * 4 + (j + 1)}`);
            document.getElementById(
              `${i * 4 + (j + 1)}`
            ).style = `--x: ${i};--y: ${j}`;
            value[i][k] = " ";
            tilesMoved = true;
            break;
          }
        }
      }
    }
  }
  return tilesMoved;
}

function get_input() {
  window.addEventListener("keydown", input, { once: true });
}

function get_tiles_colored() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let element = document.getElementById(`${i * 4 + (j + 1)}`);
      if (element != null) {
        let color = brightness.get(element.innerHTML);
        document.getElementById(
          `${i * 4 + (j + 1)}`
        ).style = `background: hsl(180, 80%, ${color}%);--x: ${i};--y: ${j}`;
      }
    }
  }
}

function reset() {
  value = [
    [" ", " ", " ", " "],
    [" ", " ", " ", " "],
    [" ", " ", " ", " "],
    [" ", " ", " ", " "],
  ];
  for (let i = 1; i <= 16; i++) {
    let remov_ele = document.getElementById(`${i}`);
    if (remov_ele != null) {
      remov_ele.remove();
    }
  }
  if (localStorage.getItem("1") < add) {
    localStorage.setItem("1", add);
  }
  document.getElementById("score").innerHTML = 0;
  add = 0;
  let score = localStorage.getItem("1");
  document.getElementById("Best-score").innerHTML = score;
  document.getElementsByClassName(
    "grid-container"
  )[0].style = `opacity: ${`${100}%`}`;
  document.getElementsByClassName(
    "result"
  )[0].style = `opacity: ${0}%; visibility: hidden;`;
  random_num();
  random_num();
  get_tiles_colored();
  get_input();
}

random_num();
random_num();
get_tiles_colored();
get_input();

function check_game() {
  get_tiles_colored();
  document.getElementById("score").innerHTML = add;
  if (localStorage.getItem("1", add) < add) {
    document.getElementById("Best-score").innerHTML = add;
  }
  if (!is_win() && is_move()) {
    get_input();
  }
}

function input(e) {
  let moved = false;
  if (
    e.key === "ArrowDown" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight"
  ) {
    saveGameState();
  }

  if (e.key === "ArrowDown") moved = lower_move();
  else if (e.key === "ArrowUp") moved = upper_move();
  else if (e.key === "ArrowLeft") moved = left_move();
  else if (e.key === "ArrowRight") moved = right_move();

  if (!moved) gameHistory.pop();
  else random_num();
  check_game();
}

function handleTouchStart(evt) {
  touchStartX = evt.touches[0].clientX;
  touchStartY = evt.touches[0].clientY;
  evt.preventDefault();
}

function handleTouchMove(evt) {
  evt.preventDefault();
}

function handleTouchEnd(evt) {
  if (!touchStartX || !touchStartY) return;

  let touchEndX = evt.changedTouches[0].clientX;
  let touchEndY = evt.changedTouches[0].clientY;

  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;

  touchStartX = 0;
  touchStartY = 0;

  if (Math.abs(deltaX) < MIN_SWIPE && Math.abs(deltaY) < MIN_SWIPE) return;

  saveGameState();

  let moved = false;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) moved = right_move();
    else moved = left_move();
  } else {
    if (deltaY > 0) moved = lower_move();
    else moved = upper_move();
  }

  if (!moved) gameHistory.pop();
  else random_num();
  check_game();
}

document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchmove", handleTouchMove, { passive: false });
document.addEventListener("touchend", handleTouchEnd, false);

document.getElementById("reset").onclick = reset;
document.getElementsByClassName("play-again")[0].onclick = reset;

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "z") {
    undo();
    e.preventDefault();
  }
});
