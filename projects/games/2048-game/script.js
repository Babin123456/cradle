// The 2048 UI is intentionally small and self-contained so it fits the
// repository's pattern of single-page, browser-only mini-games.

const logic = window.__2048Logic;
const { createInitialState, moveGameState } = logic || {};

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('scoreValue');
const bestScoreElement = document.getElementById('bestScoreValue');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartBtn');

const STORAGE_KEY = 'cradle-2048-best-score';

let bestScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
let state = createInitialState();
state.bestScore = bestScore;

function renderBoard() {
  boardElement.innerHTML = '';

  state.board.forEach((row) => {
    row.forEach((value) => {
      const tile = document.createElement('div');
      tile.className = `tile ${value ? `tile--${value}` : 'tile--empty'}`;
      tile.textContent = value || '';
      boardElement.appendChild(tile);
    });
  });

  scoreElement.textContent = state.score;
  bestScore = Math.max(bestScore, state.score);
  state.bestScore = bestScore;
  bestScoreElement.textContent = bestScore;

  if (state.won) {
    statusElement.textContent = 'You reached 2048. Keep going or restart for a fresh run.';
  } else if (state.over) {
    statusElement.textContent = 'No moves left. Press restart to play again.';
  } else {
    statusElement.textContent = 'Use the arrow keys to move the tiles.';
  }
}

function persistBestScore() {
  if (state.score > bestScore) {
    bestScore = state.score;
    localStorage.setItem(STORAGE_KEY, String(bestScore));
  }
}

function handleMove(direction) {
  const nextState = moveGameState(state, direction);

  if (!nextState.moved) {
    return;
  }

  state = nextState;
  persistBestScore();
  renderBoard();
}

function restartGame() {
  state = createInitialState();
  renderBoard();
}

function handleKeydown(event) {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };

  const direction = map[event.key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  handleMove(direction);
}

restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeydown);

renderBoard();
