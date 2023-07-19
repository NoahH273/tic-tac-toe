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
        for(let row = 2; row >= 0; row--) {
            if(board[row][col].getMarker() !== marker) {
                return false;
            }
        }
        return true;
    }

    return {getBoard, resetBoard, checkCell, setCell, checkWin};
}

function player(marker) {
    let getMarker = () => marker;
    return {getMarker};
}

function gameController(player1, player2, board) {
    let turns = 0;
    let activePlayer;
    let activeMarker;

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

    return {takeTurn, getActiveMarker};
}

function displayController(game) {
    const cells = Array.from(document.querySelectorAll(".cell"))
    cells.forEach(cell => cell.addEventListener('click', cellClick));

    function cellClick(e) {
        const cellId = e.target.dataset.id
        const row = getRow(cellId);
        const col = getCol(cellId);
        const turnInfo = game.takeTurn(row, col);

        if(!turnInfo.validSquare) return;

        e.target.textContent = game.getActiveMarker();
            
        if(turnInfo.gameStatus != 'continue') {
            const winText = document.querySelector('.winner');
            winText.classList.add('revealed');
            if(turnInfo.gameStatus === 'draw') {
                winText.textContent = "It's a draw!";
            } else {
                winText.textContent = `${turnInfo.gameStatus.getMarker()} wins!`;
            }
        }
    }

    const getRow = (cellId) => Math.floor(cellId/3);

    const getCol = (cellId) => cellId % 3;
}

const board = gameBoard();
const player1 = player('x');
const player2 = player('o');
const game = gameController(player1, player2, board);
displayController(game);