class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
    this.lockBoard = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  // makes matrix of HEIGHT x WIDTH size
  // loops through 6 (HEIGHT) times and pushes an array with a length of 7 (WIDTH) each time, then fills the arrays with values of null
  makeBoard() {
    this.board = [];
    for(let i = 0; i < this.height; i++) {
      this.board.push([...Array(this.width)].fill(null));
    }
    return this.board;
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
    htmlBoard.innerHTML = '';

    // creates top clickable row and listens for a click
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    console.log(this)
    top.addEventListener("click", this.handleClick);
  
    // appends cells to top row
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
      // added event listener to display player colour on top row hover
      headCell.addEventListener('mousemove', this.hoverPlayerColour);
    }
    
    htmlBoard.append(top);
  
    // creates table rows and cells that corresponds with the width and height of the game board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
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
  findSpotForCol(x) {
    console.log(this)
    for(y = this.height - 1; y >= 0; y--) {
      if(this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  // update DOM to place piece into HTML table of board
  placeInTable(y, x) {
    const td = document.getElementById(`${y}-${x}`)
    const piece = document.createElement('div');
    piece.classList.add('piece', this.currPlayer)
    td.append(piece);
  }

  // announce end of game
  endGame(msg) {
    alert(msg)
  }

  handleClick(e) {
    console.log(this)
    // if board is locked, return
    if (this.lockBoard) return;
  
    // get id of clicked cell
    const x = +e.target.id;
    e.target.className = '';
    
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    this.placeInTable(y, x);
    // updates board variable
    this.board[y][x] = this.currPlayer;
  
    // check for win
    if (this.checkForWin()) {
      this.lockBoard = true;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
  
    // check for tie
    if(this.board.every(row => row.every(val => val))) {
      return this.endGame('You have tied!');
    }
  
    // switches players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    // updates current player in display
    playerDisplay.innerHTML = `Current Player: Player ${this.currPlayer}`
  
  }


  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    // checks for wins roziontally, vertically and diagonally (right and left)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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

  hoverPlayerColour(e) {
    if(this.currPlayer === 1) {
      e.target.className = 'player-one';
      } else {
        e.target.className = 'player-two';
    }
  }

}



// const resetBtn = document.getElementById('reset');
// const playerDisplay = document.querySelector('#wrap div');


// refreshes game
// resetBtn.addEventListener('click', () => {
//   window.location.reload();
// });


new Game(6, 7);


