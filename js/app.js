/**
 * app.js — AP Review Workbench
 * 
 * Consolidating all logic here to ensure it works on local file systems
 * without module loading issues.
 */

// ============================================================
// 1. Data & Engines
// ============================================================

const CompetitionDB = [
  {
    name: "International Biology Olympiad",
    aliases: ["IBO"],
    scope: "International",
    selectivity: "Extreme",
    description: "Top 4 biology students per country. Highly prestigious.",
    resultsUrlPattern: "https://www.ibo-info.org/en/contest/ibo-{year}.html",
    tags: ["STEM", "Biology"]
  },
  {
    name: "International Mathematical Olympiad",
    aliases: ["IMO"],
    scope: "International",
    selectivity: "Extreme",
    description: "The premier global math competition for high schoolers.",
    resultsUrlPattern: "https://www.imo-official.org/year_info.aspx?year={year}",
    tags: ["STEM", "Math"]
  },
  {
    name: "Regeneron Science Talent Search",
    aliases: ["STS", "Intel STS"],
    scope: "National (US)",
    selectivity: "High",
    description: "Oldest and most prestigious science competition in the US.",
    resultsUrlPattern: "https://www.societyforscience.org/regeneron-sts/{year}-scholars/",
    tags: ["STEM", "Research"]
  },
  {
    name: "DECA International Career Development Conference",
    aliases: ["DECA ICDC"],
    scope: "International",
    selectivity: "Moderate-High",
    description: "Business and marketing competition with thousands of participants.",
    resultsUrlPattern: "https://www.deca.org/search?q={year}+ICDC+results",
    tags: ["Business", "Leadership"]
  },
  {
    name: "Model United Nations",
    aliases: ["MUN"],
    scope: "Variable (Local to International)",
    selectivity: "Variable",
    description: "Simulation of the UN. Selectivity depends on the conference (e.g., HMUN is high).",
    resultsUrlPattern: "https://www.google.com/search?q={name}+{year}+results",
    tags: ["Social Sciences", "Debate"]
  },
  {
    name: "World Schools Debating Championships",
    aliases: ["WSDC"],
    scope: "International",
    selectivity: "High",
    description: "The global standard for high school parliamentary debate.",
    resultsUrlPattern: "https://www.google.com/search?q=WSDC+{year}+results",
    tags: ["Debate", "Public Speaking"]
  }
];

const AnalysisEngine = {
  analyze(text) {
    const sentences = this.splitIntoSentences(text);
    return sentences.map(s => ({
      original: s,
      flags: this.getFlags(s),
      metrics: this.getMetrics(s)
    }));
  },

  splitIntoSentences(text) {
    return text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
  },

  getFlags(sentence) {
    const flags = [];
    const lower = sentence.toLowerCase();

    // Passive Voice
    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\b\s+\w+(ed|en|t)\b/i;
    if (passiveRegex.test(lower)) {
      flags.push({
        type: 'structure',
        label: 'Passive Voice',
        message: 'Consider using active voice.',
        suggestion: 'Rephrase to focus on the "doer".'
      });
    }

    // Run-on
    const words = sentence.trim().split(/\s+/);
    if (words.length > 35 && !/[;,]/.test(sentence)) {
      flags.push({
        type: 'structure',
        label: 'Possible Run-on',
        message: 'Sentence is very long.',
        suggestion: 'Split into two.'
      });
    }

    // Weak Vocab
    const weakWords = ['very', 'really', 'things', 'stuff', 'good', 'bad', 'nice'];
    weakWords.forEach(word => {
      if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
        flags.push({
          type: 'vocab',
          label: 'Weak Vocabulary',
          message: `"${word}" is vague.`,
          suggestion: 'Use a more specific term.'
        });
      }
    });

    return flags;
  },

  getMetrics(sentence) {
    const words = sentence.trim().split(/\s+/).length;
    return {
      wordCount: words,
      complexity: words > 20 ? 'High' : (words > 10 ? 'Medium' : 'Low')
    };
  }
};

