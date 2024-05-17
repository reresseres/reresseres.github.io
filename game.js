const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    image: new Image()
};

player.image.src = 'assets/character.png';

const levels = [
    {
        background: 'assets/level1.png',
        obstacles: [
            { x: 400, y: 350, width: 50, height: 50 },
            { x: 600, y: 300, width: 50, height: 100 }
        ],
        enemies: [
            { x: 500, y: 350, width: 50, height: 50, dx: 2, image: new Image() }
        ]
    },
    {
        background: 'assets/level2.png',
        obstacles: [
            { x: 200, y: 350, width: 50, height: 50 },
            { x: 500, y: 300, width: 50, height: 100 }
        ],
        enemies: [
            { x: 300, y: 350, width: 50, height: 50, dx: 2, image: new Image() }
        ]
    },
    // Add more levels here...
];

levels.forEach(level => level.enemies.forEach(enemy => enemy.image.src = 'assets/insect.png'));

let currentLevel = 0;
let startTime, endTime;
let keys = {};

window.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

startButton.addEventListener('click', function() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    startLevel();
});

function startLevel() {
    player.x = 50;
    player.y = canvas.height - 150;
    player.dy = 0;
    player.grounded = false;
    startTime = Date.now();
    requestAnimationFrame(update);
}

function jump() {
    if (player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
}

function checkCollisions() {
    const level = levels[currentLevel];
    level.obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            player.dy = 0;
            player.grounded = true;
            player.y = obstacle.y - player.height;
        }
    });

    level.enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            player.x = 50;
            player.y = canvas.height - 150;
            player.dy = 0;
            player.grounded = false;
        }
    });
}

function update() {
    if (keys[' '] || keys['ArrowUp']) {
        jump();
    }

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    const level = levels[currentLevel];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const background = new Image();
    background.src = level.background;
    background.onload = function() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        level.obstacles.forEach(obstacle => {
            ctx.fillStyle = 'green';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        level.enemies.forEach(enemy => {
            enemy.x += enemy.dx;
            if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
                enemy.dx *= -1;
            }
            ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        });

        checkCollisions();

        if (player.x > canvas.width - player.width) {
            currentLevel++;
            if (currentLevel >= levels.length) {
                alert('Congratulations! You finished all levels.');
                currentLevel = 0;
            }
            startLevel();
        } else {
            requestAnimationFrame(update);
        }
    };
}
