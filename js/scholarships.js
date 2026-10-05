// scholarships.js - Scholarships Cards (uses data/scholarships.json)
let scholarshipData = [];
let scholarshipFilter = { type: "All", search: "" };

async function initScholarships() {
  scholarshipData = await DataLoader.getScholarships();
  const container = document.getElementById('scholarshipsSectionContainer');
  if (!container) return;
  const res = await fetch('components/sections/scholarships.html');
  container.innerHTML = await res.text();
  bindScholarships();
  renderScholarships();
}

function bindScholarships() {
  document.getElementById('schType')?.addEventListener('change', e => { scholarshipFilter.type = e.target.value; renderScholarships(); });
  document.getElementById('schSearch')?.addEventListener('input', e => { scholarshipFilter.search = e.target.value.toLowerCase(); renderScholarships(); });
}

function renderScholarships() {
  const cont = document.getElementById('schCards');
  if (!cont) return;
  const filtered = scholarshipData.filter(s => {
    if (scholarshipFilter.type !== "All" && s.type !== scholarshipFilter.type) return false;
    if (scholarshipFilter.search && !s.title.toLowerCase().includes(scholarshipFilter.search) && !s.category.toLowerCase().includes(scholarshipFilter.search)) return false;
    return true;
  });
  cont.innerHTML = filtered.map(s => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="tag ${s.type.toLowerCase()}">${s.type}</span><span class="tag">${s.category}</span></div>
      <h4>${s.title}</h4>
      <div class="amount">${s.amount}</div>
      <div class="meta">Eligibility: ${s.elig}</div>
      <a href="${s.website}" target="_blank" style="display:inline-block;margin-top:10px;font-size:12px;font-weight:700;color:#1a3a5f;border:1px solid #e2e8f0;padding:6px 10px;border-radius:999px;text-decoration:none">🌐 ${new URL(s.website).hostname} →</a>
    </div>
  `).join('');
}

window.initScholarships = initScholarships;
