// main.js - Main Application Controller
let activeSection = "about";
let navLinks = [];

// Navigation Initialization
async function initNavigation() {
  navLinks = await DataLoader.getNav();
  renderNavigation();
  
  // Bind hamburger
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  // Check hash
  const hash = location.hash.replace('#', '');
  if (hash && navLinks.some(n => n.id === hash)) {
    activeSection = hash;
  }
  
  // Load initial section
  goToSection(activeSection);
}

function renderNavigation() {
  const desktop = document.getElementById('navDesktop');
  const mobile = document.getElementById('navMobile');
  if (!desktop || !mobile) return;

  desktop.innerHTML = "";
  mobile.innerHTML = "";

  navLinks.forEach(link => {
    const btn = document.createElement('button');
    btn.className = `nav-btn ${activeSection === link.id ? 'active' : ''}`;
    btn.textContent = link.label;
    btn.onclick = () => goToSection(link.id);
    desktop.appendChild(btn);

    const btnM = document.createElement('button');
    btnM.className = `nav-btn ${activeSection === link.id ? 'active' : ''}`;
    btnM.textContent = link.label;
    btnM.onclick = () => { goToSection(link.id); document.getElementById('mobileMenu')?.classList.remove('open'); };
    mobile.appendChild(btnM);
  });
}

async function goToSection(id) {
  activeSection = id;
  renderNavigation();
  
  // Hide all section containers
  document.querySelectorAll('[id$="SectionContainer"]').forEach(el => el.classList.add('hidden'));
  
  // Show active
  const activeMap = {
    'about': 'aboutSectionContainer',
    'tnea': 'tneaSectionContainer',
    'entrance': 'entranceSectionContainer',
    'scholarships': 'scholarshipsSectionContainer',
    'quiz': 'quizSectionContainer',
    'predictor': 'predictorSectionContainer',
    'counselling': 'counsellingSectionContainer'
  };

  const targetId = activeMap[id];
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.remove('hidden');
    // Load section if not loaded
    if (target.innerHTML.trim() === "") {
      await loadSection(id);
    }
  } else if (id === 'about') {
    // About is special - load immediately
    await loadSection('about');
    document.getElementById('aboutSectionContainer')?.classList.remove('hidden');
  }

  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadSection(id) {
  switch(id) {
    case 'about':
      const aboutContainer = document.getElementById('aboutSectionContainer');
      if (aboutContainer) {
        const res = await fetch('components/sections/about.html');
        aboutContainer.innerHTML = await res.text();
        // Bind about buttons
        aboutContainer.querySelectorAll('[data-go]').forEach(btn => {
          btn.addEventListener('click', () => goToSection(btn.dataset.go));
        });
      }
      break;
    case 'tnea':
      if (window.initTNEA) await window.initTNEA();
      break;
    case 'entrance':
      if (window.initEntrance) await window.initEntrance();
      break;
    case 'scholarships':
      if (window.initScholarships) await window.initScholarships();
      break;
    case 'quiz':
      if (window.initQuiz) await window.initQuiz();
      break;
    case 'predictor':
      if (window.initPredictor) await window.initPredictor();
      break;
    case 'counselling':
      const counsContainer = document.getElementById('counsellingSectionContainer');
      if (counsContainer && counsContainer.innerHTML.trim() === "") {
        const res = await fetch('components/sections/counselling.html');
        counsContainer.innerHTML = await res.text();
      }
      break;
  }
}

// Expose globally
window.initNavigation = initNavigation;
window.goToSection = goToSection;

// Initial load after components are loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Wait a bit for components.js to load header/footer
  setTimeout(async () => {
    if (navLinks.length === 0) {
      await initNavigation();
    }
    // Preload about
    await loadSection('about');
    document.getElementById('aboutSectionContainer')?.classList.remove('hidden');
  }, 500);
});

// Footer nav clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-nav]')) {
    e.preventDefault();
    goToSection(e.target.dataset.nav);
  }
  if (e.target.matches('[data-go]')) {
    goToSection(e.target.dataset.go);
  }
});
