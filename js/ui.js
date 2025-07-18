// ui.js
let currentInput = 'username';
export function initUI(onPlay, onPause) {
    document.getElementById('username').addEventListener('focus', () => currentInput = 'username');
    document.getElementById('password').addEventListener('focus', () => currentInput = 'password');
    // Play button
    document.getElementById('btnPlay').addEventListener('click', function () {
        onPlay();
        this.style.display = 'none';
        document.getElementById('btnPause').style.display = '';
    });
    // Pause button
    document.getElementById('btnPause').addEventListener('click', function () {
        onPause();
        this.style.display = 'none';
        document.getElementById('btnPlay').style.display = '';
    });
    // Nút Login xoay
    const loginBtn = document.querySelector('.login-container button');
    let isRotating = false, startAngle = 0, currentAngle = 0;
    function getAngleFromCenter(e, el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const dx = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
        const dy = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    loginBtn.addEventListener('mousedown', startRotate);
    loginBtn.addEventListener('touchstart', startRotate);
    function startRotate(e) {
        isRotating = true;
        startAngle = getAngleFromCenter(e, loginBtn) - currentAngle;
        document.body.style.userSelect = "none";
    }
    window.addEventListener('mousemove', doRotate);
    window.addEventListener('touchmove', doRotate);
    function doRotate(e) {
        if (!isRotating) return;
        e.preventDefault();
        let angle = getAngleFromCenter(e, loginBtn) - startAngle;
        currentAngle = angle;
        loginBtn.style.transform = `rotate(${angle}deg)`;
    }
    window.addEventListener('mouseup', endRotate);
    window.addEventListener('touchend', endRotate);
    function endRotate() {
        if (isRotating) {
            isRotating = false;
            document.body.style.userSelect = "";
        }
    }
}
export function getCurrentInput() {
    return currentInput;
}
