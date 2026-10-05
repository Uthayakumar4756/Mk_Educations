// entrance.js - Entrance Exams Table (uses data/entrance-exams.json)
let entranceData = [];
let entranceSearch = "";

async function initEntrance() {
  entranceData = await DataLoader.getEntrance();
  const container = document.getElementById('entranceSectionContainer');
  if (!container) return;
  const res = await fetch('components/sections/entrance.html');
  container.innerHTML = await res.text();
  bindEntrance();
  renderEntrance();
}

function bindEntrance() {
  document.getElementById('entrSearch')?.addEventListener('input', e => {
    entranceSearch = e.target.value.toLowerCase();
    renderEntrance();
  });
}

function renderEntrance() {
  const tbody = document.getElementById('entrBody');
  if (!tbody) return;
  const filtered = entranceData.filter(o => 
    !entranceSearch || 
    o.exam.toLowerCase().includes(entranceSearch) || 
    o.courses.toLowerCase().includes(entranceSearch)
  );
  tbody.innerHTML = filtered.map(o => 
    `<tr><td><b>${o.exam}</b></td><td>${o.courses}</td><td>${o.notif}</td><td>${o.examDate}</td><td>${o.result}</td><td>${o.counselling}</td><td><a href="${o.site}" target="_blank" style="color:#ff7a00;font-weight:700">${o.label}</a></td></tr>`
  ).join('');
}

window.initEntrance = initEntrance;