const CompetitionSearch = {
  find(query) {
    const q = query.toLowerCase();
    return CompetitionDB.find(c => 
      c.name.toLowerCase().includes(q) || 
      c.aliases.some(a => a.toLowerCase().includes(q))
    );
  }
};

// ============================================================
// 2. State
// ============================================================

const state = {
  activeTab: 'writing',
  isAnalyzing: false,
  writingAnalysis: [],
  competitionResult: null,
  selectedYear: '2025',
  participantName: ''
};

// ============================================================
// 3. Logic & Event Handlers
// ============================================================

function setupEventListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      render();
    });
  });

  const analyzeBtn = document.getElementById('analyze-writing-btn');
  if (analyzeBtn) analyzeBtn.addEventListener('click', handleAnalyzeWriting);

  const checkBtn = document.getElementById('check-competition-btn');
  if (checkBtn) checkBtn.addEventListener('click', handleCheckCompetition);

  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('action-btn')) {
      const { action, type, index, flagIndex } = e.target.dataset;
      handleFlagAction(action, type, parseInt(index), parseInt(flagIndex));
    }
    
    if (e.id === 'search-participant-btn' || e.target.closest('#search-participant-btn')) {
        handleSearchParticipant();
    }
  });

  // Handle dynamic inputs in Competition Checker
  document.body.addEventListener('input', e => {
      if (e.target.id === 'year-select') {
          state.selectedYear = e.target.value;
          render();
      }
      if (e.target.id === 'participant-input') {
          state.participantName = e.target.value;
      }
  });
}

function handleAnalyzeWriting() {
  const input = document.getElementById('writing-input').value.trim();
  if (!input) return;

  state.isAnalyzing = true;
  render();

  setTimeout(() => {
    const rawAnalysis = AnalysisEngine.analyze(input);
    state.writingAnalysis = rawAnalysis.map(s => ({
      ...s,
      flags: s.flags.map(f => ({ ...f, status: 'pending' }))
    }));
    state.isAnalyzing = false;
    render();
  }, 500);
}

function handleCheckCompetition() {
  const input = document.getElementById('competition-input').value.trim();
  if (!input) return;

  state.isAnalyzing = true;
  render();

  setTimeout(() => {
    const result = CompetitionSearch.find(input);
    state.competitionResult = result ? { data: result, status: 'pending' } : null;
    state.isAnalyzing = false;
    render();
  }, 300);
}

function handleFlagAction(action, type, index, flagIndex) {
  if (type === 'writing') {
    state.writingAnalysis[index].flags[flagIndex].status = action === 'accept' ? 'accepted' : 'dismissed';
  } else if (type === 'competition') {
    state.competitionResult.status = action === 'accept' ? 'accepted' : 'dismissed';
  }
  render();
}

