/*
    one single cell on the tic tac toe board
    marker is private and cannot be accessed directly
*/
function cell() {
    let marker = '';
    const getMarker = () => marker;
    const setMarker = (newMarker) => marker = newMarker;
    return {getMarker, setMarker};
}

/*
    the gameboard contains a 3*3 board filled with initially unmarkerd cells which is not publicly exposed
    the gameboard has public methods to reset the board to empty, change a specified cell, and check if a given marker has gotten 3 in a row
*/
function gameBoard() {
    let board;
    resetBoard();

    let getBoard = () => board;

    function resetBoard() {
        board = [];
        for (let row = 0; row < 3; row++) {
            board[row] = [];
            for(let col = 0; col < 3; col++) {
                let newCell = cell();
                board[row][col] = newCell;
            }
        }
    }

    function checkCell(row, col) {
        return board[row][col].getMarker() === '';
    }

    function setCell(row, col, marker) {
        const currentMarker = board[row][col].getMarker();
        if(currentMarker !== '') return false;

        board[row][col].setMarker(marker);
        return true;
    }

    function checkWin(marker) {
        if(checkRows(marker) || checkColumns(marker) || checkDiagonals(marker)) {
            return true;
        }
        return false;
    }

    function checkRows(marker) {
        for(let row = 0; row < 3; row++) {
            let winStatus = true;
            for(let col = 0; col < 3; col++) {
                if(board[row][col].getMarker() !== marker) {
                    winStatus = false;
                    break;
                }
            }
            if(winStatus === true) {
                return true;
            }
        }
        return false;
    }

    function checkColumns(marker) {
        for(let col = 0; col < 3; col++) {
            let winStatus = true;
            for(let row = 0; row < 3; row++) {
                if(board[row][col].getMarker() !== marker) {
                    winStatus = false;
                    break;
                }
            }
            if(winStatus) return true;
        }
        return false;
    }

    function checkDiagonals(marker) {
        let col = 0;
        let winStatus = true;
        //top left to bottom right
        for(let row = 0; row < 3; row++) {
            if(board[row][col].getMarker() !== marker) {
                winStatus = false;
                break;
            }
            col++
        }
        if(winStatus) return true;

        col = 2;
        winStatus = true;
        /*
            top right to bottom left
            immediately evaluates to false if one square is has the wrong marker because there are no more possible winning diagonals
        */
        for(let row = 0; row < 3; row++) {
            if(board[row][col].getMarker() !== marker) {
                return false;
            }
            col--;
        }
        return true;
    }

    function printBoard() {
        for(let row = 0; row < 3; row++) {
            let line = ''
            for(let col = 0; col < 3; col++) {
                line += board[row][col].getMarker() || ' ';
                if(col != 2) line += '|';
            }
            console.log(line);
            if(row != 2) {
                console.log('-------')
            }
        }
    }

    return {getBoard, resetBoard, checkCell, setCell, checkWin, printBoard};
}

function player(marker) {
    let getMarker = () => marker;
    return {getMarker};
}

function gameController(player1, player2, board) {
    let turns = 0;
    let activePlayer;
    let activeMarker;

    const getNextPlayer = () => activePlayer === player1 ? player2 : player1;
    const getActiveMarker = () => activeMarker;

    function setActivePlayer() {
        activePlayer = (activePlayer === player1) ? player2 : player1;
        activeMarker = activePlayer.getMarker();
    }

    function takeTurn(row, col) {
        let validSquare = board.checkCell(row, col);  
        if(validSquare) {
            turns++;
            setActivePlayer();
            board.setCell(row, col, activeMarker);
            const gameStatus = board.checkWin(activeMarker);

            let turnInfo = {validSquare};

            if(gameStatus){
                turnInfo.gameStatus = activePlayer;
            } 
            else if(turns === 9) {
                turnInfo.gameStatus = 'draw';
            } else {
                
                turnInfo.gameStatus = 'continue'
            }
            
            return turnInfo;
        }
        return {validSquare};
    }

    function reset() {
        turns = 0;
        activePlayer = undefined;
        activeMarker = undefined;
        board.resetBoard();
    }

    return {takeTurn, getActiveMarker, getNextPlayer, reset};
}

function displayController(game) {
    const cells = Array.from(document.querySelectorAll(".cell"))
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', reset);
    resetButton.addEventListener('mousedown', (e) => e.target.classList.add('pressed'));
    resetButton.addEventListener('mouseup', (e) => e.target.classList.remove('pressed'));

    const winText = document.querySelector('.winner');
    reset();

    function cellClick(e) {
        const cell = e.target;
        const cellId = cell.dataset.id
        const row = getRow(cellId);
        const col = getCol(cellId);
        const turnInfo = game.takeTurn(row, col);

        if(!turnInfo.validSquare) return;

        cell.textContent = game.getActiveMarker();
        cell.classList.add('filled');
            
        if(turnInfo.gameStatus === 'continue') {
            const nextPlayer = game.getNextPlayer();
            const marker = nextPlayer.getMarker().toUpperCase()
            winText.textContent = `${marker}'s turn`;
        } else {
            if(turnInfo.gameStatus === 'draw') {
                winText.textContent = "It's a draw!";
            } else {
                const winMarker = turnInfo.gameStatus.getMarker().toUpperCase();
                winText.textContent = `${winMarker} wins!`;
            }

            resetCells();
        }
    }

    const resetCells = () => {
        cells.forEach(cell => {
            cell.removeEventListener('click', cellClick);
            cell.classList.add('filled');
        })
    }

    const getRow = (cellId) => Math.floor(cellId/3);

    const getCol = (cellId) => cellId % 3;

    function reset() {
        game.reset();
        cells.forEach(cell => cell.textContent = '');
        cells.forEach(cell => {
            cell.addEventListener('click', cellClick)
            cell.classList.remove('filled');
        })
        winText.textContent = "X's turn"
    }
}

const board = gameBoard();
const player1 = player('x');
const player2 = player('o');
const game = gameController(player1, player2, board);
displayController(game);