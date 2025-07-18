// particles-bg.js
// Đảm bảo bạn đã thêm CDN particles.js trong _Layout.cshtml hoặc Index.cshtml
// <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
window.particlesJS && particlesJS("particles-js", {
    particles: {
        number: { value: 65, density: { enable: true, value_area: 800 } },
        color: { value: ["#e63946", "#e85890", "#fff", "#4453ea"] },
        shape: { type: "circle" },
        opacity: { value: 0.18, random: true },
        size: { value: 5, random: true },
        line_linked: {
            enable: true,
            distance: 140,
            color: "#fff",
            opacity: 0.10,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: false },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.18 } }
        }
    },
    retina_detect: true
});
