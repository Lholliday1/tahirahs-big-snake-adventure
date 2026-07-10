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
const mainMenuButton =
    document.getElementById("mainMenuButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const notificationBar = document.getElementById("notificationBar");
const tipBar = document.getElementById("tipBar");
const mainMenu = document.getElementById("mainMenu");
const startAdventureButton = document.getElementById("startAdventureButton");
const menuHearts = document.getElementById("menuHearts");
const worldMap = document.getElementById("worldMap");
const meridianButton = document.getElementById("meridianButton");
const howellButton = document.getElementById("howellButton");
const newOrleansButton = document.getElementById("newOrleansButton");
const resetProgressButton =
    document.getElementById("resetProgressButton");

    const soundtrackButton =
    document.getElementById("soundtrackButton");

const soundtrackMenu =
    document.getElementById("soundtrackMenu");

const soundtrackBackButton =
    document.getElementById("soundtrackBackButton");

    const soundtrackStopButton =
    document.getElementById("soundtrackStopButton");

const nowPlayingText =
    document.getElementById("nowPlayingText");

const soundtrackPlayButtons =
    document.querySelectorAll(".soundtrackPlayButton");

let muted = false;
let menuOpen = true;

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
let bestCombo = 1;
const comboTimeLimit = 35;

let gameStarted = false;
let gameOver = false;
let gameOverReason = "";
let gameWon = false;
let gamePaused = false;
let winFade = false;
let winFadeAlpha = 0;
let levelComplete = false;
let levelIntroActive = false;
let levelIntroTimer = 0;
let levelIntroAlpha = 1;
let comingSoonActive = false;
let comingSoonTimer = 0;
let comingSoonAlpha = 0;
let comingSoonPhase = "fadeIn";

let currentLevel = 1;
const demoMode = true;

let unlockedLevel =
    Number(localStorage.getItem("tahirahUnlockedLevel")) || 1;

const levelGoals = {
    1: 25,
    2: 25,
    3: 25
};

const levels = {
    1: {
    name: "Meridian, Mississippi",
    background: "assets/images/meridian-background.jpeg",
    music: "assets/music/meridian-theme.mp3",

    enemyType: "teleport",
    projectileAttack: false,
    chaseStartsAt: 10
},

    2: {
    name: "Howell, New Jersey",
    background: "assets/images/howell-background.jpeg",
    music: "assets/music/howell-theme.mp3",

    enemyType: "walker",
    projectileAttack: true,
    chaseStartsAt: 0
},

    3: {
    name: "New Orleans, Louisiana",
    background: "assets/images/new-orleans-background.jpeg",
    music: "assets/music/new-orleans-theme.mp3",

    enemyType: "boss",
    projectileAttack: true,
    chaseStartsAt: 0
},
};

function loadLevel(levelNumber) {
    currentLevel = levelNumber;

    const level = levels[currentLevel];

    gameBackground.src = level.background;
    gameBackground.onerror = function() {
    console.error(
        "Could not load level background:",
        level.background
    );

    showNotification(
        "⚠️ Level background could not load",
        4000
    );
};

    switchMusic(level.music);

    score = 0;
    bonusScore = 0;
    combo = 1;
    comboTimer = 0;
    bestCombo = 1;

    snake.body = [{ x: 100, y: 100 }];
    snake.directionX = 1;
    snake.directionY = 0;
    snake.growing = false;

    food.x = 300;
    food.y = 300;

    cuzon.x = 420;
    cuzon.y = 220;
    cuzon.emoji = "🤢";

    crown.visible = false;
    crown.active = false;
    crown.timer = 0;
    crownRespawnCounter = 0;

    cuzonChaseMode = false;
    cuzonMoveCounter = 0;

    cuzonState = "moving";
cuzonStateTimer = 0;
cuzonSpeech = "";

projectiles = [];
projectileCooldown = 18;
slowTimer = 0;

    gameOver = false;
    gameWon = false;
    gamePaused = false;
    winFade = false;
    winFadeAlpha = 0;
    levelIntroActive = true;
levelIntroTimer = 24;
levelIntroAlpha = 1;

    pauseButton.textContent = "⏸️ Pause";

    showNotification(
        "📍 Level " + currentLevel + ": " + level.name,
        3000
    );
}

function restartCurrentLevel() {
    levelComplete = false;
    gameOver = false;
    gameWon = false;
    gamePaused = false;

    brokenHearts = [];
    winHearts = [];
    heartEffects = [];

    loadLevel(currentLevel);

    gameStarted = true;

    showNotification(
        "🔄 Restarting " + levels[currentLevel].name,
        2000
    );
}

function startComingSoonScreen() {
    comingSoonActive = true;
    comingSoonTimer = 90;
    comingSoonAlpha = 0;
    comingSoonPhase = "fadeIn";

    gameStarted = true;
    levelComplete = false;
    winFade = false;

    projectiles = [];
    cuzonSpeech = "";

    switchMusic(levels[2].music);
}
function advanceToNextLevel() {
    if (demoMode && currentLevel === 1) {
        startComingSoonScreen();
        return;
    }

    if (currentLevel < 3) {
        unlockedLevel = Math.max(
            unlockedLevel,
            currentLevel + 1
        );

        localStorage.setItem(
            "tahirahUnlockedLevel",
            unlockedLevel
        );

        showWorldMap();
        return;
    }

    gameWon = true;
}

function showWorldMap() {
    levelComplete = false;
    gameStarted = false;

    canvas.style.display = "none";
    document.getElementById("bottomBar").style.display = "none";
    worldMap.style.display = "block";

    updateWorldMap();
}

function returnToMainMenu() {
    gameStarted = false;
    gamePaused = false;
    gameOver = false;
    gameWon = false;
    levelComplete = false;
    levelIntroActive = false;
    winFade = false;

    projectiles = [];
    heartEffects = [];
    brokenHearts = [];
    winHearts = [];

    cuzonSpeech = "";
    cuzonState = "moving";
    cuzonStateTimer = 0;

    stopMusic();

    canvas.style.display = "none";
    document.getElementById("bottomBar").style.display = "none";
    worldMap.style.display = "none";
    soundtrackMenu.style.display = "none";
    mainMenu.style.display = "block";

    menuOpen = true;

    pauseButton.textContent = "⏸️ Pause";

    clearTimeout(notificationBar.timeout);
notificationBar.textContent = "";

    startMenuMusic();
}


function updateWorldMap() {
    const howellIcon = howellButton.querySelector(".locationIcon");
    const howellStatus = howellButton.querySelector(".locationStatus");

    const newOrleansIcon =
        newOrleansButton.querySelector(".locationIcon");

    const newOrleansStatus =
        newOrleansButton.querySelector(".locationStatus");

        if (demoMode) {
    howellButton.disabled = true;
    howellButton.classList.add("locked");
    howellButton.classList.remove("unlocked");

    howellIcon.textContent = "🚧";
    howellStatus.textContent = "Coming Soon";

    newOrleansButton.disabled = true;
    newOrleansButton.classList.add("locked");
    newOrleansButton.classList.remove("unlocked");

    newOrleansIcon.textContent = "🚧";
    newOrleansStatus.textContent = "Coming Soon";

    return;
}

    if (unlockedLevel >= 2) {
        howellButton.disabled = false;
        howellButton.classList.remove("locked");
        howellButton.classList.add("unlocked");

        howellIcon.textContent = "📍";
        howellStatus.textContent = "Level 2";
    } else {
        howellButton.disabled = true;
        howellButton.classList.add("locked");
        howellButton.classList.remove("unlocked");

        howellIcon.textContent = "🔒";
        howellStatus.textContent = "Locked";
    }

    if (unlockedLevel >= 3) {
        newOrleansButton.disabled = false;
        newOrleansButton.classList.remove("locked");
        newOrleansButton.classList.add("unlocked");

        newOrleansIcon.textContent = "📍";
        newOrleansStatus.textContent = "Level 3";
    } else {
        newOrleansButton.disabled = true;
        newOrleansButton.classList.add("locked");
        newOrleansButton.classList.remove("unlocked");

        newOrleansIcon.textContent = "🔒";
        newOrleansStatus.textContent = "Locked";
    }
}

const topHudHeight = 92;
const bottomHudHeight = 0;

let cuzonChaseMode = false;
let cuzonMoveCounter = 0;
let cuzonState = "moving";

let cuzonStateTimer = 0;

let cuzonSpeech = "";
let cuzonChaseDelay = 4;

let touchStartX = 0;
let touchStartY = 0;

let heartEffects = [];
let winHearts = [];
let brokenHearts = [];
let projectiles = [];

let projectileCooldown = 0;

const projectileCooldownTime = 28;
let slowTimer = 0;

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

    if (levels[currentLevel].enemyType === "walker") {
    moveHowellCuzon();
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

function shootProjectile() {
    const head = snake.body[0];

    const angle = Math.atan2(
        head.y - cuzon.y,
        head.x - cuzon.x
    );

    projectiles.push({
        x: cuzon.x,
        y: cuzon.y,
        speed: 14,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        emoji: "🥦",
        size: 20
    });

    cuzonSpeech = "";
}

document.addEventListener("keydown", function(event) {

    if (menuOpen) {
    return;
}

if (levelComplete && event.key === "Enter") {
    levelComplete = false;
    advanceToNextLevel();
    return;
}

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
        restartCurrentLevel();
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
    if (levelComplete) {
    levelComplete = false;
    advanceToNextLevel();
    return;
}

    if (gameOver || gameWon) {
        restartCurrentLevel();
        return;
    }

    startGame();
});

function beginHowellAttack() {
    const sayings = [
        "Not today!",
        "You ain't getting those hearts!",
        "Catch this!",
        "Try dodging THIS!",
        "No free hearts!"
    ];

    cuzonSpeech =
        sayings[Math.floor(Math.random() * sayings.length)];

    cuzonState = "warning";
    cuzonStateTimer = 8;
}

function moveHowellCuzon() {
    if (cuzonState === "warning") {
        cuzonStateTimer--;

        if (cuzonStateTimer <= 0) {
            shootProjectile();

            cuzonState = "moving";
            projectileCooldown = projectileCooldownTime;
        }

        return;
    }

    if (projectileCooldown > 0) {
        projectileCooldown--;
    }

    if (projectileCooldown <= 0) {
        beginHowellAttack();
        return;
    }

    cuzonMoveCounter++;

    if (cuzonMoveCounter < 3) {
        return;
    }

    cuzonMoveCounter = 0;

    const head = snake.body[0];

    const distanceX = head.x - cuzon.x;
    const distanceY = head.y - cuzon.y;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
        cuzon.x += distanceX > 0
            ? cuzon.size
            : -cuzon.size;
    } else {
        cuzon.y += distanceY > 0
            ? cuzon.size
            : -cuzon.size;
    }

    cuzon.x = Math.max(
        0,
        Math.min(cuzon.x, canvas.width - cuzon.size)
    );

    cuzon.y = Math.max(
        topHudHeight,
        Math.min(cuzon.y, canvas.height - cuzon.size)
    );
}

function moveProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        projectile.x += projectile.dx * projectile.speed;
        projectile.y += projectile.dy * projectile.speed;

        const outsideCanvas =
            projectile.x < -40 ||
            projectile.x > canvas.width + 40 ||
            projectile.y < topHudHeight - 40 ||
            projectile.y > canvas.height + 40;

        if (outsideCanvas) {
            projectiles.splice(i, 1);
        }
    }
}

