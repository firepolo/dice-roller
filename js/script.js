class Settable {
  static selectByClassName(className) {
    return Array.prototype.map.call(document.getElementsByClassName(className), e => new Settable(e));
  }

  static selectById(id) {
    return new Settable(document.getElementById(id));
  }

  constructor(dom) {
    this.dom = dom;
    this.value = this.dom.textContent;
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

function mix(callback)
{
  const MAX_ITERATION = 40;
  let iteration = 0;

  const n = (Math.random() * 6) | 0;
  const target = DICE_ROTATION[n];
  const origin = DICE_ROTATION[rotationIndex];

  const dx = (target[0] - origin[0]) / MAX_ITERATION;
  const dy = (target[1] - origin[1]) / MAX_ITERATION;
  const dz = (target[2] - origin[2]) / MAX_ITERATION;
  const dd = (target[3] - origin[3]) / MAX_ITERATION;

  function tick()
  {
    const s = Math.abs(Math.sin(Math.PI / MAX_ITERATION * iteration)) + 1;
    const x = dx * iteration + origin[0];
    const y = dy * iteration + origin[1];
    const z = dz * iteration + origin[2];
    const d = dd * iteration + origin[3];

    dice.getDom().style['transform'] = `scale(${s}) rotate3d(${x}, ${y}, ${z}, ${d}deg)`;

    if (++iteration > MAX_ITERATION) {
      callback(n);
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function setCurrentPlayer(currentIndex) {
  playerTitles[playerIndex].getDom().classList.remove('active');
  playerTitles[currentIndex].getDom().classList.add('active');
  playerIndex = currentIndex;
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
  mix((value) => {
    rotationIndex = value;

    if (value == 0) {
      currentScores[playerIndex].setValue(0);
      hold();
    } else {
      currentScores[playerIndex].addValue(value + 1);
    }
  });
}

function hold() {
  const currentIndex = playerIndex;
  globalScores[currentIndex].addValue(currentScores[playerIndex].getValue());

  if (globalScores[currentIndex].getValue() >= SCORE_FOR_WIN) {
    winner.setValue(playerTitles[currentIndex].getValue());
    overlay.getDom().classList.add('visible');
  }
  else {
    setCurrentPlayer(currentIndex + 1 & 1);
    currentScores[currentIndex].setValue(0);
  }
}

const SCORE_FOR_WIN = 100;
const DICE_ROTATION = [
  [ 0, 0, 0, 0 ],
  [ 1, 0, 0, -90 ],
  [ 0, 1, 0, -90 ],
  [ 0, 1, 0, 90 ],
  [ 1, 0, 0, 90 ],
  [ 0, 1, 0, 180 ]
];

const playerTitles = Settable.selectByClassName('player-title');
const currentScores = Settable.selectByClassName('player-current-score', 0);
const globalScores = Settable.selectByClassName('player-global-score', 0);
const winner = Settable.selectById('winner');
const overlay = Settable.selectById('overlay');
const dice = Settable.selectById('dice');

let rotationIndex = 0;
let playerIndex = 0;

document.getElementById('newgame').onclick = reset;
document.getElementById('roll').onclick = roll;
document.getElementById('hold').onclick = hold;
overlay.getDom().onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  reset();
}

reset();