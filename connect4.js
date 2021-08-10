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
    this.board.length = 0;
    for(let i = 0; i < this.height; i++) {
      this.board.push([...Array(this.width)].fill(null));
    }
    return this.board;
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
    htmlBoard.innerHTML = '';

    // creates top clickable row and listens for a click
    const topRow = document.createElement("tr");
    topRow.setAttribute("id", "row-top");
    this.handleClick = this.handleClick.bind(this);
    topRow.addEventListener("click", this.handleClick);
  
    // appends cells to top row
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      topRow.append(headCell);
      // added event listener to display player colour on top row hover
      this.hoverPlayerColour = this.hoverPlayerColour.bind(this);
      headCell.addEventListener('mousemove', this.hoverPlayerColour);
    }
    
    htmlBoard.append(topRow);
  
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

    // reset
    const resetBtn = document.getElementById('reset');
    this.reset = this.reset.bind(this);
    resetBtn.addEventListener('click', this.reset);
  }

  // given column x, return top empty y (null if filled)
  findSpotForCol(x) {
    for(let y = this.height - 1; y >= 0; y--) {
      if(this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  // update DOM to place piece into HTML table of board
  placeInTable(y, x) {
    const spot = document.getElementById(`${y}-${x}`)
    const piece = document.createElement('div');
    piece.classList.add('piece', `_${this.currPlayer}`)
    spot.append(piece);
  }

  // announce end of game
  showMessage(msg) {
    alert(msg)
  }

  displayCurrentPlayer() {
    const playerDisplay = document.querySelector('#wrap div');
    playerDisplay.innerHTML = `Current Player: Player ${this.currPlayer}`
  }

  hoverPlayerColour(e) {
    if(this.lockBoard) {
      e.target.className = '';
      return;
    }
    e.target.className = `player-${this.currPlayer}`
  }

  switchPlayer() {
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  reset() {
      this.lockBoard = false;
      this.currPlayer = 1;
      this.displayCurrentPlayer();
      this.makeBoard();
      this.makeHtmlBoard();
  }


  handleClick(e) {
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
      let winner = this.currPlayer;
      setTimeout(() => {this.showMessage(`Player ${winner} won!`)}, 200);
    }
  
    // check for tie
    if(this.board[0].every(val => val)) {
      setTimeout(() => {this.showMessage(`You have tied!`)}, 200);
    }
  
    // switches players
    // this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    this.switchPlayer();
    // updates current player in display
    this.displayCurrentPlayer();
  }


  checkForWin() {
    const _win = cells =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

  
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


}


new Game(6, 7);


