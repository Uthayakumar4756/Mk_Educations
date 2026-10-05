// components.js - Loads header, footer, topbar from separate HTML files
async function loadComponent(url, targetId) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
  } catch (e) {
    console.error(`Failed to load ${url}`, e);
  }
}

async function loadAllComponents() {
  await Promise.all([
    loadComponent('components/topbar.html', 'topbarContainer'),
    loadComponent('components/header.html', 'headerContainer'),
    loadComponent('components/footer.html', 'footerContainer')
  ]);

  // After header loaded, init navigation
  if (window.initNavigation) window.initNavigation();
  
  // Set footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Load on DOM ready
document.addEventListener('DOMContentLoaded', loadAllComponents);