function drawProjectiles() {
    ctx.save();
    ctx.font = "24px Arial";

    projectiles.forEach(function(projectile) {
        ctx.fillText(
            projectile.emoji,
            projectile.x,
            projectile.y + projectile.size
        );
    });

    ctx.restore();
}

function checkProjectileCollision() {
    const head = snake.body[0];

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        const hit =
            head.x < projectile.x + projectile.size &&
            head.x + snake.size > projectile.x &&
            head.y < projectile.y + projectile.size &&
            head.y + snake.size > projectile.y;

        if (!hit) {
            continue;
        }

        projectiles.splice(i, 1);

        slowTimer = 20;
        combo = 1;
        comboTimer = 0;

        showNotification(
            "🥦 Broccoli hit! Tahirah is slowed!",
            2500
        );
    }
}

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
        restartCurrentLevel();
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

function openLevel(levelNumber) {
    const level = levels[levelNumber];

    menuOpen = false;

    const preloadImage = new Image();
    preloadImage.src = level.background;

    preloadImage.onload = function() {
        worldMap.style.display = "none";

        loadLevel(levelNumber);

        canvas.style.display = "block";
        document.getElementById("bottomBar").style.display = "flex";

        startGame();
    };

    preloadImage.onerror = function() {
        worldMap.style.display = "none";

        loadLevel(levelNumber);

        canvas.style.display = "block";
        document.getElementById("bottomBar").style.display = "flex";

        startGame();
    };
}

