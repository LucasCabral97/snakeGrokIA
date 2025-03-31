const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = spawnFood();
let direction = 'right';
let score = 0;
let gameOver = false;
let gameInterval;

function draw() {
    board.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function update() {
    if (gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        endGame();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        food = spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `Pontuação final: ${score}`;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    food = spawnFood();
    gameOverScreen.classList.add('hidden');
    startGame();
}

function startGame() {
    gameInterval = setInterval(update, 200);
}

// Controle com teclas e mobile
document.addEventListener('keydown', (event) => {
    if (!gameOver) {
        switch (event.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    } else if (event.key === 'Enter') {
        resetGame();
    }
});

// Controle mobile
document.querySelectorAll('.arrow-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (!gameOver) {
            const newDirection = button.getAttribute('data-direction');
            if (
                (newDirection === 'up' && direction !== 'down') ||
                (newDirection === 'down' && direction !== 'up') ||
                (newDirection === 'left' && direction !== 'right') ||
                (newDirection === 'right' && direction !== 'left')
            ) {
                direction = newDirection;
            }
        }
    });
});

restartBtn.addEventListener('click', resetGame);

draw();
startGame();