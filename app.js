function Game() {
    var baseScore = 2,
        newTileCount = 2,
        boardDimension = 4,
        currentScore = 0,
        highScore = 0,
        gameState = [],
        emptySlot = [];

    function start() {
        gameState = buildBoard(boardDimension);
        populateRandom(newTileCount);
        render();
        attachKeyListener();
    }

    function handleTurn() {
    	populateRandom(newTileCount);
        render();
        console.log(highScore);
    }

    function attachKeyListener() {
        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.which || e.keyCode) {
                case 37: // left
                	pushLeft();
                	handleTurn();
                    break;

                case 38: // up
                	pushUp();
                	handleTurn();
                    break;

                case 39: // right
                	pushRight();
                	handleTurn();
                    break;

                case 40: // down
                	pushDown();
                	handleTurn();
                    break;

                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault();
        };
    }

    function buildBoard(size) {
        var board = [];
        for (var i = 0; i < size; i++) {
            board.push(Array.apply(null, new Array(size)).map(Number.prototype.valueOf, 0));
        }
        return board;
    }

    function stripEmpty(val) {
        // [0,0,2,0] -> [2]
        while (~val.indexOf(0)) {
            val.splice(val.indexOf(0), 1);
        }
        return val;
    }

    function addEmpty(val) {
        // [2] -> [2,0,0]
        var size = boardDimension - val.length;
        return val.concat(Array.apply(null, new Array(size)).map(Number.prototype.valueOf, 0));
    }

    function collapse(val) {
        // [0,2,2,4] -> [2,2,4] -> [4,4]
        var newVal = [],
            i = 0;
        val = stripEmpty(val);
        while (val[i] !== undefined && val[i + 1] !== undefined) {
            if (val[i] === val[i + 1]) {
                val[i] += val[i + 1];
                highScore += val[i];
                val.splice(i + 1, 1);
            }
            i++;
        }
        return addEmpty(val);
    }

    function pushLeft() {
        for (var i = 0; i < boardDimension; i++) {
            setRow(i, collapse(getRow(i)));
        }
    }

    function pushRight() {
        for (var i = 0; i < boardDimension; i++) {
            setRow(i, collapse(getRow(i).reverse()).reverse());
        }
    }

    function pushUp() {
        for (var i = 0; i < boardDimension; i++) {
            setColumn(i, collapse(getColumn(i)));
        }
    }

    function pushDown() {
        for (var i = 0; i < boardDimension; i++) {
            setColumn(i, collapse(getColumn(i).reverse()).reverse());
        }
    }

    function getRow(row) {
        return gameState[row];
    }

    function setRow(row, val) {
        if (Object.prototype.toString.call(val) !== '[object Array]') {
            console.log('Error: row value to set is not an array');
            return;
        }
        if (val.length !== boardDimension) {
            console.log('Error: row value does not match board dimension');
            return;
        }
        gameState[row] = val;
    }

    function getColumn(col) {
        // Get column top to bottom
        var columnData = [];
        for (var i = 0; i < boardDimension; i++) {
            columnData.push(gameState[i][col]);
        }
        return columnData;
    }

    function setColumn(col, val) {
        if (Object.prototype.toString.call(val) !== '[object Array]') {
            console.log('Error: column value to set is not an array');
            return;
        }
        if (val.length !== boardDimension) {
            console.log('Error: column value does not match board dimension');
            return;
        }
        for (var i = boardDimension - 1; i >= 0; i--) {
            gameState[i][col] = val.pop();
        }
    }

    function findEmptySlot() {
        emptySlot = [];
        for (var i = 0; i < boardDimension; i++) {
            for (var j = 0; j < boardDimension; j++) {
                if (gameState[i][j] === 0) {
                    emptySlot.push(i * 10 + j);
                }
            }
        }
    }

    function populateRandom(newTileCount) {
        var randomPosition, position, i;
        findEmptySlot();
        if (emptySlot.length >= newTileCount) {
            // populate random position
            for (i = 0; i < newTileCount; i++) {
                randomPosition = Math.round(Math.random() * (emptySlot.length - 1));
                position = parseInt(emptySlot.splice(randomPosition, 1));
                gameState[Math.floor(position / 10)][position % 10] = baseScore;
            }
        } else {
            // fill in remaining position
            for (i = 0; i < emptySlot.length; i++) {
                position = emptySlot[i];
                gameState[Math.floor(position / 10)][position % 10] = baseScore;
            }
            emptySlot = [];
        }
    }

    function render() {
        var output = '';
        for (var i = 0; i < boardDimension; i++) {
            for (var j = 0; j < boardDimension; j++) {
                output += '[' + (gameState[i][j] === 0 ? ' ': gameState[i][j]) + ']';
            }
            output += '\n';
        }
        console.log(output);
    }
    return {
        start: start,
        pushLeft: pushLeft,
        pushRight: pushRight,
        pushUp: pushUp,
        pushDown: pushDown
    };
}
