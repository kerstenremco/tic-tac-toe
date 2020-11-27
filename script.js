const onePlayerButton = document.getElementById("onePlayer");
const twoPlayersButton = document.getElementById("twoPlayers");
const menuElement = document.getElementById("menu");
const boardElement = document.getElementById("board");
const gridElement = document.getElementById("grid");
const gridPlacesElements = document.querySelectorAll("[data-row][data-col]");
const textElement = document.getElementById("currentPlayer");
const restartButtonElement = document.getElementById("restart");

let turn;
let solo;
const board = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];

function init() {
  onePlayerButton.addEventListener("click", () => startGame(true));
  twoPlayersButton.addEventListener("click", () => startGame(false));
  restartButtonElement.addEventListener("click", reset);
}

function startGame(soloPlayer) {
  solo = soloPlayer;
  toggleElement(menuElement, false);
  toggleElement(boardElement, true);
  swapTurn(true);
  gridPlacesElements.forEach((element) => {
    element.addEventListener("click", handleClick);
  });
}

function reset() {
  toggleElement(menuElement, true);
  toggleElement(boardElement, false);
  gridPlacesElements.forEach((element) => {
    element.removeEventListener("click", handleClick);
    element.classList.remove("x");
    element.classList.remove("o");
  });
  resetBoard();
}

function resetBoard() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = "-";
    }
  }
}

function toggleElement(element, show) {
  if (show) element.classList.remove("hide");
  else element.classList.add("hide");
}

function setText(text) {
  textElement.innerText = text;
}

function handleClick(e) {
  const row = e.target.dataset.row;
  const col = e.target.dataset.col;
  place(row, col);
}

function place(row, col) {
  if (board[row][col] !== "-") return;
  const element = document.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  );
  element.classList.add(turn);
  board[row][col] = turn;

  const winner = checkWinner();

  if (winner !== "-") {
    lockBoard();
    setText(`${winner} has won!`);
    toggleElement(restartButtonElement, true);
  } else if (checkBoardFull()) {
    lockBoard();
    setText(`Draw!`);
    toggleElement(restartButtonElement, true);
  } else swapTurn(false);
}

function swapTurn(newGame) {
  if (newGame) turn = "x";
  else turn = turn === "x" ? "o" : "x";
  setText(`It's ${turn}'s turn`);
  if (turn === "o" && solo) {
    gridElement.classList.remove("xturn");
    placeAiMove();
  } else {
    gridElement.classList.remove("xturn");
    gridElement.classList.remove("oturn");
    gridElement.classList.add(`${turn}turn`);
  }
}

function checkWinner() {
  // Check for horizontal row
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] !== "-") return board[row][0];
    }
  }
  // Check for vertical row
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] !== "-") return board[0][col];
    }
  }
  // Check for diagonal row
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] !== "-") return board[0][0];
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] !== "-") return board[0][2];
  }
  // No winner?
  return "-";
}

function checkBoardFull() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "-") return false;
    }
  }
  return true;
}

function lockBoard() {
  gridElement.classList.remove("xturn");
  gridElement.classList.remove("oturn");
  gridPlacesElements.forEach((element) => {
    element.removeEventListener("click", handleClick);
  });
}

function placeAiMove() {
  const bestPosition = findBestPosition();
  place(bestPosition[0], bestPosition[1]);
}

function findBestPosition() {
  let bestRow;
  let bestCol;
  let bestScore = -Infinity;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "-") {
        board[row][col] = "o";
        const score = minimax(false);
        if (score > bestScore) {
          bestScore = score;
          bestRow = row;
          bestCol = col;
        }
        board[row][col] = "-";
      }
    }
  }
  return [bestRow, bestCol];
}

function minimax(isMaximizingPlayer) {
  // End statement of recursive function, if board full return value
  if (checkBoardFull()) {
    const winner = checkWinner();
    if (winner === "x") return -10;
    else if (winner === "o") return 10;
    return 0;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "-") {
          board[row][col] = "o";
          const score = minimax(false);
          if (score > bestScore) bestScore = score;
          board[row][col] = "-";
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "-") {
          board[row][col] = "x";
          const score = minimax(true);
          if (score < bestScore) bestScore = score;
          board[row][col] = "-";
        }
      }
    }
    return bestScore;
  }
}

init();
