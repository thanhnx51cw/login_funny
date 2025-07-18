// logo.js
export function moveLogo() {
    const logo = document.getElementById('logo-bounce');
    let lx = Math.random() * (window.innerWidth - 90);
    let ly = Math.random() * (window.innerHeight - 90);
    let ldx = (Math.random() < 0.5 ? 1 : -1) * (2 + Math.random() * 2.5);
    let ldy = (Math.random() < 0.5 ? 1 : -1) * (2 + Math.random() * 2.5);
    function step() {
        lx += ldx; ly += ldy;
        if (lx < 0 || lx + 90 > window.innerWidth) ldx = -ldx;
        if (ly < 0 || ly + 90 > window.innerHeight) ldy = -ldy;
        if (lx < 0) lx = 0;
        if (lx + 90 > window.innerWidth) lx = window.innerWidth - 90;
        if (ly < 0) ly = 0;
        if (ly + 90 > window.innerHeight) ly = window.innerHeight - 90;
        logo.style.left = lx + 'px';
        logo.style.top = ly + 'px';
        requestAnimationFrame(step);
    }
    step();
    window.addEventListener('resize', () => {
        if (lx + 90 > window.innerWidth) lx = window.innerWidth - 90;
        if (ly + 90 > window.innerHeight) ly = window.innerHeight - 90;
    });
}
