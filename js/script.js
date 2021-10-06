class Settable {
  static selectByClassName(className) {
    return Array.prototype.map.call(document.getElementsByClassName(className), e => new Settable(e));
  }

  constructor(dom) {
    this.dom = dom;
    this.value = parseInt(this.dom.textContent);
  }

  get() {
    return this.value;
  }

  set(value) {
    this.value = value;
    this.dom.textContent = this.value;
  }

  add(value) {
    this.set(this.value + value);
  }
}

function setCurrentPlayer(currentIndex) {
  playerTitles[currentPlayerIndex].classList.remove('active');
  playerTitles[currentIndex].classList.add('active');
  currentPlayerIndex = currentIndex;
}

function reset() {
  for (const score of currentScores) {
    score.set(0);
  }

  for (const score of globalScores) {
    score.set(0);
  }

  setCurrentPlayer(Math.random() * 2 | 0);
}

function roll() {
  const dice = 1 + Math.random() * 5 | 0;

  if (dice == 1) {
    currentScores[currentPlayerIndex].set(0);
    hold();
  } else {
    currentScores[currentPlayerIndex].add(dice);
  }
}

function hold() {
  const currentIndex = currentPlayerIndex;
  globalScores[currentIndex].add(currentScores[currentPlayerIndex].get());

  if (globalScores[currentIndex].get() > 100) {}

  setCurrentPlayer(currentIndex + 1 & 1);
  currentScores[currentIndex].set(0);
}

const playerTitles = document.getElementsByClassName('player-title');
const currentScores = Settable.selectByClassName('player-current-score');
const globalScores = Settable.selectByClassName('player-global-score');

let currentPlayerIndex = 0;

document.getElementById('newgame').onclick = reset;
document.getElementById('roll').onclick = roll;
document.getElementById('hold').onclick = hold;

reset();