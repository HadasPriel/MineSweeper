var gSafeNum = 3;

function getRandomCellCoor2() {
    var freeCoors = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][i].isMine === false && gBoard[i][i].isShown === false) freeCoors.push({ i: i, j: j })
        }
    }
    freeCoors.sort(function() { return Math.random() - 0.5 })
    return freeCoors.pop();
}

function getRandomCellCoor() {
    if (gBoard.isShown + gBoard.isMine > Math.pow(gLevel.SIZE, 2)) return; //need improvement!!!!!!!!!
    var i = getRandomIntInclusive(0, gBoard.length - 1);
    var j = getRandomIntInclusive(0, gBoard.length - 1);
    if (gBoard[i][j].isMine) getRandomCellCoor(gBoard);
    if (gBoard[i][j].isShown) getRandomCellCoor(gBoard); //need improvement!!!!

    return { i: i, j: j };
}

function liveHTML() {
    strHTML = ''
    for (var i = 0; i < gLiveCounter; i++) {
        strHTML += '<img src="img/heart.png"/>';
    }
    var elLiveBar = document.querySelector('.lives');
    elLiveBar.innerHTML = strHTML;
}

function hint(elHintBtn) {
    elHintBtn.classList.add('use')
    gGame.isHint = true;
}

function playHint(elCell) {
    var location = getCellLocation(elCell.className);
    for (let m = location.i - 1; m <= location.i + 1; m++) {
        if (m < 0 || m > gBoard.length - 1) continue;
        for (let n = location.j - 1; n <= location.j + 1; n++) {
            if (n < 0 || n > gBoard.length - 1) continue;
            var elCell = document.querySelector(`.cell-${m}-${n}`);
            if (gBoard[m][n].isMine) renderCell(m, n, MINE_IMG);
            else renderCell(m, n, gBoard[m][n].minesAroundCount);

            setTimeout(function() {
                if (gBoard[m][n].isShown) renderCell(m, n, gBoard[m][n].minesAroundCount);
                else renderCell(m, n, '');
            }, 1000)
        }
    }
    var elHintBtn = document.querySelector('.use');
    elHintBtn.classList.remove('use')
    elHintBtn.innerHTML = '';
    gGame.isHint = false
}

function safeClick(elSafeBtn) {
    if (gSafeNum === 0) return
    gSafeNum--;
    for (var i = 0; i < 3; i++) {
        var location = getRandomCellCoor2()
        var elRandom = document.querySelector(`.cell-${location.i}-${location.j}`)
        elRandom.classList.add('safeClick')

        deletSafe(elRandom)

    }
    // var elSpan = elSafeBtn.document.querySelector('span')
    // elSpan.innerText = gSafeNum;
    elSafeBtn.innerText = `${gSafeNum} safe click`
}

function deletSafe(elRandom) {
    setTimeout(function() {
        elRandom.classList.remove('safeClick')
    }, 1000)
}