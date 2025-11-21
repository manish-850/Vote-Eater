window.addEventListener("DOMContentLoaded", () => {

    // variables
    const board = document.querySelector('main .bottom');
    const foodMusic = document.querySelector(".food-music");
    const over = document.querySelector(".game-over")
    const bgm = document.querySelector(".bgm");
    const score = document.querySelector("#score");
    const startBtn = document.querySelector(".start-btn");
    const startOverlay = document.querySelector(".start-overlay");
    const replayBtn = document.querySelector(".replay-btn");
    const overOverlay = document.querySelector(".over-overlay");
    const side = 50;
    let rows = Math.floor(board.clientHeight / side);
    let cols = Math.floor(board.clientWidth / side);
    let scr = 0;
    const highScrElem = document.querySelector("#high-score");
    const timerElem = document.querySelector("#timer");
    let highScore=0;
    let snake = [{ x: 1, y: 3 }];
    let food = null
    let direction = 'down';
    let timerLoopId;
    let gameLoopId;
    let second = 0;
    let minute = 0;
    const foodImg = ["./img/rahul.jpg", "./img/mamta.png", "./img/arvind.jpeg", "./img/lallu.png", "./img/tejpratap.jpg"];

    bgm.load()
    foodMusic.load();
    foodMusic.volume=0.5;
    over.load();
    bgm.volume=0.2;
    bgm.play()

    // high score 
    highScore = Number(localStorage.getItem("highScore")) || 0;
    highScrElem.textContent = highScore;
    
    // direction
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        }

        else if (e.key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        }
        else if (e.key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        }
        else if (e.key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        }
    });

    let startX, startY, endX, endY;

    board.addEventListener("touchstart", (e) => {
        e.preventDefault();   // stop pull-to-refresh
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: false });

    board.addEventListener("touchmove", (e) => {
        e.preventDefault();   // stop scrolling
        const touch = e.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;
    }, { passive: false });

    board.addEventListener("touchend", (e) => {
        e.preventDefault();   // stop pull-to-refresh
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && direction !== "left") direction = "right";
            else if (diffX < 0 && direction !== "right") direction = "left";
        } else {
            if (diffY > 0 && direction !== "up") direction = "down";
            else if (diffY < 0 && direction !== "down") direction = "up";
        }
    }, { passive: false });


    // creating board
    function createBlocks() {

        if (board.innerHTML !== '') {
            board.innerHTML = '';
        }
        rows = Math.floor(board.clientHeight / side);
        cols = Math.floor(board.clientWidth / side);


        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.classList.add('block');
                cell.setAttribute('data-row', `${i}`);
                cell.setAttribute('data-col', `${j}`);
                board.appendChild(cell);
            }
        }
    }
    createBlocks();
    const cells = document.querySelectorAll('.block');
    // resizing the board
    window.addEventListener('resize', () => {
        cells = document.querySelectorAll('.block');
        createBlocks();
        drawSnake()
    });

    // rendering snake
    function drawSnake() {
        snake.forEach((part) => {
            cells.forEach((cell) => {
                if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                    cell.classList.add('snake');
                }
            })
        })
    }
    drawSnake()

    // removing snake
    function clearSnake() {
        const snakeCells = document.querySelectorAll('.snake');
        snakeCells.forEach((cell) => {
            cell.classList.remove('snake');
        })
    }

    // generating food
    function foodGenerator() {
        let foodX = Math.floor(Math.random() * rows);
        let foodY = Math.floor(Math.random() * cols);
        const foodImgUrl = foodImg[Math.floor(Math.random() * foodImg.length)];
        snake.forEach((part) => {
            if (part.x == foodX && part.y == foodY) {
                foodX = Math.floor(Math.random() * rows);
                foodY = Math.floor(Math.random() * cols);
            }
        })
        cells.forEach((cell) => {
            if (cell.getAttribute('data-row') == foodX && cell.getAttribute('data-col') == foodY) {
                cell.classList.add('food');
                document.querySelector('.food').style.backgroundImage = `url(${foodImgUrl})`;
                food = { x: foodX, y: foodY };
            }
        })
    }

    function moveSnake() {
        let head = null;
        if (direction === 'right') {
            head = { x: snake[0].x, y: snake[0].y + 1 };
            clearSnake();
        }

        else if (direction === 'left') {
            head = { x: snake[0].x, y: snake[0].y - 1 };
            clearSnake();
        }

        else if (direction === 'up') {
            head = { x: snake[0].x - 1, y: snake[0].y };
            clearSnake();
        }

        else if (direction === 'down') {
            head = { x: snake[0].x + 1, y: snake[0].y };
            clearSnake();
        }
        snake.unshift(head);
        snake.pop();
    }

    function clearFood() {
        const foodCell = document.querySelector('.food');
        if (foodCell) {
            foodCell.style.backgroundImage = "";
            foodCell.classList.remove('food');
        }
        food = null;
    }

    function playGame() {
        if (food === null) {
            foodGenerator();
        }
        else {
            if (snake[0].x == food.x && snake[0].y == food.y) {
                const tail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
                foodMusic.play();
                snake.push(tail);
                scr += 10;
                score.textContent = scr;
                clearFood();
            }
        }
    }
    // game over
    function gameOver() {
        clearInterval(timerLoopId);
        overOverlay.style.transform = "scale(1)";;
        overOverlay.style.transition = "0.5s";
        over.play()
        saveHighScr(scr)
    }

    function gameLoop() {
        clearInterval(gameLoopId)
        gameLoopId = setInterval(() => {
            moveSnake()
            drawSnake()
            playGame()
            if ((direction === "right" && snake[0].y > cols - 1) || (direction === "left" && snake[0].y < 0) ||
                (direction === "down" && snake[0].x > rows - 1) || (direction === "up" && snake[0].x < 0)) {
                clearInterval(gameLoopId);
                gameOver()
            }
        }, 400);
    }

    // start game
    startBtn.addEventListener("click", () => {
        startOverlay.style.transform = "scale(0)";
        startOverlay.style.transition = "0.5s";
        setTimeout(gameLoop, 600)
        timer()
    })

    // replay game
    replayBtn.addEventListener("click", () => {
        clearSnake();
        clearFood();
        overOverlay.style.transform = "scale(0)";
        overOverlay.style.transition = "0.5s";
        snake = [{ x: 1, y: 3 }];
        food = null;
        direction = "down";
        scr = 0;
        score.textContent = scr;
        timerElem.textContent = 0;
        setTimeout(gameLoop, 600)
        timer();
    })

    // Timer
    function timer() {
        clearInterval(timerLoopId);
        second = 0;
        minute = 0;
        timerLoopId = setInterval(() => {
            second++;
            if (second === 60) {
                second = 0;
                minute++;
            }
            timerElem.textContent = `${minute}:${second}`;
        }, 1000)
    }

    // high score
    function saveHighScr(score) {
        if (score > highScore) {
            localStorage.setItem("highScore", score);
            highScore = Number(localStorage.getItem("highScore"));
            highScrElem.textContent = highScore;
        }
    }
});