function handleSearchParticipant() {
    if (!state.competitionResult || !state.participantName) return;
    const compName = state.competitionResult.data.name;
    const searchQuery = `${compName} ${state.selectedYear} results ${state.participantName}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
}

// ============================================================
// 4. Rendering
// ============================================================

function render() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
  });
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('active', tab.id === `${state.activeTab}-tab`);
  });

  const analyzeBtn = document.getElementById('analyze-writing-btn');
  if (analyzeBtn) {
    analyzeBtn.disabled = state.isAnalyzing;
    analyzeBtn.textContent = (state.isAnalyzing && state.activeTab === 'writing') ? 'Analyzing...' : 'Analyze Sample';
  }
  const checkBtn = document.getElementById('check-competition-btn');
  if (checkBtn) {
    checkBtn.disabled = state.isAnalyzing;
    checkBtn.textContent = (state.isAnalyzing && state.activeTab === 'competitions') ? 'Checking...' : 'Check Competition';
  }

  renderWritingResults();
  renderCompetitionResults();
}

function renderWritingResults() {
  const container = document.getElementById('writing-results');
  if (!state.writingAnalysis.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  container.innerHTML = `
    <h2>Analysis Results</h2>
    <div class="analysis-list">
      ${state.writingAnalysis.map((s, i) => `
        <div class="analysis-item">
          <p class="analysis-sentence">${s.original}</p>
          <div class="metrics">Words: ${s.metrics.wordCount} | Complexity: ${s.metrics.complexity}</div>
          ${s.flags.map((f, fi) => `
            <div class="analysis-feedback ${f.status}">
              <span class="feedback-tag tag-${f.type}">${f.label}</span>
              ${f.message} <em>Suggestion: ${f.suggestion}</em>
              <div class="flag-actions">
                ${f.status === 'pending' ? `
                  <button class="action-btn accept" data-action="accept" data-type="writing" data-index="${i}" data-flag-index="${fi}">Accept</button>
                  <button class="action-btn dismiss" data-action="dismiss" data-type="writing" data-index="${i}" data-flag-index="${fi}">Dismiss</button>
                ` : `<span class="status-label">${f.status === 'accepted' ? '✓ Accepted' : '✕ Dismissed'}</span>`}
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderCompetitionResults() {
  const container = document.getElementById('competition-results');
  const input = document.getElementById('competition-input')?.value.trim();

  if (!state.competitionResult) {
    if (input && !state.isAnalyzing && state.activeTab === 'competitions') {
       container.style.display = 'block';
       container.innerHTML = `<div class="card"><p>No exact match found for "${input}". AP should verify manually.</p></div>`;
    } else {
       container.style.display = 'none';
    }
    return;
  }
  
  container.style.display = 'block';
  const { data, status } = state.competitionResult;
  
  // Generate results URL
  const resultsUrl = data.resultsUrlPattern
    .replace('{year}', state.selectedYear)
    .replace('{name}', encodeURIComponent(data.name));

  container.innerHTML = `
    <h2>Competition Context</h2>
    <div class="card competition-card ${status}">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
            <h3>${data.name}</h3>
            <p>${data.description}</p>
        </div>
        <div style="text-align: right;">
            <label for="year-select" style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px;">Select Year</label>
            <select id="year-select" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--mu-ash);">
                ${['2026', '2025', '2024', '2023', '2022', '2021', '2020'].map(y => `
                    <option value="${y}" ${state.selectedYear === y ? 'selected' : ''}>${y}</option>
                `).join('')}
            </select>
        </div>
      </div>

      <div class="analysis-feedback">
        <span class="feedback-tag tag-structure">Scope</span>
        <strong>${data.scope}</strong>
      </div>
      <div class="analysis-feedback">
        <span class="feedback-tag tag-vocab">Selectivity</span>
        <strong>${data.selectivity}</strong>
      </div>

      <div class="verification-tools" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--mu-ash);">
        <h3 style="font-size: 0.9rem;">Verification Tools</h3>
        <p style="font-size: 0.9rem;">Official Results: <a href="${resultsUrl}" target="_blank" class="mu-clay" style="font-weight: 600;">View ${state.selectedYear} Page ↗</a></p>
        
        <div style="display: flex; gap: 8px; margin-top: 1rem;">
            <input type="text" id="participant-input" placeholder="Verify participant name..." value="${state.participantName}" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--mu-ash); font-size: 0.9rem;">
            <button id="search-participant-btn" class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">Search Results</button>
        </div>
        <p style="font-size: 0.75rem; color: var(--mu-slate); margin-top: 4px;">Generates a targeted Google search. No data is stored.</p>
      </div>

      <div class="flag-actions" style="margin-top: 1.5rem;">
        ${status === 'pending' ? `
          <button class="action-btn accept" data-action="accept" data-type="competition">Verify Impact</button>
          <button class="action-btn dismiss" data-action="dismiss" data-type="competition">Dismiss</button>
        ` : `<span class="status-label">${status === 'accepted' ? '✓ Verified' : '✕ Dismissed'}</span>`}
      </div>
    </div>
  `;
}

// ============================================================
// 5. Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] initialized');
  setupEventListeners();
  render();
});