soundtrackButton.addEventListener("click", function() {
    menuOpen = true;

    mainMenu.style.display = "none";
    soundtrackMenu.style.display = "block";

    stopMusic();

    nowPlayingText.textContent =
        "Select a track to begin.";
});

let activeSoundtrackButton = null;
let activeSoundtrackTrack = "";

soundtrackPlayButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const selectedTrack =
            button.dataset.track;

        const selectedTitle =
            button.dataset.title;

        // Pause the song if this is already the active track.
        if (
            activeSoundtrackTrack === selectedTrack &&
            !bgMusic.paused
        ) {
            bgMusic.pause();

            button.textContent = "▶️ Resume";

            nowPlayingText.textContent =
                "⏸️ Paused: " + selectedTitle;

            return;
        }

        // Resume the same track without restarting it.
        if (
            activeSoundtrackTrack === selectedTrack &&
            bgMusic.paused
        ) {
            bgMusic.play().catch(function(error) {
                console.log(
                    "Soundtrack could not resume:",
                    error
                );
            });

            button.textContent = "⏸️ Pause";

            nowPlayingText.textContent =
                "🎵 Now Playing: " + selectedTitle;

            return;
        }

        // A different song was selected.
        bgMusic.pause();
        bgMusic.currentTime = 0;

        bgMusic.src = selectedTrack;
        bgMusic.loop = true;
        bgMusic.volume = 0.35;
        bgMusic.load();

        bgMusic.play().catch(function(error) {
            console.log(
                "Soundtrack could not play:",
                error
            );
        });

        soundtrackPlayButtons.forEach(function(otherButton) {
    otherButton.textContent = "▶️ Play";

    otherButton
        .closest(".soundtrackCard")
        .classList.remove("activeTrack");
});

