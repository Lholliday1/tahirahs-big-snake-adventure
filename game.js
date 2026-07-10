const gameBackground = new Image();
gameBackground.src = "assets/images/game-background.jpeg";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const eddieLaugh = new Audio("assets/sounds/eddie-haha.mp3");
eddieLaugh.volume = 1.0;

const princeDidThat = new Audio("assets/sounds/prince-did-that.mp3");
princeDidThat.volume = 0.25;

const winSound = new Audio("assets/sounds/aww-so-cute.m4a");
winSound.volume = 0.45;

const heartPop = new Audio("assets/sounds/heart-pop.mp3");
heartPop.volume = 0.01;

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.35;

const muteButton = document.getElementById("muteButton");
const pauseButton = document.getElementById("pauseButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const notificationBar = document.getElementById("notificationBar");
const tipBar = document.getElementById("tipBar");

let muted = false;

muteButton.addEventListener("click", function() {
    muted = !muted;

    bgMusic.muted = muted;
    eddieLaugh.muted = muted;
    princeDidThat.muted = muted;
    winSound.muted = muted;
    heartPop.muted = muted;

    muteButton.textContent = muted
        ? "🔇 Sound Off"
        : "🔊 Sound On";
});

pauseButton.addEventListener("click", function() {
    if (!gameStarted || gameOver || gameWon) {
        return;
    }

    gamePaused = !gamePaused;

    if (gamePaused) {
        pauseButton.textContent = "▶️ Resume";
        showNotification("⏸️ Game Paused", 2000);
    } else {
        pauseButton.textContent = "⏸️ Pause";
        showNotification("▶️ Game Resumed", 2000);
    }
});

function useDpad(directionX, directionY) {
    if (gameOver || gameWon || gamePaused) {
        return;
    }

    startGame();
    changeDirection(directionX, directionY);
}

upButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    useDpad(0, -1);
});

downButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    useDpad(0, 1);
});

leftButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    useDpad(-1, 0);
});

rightButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    useDpad(1, 0);
});

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
let bonusScore = 0;
let combo = 1;
let comboTimer = 0;
const comboTimeLimit = 35;

let gameStarted = false;
let gameOver = false;
let gameOverReason = "";
let gameWon = false;
let gamePaused = false;
let winFade = false;
let winFadeAlpha = 0;

const winningScore = 25;
const topHudHeight = 80;
const bottomHudHeight = 0;

let cuzonChaseMode = false;
let cuzonMoveCounter = 0;
let cuzonChaseDelay = 4;

let touchStartX = 0;
let touchStartY = 0;

let heartEffects = [];
let winHearts = [];
let brokenHearts = [];

let notificationText = "";
let notificationTimer = 0;

let crownRespawnCounter = 0;
const crownRespawnDelay = 80;

const crown = {
    x: 200,
    y: 200,
    size: 20,
    emoji: "👑",
    visible: false,
    active: false,
    timer: 0
};

const tips = [
    "💡 Swipe or use Arrow Keys to move",
    "❤️ Collect 25 Hearts to Win",
    "👑 Crown freezes Cuzon",
    "🤢 Avoid Cuzon!",
    "🔊 Tap Sound to mute/unmute",
    "🏆 Beat your High Score!"
];

let currentTip = 0;
let tipInterval = null;

function startTips() {
    if (tipInterval !== null) {
        return;
    }

    tipInterval = setInterval(function() {
        currentTip = (currentTip + 1) % tips.length;
        tipBar.textContent = tips[currentTip];
    }, 4000);
}

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
        startTips();

        tipBar.textContent = tips[0];
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
    } while (
        isOnSnake(newX, newY) ||
        (newX === cuzon.x && newY === cuzon.y)
    );

    food.x = newX;
    food.y = newY;
}

function moveCuzon() {
    if (!gameStarted || gameOver || gameWon) {
        return;
    }

    if (crown.active) {
        return;
    }

    if (!cuzonChaseMode) {
        cuzonMoveCounter++;

        if (cuzonMoveCounter < 17) {
            return;
        }

        cuzonMoveCounter = 0;

        let newX;
        let newY;

        do {
            newX = randomGridPosition(cuzon.size, "x");
            newY = randomGridPosition(cuzon.size, "y");
        } while (
            isOnSnake(newX, newY) ||
            (newX === food.x && newY === food.y)
        );

        cuzon.x = newX;
        cuzon.y = newY;
        return;
    }

    cuzonMoveCounter++;

    if (cuzonMoveCounter < 2) {
        return;
    }

    cuzonMoveCounter = 0;

    const head = snake.body[0];

    const distanceX = head.x - cuzon.x;
    const distanceY = head.y - cuzon.y;

    if (Math.random() < 0.15) {
        return;
    }

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (distanceX > 0) {
            cuzon.x += cuzon.size;
        } else if (distanceX < 0) {
            cuzon.x -= cuzon.size;
        }
    } else {
        if (distanceY > 0) {
            cuzon.y += cuzon.size;
        } else if (distanceY < 0) {
            cuzon.y -= cuzon.size;
        }
    }
}

