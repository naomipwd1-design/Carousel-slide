const track = document.querySelector('.carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
let currentIndex = 0;
let slides = [];

async function loadCarousel() {
  const res = await fetch('carousel.json');
  slides = await res.json();
  renderSlides();
  renderDots();
  updateCarousel();
  setInterval(nextSlide, 5000); // Auto-cycle every 5s
}

function renderSlides() {
  track.innerHTML = slides.map(slide => `
    <div class="carousel-slide">
      <img src="${slide.image}" alt="${slide.title}">
      <h2>${slide.title}</h2>
      <p>${slide.description}</p>
    </div>
  `).join('');
}

function renderDots() {
  dotsContainer.innerHTML = slides.map((_, i) => `
    <button onclick="goToSlide(${i})" class="${i === 0 ? 'active' : ''}"></button>
  `).join('');
}

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  [...dotsContainer.children].forEach((dot, i) =>
    dot.classList.toggle('active', i === currentIndex)
  );
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);

window.addEventListener('DOMContentLoaded', loadCarousel);

let startX = 0;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide();
  }
});

