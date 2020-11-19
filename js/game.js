var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    isVictory: false,
    isHint: false
};
var gTimerInterval;
var gLiveCounter = 3;


function initGame() {
    renderBoard(gBoard, '.board-container');
    liveHTML();
    btnHTML();
}

function firstClick(cell) {
    if (cell.isMine) {
        var random = getRandomCell(gBoard);
        var temp = cell;
        cell = random;
        random = temp;
        setMinesNegsCount(gBoard);
    }
    startTimer();
    gGame.isOn = true;
    return cell;
}

function endGame() {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    var elClock = document.querySelector('.clock');
    gGame.isOn = false;
    btnHTML();
}

function reset() {
    gLiveCounter = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isVictory = false;
    gGame.isOn = false;
    clearInterval(gTimerInterval);
    btnHTML();
    liveHTML();
    var elClock = document.querySelector('.clock');
    elClock.innerText = '00 : 00';

}

function resetBoard() {
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard, '.board-container');
}

function cellClicked(elCell) {
    if (gGame.isHint) {
        playHint(elCell)
        return
    }
    var location = getCellLocation(elCell.className);
    var cell = gBoard[location.i][location.j];
    //first click of game
    if (!gGame.isOn) {
        if (gGame.shownCount + gGame.markedCount === 0) cell = firstClick(cell);
        else return;
    }
    if (cell.isShown) return;
    if (cell.isMarked) return;
    //case the user clicked a mine:
    if (cell.isMine) {
        if (gLiveCounter === 1) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard.length; j++) {
                    if (gBoard[i][j].isMine) {
                        renderCell(i, j, MINE_IMG);
                    }
                }
            }
            elCell.classList.add('miss');
            endGame();
        }
        cell.isShown = true;
        renderCell(location.i, location.j, MINE_IMG);
        gLiveCounter--;
        liveHTML();
    }

    //case the user clicked cell with neighbors:
    else if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        elCell.innerHTML = cell.minesAroundCount;
        elCell.classList.add("checked");
        gGame.shownCount++;
    }

    //case the user clicked cell with no neighbors:
    else if (cell.minesAroundCount === 0) {
        expandShown(gBoard, location.i, location.j);
    }

    checkGameOver();
}

function expandShown(board, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x > board.length - 1) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y > board.length - 1) continue;
            if (board[x][y].isMine) continue;
            if (board[x][y].isShown) continue;
            if (board[x][y].isMarked) continue;
            board[x][y].isShown = true;
            gGame.shownCount++;

            var elNeg = document.querySelector(`.cell-${x}-${y}`);
            elNeg.classList.add("checked");
            //if cell have 0 negs dont show number
            if (board[x][y].minesAroundCount) renderCell(x, y, board[x][y].minesAroundCount);
            else expandShown(board, x, y);
        }
    }
}

function cellMarked(elCell, event) {
    if (event.button !== 2) return;
    var location = getCellLocation(elCell.className);
    var cell = gBoard[location.i][location.j];
    if (cell.isShown) return
    if (gGame.shownCount + gGame.markedCount === 0) {
        startTimer();
        gGame.isOn = true;
    }
    if (cell.isShown) return;
    if (!cell.isMarked) {
        cell.isMarked = true;
        gGame.markedCount++;
        renderCell(location.i, location.j, MARK_IMG);
    } else {
        cell.isMarked = false;
        gGame.markedCount--;
        renderCell(location.i, location.j, ' ');
    }
    checkGameOver();
}

function checkGameOver() {
    if (gGame.markedCount + gGame.shownCount === Math.pow(gLevel.SIZE, 2) &&
        gGame.markedCount === gLevel.MINES) {
        gGame.isVictory = true;
        console.log('Victory');
        endGame();
    }
}

function btnHTML() {
    strHTML = '';
    if (gGame.isVictory) strHTML = '<img src="img/cool.png"/>';

    else if (gGame.isOn) strHTML = '<img src="img/smile.png"/>';
    else if (!gGame.isOn && gGame.markedCount + gGame.shownCount === 0) strHTML = '<img src="img/smile.png"/>';
    else if (!gGame.isOn) strHTML = '<img src="img/sad.png"/>';

    elBtn = document.querySelector('button');
    elBtn.innerHTML = strHTML;
}