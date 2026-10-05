// predictor.js - College Predictor (uses data/tnea-cutoff.json)
let predictorData = [];
let predictorFilter = { cutoff: "192", category: "OC", course: "All", district: "All" };

async function initPredictor() {
  predictorData = await DataLoader.getTNEA();
  const container = document.getElementById('predictorSectionContainer');
  if (!container) return;
  const res = await fetch('components/sections/predictor.html');
  container.innerHTML = await res.text();
  bindPredictor();
  renderPredictor();
}

function bindPredictor() {
  document.getElementById('predCut')?.addEventListener('input', e => { predictorFilter.cutoff = e.target.value; renderPredictor(); });
  document.getElementById('predCat')?.addEventListener('change', e => { predictorFilter.category = e.target.value; renderPredictor(); });
  document.getElementById('predCourse')?.addEventListener('change', e => { predictorFilter.course = e.target.value; renderPredictor(); });
  document.getElementById('predDist')?.addEventListener('change', e => { predictorFilter.district = e.target.value; renderPredictor(); });
}

function renderPredictor() {
  const tbody = document.getElementById('predBody');
  const info = document.getElementById('predInfo');
  if (!tbody) return;
  const my = parseFloat(predictorFilter.cutoff) || 0;
  
  const filtered = predictorData.filter(r => {
    if (predictorFilter.course !== "All") {
      if (predictorFilter.course === "AI" && !r.course.includes("AI")) return false;
      if (predictorFilter.course === "CSE" && r.course !== "CSE") return false;
      if (predictorFilter.course === "ECE" && r.course !== "ECE") return false;
      if (predictorFilter.course === "Mech" && !r.course.includes("Mech")) return false;
    }
    if (predictorFilter.district !== "All" && r.district !== predictorFilter.district) return false;
    const req = r[predictorFilter.category] ?? r.OC;
    return my >= req - 3;
  }).map(r => {
    const req = r[predictorFilter.category] ?? r.OC;
    const diff = my - req;
    let chance = "Low", cls = "chance-low";
    if (diff >= 2) { chance = "High"; cls = "chance-high"; }
    else if (diff >= 0) { chance = "Medium"; cls = "chance-medium"; }
    return { ...r, req, diff, chance, cls };
  }).sort((a, b) => b.diff - a.diff).slice(0, 12);

  if (info) info.textContent = `Showing ${filtered.length} colleges where your ${predictorFilter.category} cutoff ${my} is within 3 marks of required cutoff. (JSON: data/tnea-cutoff.json)`;
  
  tbody.innerHTML = filtered.map(r => 
    `<tr><td><b>${r.college}</b><br><span style="font-size:11px;color:#64748b">${r.short}</span></td><td>${r.course}</td><td>${my} vs ${r.req}</td><td><span class="chance ${r.cls}">${r.chance}</span></td><td>${r.diff >= 0 ? `+${r.diff.toFixed(1)}` : r.diff.toFixed(1)}</td></tr>`
  ).join('') || `<tr><td colspan="5" style="text-align:center;padding:20px;color:#94a3b8">No colleges in this range. Try lowering cutoff or changing district.</td></tr>`;
}

window.initPredictor = initPredictor;
