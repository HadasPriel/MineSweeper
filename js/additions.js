var gSafeNum = 3;

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
    safeCells = [];
    while (safeCells.length < 3) {
        var location = getRandomFreeLocation(gBoard)
        var random = gBoard[location.i][location.j]
        if (safeCells.includes(random)) {
            location = getRandomFreeLocation(gBoard)
            var random = gBoard[location.i][location.j]
        }
        safeCells.push(random)
        var elRandom = document.querySelector(`.cell-${location.i}-${location.j}`)
        elRandom.classList.add('safeClick')

        deletSafe(elRandom)
    }
    var elSpan = elSafeBtn.querySelector('span')
    elSpan.innerText = gSafeNum;
}

function deletSafe(elRandom) {
    setTimeout(function() {
        elRandom.classList.remove('safeClick')
    }, 1000)
}

function undo() {
    if (!gGame.isOn) return
    var lastClickCells = gMoves.pop()
    for (var i = 0; i < lastClickCells.length; i++) {
        var lastLocation = lastClickCells[i]
        var lastCell = gBoard[lastLocation.i][lastLocation.j]
        lastCell.isShown = false

        var elLastCell = document.querySelector(`.cell-${lastLocation.i}-${lastLocation.j}`)
        elLastCell.innerText = '';
        elLastCell.classList.remove('checked')
    }
}


function manuallyCreate() {
    gGame.manuallyCreate = true;
}

function playManually(elCell) {



    elBtn = document.querySelector('.manually span')
    for (var i = gLevel.MINES; i > 0; i++) {
        elBtn.innerText = `Insert ${i} more mines`
    }
}