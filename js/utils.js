function getRandomCell(board) {
    var i = getRandomIntInclusive(0, board.length - 1);
    var j = getRandomIntInclusive(0, board.length - 1);
    if (board[i][j].isMine) getRandomCell(board);
    return board[i][j];
}

//translate class 'cell,i,j' into lacotion {i: i, j: j} 
function getCellLocation(str) {
    var classDivs = str.split('-');
    var location = { i: +classDivs[1], j: +classDivs[2] };
    return location;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startTimer() {
    gTime = Date.now()
    intervalId = setInterval(time, 10)
}

function time() {
    var now = Date.now()
    timer = now - gTime

    var minute = +((Math.floor(timer / (1000 * 60))))
    var second = +(Math.floor(timer / 1000) % 60)

    if (minute < 10) minute = '0' + minute
    if (second < 10) second = '0' + second
    else if (second === 0) second = '00'


    var elClock = document.querySelector('.clock')
    elClock.innerText = (minute + ' : ' + second);
}

function findNegs(location) {
    //to avoid repetition build and use at cellClicked and setMinesNegsCount
}

function renderCell(location, value) {
    //to make the code more efficient and avoid render all board at cellClicked
}











// for (var x = location.i - 1; x <= location.i + 1; x++) {
//     if (x < 0 || x > gBoard.length - 1) continue;
//     for (var y = location.j - 1; y <= location.j + 1; y++) {
//         if (y < 0 || y > gBoard.length - 1) continue;
//         if (gBoard[x][y].isMine) continue;
//         if (gBoard[x][y].isShown) continue;
//         gBoard[x][y].isShown = true;
//         renderCell(x, y, gBoard[x][y].minesAroundCount);
//     }
// }