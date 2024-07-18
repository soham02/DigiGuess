function generateFiveDigitNumber() {
  const digits = [];
  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }
  return digits.join("");
}

const state = {
  secret: generateFiveDigitNumber(),
  grid: Array(5)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = " ") {
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box${row}${col}`;
  box.textContent = letter;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === "Enter") {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      }
    }
    if (key === "Backspace") {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function revealWord(guess) {
  const row = state.currentRow;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;

    if (letter === state.secret[i]) {
      box.classList.add("correct");
    } else if (state.secret.includes(letter)) {
      if (letter < state.secret[i]) {
        box.classList.add("wronggreater");
      } else {
        box.classList.add("wronglesser");
      }
    } else {
      if (letter < state.secret[i]) {
        box.classList.add("notgreater");
      } else {
        box.classList.add("notlesser");
      }
    }
  }

  const isWinner = state.secret === guess;
  const isGaveOver = state.currentRow === 4;

  setTimeout(() => {
    if (isWinner) {
      alert("Good Job");
    } else if (isGaveOver) {
      alert(`Try again. The number was ${state.secret}.`);
    }
  }, 100);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[0-9]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = "";
  state.currentCol--;
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);

  registerKeyboardEvents();

  console.log(state.secret);
}

startup();
