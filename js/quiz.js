// quiz.js - Course Quiz (uses data/quiz-questions.json + data/courses.json)
let quizQuestions = [];
let courseMap = [];
let quizAnswers = Array(10).fill(-1);
let quizStep = 0;

async function initQuiz() {
  quizQuestions = await DataLoader.getQuiz();
  courseMap = await DataLoader.getCourses();
  const container = document.getElementById('quizSectionContainer');
  if (!container) return;
  const res = await fetch('components/sections/quiz.html');
  container.innerHTML = await res.text();
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const area = document.getElementById('quizArea');
  const progressBar = document.getElementById('quizProgressBar');
  const statusEl = document.getElementById('quizStatus');
  if (!area) return;

  const answered = quizAnswers.filter(a => a !== -1).length;
  const progress = Math.round(answered / 10 * 100);
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (statusEl) statusEl.textContent = `${answered}/10 answered • Step ${quizStep + 1}`;

  const q = quizQuestions[quizStep];
  if (!q || quizStep >= 10) {
    // Show results
    const selectedTags = quizAnswers.map((ans, i) => quizQuestions[i]?.options[ans]).filter(Boolean);
    const scored = courseMap.map(c => {
      let score = 0;
      selectedTags.forEach(t => { if (c.tags.includes(t)) score++; });
      return { ...c, score: Math.round(score / 10 * 100) };
    }).sort((a, b) => b.score - a.score);

    area.innerHTML = `
      <h4 style="color:#1a3a5f">Your Top Matches</h4>
      ${scored.slice(0, 5).map(r => `
        <div class="result">
          <span style="font-size:22px">${r.icon}</span>
          <div style="flex:1"><b>${r.course}</b><div class="bar"><div style="width:${r.score}%"></div></div></div>
          <b style="color:#1a3a5f">${r.score}%</b>
        </div>
      `).join('')}
      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-ghost" id="retakeBtn">Retake Quiz</button>
        <button class="btn btn-primary" id="callExpertBtn">Call Expert for Counselling</button>
      </div>
    `;
    document.getElementById('retakeBtn').onclick = () => { quizAnswers = Array(10).fill(-1); quizStep = 0; renderQuizQuestion(); };
    document.getElementById('callExpertBtn').onclick = () => { if (window.goToSection) window.goToSection('counselling'); };
    if (progressBar) progressBar.style.width = "100%";
    return;
  }

  area.innerHTML = `
    <div class="q-card">
      <h4>Q${quizStep + 1}. ${q.q}</h4>
      <div class="options">${q.options.map((opt, i) => `<button class="opt ${quizAnswers[quizStep] === i ? 'selected' : ''}" data-i="${i}">${opt}</button>`).join('')}</div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:12px">
      <button class="btn btn-ghost" ${quizStep === 0 ? 'disabled' : ''} id="prevQ">← Previous</button>
      <button class="btn btn-primary" id="nextQ">${quizStep === 9 ? 'See Result' : 'Next →'}</button>
    </div>
  `;

  area.querySelectorAll('.opt').forEach(btn => {
    btn.onclick = () => {
      quizAnswers[quizStep] = parseInt(btn.dataset.i);
      if (quizStep < 9) quizStep++;
      else quizStep = 10;
      renderQuizQuestion();
    };
  });
  document.getElementById('prevQ').onclick = () => { if (quizStep > 0) { quizStep--; renderQuizQuestion(); } };
  document.getElementById('nextQ').onclick = () => {
    if (quizAnswers[quizStep] === -1) { alert("Please select an option"); return; }
    if (quizStep < 9) { quizStep++; renderQuizQuestion(); }
    else { quizStep = 10; renderQuizQuestion(); }
  };
}

window.initQuiz = initQuiz;
