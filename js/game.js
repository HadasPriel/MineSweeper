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
        var temp = random;
        random = cell;
        cell = temp;
        setMinesNegsCount(gBoard);
    }
    startTimer();
    gGame.isOn = true;
    return cell;
}

function endGame() {
    clearInterval(gTimerInterval);
    gGame.isOn = false;
    btnHTML();
}

function reset() {
    gLiveCounter = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isVictory = false;
    gTimerInterval = null;
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
        gBoard[location.i][location.j].isShown = true;
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
            //if 0 negs dont show number
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

function liveHTML() {
    strHTML = ''
    for (var i = 0; i < gLiveCounter; i++) {
        strHTML += '<img src="img/heart.png"/>';
    }
    var elLiveBar = document.querySelector('.lives');
    elLiveBar.innerHTML = strHTML;
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

function hint(elHintBtn) {
    elHintBtn.classList.add('use')
    gGame.isHint = true;

    // setTimeout(function() {
    //     elHintBtn.classList.remove('use')
    // }, 1000)


    //     strHTML='';
    // strHTML+= `<img src="img/bulbOn.png">`
}

function playHint(elCell) {


    var location = getCellLocation(elCell.className);
    var cell = gBoard[location.i][location.j];

    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue;
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.classList.add("checked");
            if (gBoard[i][j].minesAroundCount) renderCell(i, j, gBoard[i][j].minesAroundCount);
        }

    }
}