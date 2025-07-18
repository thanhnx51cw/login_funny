// game.js
let canvas, ctx, paddle, falling, W, H, spawnInterval, isDragging = false, dragOffsetX = 0;
let gameStarted = false, gamePaused = false;
let getCurrentInput = () => "username";

// Giúp responsive paddle & chữ
function isMobile() {
    return window.innerWidth <= 600;
}

export function initGame(getInputCallback) {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    initPaddle();
    falling = [];
    getCurrentInput = getInputCallback;

    window.addEventListener('resize', resize);
    spawnInterval = setInterval(spawnLetters, 950);
    setupDrag();
    setupKey();
}

function initPaddle() {
    paddle = {
        width: isMobile() ? 110 : 190,
        height: isMobile() ? 18 : 30,
        x: W / 2 - (isMobile() ? 55 : 95),
        y: H - 90,
        speed: isMobile() ? 9 : 14,
        dx: 0
    };
}

export function setGameState(started, paused) {
    gameStarted = started;
    gamePaused = paused;
}

export function drawGame() {
    ctx.clearRect(0, 0, W, H);

    // Paddle chỉ hiện khi play & không pause
    if (gameStarted && !gamePaused) drawPaddle();

    // Vẽ chữ rơi
    ctx.textAlign = 'center';
    for (let i = falling.length - 1; i >= 0; i--) {
        let f = falling[i];
        ctx.save();
        ctx.font = 'bold ' + (isMobile() ? '24px' : '38px') + ' Segoe UI, Arial';
        ctx.shadowColor = '#71b7ff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#fff';
        ctx.fillText(f.char, f.x, f.y);
        ctx.restore();
        f.y += f.speed;

        // Chỉ nhận chữ khi đang chơi và không pause!
        if (
            gameStarted && !gamePaused &&
            f.y + (isMobile() ? 16 : 22) > paddle.y &&
            f.x > paddle.x &&
            f.x < paddle.x + paddle.width &&
            f.y < paddle.y + paddle.height + (isMobile() ? 18 : 32)
        ) {
            const inputId = getCurrentInput();
            const inputElem = document.getElementById(inputId);
            inputElem.value += f.char;
            falling.splice(i, 1);
            continue;
        }
        if (f.y > H + 44) falling.splice(i, 1);
    }

    // Di chuyển paddle nếu đang chơi (ko pause)
    if (gameStarted && !gamePaused) {
        paddle.x += paddle.dx;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > W) paddle.x = W - paddle.width;
    }

    requestAnimationFrame(drawGame);
}

function drawPaddle() {
    ctx.save();
    ctx.shadowColor = "#e63946bb"; ctx.shadowBlur = isMobile() ? 9 : 18;
    ctx.fillStyle = "#fff";
    const radius = isMobile() ? 10 : 18;
    ctx.beginPath();
    ctx.moveTo(paddle.x + radius, paddle.y);
    ctx.lineTo(paddle.x + paddle.width - radius, paddle.y);
    ctx.quadraticCurveTo(paddle.x + paddle.width, paddle.y, paddle.x + paddle.width, paddle.y + radius);
    ctx.lineTo(paddle.x + paddle.width, paddle.y + paddle.height - radius);
    ctx.quadraticCurveTo(paddle.x + paddle.width, paddle.y + paddle.height, paddle.x + paddle.width - radius, paddle.y + paddle.height);
    ctx.lineTo(paddle.x + radius, paddle.y + paddle.height);
    ctx.quadraticCurveTo(paddle.x, paddle.y + paddle.height, paddle.x, paddle.y + paddle.height - radius);
    ctx.lineTo(paddle.x, paddle.y + radius);
    ctx.quadraticCurveTo(paddle.x, paddle.y, paddle.x + radius, paddle.y);
    ctx.closePath(); ctx.fill(); ctx.restore();
    let grad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y + paddle.height);
    grad.addColorStop(0, '#e63946'); grad.addColorStop(1, '#e85890');
    ctx.fillStyle = grad;
    ctx.fillRect(paddle.x + radius / 2, paddle.y + radius / 2, paddle.width - radius, paddle.height - radius);
    ctx.font = (isMobile() ? '12px' : '16px') + ' Segoe UI, Arial';
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText('← Bắt chữ →', paddle.x + paddle.width / 2, paddle.y + paddle.height - (isMobile() ? 4 : 8));
}

function randomLetter() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return letters[Math.floor(Math.random() * letters.length)];
}
function spawnLetters() {
    for (let i = 0; i < 3; i++) {
        falling.push({
            char: randomLetter(),
            x: Math.random() * (W - 44) + 22,
            y: -32,
            speed: 1.1 + Math.random() * 1.2
        });
    }
}
function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    paddle.y = H - 90;
    // Cập nhật kích thước paddle khi đổi cỡ
    if (isMobile()) {
        paddle.width = 110;
        paddle.height = 18;
        if (paddle.x + paddle.width > W) paddle.x = W - paddle.width;
    } else {
        paddle.width = 190;
        paddle.height = 30;
        if (paddle.x + paddle.width > W) paddle.x = W - paddle.width;
    }
}
function setupKey() {
    document.addEventListener('keydown', (e) => {
        if (!(gameStarted && !gamePaused)) return;
        if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
        if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
    });
    document.addEventListener('keyup', (e) => {
        if (!(gameStarted && !gamePaused)) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') paddle.dx = 0;
    });
}
function setupDrag() {
    canvas.addEventListener('mousedown', (e) => {
        if (!(gameStarted && !gamePaused)) return;
        const mouseX = e.clientX, mouseY = e.clientY;
        if (
            mouseX >= paddle.x && mouseX <= paddle.x + paddle.width &&
            mouseY >= paddle.y && mouseY <= paddle.y + paddle.height
        ) {
            isDragging = true;
            dragOffsetX = mouseX - paddle.x;
            document.body.style.userSelect = 'none';
        }
    });
    canvas.addEventListener('touchstart', (e) => {
        if (!(gameStarted && !gamePaused)) return;
        const touch = e.touches[0];
        const mouseX = touch.clientX, mouseY = touch.clientY;
        if (
            mouseX >= paddle.x && mouseX <= paddle.x + paddle.width &&
            mouseY >= paddle.y && mouseY <= paddle.y + paddle.height
        ) {
            isDragging = true;
            dragOffsetX = mouseX - paddle.x;
            document.body.style.userSelect = 'none';
        }
    });
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            paddle.x = e.clientX - dragOffsetX;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > W) paddle.x = W - paddle.width;
        }
    });
    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            paddle.x = touch.clientX - dragOffsetX;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > W) paddle.x = W - paddle.width;
        }
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
    window.addEventListener('touchend', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}
