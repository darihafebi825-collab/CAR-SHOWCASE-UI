
let current = 0;
let isAnimating = false;


function applyTheme(car, animate = true) {
  const root = document.documentElement;
  root.style.setProperty('--primary', car.color);
  root.style.setProperty('--accent', car.accent);
  root.style.setProperty('--glow', car.glow);
  root.style.setProperty('--bg', car.bg);
  document.body.style.background = car.bg;
}

function buildSelector() {
  const track = document.getElementById('selTrack');
  track.innerHTML = '';
  cars.forEach((car, i) => {
    const item = document.createElement('div');
    item.className = 'sel-item' + (i === current ? ' active' : '');
    item.innerHTML = `
      <div class="sel-color" style="background:${car.color}; color:${car.color}"></div>
      <div class="sel-info">
        <div class="sel-model">${car.model}</div>
        <div class="sel-price">${car.price}</div>
      </div>`;
    item.onclick = () => switchTo(i);
    track.appendChild(item);
  });
}

function switchTo(idx, direction = 1) {
  if (isAnimating || idx === current) return;
  isAnimating = true;

  direction = idx > current ? 1 : -1;
  const prevIdx = current;
  current = idx;

  const car = cars[current];
  const img = document.getElementById('carImg');
  const overlay = document.getElementById('overlay');

  // Flash overlay
  overlay.classList.remove('flash');
  void overlay.offsetWidth;
  overlay.classList.add('flash');

  // Slide out car
  img.style.transition = 'transform 0.45s ease, opacity 0.45s ease';
  img.style.transform = `translateX(${direction * -100}%) scale(0.85)`;
  img.style.opacity = '0';

  setTimeout(() => {
    // Update theme
    applyTheme(car);
    buildSelector();
    updateDots();

    // Update content
    document.getElementById('nameLine1').textContent = car.name1;
    document.getElementById('nameLine2').textContent = car.name2;
    document.getElementById('nameLine3').textContent = car.name3;
    document.getElementById('carDesc').textContent = car.desc;
    document.getElementById('badge').textContent = car.series;
    document.getElementById('s1').textContent = car.stats[0];
    document.getElementById('s2').textContent = car.stats[1];
    document.getElementById('s3').textContent = car.stats[2];
    document.getElementById('priceVal').textContent = car.price;

    // Set new car image and slide in from opposite side
    img.src = car.img;
    img.style.transition = 'none';
    img.style.transform = `translateX(${direction * 100}%) scale(0.85)`;
    img.style.opacity = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        img.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease';
        img.style.transform = 'translateY(0)';
        img.style.opacity = '1';
        // Restart float animation
        img.style.animation = 'none';
        setTimeout(() => { img.style.animation = 'float 4s ease-in-out infinite'; }, 650);
        isAnimating = false;
      });
    });
  }, 350);
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

// Init
function init() {
  const car = cars[current];
  applyTheme(car, false);
  document.getElementById('carImg').src = car.img;
  document.getElementById('nameLine1').textContent = car.name1;
  document.getElementById('nameLine2').textContent = car.name2;
  document.getElementById('nameLine3').textContent = car.name3;
  document.getElementById('carDesc').textContent = car.desc;
  document.getElementById('badge').textContent = car.series;
  document.getElementById('s1').textContent = car.stats[0];
  document.getElementById('s2').textContent = car.stats[1];
  document.getElementById('s3').textContent = car.stats[2];
  document.getElementById('priceVal').textContent = car.price;

  buildSelector();

  // Dots
  const dotsEl = document.createElement('div');
  dotsEl.className = 'dots';
  cars.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => switchTo(i);
    dotsEl.appendChild(d);
  });
  document.querySelector('.shell').appendChild(dotsEl);
  updateDots();

  document.getElementById('prevBtn').onclick = () => {
    const prev = (current - 1 + cars.length) % cars.length;
    switchTo(prev, -1);
  };
  document.getElementById('nextBtn').onclick = () => {
    const next = (current + 1) % cars.length;
    switchTo(next, 1);
  };

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
  });
}

init();