activeSoundtrackButton = button;
activeSoundtrackTrack = selectedTrack;

button
    .closest(".soundtrackCard")
    .classList.add("activeTrack");

        button.textContent = "⏸️ Pause";

        nowPlayingText.textContent =
            "🎵 Now Playing: " + selectedTitle;
    });
});

soundtrackStopButton.addEventListener("click", function() {
    stopMusic();

    soundtrackPlayButtons.forEach(function(button) {
        button.textContent = "▶️ Play";

        button
            .closest(".soundtrackCard")
            .classList.remove("activeTrack");
    });

    activeSoundtrackButton = null;
    activeSoundtrackTrack = "";

    nowPlayingText.textContent =
        "⏹️ Music stopped.";
});

soundtrackBackButton.addEventListener("click", function() {
    stopMusic();

    soundtrackMenu.style.display = "none";
    mainMenu.style.display = "block";

    menuOpen = true;

    soundtrackPlayButtons.forEach(function(button) {
    button.textContent = "▶️ Play";

    button
        .closest(".soundtrackCard")
        .classList.remove("activeTrack");
});

    nowPlayingText.textContent =
    "Select a track to begin.";

activeSoundtrackButton = null;
activeSoundtrackTrack = "";

startMenuMusic();
});

startAdventureButton.addEventListener("click", function() {
    mainMenu.style.display = "none";
    worldMap.style.display = "block";

    updateWorldMap();
});