document.addEventListener("keydown", function(event) {
    const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];

    if (gameKeys.includes(event.key)) {
        event.preventDefault();
    }

    if (event.key.toLowerCase() === "p" && gameStarted && !gameOver && !gameWon) {
        gamePaused = !gamePaused;

        if (gamePaused) {
            pauseButton.textContent = "▶️ Resume";
            showNotification("⏸️ Game Paused", 2000);
        } else {
            pauseButton.textContent = "⏸️ Pause";
            showNotification("▶️ Game Resumed", 2000);
        }

        return;
    }

    if ((gameOver || gameWon) && event.key.toLowerCase() === "r") {
        location.reload();
        return;
    }

    if (!gameStarted) {
        startGame();
        return;
    }

    if (gamePaused) {
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

    if (gamePaused) {
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

    if (crown.active) {
        const head = snake.body[0];

        ctx.save();

        if (crown.timer <= 15) {
            ctx.globalAlpha = (Math.sin(Date.now() / 60) + 1) / 2;
        } else if (crown.timer <= 25) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 180) * 0.5;
        }

        ctx.shadowColor = "gold";
        ctx.shadowBlur = 18;
        ctx.font = "20px Arial";
        ctx.fillText("👑", head.x - 2, head.y - 4);

        ctx.restore();
    }
}

function drawFood() {
    ctx.font = "24px Arial";
    ctx.fillText(food.emoji, food.x, food.y + 20);
}

function drawCuzon() {
    ctx.font = "24px Arial";
    ctx.fillText(cuzon.emoji, cuzon.x, cuzon.y + 20);
}

function drawCrown() {
    if (!crown.visible) {
        return;
    }

    const bounce = Math.sin(Date.now() / 150) * 5;

    ctx.save();

    ctx.shadowColor = "gold";
    ctx.shadowBlur = 12 + Math.sin(Date.now() / 150) * 8;

    ctx.font = "28px Arial";
    ctx.fillText(crown.emoji, crown.x, crown.y + 20 + bounce);

    ctx.restore();
}

function drawScore() {
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, canvas.width, topHudHeight);

    ctx.strokeStyle = "hotpink";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, topHudHeight);
    ctx.lineTo(canvas.width, topHudHeight);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;

    ctx.fillText("Hearts: " + score, 24, 10);
    ctx.fillText("Best: " + highScore, 24, 36);
    ctx.fillText("Combo: x" + combo, 24, 62);

    ctx.restore();
}

