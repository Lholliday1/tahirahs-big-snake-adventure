const gameBackground = new Image();
gameBackground.src = "assets/images/game-background.jpeg";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const eddieLaugh = new Audio("assets/sounds/eddie-haha.mp3");
eddieLaugh.volume = 1.0;

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.35;

const introBackground = new Image();
introBackground.src = "assets/images/intro-background.jpeg";
const gameOverBackground = new Image();
gameOverBackground.src = "assets/images/game-over.jpeg";
const winBackground = new Image();
winBackground.src = "assets/images/win-screen.jpeg";

function startMusic() {
    bgMusic.volume = 0.35;

    bgMusic.play().catch(function(error) {
        console.log("Music could not start:", error);
    });
}

const snake = {
    body: [{ x: 100, y: 100 }],
    size: 20,
    color: "lime",
    speed: 20,
    directionX: 1,
    directionY: 0,
    growing: false
};

const food = {
    x: 300,
    y: 300,
    size: 20,
    emoji: "❤️"
};

const cuzon = {
    x: 420,
    y: 220,
    size: 20,
    emoji: "🤢"
};

let score = 0;
let highScore = localStorage.getItem("tahirahHighScore") || 0;
let gameStarted = false;
let gameOver = false;
let gameOverReason = "";
let gameWon = false;
const winningScore = 25;
const topHudHeight = 80;
const bottomHudHeight = 0;

let touchStartX = 0;
let touchStartY = 0;

function randomGridPosition(size, axis) {
    if (axis === "x") {
        return Math.floor(Math.random() * (canvas.width / size)) * size;
    }

    const minY = topHudHeight;
    const maxY = canvas.height - bottomHudHeight - size;

    const rows = Math.floor((maxY - minY) / size);
    return minY + Math.floor(Math.random() * rows) * size;
}

function isOnSnake(x, y) {
    return snake.body.some(function(part) {
        return part.x === x && part.y === y;
    });
}

function startGame() {
    if (!gameStarted && !gameOver && !gameWon) {
        gameStarted = true;
        startMusic();
    }
}

function changeDirection(newDirectionX, newDirectionY) {
    if (newDirectionX === 0 && newDirectionY === -1 && snake.directionY !== 1) {
        snake.directionX = 0;
        snake.directionY = -1;
    }

    if (newDirectionX === 0 && newDirectionY === 1 && snake.directionY !== -1) {
        snake.directionX = 0;
        snake.directionY = 1;
    }

    if (newDirectionX === -1 && newDirectionY === 0 && snake.directionX !== 1) {
        snake.directionX = -1;
        snake.directionY = 0;
    }

    if (newDirectionX === 1 && newDirectionY === 0 && snake.directionX !== -1) {
        snake.directionX = 1;
        snake.directionY = 0;
    }
}

function moveSnake() {
    const head = {
        x: snake.body[0].x + snake.directionX * snake.speed,
        y: snake.body[0].y + snake.directionY * snake.speed
    };

    snake.body.unshift(head);

    if (!snake.growing) {
        snake.body.pop();
    } else {
        snake.growing = false;
    }
}

function moveFood() {
    let newX;
    let newY;

    do {
        newX = randomGridPosition(food.size, "x");
        newY = randomGridPosition(food.size, "y");
    } while (isOnSnake(newX, newY) || (newX === cuzon.x && newY === cuzon.y));

    food.x = newX;
    food.y = newY;
}

function moveCuzon() {
    if (!gameStarted || gameOver || gameWon) {
        return;
    }

    let newX;
    let newY;

    do {
        newX = randomGridPosition(cuzon.size, "x");
        newY = randomGridPosition(cuzon.size, "y");
    } while (isOnSnake(newX, newY) || (newX === food.x && newY === food.y));

    cuzon.x = newX;
    cuzon.y = newY;
}

document.addEventListener("keydown", function(event) {
    if ((gameOver || gameWon) && event.key.toLowerCase() === "r") {
    location.reload();
}

    if (!gameStarted) {
        startGame();
        return;
    }

    if (event.key === "ArrowUp") {
        changeDirection(0, -1);
    }

    if (event.key === "ArrowDown") {
        changeDirection(0, 1);
    }

    if (event.key === "ArrowLeft") {
        changeDirection(-1, 0);
    }

    if (event.key === "ArrowRight") {
        changeDirection(1, 0);
    }
});

canvas.addEventListener("click", function() {
    if (gameOver || gameWon) {
    location.reload();
    return;
}

    startGame();
});

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();

    startGame();

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, { passive: false });

