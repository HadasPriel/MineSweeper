function getRandomCell(gBoard) {
    var i = getRandomIntInclusive(0, gBoard.length - 1);
    var j = getRandomIntInclusive(0, gBoard.length - 1);
    if (gBoard[i][j].isMine) getRandomCell(gBoard);
    return gBoard[i][j];
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
    gTimerInterval = setInterval(time, 1)
}

function time() {
    if (!gGame.isOn) return
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