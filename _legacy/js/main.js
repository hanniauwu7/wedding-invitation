// 1. CONFIGURACIÓN DE FECHA
const weddingDate = new Date("May 30, 2026 16:00:00").getTime();

// 2. LÓGICA CUENTA REGRESIVA
const interval = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("d").innerText = d < 10 ? '0' + d : d;
    document.getElementById("h").innerText = h < 10 ? '0' + h : h;
    document.getElementById("m").innerText = m < 10 ? '0' + m : m;
    document.getElementById("s").innerText = s < 10 ? '0' + s : s;

    if (distance < 0) {
        clearInterval(interval);
        document.getElementById("countdown").innerHTML = "<h2>¡Es Hoy!</h2>";
    }
}, 1000);

// 3. SIMULACIÓN DE MÚSICA
    var audio = document.getElementById("bodaAudio");
    var playIcon = document.getElementById("playIcon");
    var progressFill = document.getElementById("progressFill");

    function toggleMusic() {
        if (audio.paused) {
            audio.play();
            // Cambiar icono a Pausa
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        } else {
            audio.pause();
            // Cambiar icono a Play
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
        }
    }

    // Esto hace que la barrita avance sola
    audio.ontimeupdate = function() {
        var porcentaje = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = porcentaje + "%";
    };

// ==========================================
// 4. ANIMACIÓN GALERÍA POLAROID
// ==========================================

function startPolaroidGallery() {
    const stack = document.getElementById('polaroidStack');
    // Obtenemos todas las cartas (fotos)
    let cards = Array.from(stack.children);
    
    // Invertimos el orden para que la primera en HTML sea la de hasta arriba (visual)
    // O simplemente trabajamos asumiendo que el último hijo es el de hasta arriba (CSS default stacking)
    // Para simplificar: CSS pone el último elemento HTML hasta arriba. 
    // Así que animaremos el último hijo (lastElementChild).

    setInterval(() => {
        const topCard = stack.lastElementChild;
        
        // 1. Agregamos la clase para que vuele
        topCard.classList.add('fly-out');

        // 2. Esperamos a que termine la animación (600ms)
        setTimeout(() => {
            // Quitamos la carta del tope y la ponemos al inicio (fondo)
            stack.prepend(topCard);
            
            // Le quitamos la clase de volar y limpiamos estilos
            topCard.classList.remove('fly-out');
            
            // Opcional: Truco para forzar al navegador a notar el cambio de posición
            void topCard.offsetWidth; 

        }, 600); // Este tiempo debe coincidir con el transition del CSS (0.6s)

    }, 2000); // <--- TIEMPO: Cambia aquí la velocidad (2000 = 2 segundos)
}

// Iniciamos la galería cuando cargue la página
document.addEventListener('DOMContentLoaded', startPolaroidGallery);