function showNotification(text, time) {
    notificationBar.textContent = text;

    clearTimeout(notificationBar.timeout);

    notificationBar.timeout = setTimeout(function() {
        notificationBar.textContent = "";
    }, time);
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

function createHeartEffect(x, y) {
    heartEffects.push({
        x: x,
        y: y,
        text: "+1 ❤️",
        life: 18,
        maxLife: 18
    });
}

function createWinHeart() {
    winHearts.push({
        x: Math.random() * canvas.width,
        y: -30,
        speed: 2 + Math.random() * 2,
        size: 18 + Math.random() * 12
    });
}

function createBrokenHeart() {
    brokenHearts.push({
        x: Math.random() * canvas.width,
        y: -30,
        speed: 2 + Math.random() * 2,
        size: 18 + Math.random() * 12
    });
}

function moveCrown() {
    let newX;
    let newY;

    do {
        newX = randomGridPosition(crown.size, "x");
        newY = randomGridPosition(crown.size, "y");
    } while (
        isOnSnake(newX, newY) ||
        (newX === food.x && newY === food.y) ||
        (newX === cuzon.x && newY === cuzon.y)
    );

    crown.x = newX;
    crown.y = newY;
}

function checkCrownCollision() {
    const head = snake.body[0];

    if (
    crown.visible &&
    head.x === crown.x &&
    head.y === crown.y
) {
        crown.visible = false;
        crown.active = true;
        crown.timer = 50;

        cuzon.emoji = "🥶";

        princeDidThat.currentTime = 0;
        princeDidThat.play();

        showNotification("👑 Prince Did That! Cuzon is frozen!", 3500);
    }

    if (crown.active) {
        crown.timer--;

        if (crown.timer === 15) {
            showNotification("⚠️ Crown power ending!", 1500);
        }

        if (crown.timer <= 0) {
            crown.active = false;
            crownRespawnCounter = 0;

            cuzon.emoji = "🤢";

            showNotification("⚠️ Cuzon is moving again!", 3000);
        }
    }

    if (!crown.visible && !crown.active && cuzonChaseMode && !gameOver && !gameWon) {
        crownRespawnCounter++;

        if (crownRespawnCounter >= crownRespawnDelay) {
            moveCrown();
            crown.visible = true;
            crownRespawnCounter = 0;

            showNotification("👑 Crown power-up appeared!", 3000);
        }
    }
}

function checkFoodCollision() {
    const head = snake.body[0];

    if (
        head.x < food.x + food.size &&
        head.x + snake.size > food.x &&
        head.y < food.y + food.size &&
        head.y + snake.size > food.y
    ) {
        score++;
        snake.growing = true;
        if (comboTimer > 0) {
    combo++;
} else {
    combo = 1;
}

comboTimer = comboTimeLimit;
bonusScore += combo;
if (combo >= 2) {
    showNotification("🔥 Combo x" + combo + "!", 1200);
}

        heartPop.currentTime = 0;
        heartPop.play();

        createHeartEffect(food.x, food.y);

        if (score === 10) {
            cuzonChaseMode = true;
            cuzonChaseDelay = 1;

            moveCrown();
            crown.visible = true;

            showNotification("❤️ Tahirah is getting stronger! Cuzon is chasing now! 👑", 3500);
        }

        if (score >= winningScore) {
    winFade = true;
    winFadeAlpha = 0;

    stopMusic();
    updateHighScore();

    showNotification("🏆 Tahirah Wins!", 2500);

    winSound.currentTime = 0;
    winSound.play();

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

    if (
        head.x < cuzon.x + cuzon.size &&
        head.x + snake.size > cuzon.x &&
        head.y < cuzon.y + cuzon.size &&
        head.y + snake.size > cuzon.y
    ) {
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

    if (Math.random() < 0.35) {
        createBrokenHeart();
    }

    for (let i = brokenHearts.length - 1; i >= 0; i--) {
        const heart = brokenHearts[i];

        ctx.font = heart.size + "px Arial";
        ctx.fillText("💔", heart.x, heart.y);

        heart.y += heart.speed;

        if (heart.y > canvas.height + 30) {
            brokenHearts.splice(i, 1);
        }
    }

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
    ctx.fillText("YOU WIN!", canvas.width / 2, 180);

    ctx.font = "40px Arial";
    ctx.fillText("❤️", canvas.width / 2, 225);

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText("Tahirah collected all 25 hearts!", canvas.width / 2, 260);

    ctx.font = "24px Arial";
    ctx.fillText("Cuzon could not stop the love! 🤢", canvas.width / 2, 320);

    ctx.font = "26px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, 410);

    ctx.textAlign = "start";
}

function drawHeartEffects() {
    for (let i = heartEffects.length - 1; i >= 0; i--) {
        const effect = heartEffects[i];

        const fade = effect.life / effect.maxLife;

        ctx.save();

        ctx.globalAlpha = fade;
        ctx.textAlign = "center";
        ctx.fillStyle = "pink";
        ctx.font = "bold 22px Arial";
        ctx.fillText(effect.text, effect.x + 10, effect.y);

        ctx.restore();

        effect.y -= 2;
        effect.life--;

        if (effect.life <= 0) {
            heartEffects.splice(i, 1);
        }
    }

    ctx.textAlign = "start";
}

function draw() {
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    if (winFade) {
    if (gameBackground.complete) {
        ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawSnake();
    drawFood();
    drawCrown();
    drawHeartEffects();
    drawCuzon();
    drawScore();

    winFadeAlpha += 0.08;

    ctx.fillStyle = "rgba(0, 0, 0, " + winFadeAlpha + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (winFadeAlpha >= 1) {
        winFade = false;
        gameWon = true;
    }

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

    if (gamePaused) {
    if (gameBackground.complete) {
        ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawSnake();
    drawFood();
    drawCrown();
    drawCuzon();
    drawScore();

    ctx.fillStyle = "rgba(0, 0, 0, 0.60)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "white";
    ctx.font = "bold 46px Arial";
    ctx.fillText("⏸️ PAUSED", canvas.width / 2, canvas.height / 2);

    ctx.font = "22px Arial";
    ctx.fillText("Press P or Tap Resume", canvas.width / 2, canvas.height / 2 + 50);

    ctx.textAlign = "start";
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
    moveCuzon();

    if (comboTimer > 0) {
    comboTimer--;
    setGameSpeed(110);
} else {
    combo = 1;
    setGameSpeed(150);
}

    checkWallCollision();
    checkCuzonCollision();
    checkFoodCollision();
    checkCrownCollision();

    drawSnake();
    drawFood();
    drawCrown();
    drawHeartEffects();
    drawCuzon();
    drawScore();
}

let gameLoopSpeed = 150;
let gameLoop = setInterval(draw, gameLoopSpeed);

function setGameSpeed(newSpeed) {
    if (gameLoopSpeed === newSpeed) {
        return;
    }

    gameLoopSpeed = newSpeed;

    clearInterval(gameLoop);
    gameLoop = setInterval(draw, gameLoopSpeed);
}