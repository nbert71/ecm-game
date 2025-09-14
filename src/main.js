const ROWS = 6;
const COLS = 7;
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let current = 1;
let gameOver = false;

const boardEl = document.getElementById('board');
const colButtonsEl = document.getElementById('col-buttons');
const playerNameEl = document.getElementById('player-name');
const resetBtn = document.getElementById('reset');
const winnerEl = document.getElementById('winner');

for (let c = 0; c < COLS; c++) {
  const btn = document.createElement('button');
  btn.className =
    'col-btn flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm text-white transition-transform';
  btn.innerText = '👇';
  btn.dataset.col = c;
  btn.onclick = () => handleColumnClick(c);
  colButtonsEl.appendChild(btn);
}

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement('button');
    cell.className =
      'w-14 h-14 md:w-16 md:h-16 rounded-full bg-sky-100 shadow-inner flex items-center justify-center';
    cell.dataset.row = r;
    cell.dataset.col = c;
    const inner = document.createElement('div');
    inner.className = 'w-12 h-12 rounded-full drop-anim';
    inner.style.background = 'transparent';
    cell.appendChild(inner);
    boardEl.appendChild(cell);
  }
}

function handleColumnClick(col) {
  if (gameOver) return;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === 0) {
      grid[r][col] = current;
      updateCell(r, col, current);
      if (checkWin(r, col, current)) {
        showWinner(current);
        gameOver = true;
        return;
      }
      current = current === 1 ? 2 : 1;
      updateCurrentDisplay();
      return;
    }
  }
}

function updateCell(r, c, player) {
  const selector = `[data-row='${r}'][data-col='${c}']`;
  const cell = boardEl.querySelector(selector);
  const inner = cell.firstElementChild;
  inner.style.background = player === 1 ? '' : '';
  if (player === 1) {
    inner.classList.add('bg-red-500');
    inner.classList.remove('bg-yellow-400');
  } else {
    inner.classList.add('bg-yellow-400');
    inner.classList.remove('bg-red-500');
  }
  inner.classList.add('drop-anim');
  setTimeout(() => inner.classList.remove('drop-anim'), 300);
}

function updateCurrentDisplay() {
  playerNameEl.innerText = current === 1 ? '1 (rouge)' : '2 (jaune)';
}

function showWinner(player) {
  winnerEl.textContent = `🎉 Joueur ${player} a gagné !`;
  winnerEl.classList.remove('hidden');
}

function checkWin(row, col, player) {
  function countDir(dr, dc) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    return count;
  }
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let [dr, dc] of dirs) {
    const total = 1 + countDir(dr, dc) + countDir(-dr, -dc);
    if (total >= 4) return true;
  }
  return false;
}

resetBtn.addEventListener('click', () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = 0;
      const selector = `[data-row='${r}'][data-col='${c}']`;
      const cell = boardEl.querySelector(selector);
      const inner = cell.firstElementChild;
      inner.classList.remove('bg-red-500', 'bg-yellow-400');
      inner.style.background = 'transparent';
    }
  }
  current = 1;
  gameOver = false;
  winnerEl.classList.add('hidden');
  updateCurrentDisplay();
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= String(COLS))
    handleColumnClick(Number(e.key) - 1);
  if (e.key === 'r' || e.key === 'R') resetBtn.click();
});
