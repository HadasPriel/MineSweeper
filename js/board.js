const MINE_IMG = '<img src="img/mine.png"/>';
const MARK_IMG = '<img src="img/flag.png"/>';

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
console.log(gBoard);

function buildBoard(size) {
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
    for (i = 0; i < gLevel.MINES; i++) {
        randomCell = getRandomCell(board);
        randomCell.isMine = true;
    }
    setMinesNegsCount(board);
    return board;
}

function renderBoard(board, selector) {
    var strHtml = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHtml += `<td onclick="cellClicked(this, ${i}, ${j})" 
            onmousedown = "cellMarked(this, event)" 
            oncontextmenu="event.preventDefault();"
            class="cell-${i}-${j}" >`;
            strHtml += '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHtml;
}


function renderCell(i, j, value) {
    var cellClass = 'cell-' + i + '-' + j;
    var elCell = document.querySelector('.' + cellClass);
    elCell.innerHTML = value;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = 0;
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


function setLevel(elLevel) {
    endGame()
    switch (elLevel.value) {
        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    reset();
    resetBoard();
}