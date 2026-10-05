// tnea.js - TNEA Cutoff Table Logic (uses data/tnea-cutoff.json)
let tneaData = [];
let tneaFilter = { course: "All", search: "", category: "OC", cutoff: "189.5" };

function getChance(myCutoff, collegeCutoff) {
  const diff = myCutoff - collegeCutoff;
  if (diff >= 1.5) return { label: "High Chance", cls: "chance-high" };
  if (diff >= 0) return { label: "Medium", cls: "chance-medium" };
  if (diff >= -1.5) return { label: "Low - Try", cls: "chance-low" };
  return { label: "No Chance", cls: "chance-no" };
}

async function initTNEA() {
  tneaData = await DataLoader.getTNEA();
  const container = document.getElementById('tneaSectionContainer');
  if (!container) return;
  
  // Load section HTML
  const res = await fetch('components/sections/tnea.html');
  container.innerHTML = await res.text();
  
  bindTNEAEvents();
  renderTNEA();
}

function bindTNEAEvents() {
  document.getElementById('tneaCourse')?.addEventListener('change', e => { tneaFilter.course = e.target.value; renderTNEA(); });
  document.getElementById('tneaSearch')?.addEventListener('input', e => { tneaFilter.search = e.target.value; renderTNEA(); });
  document.getElementById('tneaCategory')?.addEventListener('change', e => { 
    tneaFilter.category = e.target.value; 
    document.getElementById('tneaCatHead').textContent = `${e.target.value} Cutoff`;
    renderTNEA(); 
  });
  document.getElementById('tneaCutoff')?.addEventListener('input', e => { tneaFilter.cutoff = e.target.value; renderTNEA(); });
}

function renderTNEA() {
  const tbody = document.getElementById('tneaBody');
  if (!tbody) return;
  const my = parseFloat(tneaFilter.cutoff) || 0;
  
  const filtered = tneaData.filter(r => {
    if (tneaFilter.course !== "All") {
      if (tneaFilter.course === "AI" && !r.course.includes("AI")) return false;
      if (tneaFilter.course === "CSE" && r.course !== "CSE") return false;
      if (tneaFilter.course === "ECE" && r.course !== "ECE") return false;
      if (tneaFilter.course === "Mech" && !r.course.includes("Mech")) return false;
    }
    if (tneaFilter.search && !r.college.toLowerCase().includes(tneaFilter.search.toLowerCase()) && !r.short.toLowerCase().includes(tneaFilter.search.toLowerCase())) return false;
    return true;
  });

  tbody.innerHTML = filtered.map(r => {
    const cutoffVal = r[tneaFilter.category] ?? r.OC;
    const ch = getChance(my, cutoffVal);
    return `<tr><td><b>${r.college}</b><br><span style="font-size:11px;color:#64748b">${r.short} • ${r.course}</span></td><td>${r.course}</td><td>${r.district}</td><td><b>${cutoffVal}</b></td><td><span class="chance ${ch.cls}">${ch.label}</span></td></tr>`;
  }).join('') || `<tr><td colspan="5" style="text-align:center;padding:20px;color:#94a3b8">No colleges found</td></tr>`;
}

window.initTNEA = initTNEA;