meridianButton.addEventListener("click", function() {
    openLevel(1);
});

howellButton.addEventListener("click", function() {
    if (demoMode) {
        return;
    }

    if (unlockedLevel < 2) {
        return;
    }

    openLevel(2);
});

newOrleansButton.addEventListener("click", function() {
    if (demoMode) {
        return;
    }

    if (unlockedLevel < 3) {
        return;
    }

    openLevel(3);
});

mainMenuButton.addEventListener("click", function() {
    const confirmed = confirm(
        "Return to the main menu? Your current level progress will restart."
    );

    if (!confirmed) {
        return;
    }

    returnToMainMenu();
});

resetProgressButton.addEventListener("click", function() {
    const confirmed = confirm(
        "Reset all progress, unlocked levels, and the high score?"
    );

    if (!confirmed) {
        return;
    }

    unlockedLevel = 1;
    highScore = 0;

    localStorage.removeItem("tahirahUnlockedLevel");
    localStorage.removeItem("tahirahHighScore");

    updateWorldMap();

    alert(
        "All progress has been reset. Only Meridian is unlocked."
    );
});

function startMenuMusic() {
    if (!menuOpen) {
        return;
    }

    bgMusic.src = "assets/music/main-menu-theme.mp3";
    bgMusic.loop = true;
    bgMusic.volume = 0.35;

    bgMusic.play().catch(function(error) {
        console.log("Menu music could not start:", error);
    });
}

function switchMusic(newTrack) {
    bgMusic.pause();
    bgMusic.currentTime = 0;

    bgMusic.src = newTrack;
    bgMusic.load();
    bgMusic.volume = 0.35;

    bgMusic.play().catch(function(error) {
        console.log("Music could not switch:", error);
    });
}

function createMenuHeart() {
    if (!menuOpen) {
        return;
    }

    const heart = document.createElement("span");

    heart.textContent = "❤️";
    heart.className = "menuHeart";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 14 + Math.random() * 18 + "px";
    heart.style.animationDuration = 5 + Math.random() * 4 + "s";

    menuHearts.appendChild(heart);

    heart.addEventListener("animationend", function() {
        heart.remove();
    });
}
setInterval(function() {
    if (menuOpen) {
        createMenuHeart();
    }
}, 700);

