document.getElementById('year').textContent = new Date().getFullYear();

const phrases = [
  'parsing evidence, one byte at a time.',
  'digital forensics × software engineering.',
  'reconstructing truth from raw data.'
];

const typeTarget = document.getElementById('typeTarget');
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typeTarget.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    charIndex--;
    typeTarget.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 35 : 55);
}

typeLoop();

async function loadProjects() {
  const grid = document.getElementById('projectGrid');

  try {
    const response = await fetch('graphics/projects.json');
    const projects = await response.json();

    projects.forEach((project, index) => {
      const card = document.createElement('a');
      card.className = 'project-card';
      card.href = project.link;
      card.target = '_blank';
      card.rel = 'noopener';
      card.style.transitionDelay = (index * 60) + 'ms';

      card.innerHTML = `
        <div class="project-thumb">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        <div class="project-body">
          <span class="project-title">${project.title}</span>
          <span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
        </div>
      `;

      grid.appendChild(card);
    });

    observeCards();
  } catch (error) {
    grid.innerHTML = '<p style="font-family: var(--mono); color: var(--muted);">Unable to load case files right now.</p>';
  }
}

function observeCards() {
  const cards = document.querySelectorAll('.project-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card) => observer.observe(card));
}

loadProjects();