document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.gameGrid');
    const width = 10;
    const result = document.querySelector('#result');

    let bombs = 20;
    let flagsLeft = document.querySelector('#flagsLeft');
    let squares = [];
    let isGameOver = false;
    let flags = 0;
    let flagsRemaining = bombs;

    function drawBoard() {

        flagsLeft.innerHTML = flagsRemaining;

        const bombArray = Array(bombs).fill('bomb');
        const emptyArray = Array(width * width - bombs).fill('safe');
        const gameArray = emptyArray.concat(bombArray);
        const shuffledArray = shuffle(gameArray);

        const LONG_PRESS_MS = 350;

        for (let i = 0; i < width * width; i++) {

            let pressTimer = null;
            let longPressTriggered = false;
            let lastTouchTime = 0;

            const square = document.createElement('div');
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function () {
                if ((Date.now() - lastTouchTime) < 900) { return; }
                click(square);
            });

            square.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if (square.classList.contains('checked')) { return; }
                else { addFlag(square); }
            });

            square.addEventListener('touchstart', (e) => {
                longPressTriggered = false;
                pressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    addFlag(square);
                }, LONG_PRESS_MS);
            });

            square.addEventListener('touchend', (e) => {
                clearTimeout(pressTimer);
                lastTouchTime = Date.now();
                if (!longPressTriggered) {
                    click(square);
                }
                e.preventDefault();
            });

            square.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            });
        }


        // the numbers
        for (let i = 0; i < squares.length; i++) {

            if (!squares[i].classList.contains('safe')) continue;

            const row = Math.floor(i / width);
            const col = i % width;

            const hasTop = row > 0;
            const hasBottom = row < width - 1;
            const hasLeft = col > 0;
            const hasRight = col < width - 1;
            let count = 0;

            if (hasLeft && squares[i - 1].classList.contains('bomb')) count++;                        // left
            if (hasRight && squares[i + 1].classList.contains('bomb')) count++;                       // right
            if (hasTop && squares[i - width].classList.contains('bomb')) count++;                     // top
            if (hasTop && hasRight && squares[i - width + 1].classList.contains('bomb')) count++;     // top right
            if (hasTop && hasLeft && squares[i - width - 1].classList.contains('bomb')) count++;      // top left
            if (hasBottom && squares[i + width].classList.contains('bomb')) count++;                  // bottom
            if (hasBottom && hasLeft && squares[i + width - 1].classList.contains('bomb')) count++;   // bottom left
            if (hasBottom && hasRight && squares[i + width + 1].classList.contains('bomb')) count++;  // bottom right

            squares[i].setAttribute('data', count);
        }
    }

    drawBoard();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function addFlag(square) {

        if (isGameOver) { return; }

        if (square.classList.contains('flag') && !square.classList.contains('checked')) {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
            flagsLeft.innerHTML = ++flagsRemaining;
            return;
        }

        if (!square.classList.contains('checked') && (flags < bombs)) {

            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                flags++;
                flagsLeft.innerHTML = --flagsRemaining;
                square.innerHTML = '<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="110" width="80" height="20" fill="#000000" /><rect x="60" y="100" width="40" height="10" fill="#000000" /><rect x="80" y="40" width="10" height="60" fill="#000000" /><path d="M 90 30 L 35 57 L 90 84" fill="#ff0000" /></svg>';

                checkWin();
            }
        }
    }

    function click(square) {

        if (isGameOver) { return; }

        if (square.classList.contains('checked') || square.classList.contains('flag')) { return; }

        if (square.classList.contains('bomb')) {
            gameOver();
        }

        else {
            let count = square.getAttribute('data');

            if (count != 0) {

                if (count == 1) { square.classList.add('one'); }
                if (count == 2) { square.classList.add('two'); }
                if (count == 3) { square.classList.add('three'); }
                if (count == 4) { square.classList.add('four'); }
                if (count == 5) { square.classList.add('five'); }
                if (count == 6) { square.classList.add('six'); }
                if (count == 7) { square.classList.add('seven'); }
                if (count == 8) { square.classList.add('eight'); }

                square.innerHTML = count;
                square.classList.add('checked');
                return;
            }
            checkSquare(square);
        }
        square.classList.add('checked');
    }

    function checkWin() {
        let matches = 0;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }

            if (matches === bombs) {
                result.innerHTML = 'YOU WIN!';
                isGameOver = true;
            }
        }
    }

    function gameOver() {
        result.innerHTML = 'GAME OVER!';
        isGameOver = true;

        squares.forEach(function (square) {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '<svg width="400" height="400" viewBox="-15 -15 147.509 147.509" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path style="fill:#fff;stroke-width:.1;stroke-linejoin:bevel" d="M35.134 34.736h20.478v20.612H35.134z"/><path style="fill:#000" d="M54.29 108.46v-9.047H36.192v-9.049h-9.048v9.049h-9.049v-9.049h9.049v-9.048h-9.049V63.22H0V54.289h18.096V36.193h9.049v-9.048h-9.049v-9.049h9.049v9.049h9.048v-9.049h18.096V0H63.22v18.096h18.096v9.049h9.048v-9.049h9.049v9.049h-9.049v9.048h9.049v18.096h18.096V63.22H99.413v18.096h-9.049v9.048h9.049v9.049h-9.049v-9.049h-9.048v9.049H63.22v18.096H54.289zm0-63.219v-9.048H36.192v18.096h18.096z"/></svg>';
                square.style.backgroundColor = "red";
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        })
    }

    function checkSquare(square) {  // when count is 0 

        const squareID = parseInt(square.id);
        const row = Math.floor(squareID / width);
        const col = squareID % width;

        const hasTop = row > 0;
        const hasBottom = row < width - 1;
        const hasLeft = col > 0;
        const hasRight = col < width - 1;

        setTimeout(function () {
            if (hasLeft) click(document.getElementById(squareID - 1));
            if (hasRight) click(document.getElementById(squareID + 1));
            if (hasTop) click(document.getElementById(squareID - width));
            if (hasTop && hasRight) click(document.getElementById(squareID - width + 1));
            if (hasTop && hasLeft) click(document.getElementById(squareID - width - 1));
            if (hasBottom) click(document.getElementById(squareID + width));
            if (hasBottom && hasLeft) click(document.getElementById(squareID + width - 1));
            if (hasBottom && hasRight) click(document.getElementById(squareID + width + 1));
        }, 10);
    }
})

