const cars = [
  {
    model: "765LT",
    series: "Longtail Series",
    name1: "765", name2: "LT", name3: "Longtail",
    desc: "The most extreme Longtail in McLaren's history. With 765PS and 800Nm of torque from a twin-turbo V8, every component earns its place. Born from fearless engineering.",
    stats: ["2.8s", "205", "765"],
    price: "$382,000",
    color: "#e85d04",
    glow: "rgba(232,93,4,0.45)",
    bg: "#100500",
    accent: "#ff7a2b",
    img: "car.png",
  },
  {
    model: "720S",
    series: "Super Series",
    name1: "720", name2: "S", name3: "Super Series",
    desc: "The 720S is a force of nature...",
    stats: ["2.9s", "212", "720"],
    price: "$299,000",
    color: "#00cfff",
    glow: "rgba(0,180,255,0.38)",
    bg: "#000c12",
    accent: "#5de0ff",
    img: "car.png",
  },
  {
    model: "Artura",
    series: "High Performance Hybrid",
    name1: "ART", name2: "URA", name3: "HPH",
    desc: "McLaren's first series-production High-Performance Hybrid...",
    stats: ["3.0s", "205", "700"],
    price: "$237,000",
    color: "#c77dff",
    glow: "rgba(199,125,255,0.4)",
    bg: "#0a0012",
    accent: "#e0aaff",
    img: "car.png",
  },
  {
    model: "750S",
    series: "Super Series",
    name1: "750", name2: "S", name3: "Super Series",
    desc: "The lightest and most powerful McLaren...",
    stats: ["2.8s", "206", "750"],
    price: "$319,000",
    color: "#ff2040",
    glow: "rgba(220,20,40,0.45)",
    bg: "#0f0003",
    accent: "#ff5570",
    img: "car.png",
  },
];
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