// about.js - About page interactions
function initAbout() {
  // Animate expert cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.expert-card, .pillar-card, .office-card-detailed').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Logo click - scroll to top
  document.getElementById('headerLogo')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.initAbout = initAbout;

// Auto init when about section loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.querySelector('.about-page')) {
      initAbout();
    }
  }, 600);
});
