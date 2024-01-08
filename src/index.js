function Ship(length, coordinates, xy) {
  let hitCount = 0;
  let sunk = false;
  const hit = () => hitCount++;
  const isSunk = () => hitCount < length ? sunk = false : sunk = true;
  return {length, coordinates, xy, hit, isSunk, sunk}
}

function Gameboard() {
  const hitCoordinates = [];
  const missed = [];
  const ships = [];

  function pushCoordinates(ship) {
    ships.push(ship);
    const array = [];
    for (let i = 0; i < ship.length; i++) {
      if (ship.xy === 'x') {
        const arr = [ship.coordinates[0], ship.coordinates[1] + i];  
        array.push(arr);
      } else {
        const arr = [ship.coordinates[0] + i, ship.coordinates[1]];
        array.push(arr);
      }
    }
    hitCoordinates.push(array);
  }

  const fiveShip = Ship(5, [1, 2], 'x');
  pushCoordinates(fiveShip);
  const fourShip = Ship(4, [2, 2], 'x');
  pushCoordinates(fourShip);
  const threeShip = Ship(3, [3, 2], 'x');
  pushCoordinates(threeShip);
  const twoShip = Ship(2, [4, 2], 'x');
  pushCoordinates(twoShip);
  const oneShip = Ship(1, [5, 2], 'x');
  pushCoordinates(oneShip);

  function receiveAttack(coordinates) {
    if (JSON.stringify(hitCoordinates).includes(coordinates)) {
      for (let i = 0; i < hitCoordinates.length; i++) {
        if (JSON.stringify(hitCoordinates[i]).includes(coordinates)) {
          ships[i].hit();
        }
      }
    } else missed.push(coordinates);
  }

  return { receiveAttack };
}

function Player() {
  const gameboard = Gameboard();
  return {gameboard}
}

const player = Player();
const computer = Player();