canvas.addEventListener("touchend", function(event) {
    event.preventDefault();

    if (gameOver || gameWon) {
    location.reload();
    return;
}

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) < 20 && Math.abs(diffY) < 20) {
        return;
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            changeDirection(1, 0);
        } else {
            changeDirection(-1, 0);
        }
    } else {
        if (diffY > 0) {
            changeDirection(0, 1);
        } else {
            changeDirection(0, -1);
        }
    }
}, { passive: false });

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function drawSnake() {
    ctx.fillStyle = snake.color;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    snake.body.forEach(function(part) {
        ctx.fillRect(part.x, part.y, snake.size, snake.size);
        ctx.strokeRect(part.x, part.y, snake.size, snake.size);
    });
}

function drawFood() {
    ctx.font = "24px Arial";
    ctx.fillText(food.emoji, food.x, food.y + 20);
}

function drawCuzon() {
    ctx.font = "24px Arial";
    ctx.fillText(cuzon.emoji, cuzon.x, cuzon.y + 20);
}

function drawScore() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, canvas.width, topHudHeight);

    ctx.strokeStyle = "hotpink";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, topHudHeight);
    ctx.lineTo(canvas.width, topHudHeight);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Hearts: " + score, 20, 35);
    ctx.fillText("Best: " + highScore, 20, 65);
}

function drawStartScreen() {
    if (introBackground.complete) {
        ctx.drawImage(introBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    const scale = canvas.width / 600;

    ctx.fillStyle = "white";
    ctx.font = `bold ${34 * scale}px Arial`;
    ctx.fillText("Tahirah's Big", canvas.width / 2, 150 * scale);
    ctx.fillText("Snake Adventure 🐍", canvas.width / 2, 200 * scale);

    ctx.font = `${20 * scale}px Arial`;
    ctx.fillText("Collect the hearts before", canvas.width / 2, 285 * scale);
    ctx.fillText("Cuzon gets sick 🤢", canvas.width / 2, 315 * scale);

    // Developer credit - bottom right
ctx.textAlign = "right";

ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
ctx.font = `${13 * scale}px Arial`;
ctx.fillText("Developed by LaQuinton Holliday", canvas.width - 14, canvas.height - 34);

ctx.fillStyle = "rgba(255, 192, 203, 0.95)";
ctx.font = `${12 * scale}px Arial`;
ctx.fillText("Music by LaQuinton Holliday", canvas.width - 14, canvas.height - 16);

ctx.textAlign = "center";
    ctx.font = `${24 * scale}px Arial`;
    ctx.fillText("Press Any Key, Click,", canvas.width / 2, 465 * scale);
    ctx.fillText("or Swipe to Begin", canvas.width / 2, 495 * scale);

    ctx.textAlign = "start";
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("tahirahHighScore", highScore);
    }
}
function checkFoodCollision() {
    const head = snake.body[0];

    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.growing = true;

        if (score >= winningScore) {
            gameWon = true;
            stopMusic();
            updateHighScore();
            return;
            
            return;
        }

        moveFood();
    }
}

function checkWallCollision() {
    const head = snake.body[0];

    if (
        head.x < 0 ||
        head.y < topHudHeight ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        gameOver = true;
        gameOverReason = "Tahirah ran out of room! 😭";
        stopMusic();
        updateHighScore();

        eddieLaugh.currentTime = 0;
        eddieLaugh.play();
    }
}

function checkCuzonCollision() {
    const head = snake.body[0];

    if (head.x === cuzon.x && head.y === cuzon.y) {
        gameOver = true;
        gameOverReason = "Cuzon got too close and got SICK! 🤢";
        stopMusic();
updateHighScore();

eddieLaugh.currentTime = 0;
eddieLaugh.play();
    }
}

function drawGameOver() {
    if (gameOverBackground.complete) {
        ctx.drawImage(gameOverBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "red";
    ctx.font = "56px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, 190);

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText(gameOverReason, canvas.width / 2, 270);

    ctx.font = "28px Arial";
    ctx.fillText("Final Hearts: " + score, canvas.width / 2, 345);

    ctx.font = "26px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, 415);

    ctx.textAlign = "start";
}

function drawWinScreen() {
    if (winBackground.complete) {
        ctx.drawImage(winBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.30)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "#ff4fd8";
    ctx.font = "bold 48px Arial";
    ctx.fillText("YOU WIN! ❤️", canvas.width / 2, 180);

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText("Tahirah collected all 25 hearts!", canvas.width / 2, 260);

    ctx.font = "24px Arial";
    ctx.fillText("Cuzon could not stop the love! 🤢", canvas.width / 2, 320);

    ctx.font = "26px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, 410);

    ctx.textAlign = "start";
}
function draw() {
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    if (gameWon) {
    drawWinScreen();
    return;
}

    if (gameOver) {
        drawGameOver();
        return;
    }

    if (gameBackground.complete) {
        ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    moveSnake();
    checkWallCollision();
    checkCuzonCollision();
    checkFoodCollision();

    drawSnake();
    drawFood();
    drawCuzon();
    drawScore();
    drawLoveMessage();
}

setInterval(draw, 150);
setInterval(moveCuzon, 2500);