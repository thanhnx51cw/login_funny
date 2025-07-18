// main.js
import { initGame, drawGame, setGameState } from './game.js';
import { initUI, getCurrentInput } from './ui.js';
import { moveLogo } from './logo.js';
import './particles-bg.js';

window.addEventListener('DOMContentLoaded', function () {
    initGame(getCurrentInput);
    initUI(
        () => setGameState(true, false),     // onPlay
        () => setGameState(true, true)       // onPause
    );
    moveLogo();
    drawGame();
});
