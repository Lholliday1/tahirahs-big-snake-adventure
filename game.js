const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.35;

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
let gameStarted = false;
let gameOver = false;
let gameOverReason = "";

function randomGridPosition(size) {
    return Math.floor(Math.random() * (canvas.width / size)) * size;
}

function isOnSnake(x, y) {
    return snake.body.some(function(part) {
        return part.x === x && part.y === y;
    });
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
        newX = randomGridPosition(food.size);
        newY = randomGridPosition(food.size);
    } while (isOnSnake(newX, newY) || (newX === cuzon.x && newY === cuzon.y));

    food.x = newX;
    food.y = newY;
}

function moveCuzon() {
    if (!gameStarted || gameOver) {
        return;
    }

    let newX;
    let newY;

    do {
        newX = randomGridPosition(cuzon.size);
        newY = randomGridPosition(cuzon.size);
    } while (isOnSnake(newX, newY) || (newX === food.x && newY === food.y));

    cuzon.x = newX;
    cuzon.y = newY;
}

document.addEventListener("keydown", function(event) {
    if (gameOver && event.key.toLowerCase() === "r") {
        location.reload();
    }

    if (!gameStarted) {
        gameStarted = true;
        bgMusic.play();
        return;
    }

    if (event.key === "ArrowUp" && snake.directionY !== 1) {
        snake.directionX = 0;
        snake.directionY = -1;
    }

    if (event.key === "ArrowDown" && snake.directionY !== -1) {
        snake.directionX = 0;
        snake.directionY = 1;
    }

    if (event.key === "ArrowLeft" && snake.directionX !== 1) {
        snake.directionX = -1;
        snake.directionY = 0;
    }

    if (event.key === "ArrowRight" && snake.directionX !== -1) {
        snake.directionX = 1;
        snake.directionY = 0;
    }
});

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
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Hearts: " + score, 20, 35);
}

function drawLoveMessage() {
    if (score >= 10) {
        ctx.fillStyle = "pink";
        ctx.font = "28px Arial";
        ctx.fillText("Tahirah is too powerful now! ❤️", 85, 570);
    }
}

function drawStartScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "34px Arial";
    ctx.fillText("Tahirah's Big", 175, 150);
    ctx.fillText("Snake Adventure 🐍", 125, 200);

    ctx.font = "20px Arial";
    ctx.fillText("Collect the hearts before Cuzon gets sick 🤢", 85, 285);

    ctx.font = "22px Arial";
    ctx.fillText("Developed by LaQuinton Holliday", 130, 340);

    ctx.font = "24px Arial";
    ctx.fillText("Press Any Key to Begin", 165, 430);
}

function checkFoodCollision() {
    const head = snake.body[0];

    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.growing = true;
        moveFood();
    }
}

function checkWallCollision() {
    const head = snake.body[0];

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        gameOver = true;
        gameOverReason = "Tahirah ran out of room! 😭";
        stopMusic();
    }
}

function checkCuzonCollision() {
    const head = snake.body[0];

    if (head.x === cuzon.x && head.y === cuzon.y) {
        gameOver = true;
        gameOverReason = "Cuzon got too close and got SICK! 🤢";
        stopMusic();
    }
}

function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("GAME OVER", 145, 190);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(gameOverReason, 110, 260);
    ctx.fillText("Final Hearts: " + score, 205, 330);
    ctx.fillText("Press R to Restart", 165, 390);
}

function draw() {
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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