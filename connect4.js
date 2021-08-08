const resetBtn = document.getElementById('reset');
const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1;
let lockBoard = false;
const board = [];

// makes matrix of HEIGHT x WIDTH size
// loops through 6 (HEIGHT) times and pushes an array with a length of 7 (WIDTH) each time, then fills the arrays with values of null
function makeBoard() {
  board.length = 0;
  for(let i = 0; i < HEIGHT; i++) {
    board.push([...Array(WIDTH)].fill(null));
  }
  return board;
}

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  
  htmlBoard.innerHTML = '';
  // creates top clickable row and listens for a click
  const topRow = document.createElement("tr");
  topRow.setAttribute("id", "row-top");
  topRow.addEventListener("click", handleClick);

  // appends cells to top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    topRow.append(headCell);
    // added event listener to display player colour on top row hover
    headCell.addEventListener('mousemove', hoverPlayerColour);
  }
  
  htmlBoard.append(topRow);

  // creates table rows and cells that corresponds with the width and height of the game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      const div = document.createElement('div');
      cell.setAttribute("id", `${y}-${x}`);
      cell.append(div);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

// given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  for(y = HEIGHT - 1; y >= 0; y--) {
    if(board[y][x] === null) {
      return y;
    }
  }
  return null;
}

// update DOM to place piece into HTML table of board
function placeInTable(y, x) {
  const spot = document.getElementById(`${y}-${x}`);
  const piece = document.createElement('div');
  piece.classList.add('piece', `_${currPlayer}`);
  spot.append(piece);
}

// announce end of game
function showMessage(msg) {
  alert(msg)
}

// updates current player in display
function displayCurrentPlayer() {
  const playerDisplay = document.querySelector('#wrap div');
  playerDisplay.innerHTML = `Current Player: Player ${currPlayer}`
}

// displays current player colour on hover
function hoverPlayerColour(e) {
  e.target.className = `player-${currPlayer}`
}

// refreshes game
resetBtn.addEventListener('click', () => {
  makeBoard();
  makeHtmlBoard();
});

// handle click of column top to play piece
function handleClick(e) {

  // if board is locked, return
  if (lockBoard) return;

  // get id of clicked cell
  const x = +e.target.id;
  e.target.className = '';
  
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  placeInTable(y, x);
  // updates board variable
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    lockBoard = true;
    showMessage(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(board[0].every(val => val)) {
    showMessage('You have tied!');
  }

  // switches players
  currPlayer = currPlayer === 1 ? 2 : 1;
  // updates current player in display
  displayCurrentPlayer() 
}


// checkForWin: check board cell-by-cell for "does a win start here?"
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // checks for wins roziontally, vertically and diagonally (right and left)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

