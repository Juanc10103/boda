const floatingCountdown = document.getElementById('floatingCountdown');
window.addEventListener('scroll', () => {
    window.scrollY > 80 ? floatingCountdown.classList.add('show') : floatingCountdown.classList.remove('show');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Detectar si tiene bordes simétricos
            const hasSymmetric = entry.target.classList.contains('torn-edge-symmetric-top') ||
                entry.target.classList.contains('torn-edge-symmetric-bottom');

            if (hasSymmetric) {
                entry.target.classList.add('reveal-edge-symmetric', 'is-visible');
            } else {
                entry.target.classList.add('reveal-edge', 'is-visible');
            }
        }
    });
}, { threshold: 0.15 });

// Observamos secciones y ahora también las flores
document.querySelectorAll('.torn-section, .animate-section, .invitation-flower').forEach(el => observer.observe(el));

const targetDate = new Date("September 12, 2026 17:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff < 0) return;
    document.getElementById("days").innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

const track = document.getElementById('galleryTrack');
const outer = document.getElementById('galleryCarousel');
const originalCards = Array.from(track.children);

// Clonamos para el efecto infinito
for (let i = 0; i < 6; i++) originalCards.forEach(card => track.appendChild(card.cloneNode(true)));

// Empezamos en un bloque central para permitir scroll en ambas direcciones
let currentIndex = originalCards.length * 3;
let isTransitioning = false;

function updateCarousel(instant = false) {
    const items = Array.from(track.children);
    const cardWidth = items[0].offsetWidth;
    const gap = outer.offsetWidth < 768 ? 15 : 20;
    const offset = (currentIndex * (cardWidth + gap)) - (outer.offsetWidth / 2) + (cardWidth / 2);

    if (instant) {
        track.style.transition = 'none';
        items.forEach(c => c.style.transition = 'none');
    } else {
        track.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
        items.forEach(c => c.style.transition = '');
    }

    track.style.transform = `translateX(${-offset}px)`;

    // Actualizar clase activa para el efecto de escala
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Restaurar transiciones después de un frame si fue instantáneo
    if (instant) {
        setTimeout(() => {
            track.style.transition = '';
            items.forEach(c => c.style.transition = '');
        }, 50);
    }
}

function move(dir) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = (dir === 'next') ? currentIndex + 1 : currentIndex - 1;
    updateCarousel();

    // Reset de posición sin transición al final para bucle infinito
    setTimeout(() => {
        if (currentIndex >= originalCards.length * 5) {
            currentIndex = originalCards.length * 2 + (currentIndex % originalCards.length);
            updateCarousel(true);
        } else if (currentIndex <= originalCards.length) {
            currentIndex = originalCards.length * 3 + (currentIndex % originalCards.length);
            updateCarousel(true);
        }
        isTransitioning = false;
    }, 600);
}

function toggleInfo() {
    const infoBox = document.getElementById('info-box');
    if (infoBox.style.display === 'block') {
        infoBox.style.display = 'none';
    } else {
        infoBox.style.display = 'block';
        // Animación de scroll suave hacia el contenido nuevo
        setTimeout(() => {
            infoBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

document.getElementById('galleryNext').onclick = () => move('next');
document.getElementById('galleryPrev').onclick = () => move('prev');
window.addEventListener('resize', () => updateCarousel(true));

window.onload = () => {
    updateCarousel(true);
    // Intervalo automático
    setInterval(() => move('next'), 4000);
};