mainMenu.addEventListener("pointerdown", function() {
    if (bgMusic.paused) {
        startMenuMusic();
    }
}, { once: true });

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function fadeOutMusic(duration = 2500) {
    const startingVolume = bgMusic.volume;
    const fadeSteps = 25;
    const stepTime = duration / fadeSteps;
    const volumeStep = startingVolume / fadeSteps;

    const fadeInterval = setInterval(function() {
        bgMusic.volume = Math.max(
            0,
            bgMusic.volume - volumeStep
        );

        if (bgMusic.volume <= 0) {
            clearInterval(fadeInterval);

            bgMusic.pause();
            bgMusic.currentTime = 0;
            bgMusic.volume = 0.35;
        }
    }, stepTime);
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
    ctx.fillText(
        cuzon.emoji,
        cuzon.x,
        cuzon.y + 20
    );

    if (!cuzonSpeech) {
        return;
    }

    ctx.save();

    const bubbleWidth = 220;
    const bubbleHeight = 52;

    const head = snake.body[0];

let bubbleX = cuzon.x - bubbleWidth / 2;
let bubbleY = cuzon.y - 68;

const snakeNearBubble =
    head.x < bubbleX + bubbleWidth + 30 &&
    head.x + snake.size > bubbleX - 30 &&
    head.y < bubbleY + bubbleHeight + 30 &&
    head.y + snake.size > bubbleY - 30;

if (snakeNearBubble) {
    bubbleY = cuzon.y + 38;
}

bubbleX = Math.max(
    10,
    Math.min(bubbleX, canvas.width - bubbleWidth - 10)
);

bubbleY = Math.max(
    topHudHeight + 10,
    Math.min(bubbleY, canvas.height - bubbleHeight - 10)
);

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(
        bubbleX,
        bubbleY,
        bubbleWidth,
        bubbleHeight,
        12
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        cuzonSpeech,
        bubbleX + bubbleWidth / 2,
        bubbleY + bubbleHeight / 2
    );

    ctx.restore();
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

    ctx.fillText("Hearts: " + score, 24, 8);
    ctx.fillText("Best: " + highScore, 24, 34);
    ctx.fillText("Combo: x" + combo, 24, 60);
    ctx.textAlign = "right";
ctx.fillStyle = "hotpink";
ctx.font = "bold 18px Arial";

ctx.fillText(
    "Level " + currentLevel,
    canvas.width - 24,
    16
);

ctx.fillStyle = "white";
ctx.font = "16px Arial";

ctx.fillText(
    levels[currentLevel].name,
    canvas.width - 24,
    44
);

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

if (combo > bestCombo) {
    bestCombo = combo;
}
if (combo >= 2) {
    showNotification("🔥 Combo x" + combo + "!", 1200);
}

        heartPop.currentTime = 0;
        heartPop.play();

        createHeartEffect(food.x, food.y);

        if (
    currentLevel === 1 &&
    score === levels[currentLevel].chaseStartsAt
) {
            cuzonChaseMode = true;
            cuzonChaseDelay = 1;

            moveCrown();
            crown.visible = true;

            showNotification("❤️ Tahirah is getting stronger! Cuzon is chasing now! 👑", 3500);
        }

        if (score >= levelGoals[currentLevel]) {

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
    ctx.fillText(
    "Press R or Tap to Retry Level " + currentLevel,
    canvas.width / 2,
    415
);

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

function drawLevelIntro() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.globalAlpha = levelIntroAlpha;
    ctx.textAlign = "center";

    ctx.fillStyle = "white";
    ctx.font = "bold 34px monospace";
    ctx.fillText(
        "LEVEL " + currentLevel,
        canvas.width / 2,
        190
    );

    ctx.fillStyle = "hotpink";
    ctx.font = "bold 28px monospace";
    ctx.fillText(
        levels[currentLevel].name.toUpperCase(),
        canvas.width / 2,
        250
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 24px monospace";
    ctx.fillText(
        "READY?",
        canvas.width / 2,
        340
    );

    ctx.fillStyle = "gold";
    ctx.font = "bold 42px monospace";
    ctx.fillText(
        "START!",
        canvas.width / 2,
        410
    );

    ctx.restore();

    if (levelIntroTimer > 0) {
        levelIntroTimer--;
        return;
    }

    levelIntroAlpha -= 0.08;

    if (levelIntroAlpha <= 0) {
        levelIntroAlpha = 0;
        levelIntroActive = false;
    }
}

function drawComingSoonScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.globalAlpha = comingSoonAlpha;
    ctx.textAlign = "center";

    ctx.fillStyle = "hotpink";
    ctx.font = "bold 26px monospace";
    ctx.fillText(
        "NEXT STOP",
        canvas.width / 2,
        170
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 34px monospace";
    ctx.fillText(
        "HOWELL, NEW JERSEY",
        canvas.width / 2,
        240
    );

    ctx.fillStyle = "gold";
    ctx.font = "bold 46px monospace";
    ctx.fillText(
        "COMING SOON",
        canvas.width / 2,
        335
    );

    ctx.fillStyle = "white";
    ctx.font = "21px Arial";
    ctx.fillText(
        "The adventure continues...",
        canvas.width / 2,
        395
    );

    ctx.font = "34px Arial";
    ctx.fillText(
        "❤️ 🗺️ ❤️",
        canvas.width / 2,
        460
    );

    ctx.fillStyle = "#bbbbbb";
ctx.font = "16px Arial";
ctx.fillText(
    "Version 0.1 Demo",
    canvas.width / 2,
    canvas.height - 28
);

    ctx.restore();

    if (comingSoonPhase === "fadeIn") {
        comingSoonAlpha += 0.07;

        if (comingSoonAlpha >= 1) {
            comingSoonAlpha = 1;
            comingSoonPhase = "hold";
        }

        return;
    }

    if (comingSoonPhase === "hold") {
    comingSoonTimer--;

    if (comingSoonTimer === 20) {
        fadeOutMusic(3000);
    }

    if (comingSoonTimer <= 0) {
        comingSoonPhase = "fadeOut";
    }

    return;
}

    if (comingSoonPhase === "fadeOut") {
        comingSoonAlpha -= 0.06;

        if (comingSoonAlpha <= 0) {
            comingSoonAlpha = 0;
            comingSoonActive = false;

            returnToMainMenu();
        }
    }
}

function drawLevelComplete() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "hotpink";
    ctx.font = "bold 46px Arial";
    ctx.fillText(
        "❤️ LEVEL COMPLETE ❤️",
        canvas.width / 2,
        150
    );

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(
        levels[currentLevel].name,
        canvas.width / 2,
        220
    );

    ctx.font = "24px Arial";
    ctx.fillText(
        "Hearts Collected: " + score,
        canvas.width / 2,
        280
    );

    ctx.fillText(
    "Best Combo: x" + bestCombo,
    canvas.width / 2,
    330
);

    if (currentLevel < 3) {
        ctx.fillText(
            "Next Stop:",
            canvas.width / 2,
            410
        );

        ctx.font = "bold 28px Arial";
        ctx.fillText(
            levels[currentLevel + 1].name,
            canvas.width / 2,
            455
        );

        ctx.font = "22px Arial";
        ctx.fillText(
            "Press ENTER or Tap to Continue",
            canvas.width / 2,
            525
        );
    } else {
        ctx.font = "22px Arial";
        ctx.fillText(
            "Final Boss Ahead!",
            canvas.width / 2,
            450
        );
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

    if (levelIntroActive) {
    drawLevelIntro();
    return;
}

if (comingSoonActive) {
    drawComingSoonScreen();
    return;
}

    if (winFade) {
        if (
    gameBackground.complete &&
    gameBackground.naturalWidth > 0
) {
            ctx.drawImage(
                gameBackground,
                0,
                0,
                canvas.width,
                canvas.height
            );
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
        drawProjectiles();

        winFadeAlpha += 0.08;

        ctx.fillStyle =
            "rgba(0, 0, 0, " + winFadeAlpha + ")";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (winFadeAlpha >= 1) {
            winFade = false;
            levelComplete = true;
        }

        return;
    }

    if (levelComplete) {
        drawLevelComplete();
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
    if (
        gameBackground.complete &&
        gameBackground.naturalWidth > 0
    ) {
        ctx.drawImage(
            gameBackground,
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    drawSnake();
    drawFood();
    drawCrown();
    drawCuzon();
    drawScore();
    drawProjectiles();

    // Dark overlay over the playable area only.
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(
        0,
        topHudHeight,
        canvas.width,
        canvas.height - topHudHeight
    );

    // Find the center of the playable area below the HUD.
    const pauseCenterY =
        topHudHeight +
        (canvas.height - topHudHeight) / 2;

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;

    ctx.font = "bold 46px Arial";
    ctx.fillText(
        "⏸️ PAUSED",
        canvas.width / 2,
        pauseCenterY - 25
    );

    ctx.font = "22px Arial";
    ctx.fillText(
        "Press P or Tap Resume",
        canvas.width / 2,
        pauseCenterY + 35
    );

    ctx.restore();

    return;
}

    if (
    gameBackground.complete &&
    gameBackground.naturalWidth > 0
) {
        ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    moveSnake();
moveCuzon();
moveProjectiles();

    if (slowTimer > 0) {
    slowTimer--;
    setGameSpeed(220);
} else if (comboTimer > 0) {
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
checkProjectileCollision();

    drawSnake();
    drawFood();
    drawCrown();
    drawHeartEffects();
    drawCuzon();
drawProjectiles();
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