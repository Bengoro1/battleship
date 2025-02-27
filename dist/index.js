function Ship(length, coordinates, xy) {
  let hitCount = 0;
  let sunk = false;
  const hit = () => hitCount++;
  const isSunk = () => hitCount < length ? sunk = false : sunk = true;
  return {length, coordinates, xy, hit, isSunk, sunk}
}

function Gameboard(enemy) {
  const hitCoordinates = [];
  const ships = [];
  enemy = enemy.charAt().toUpperCase() + enemy.slice(1);

  function pushCoordinates(ship) {
    const array = [];
    let flag = true;
    for (let i = 0; i < ship.length; i++) {
      if (ship.xy === 'x') {
        const arr = [ship.coordinates[0] + i, ship.coordinates[1]];
        array.push(arr);
      } else {
        const arr = [ship.coordinates[0], ship.coordinates[1] + i];  
        array.push(arr);
      }
    }
    array.forEach((el) => {
      el.forEach(num => {
        if (num >= 10) flag = false;
      });
      for (let i = 0; i < hitCoordinates.length; i++) {
        if (flag == false) break;
        for (let j = 0; j < hitCoordinates[i].length; j++) {
          if (flag == false) break;
          for (let k = 0; k < hitCoordinates[i][j]; k++) {
            if (flag == false) break;
          }
          if (JSON.stringify(el) == JSON.stringify(hitCoordinates[i][j])) flag = false;
        }
      }
    });
    if (flag === true) {
      ships.push(ship);
      hitCoordinates.push(array);
    } else if (enemy === 'Computer') {
      shipSize++;
    } else if (enemy === 'Player') {
      computerShipSize++;
    }
    if (enemy === 'Computer') createPlayerBoard(hitCoordinates);
  }

  function receiveAttack(coordinates, e) {
    if (JSON.stringify(hitCoordinates).includes(coordinates)) {
      for (let i = 0; i < hitCoordinates.length; i++) {
        if (JSON.stringify(hitCoordinates[i]).includes(coordinates)) {
          ships[i].hit();
          e.classList.add('hit');
          if (enemy == 'Computer') {
            lastHit = true;
            lastHitXY = coordinates;
            lastHitDir = lastDir;
            computerHits.push(coordinates);
          }
          if (ships[i].isSunk()) {
            ships.splice(i, 1);
            hitCoordinates.splice(i, 1);
            if (enemy == 'Computer') {
              shipDestroyed = true;
              lastHitXY = null;
              lastHitDir = null;
              lastDir = null;
            }
            if (ships.length == 0) {
              const newContainer = container.cloneNode(true);
              container.parentNode.replaceChild(newContainer, container);
              const resultContainer = document.createElement('div');
              newContainer.appendChild(resultContainer);
              resultContainer.classList.add('result-container');
              const result = document.createElement('div');
              resultContainer.appendChild(result);
              const winningLine = `${enemy}'s win. Do you want to try again?`;
              result.textContent = winningLine;
              const restart = document.createElement('button');
              restart.classList.add('restart');
              resultContainer.appendChild(restart);
              restart.textContent = 'Restart';
              restart.addEventListener('click', () => {
                window.location.reload();
              }); 
            }
          }
        }
      }
    } else {
      e.classList.add('missed');
      if (enemy == 'Computer') {
        lastHit = false;
      }
    }
  }

  return { receiveAttack, pushCoordinates };
}

function Player(enemy) {
  const gameboard = Gameboard(enemy);
  return {gameboard}
}

const player = Player('computer');
const computer = Player('player');

const header = document.createElement('div');
document.body.appendChild(header);
header.classList.add('header');
header.textContent = 'Battleship';

const container = document.createElement('div');
document.body.appendChild(container);
container.classList.add('container');

const button = document.createElement('button');
container.appendChild(button);
button.textContent = 'Axis: X';
let xy = 'x'
button.addEventListener('click', () => {
  if (xy === 'x') {
    xy = 'y';
  } else if (xy = 'y') {
    xy = 'x';
  }
  button.textContent = `Axis: ${xy.toUpperCase()}`;
});

const playerBoard = document.createElement('div');
container.appendChild(playerBoard);
playerBoard.classList.add('player-board');

let shipSize = 5;

function createPlayerBoard(arr = []) {
  while (playerBoard.firstChild) {
    playerBoard.removeChild(playerBoard.firstChild);
  }
  for (let i = 0; i < 10; i++) {
    const rowDiv = document.createElement('div');
    playerBoard.appendChild(rowDiv);
    for (let j = 0; j < 10; j++) {
      const div = document.createElement('div');
      rowDiv.appendChild(div);
      div.classList.add('game-cell');
      div.classList.add('player');
      div.addEventListener('click', () => {
        if (shipSize > 0) {
          const ship = Ship(shipSize, [i, j], xy);
          player.gameboard.pushCoordinates(ship);
          shipSize--;
        }
      });
      if (JSON.stringify(arr).includes([i, j])) {
        for (let k = 0; k < arr.length; k++) {
          if (JSON.stringify(arr[k]).includes([i, j])) {
            div.classList.add('ship');
          }
        }
      }
    }
  }
}

createPlayerBoard();

const computerBoard = document.createElement('div');
container.appendChild(computerBoard);
computerBoard.classList.add('computer-board');

function createComputerBoard() {
  for (let i = 0; i < 10; i++) {
    const rowDiv = document.createElement('div');
    computerBoard.appendChild(rowDiv);
    for (let j = 0; j < 10; j++) {
      const div = document.createElement('div');
      rowDiv.appendChild(div);
      div.classList.add('game-cell');
      div.addEventListener('click', () => {
        if (shipSize === 0) {
          computer.gameboard.receiveAttack([i, j], div);
          computerPlay();
          const newDiv = div.cloneNode(true);
          div.parentNode.replaceChild(newDiv, div);
        }
      });
    }
  }
}

