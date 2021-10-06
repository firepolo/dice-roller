class Settable {
  static selectByClassName(className, isInt = false) {
    return Array.prototype.map.call(document.getElementsByClassName(className), e => new Settable(e, isInt));
  }

  static selectById(id, isInt = false) {
    return new Settable(document.getElementById(id), isInt);
  }

  constructor(dom, isInt = false) {
    this.dom = dom;
    this.value = isInt ? parseInt(this.dom.textContent) : this.dom.textContent;
  }

  getDom() {
    return this.dom;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
    this.dom.textContent = this.value;
  }

  addValue(value) {
    this.setValue(this.value + value);
  }
}

function setCurrentPlayer(currentIndex) {
  playerTitles[currentPlayerIndex].getDom().classList.remove('active');
  playerTitles[currentIndex].getDom().classList.add('active');
  currentPlayerIndex = currentIndex;
}

function reset() {
  for (const score of currentScores) {
    score.setValue(0);
  }

  for (const score of globalScores) {
    score.setValue(0);
  }

  setCurrentPlayer(Math.random() * 2 | 0);
  overlay.getDom().classList.remove('visible');
}

function roll() {
  const value = 1 + Math.random() * 5 | 0;

  if (value == 1) {
    currentScores[currentPlayerIndex].setValue(0);
    hold();
  } else {
    currentScores[currentPlayerIndex].addValue(value);
  }
}

function hold() {
  const currentIndex = currentPlayerIndex;
  globalScores[currentIndex].addValue(currentScores[currentPlayerIndex].getValue());

  if (globalScores[currentIndex].getValue() >= SCORE_FOR_WIN) {
    winner.setValue(playerTitles[currentIndex].getValue());
    overlay.getDom().classList.add('visible');
  }
  else {
    setCurrentPlayer(currentIndex + 1 & 1);
    currentScores[currentIndex].setValue(0);
  }
}

const SCORE_FOR_WIN = 10;

const playerTitles = Settable.selectByClassName('player-title');
const currentScores = Settable.selectByClassName('player-current-score', true);
const globalScores = Settable.selectByClassName('player-global-score', true);
const winner = Settable.selectById('winner');
const overlay = Settable.selectById('overlay');
const dice = Settable.selectById('dice');

let currentPlayerIndex = 0;

document.getElementById('newgame').onclick = reset;
document.getElementById('roll').onclick = roll;
document.getElementById('hold').onclick = hold;
overlay.getDom().onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  reset();
}

reset();