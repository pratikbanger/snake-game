// Game constaints & variables
let inputDirection = { x: 0, y: 0 };
const eatSFX = new Audio('eatSFX.mp3');
const gameOver = new Audio('gameOverSFX.mp3');
const moveSFX = new Audio('moveSFX.mp3');
const gameMusic = new Audio('bgMusic.mp3');

let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArray = [
    { x: 1, y: 1 }
]
let food = { x: 5, y: 5 };

// Game functions
// startGame.addEventListener("click", main);
let gameOverBox = document.querySelector('.gameOverBox');

function main(currentTime) {
    
    if(gameOverBox.classList.contains('d-none')){
        startGame.style.visibility = 'hidden';
        
        window.requestAnimationFrame(main);
        if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
            return;
        }
        lastPaintTime = currentTime;
        
        gameEngine();
    }
}

function isCollied(snake) {
    // If you bite yourself
    for (let index = 1; index < snakeArray.length; index++) {
        if (snake[index].x === snake[0].x && snake[index].y === snake[0].y) {
            return true;
        }
    }
    
    // If you bump into the wall
    if (snake[0].x >= 15 || snake[0].x <= 0 || snake[0].y >= 15 || snake[0].y <= 0) {
        return true;
    }
}

const displayNone = document.querySelector('.display-none');
function gameEngine() {
    
    // Part 1: Updating the snake array & Food
    let gameOverBox = document.querySelector('.gameOverBox');
    
    if (isCollied(snakeArray)) {
        gameOver.play();
        inputDirection = { x: 0, y: 0 };
        
        gameOverBox.style.visibility = 'visible';
        gameScore.innerHTML = "Your Score: 0";
        
        snakeArray = [{ x: 1, y: 1 }];
        score = 0;
        
        gameOverBox.classList.remove('d-none')
    }
    
    // On Eating food increment the score and regenerate the food; 
    if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
        eatSFX.play();
        score += 1;
        if (score > hiScoreValue) {
            hiScoreValue = score;
            localStorage.setItem('hiScore', JSON.stringify(hiScoreValue));
            gameHighestScore.innerHTML = "Highest Score: " + hiScoreValue;
        }
        gameScore.innerHTML = "Your Score: " + score;
        snakeArray.unshift({ x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y });
        let a = 2
        let b = 13
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }
    
    // Moving the snake
    for (let index = snakeArray.length - 2; index >= 0; index--) {
        snakeArray[index + 1] = { ...snakeArray[index] }
    }
    
    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;
    
    // Part 2: Display the snake
    gameBord.innerHTML = '';
    snakeArray.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('snakeHead')
        }
        else {
            snakeElement.classList.add('snakebody')
        }
        gameBord.appendChild(snakeElement);
    })
    
    // Part 3: Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('snakeFood')
    gameBord.appendChild(foodElement);
}

const playAgain = document.querySelector('.btn-success');
playAgain.addEventListener("click", () => {
    gameOverBox.classList.add('d-none')
    window.requestAnimationFrame(main);
});

// Main logic starts here
let hiScore = localStorage.getItem('hiScore');
if (hiScore === null) {
    hiScoreValue = 0;
    localStorage.setItem('hiScore', JSON.stringify(hiScoreValue));
}
else {
    hiScoreValue = JSON.parse(hiScore)
    gameHighestScore.innerHTML = 'Highest Score: ' + hiScore;
}

const startGame = document.querySelector('.btn-outline-success');
startGame.addEventListener("click", main);

// window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDirection = { x: 0, y: 1 } // Start the game
    switch (e.key) {
        case "ArrowUp":
            inputDirection.x = 0;
            inputDirection.y = -1;
            moveSFX.play();
            break;
        case "ArrowLeft":
            inputDirection.x = -1;
            inputDirection.y = 0;
            moveSFX.play();
            break;
        case "ArrowRight":
            inputDirection.x = 1;
            inputDirection.y = 0;
            moveSFX.play();
            break;
        case "ArrowDown":
            inputDirection.x = 0;
            inputDirection.y = 1;
            moveSFX.play();
            break;

        default:
            break;
    }
})

// Playing game music
let playMusic = document.getElementsByClassName('fa-solid');
Array.from(playMusic).forEach(element => {
    element.addEventListener('click', () => {
        if (element.classList.contains("fa-volume-xmark")) {
            gameMusic.play();
            element.classList.remove("fa-volume-xmark");
            element.classList.add("fa-volume-high");
        }
        else {
            gameMusic.pause();
            element.classList.add("fa-volume-xmark");
            element.classList.remove("fa-volume-high");
        }
    });
});