createComputerBoard();

let computerShipSize = 5;

function computerPlacement() {
  for ( ; computerShipSize > 0; computerShipSize--) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const random = Math.floor(Math.random() * 2);
    let xy;
    random == 0 ? xy = 'x' : xy = 'y';
    const ship = Ship(computerShipSize, [x, y], xy);
    computer.gameboard.pushCoordinates(ship);
  }
}

let lastHit = false;
let lastHitXY = null;
let lastHitDir = null;
let lastDir = null;
let shipDestroyed = false;
const computerHits = [];
const computerMoves = [];

function computerPlay(count = 0) {
  if (shipDestroyed == false && lastHitXY != null) {
    if (!JSON.stringify(computerMoves).includes(JSON.stringify([lastHitXY[0], lastHitXY[1] + 1])) && lastHitXY[1] !== 9 && (lastHitDir == null || lastHitDir == 'down')) {
      lastDir = 'down';
      computerMoves.push([lastHitXY[0], lastHitXY[1] + 1]);
      player.gameboard.receiveAttack([lastHitXY[0], lastHitXY[1] + 1], playerBoard.children[lastHitXY[0]].children[lastHitXY[1] + 1]);
    } else if (!JSON.stringify(computerMoves).includes(JSON.stringify([lastHitXY[0], lastHitXY[1] - 1])) && lastHitXY[1] !== 0 && (lastHitDir == null || lastHitDir == 'up')) {
      lastDir = 'up';
      computerMoves.push([lastHitXY[0], lastHitXY[1] - 1]);
      player.gameboard.receiveAttack([lastHitXY[0], lastHitXY[1] - 1], playerBoard.children[lastHitXY[0]].children[lastHitXY[1] - 1]);
    } else if (!JSON.stringify(computerMoves).includes(JSON.stringify([lastHitXY[0] + 1, lastHitXY[1]])) && lastHitXY[0] !== 9 && (lastHitDir == null || lastHitDir == 'right')) {
      lastDir = 'right';
      computerMoves.push([lastHitXY[0] + 1, lastHitXY[1]]);
      player.gameboard.receiveAttack([lastHitXY[0] + 1, lastHitXY[1]], playerBoard.children[lastHitXY[0] + 1].children[lastHitXY[1]]);
    } else if (!JSON.stringify(computerMoves).includes(JSON.stringify([lastHitXY[0] - 1, lastHitXY[1]])) && lastHitXY[0] !== 0 && (lastHitDir == null || lastHitDir == 'left')) {
      lastDir = 'left';
      computerMoves.push([lastHitXY[0] - 1, lastHitXY[1]]);
      player.gameboard.receiveAttack([lastHitXY[0] - 1, lastHitXY[1]], playerBoard.children[lastHitXY[0] - 1].children[lastHitXY[1]]);
    } else if (lastHitDir != lastDir && count > 1) {
      lastHitDir = null;
      computerPlay();
    } else if (lastHitDir != null) {
      //loop to opposite direction
      switch (lastHitDir) {
        case 'down':
          lastHitDir = 'up';
          while (JSON.stringify(computerHits).includes(JSON.stringify([lastHitXY[0], lastHitXY[1] - 1])) && lastHitXY[1] !== 0) {
            lastHitXY = [lastHitXY[0], lastHitXY[1] - 1];
          }
          break;
        case 'up':
          lastHitDir = 'down';
          while (JSON.stringify(computerHits).includes(JSON.stringify([lastHitXY[0], lastHitXY[1] + 1])) && lastHitXY[1] !== 9) {
            lastHitXY = [lastHitXY[0], lastHitXY[1] + 1];
          }
          break;
        case 'right':
          lastHitDir = 'left';
          while (JSON.stringify(computerHits).includes(JSON.stringify([lastHitXY[0] - 1, lastHitXY[1]])) && lastHitXY[0] !== 0) {
            lastHitXY = [lastHitXY[0] - 1, lastHitXY[1]];
          }
          break;
        case 'left':
          lastHitDir = 'right';
          while (JSON.stringify(computerHits).includes(JSON.stringify([lastHitXY[0] + 1, lastHitXY[1]])) && lastHitXY[0] !== 9) {
            lastHitXY = [lastHitXY[0] + 1, lastHitXY[1]];
          }
          break;
      }
      computerPlay(++count);
    } 
  } else if (shipDestroyed == true || lastHitXY == null) {
    shipDestroyed = false;
    for (let i = 0; i < 1; i++) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (!JSON.stringify(computerMoves).includes(JSON.stringify([x, y]))) {
        computerMoves.push([x, y]);
        player.gameboard.receiveAttack([x, y], playerBoard.children[x].children[y]);
      } else i--;
    }
  }  
}

computerPlacement();

const footer = document.createElement('div');
document.body.appendChild(footer);
footer.classList.add('footer');

const signature = document.createElement('div');
let d = new Date();
let year = d.getFullYear();
signature.textContent = `Copyright © Bengoro1 ${year}`;
signature.setAttribute('class', 'signature');
footer.appendChild(signature);
const gitLogo = document.createElement('img');
gitLogo.setAttribute('src', 'github.jpg');
gitLogo.setAttribute('alt', 'Logo');
gitLogo.setAttribute('class', 'git-logo');
gitLogo.setAttribute('onclick', "window.open('https://github.com/Bengoro1','_newtab');");
signature.appendChild(gitLogo);
