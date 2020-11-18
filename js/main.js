var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var board = buildBoard(gLevel.SIZE, gLevel.MINES);
console.log(board);
var gShowenCount;
var gMarkedCount;

const MINE_IMG = '<img src="img/mine.jpg"/>';
const MARK_IMG = '<img src="img/flag.png"/>';
const EMPTY = '';

function initGame() {
    gShowenCount = 0;
    gMarkedCount = 0;
    // startTimer()
    renderBoard(board, '.board-container');
}

function buildBoard(size, mines) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    for (i = 0; i < mines; i++) {
        randomCell = getRandomCell(board);
        randomCell.isMine = true;
        // randomCell.isShown = true;
    }

    setMinesNegsCount(board)
    return board;
}

function renderBoard(board, selector) {
    var strHtml = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // var cellClass = 'cell,' + i + ',' + j;
            strHtml += `<td onclick="cellClicked(this, ${i}, ${j})" 
            onmousedown = "cellMarked(this, event)" 
            oncontextmenu="event.preventDefault(event, this);"
            
             class="cell-${i}-${j}" >`;

            //contant of cell
            if (board[i][j].isShown) {
                if (!board[i][j].isMine) strHtml += board[i][j].minesAroundCount;
                if (board[i][j].isMine) strHtml += MINE_IMG;
                if (board[i][j].isMarked) strHtml += MARK;
            }
            strHtml += '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHtml;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            for (var x = i - 1; x <= i + 1; x++) {
                if (x < 0 || x > board.length - 1) continue;
                for (var y = j - 1; y <= j + 1; y++) {
                    if (y < 0 || y > board.length - 1) continue;
                    if (i === x && j === y) continue;
                    if (board[x][y].isMine) board[i][j].minesAroundCount++;
                }
            }
        }
    }
}


function cellClicked(elCell) {

    var location = getCellLocation(elCell.className);
    var cell = board[location.i][location.j];

    if (cell.isMine) {
        elCell.innerHTML = MINE_IMG;

        console.log('game over');
    } else if (cell.minesAroundCount > 0) {
        board[location.i][location.j].isShown = true;
        elCell.innerText = cell.minesAroundCount;
        gShowenCount++
    } else if (cell.minesAroundCount === 0) {
        expandShown(board, location.i, location.j)
    }

    if (!checkGameOver()) console.log('Vitory');
}


function expandShown(board, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x > board.length - 1) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y > board.length - 1) continue;
            if (board[x][y].isMine) continue;
            if (board[x][y].isShown) continue;
            board[x][y].isShown = true;
            gShowenCount++;
            renderCell(x, y, board[x][y].minesAroundCount);
        }
    }
}

function renderCell(i, j, value) {
    var cellClass = 'cell-' + i + '-' + j;
    var elCell = document.querySelector('.' + cellClass);
    elCell.innerHTML = value;
}

function cellMarked(elCell, event) {
    if (event.button !== 2) return;
    var location = getCellLocation(elCell.className);
    var cell = board[location.i][location.j]
    if (cell.isShown) return;
    if (!cell.isMarked) {
        board[location.i][location.j].isShown = true;
        cell.isMarked = true;
        gMarkedCount++;
        renderCell(location.i, location.j, MARK_IMG)
    } else {
        board[location.i][location.j].isShown = false;
        cell.isMarked = false;
        gMarkedCount--;
        renderCell(location.i, location.j, ' ') //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    // if (checkGameOver()) console.log('Vitory');
}

function checkGameOver() {
    if (gMarkedCount + gShowenCount === Math.pow(gLevel.SIZE, 2)) return true;
    return false;
}