window.addEventListener("DOMContentLoaded", () => {

    // variables
    const board = document.querySelector('main .bottom');
    const foodMusic = document.querySelector(".food-music");
    const over = document.querySelector(".game-over")
    const score = document.querySelector("#score");
    const startBtn = document.querySelector(".start-btn");
    const startOverlay = document.querySelector(".start-overlay");
    const replayBtn = document.querySelector(".replay-btn");
    const overOverlay = document.querySelector(".over-overlay");
    const side = 50;
    let rows = Math.floor(board.clientHeight / side);
    let cols = Math.floor(board.clientWidth / side);
    let scr = 0;
    let snake = [{ x: 1, y: 3 }];
    let food = null
    let direction = 'right';
    let timerLoopId;
    let second = 0;
    let minute = 0;
    const foodImg = ["./img/rahul2.jpg", "./img/mamta.png", "./img/arvind.jpeg", "./img/lallu.png", "./img/tejpratap.jpg"];

    foodMusic.load();
    over.load();

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

    // resizing the board
    window.addEventListener('resize', () => {
        createBlocks();
        drawSnake()
    });

    // rendering snake
    function drawSnake() {
        const cells = document.querySelectorAll('.block');
        snake.forEach((part) => {
            cells.forEach((cell) => {
                if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                    cell.classList.add('snake');
                }
            })
        })
    }
    drawSnake()

    // generating food
    function foodGenerator() {
        const cells = document.querySelectorAll('.block');
        let foodX = Math.floor(Math.random() * (board.clientHeight / side));
        let foodY = Math.floor(Math.random() * (board.clientWidth / side));
        const foodImgUrl = foodImg[Math.floor(Math.random() * foodImg.length)];
        snake.forEach((part) => {
            if (part.x == foodX && part.y == foodY) {
                foodX = Math.floor(Math.random() * (board.clientHeight / side));
                foodY = Math.floor(Math.random() * (board.clientWidth / side));
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
        const cells = document.querySelectorAll('.block');
        let head = null;
        if (direction === 'right') {
            head = { x: snake[0].x, y: snake[0].y + 1 };
            snake.forEach((part) => {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                        cell.classList.remove('snake');

                    }
                })
            })
        }

        else if (direction === 'left') {
            head = { x: snake[0].x, y: snake[0].y - 1 };
            snake.forEach((part) => {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                        cell.classList.remove('snake');
                    }
                })
            })
        }

        if (direction === 'up') {
            head = { x: snake[0].x - 1, y: snake[0].y };
            snake.forEach((part) => {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                        cell.classList.remove('snake');
                    }
                })
            })
        }

        else if (direction === 'down') {
            head = { x: snake[0].x + 1, y: snake[0].y };
            snake.forEach((part) => {
                cells.forEach((cell) => {
                    if (cell.getAttribute('data-row') == part.x && cell.getAttribute('data-col') == part.y) {
                        cell.classList.remove('snake');
                    }
                })
            })
        }
        snake.unshift(head);
        snake.pop();
    }

    function clearFood() {
        const cells = document.querySelectorAll('.block');
        cells.forEach((cell) => {
            if (cell.getAttribute('data-row') == food.x && cell.getAttribute('data-col') == food.y) {
                document.querySelector('.food').style.backgroundImage = "";
                scr += 10;
                score.textContent = scr;
                cell.classList.remove('food');
            }
        })
        food = null;
    }

    function playGame() {
        if (food === null) {
            foodGenerator();
        }
        else {
            if (snake[0].x == food.x && snake[0].y == food.y) {
                const tail = { x: snake[0].x, y: snake[0].y };
                foodMusic.play();
                snake.push(tail);
                clearFood();
            }
        }
    }

    function gameLoop() {
        const gameLoopId = setInterval(() => {
            moveSnake()
            drawSnake()
            playGame()
            if (direction === "right" && snake[0].y > cols - 1) {
                clearInterval(gameLoopId);
                gameOver()
            }
            else if (direction === "left" && snake[0].y < 0) {
                clearInterval(gameLoopId);
                gameOver()
            }
            else if (direction === "down" && snake[0].x > rows - 1) {
                clearInterval(gameLoopId);
                gameOver()
            }
            else if (direction === "up" && snake[0].x < 0) {
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

    function gameOver() {
        clearInterval(timerLoopId);
        overOverlay.style.transform = "scale(1)";;
        overOverlay.style.transition = "0.5s";
        over.play()
        saveHighScr(scr)
    }

    // replay game
    replayBtn.addEventListener("click", () => {
        const cells = document.querySelectorAll('.block');
        cells.forEach((cell) => {
            cell.classList.remove('snake');

        })
        snake = [{ x: 1, y: 3 }];

        cells.forEach((cell) => {
            const foodCell = document.querySelector('.food');
            if (foodCell) foodCell.style.backgroundImage = "";

            cell.classList.remove('food');

        })
        food = null;
        overOverlay.style.transform = "scale(0)";
        overOverlay.style.transition = "0.5s";
        direction = "right";
        scr = 0;
        score.textContent = scr;
        document.querySelector("#timer").textContent = 0;
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
            document.querySelector("#timer").textContent = `${minute}:${second}`;
        }, 1000)
    }

    // high score
    function saveHighScr(score) {
        const highScore = Number(localStorage.getItem("highScore")) || 0;
        if (score > highScore) {
            localStorage.setItem("highScore", score);
            document.querySelector("#high-score").textContent = localStorage.getItem("highScore");
        }
    }
});