document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const context = canvas.getContext('2d');
    const startButton = document.getElementById('start-button');
    const difficultySlider = document.getElementById('difficulty-slider');
    const difficultyLabel = document.getElementById('difficulty-label');
    const messageDiv = document.getElementById('message');
    const moveCounter = document.getElementById('move-counter');
    const rulesButton = document.getElementById('rules-button');
    const modal = document.getElementById('rules-modal');
    const closeButton = document.querySelector('.close-button');

    let boardSize = 5;
    let board = [];
    let knightMoves = [
        [-2, -1], [-1, -2], [1, -2], [2, -1],
        [2, 1], [1, 2], [-1, 2], [-2, 1]
    ];
    let path = [];
    let moveCount = 0;
    let isGameActive = false;
    let knightPosition = { x: 0, y: 0 };
    const knightIcon = '♞';

    const difficulties = ['5x5', '6x6', '7x7', '8x8'];
    const solvableStartingPositions = {
        5: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 4 }, { x: 3, y: 1 }],
        6: [{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
        7: [{ x: 0, y: 0 }, { x: 6, y: 6 }, { x: 3, y: 3 }, { x: 2, y: 1 }],
        8: [{ x: 0, y: 0 }, { x: 7, y: 7 }, { x: 4, y: 4 }, { x: 1, y: 2 }]
    };

    difficultySlider.addEventListener('input', (event) => {
        difficultyLabel.textContent = difficulties[event.target.value - 5];
        boardSize = parseInt(event.target.value);
        resizeCanvas();
    });

    startButton.addEventListener('click', () => {
        messageDiv.textContent = '';
        moveCount = 0;
        path = [];
        isGameActive = true;
        moveCounter.textContent = `移动次数 = ${moveCount}`;
        initializeBoard();
        knightPosition = getRandomStartPosition();
        board[knightPosition.y][knightPosition.x] = ++moveCount;
        path.push([knightPosition.y, knightPosition.x]);
        drawBoard();
    });

    canvas.addEventListener('click', (event) => {
        if (!isGameActive) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor(x / (rect.width / boardSize));
        const row = Math.floor(y / (rect.height / boardSize));

        if (isValidMove(row, col)) {
            knightPosition = { x: col, y: row };
            board[row][col] = ++moveCount;
            path.push([row, col]);
            moveCounter.textContent = `移动次数 = ${moveCount}`;
            drawBoard();

            if (moveCount === boardSize * boardSize) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = `恭喜成功!`;
                isGameActive = false;
            } else if (!hasValidMoves()) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = `失败了，再来一次，加油！`;
                isGameActive = false;
            }
        }
    });

    function initializeBoard() {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    }

    function isValidMove(row, col) {
        if (row < 0 || col < 0 || row >= boardSize || col >= boardSize || board[row][col] !== 0) {
            return false;
        }

        const [lastRow, lastCol] = path[path.length - 1];
        for (let [dx, dy] of knightMoves) {
            if (lastRow + dx === row && lastCol + dy === col) {
                return true;
            }
        }

        return false;
    }

    function hasValidMoves() {
        const [currentRow, currentCol] = path[path.length - 1];
        return knightMoves.some(([dx, dy]) => {
            const newRow = currentRow + dx;
            const newCol = currentCol + dy;
            return newRow >= 0 && newCol >= 0 && newRow < boardSize && newCol < boardSize && board[newRow][newCol] === 0;
        });
    }

    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const cellSize = Math.min(canvas.width / boardSize, canvas.height / boardSize);

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                context.fillStyle = board[row][col] === 0 ? 'white' : 'green';
                context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }

        context.font = `${cellSize - 10}px Arial`;
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(knightIcon, knightPosition.x * cellSize + cellSize / 2, knightPosition.y * cellSize + cellSize / 2);
    }

    function getRandomStartPosition() {
        const randomIndex = Math.floor(Math.random() * solvableStartingPositions[boardSize].length);
        return solvableStartingPositions[boardSize][randomIndex];
    }

    function resizeCanvas() {
        const minDimension = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
        canvas.width = minDimension;
        canvas.height = minDimension;
        drawBoard();
    }

    // Initialize game
    resizeCanvas();

    // Rules modal
    rulesButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    window.addEventListener('resize', resizeCanvas);
});