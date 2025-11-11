const board = document.querySelector('main .bottom');
const side = 50;

let snake = [{ x: 1, y: 3 }];
let food = null
let direction = 'right';

const foodImg = ["./img/rahul2.jpg", "./img/mamta.png", "./img/arvind.jpeg","./img/lallu.png","./img/tejpratap.jpg"];

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
function createBlocks() {

    if (board.innerHTML !== '') {
        board.innerHTML = '';
    }
    const rows = Math.floor(board.clientHeight / side);
    const cols = Math.floor(board.clientWidth / side);


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
window.addEventListener('resize', () => {
    createBlocks();
    drawSnake()
});


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
            // head = { x: food.x, y: food.y };
            snake.push(tail);
            // snake.unshift(head);
            clearFood();
        } 
    }
}
function gameLoop() {
    let check=1;
    const gameLoopId = setInterval(() => {
        moveSnake()
        drawSnake()
        playGame()
    }, 400);
}

document.querySelector(".start-btn").addEventListener("click",()=>{
    document.querySelector(".overlay").style.scale=0;
    document.querySelector(".overlay").style.transition="0.5s";
    setTimeout(gameLoop, 600)
})