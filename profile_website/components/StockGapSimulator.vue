<template>
  <div class="simulator">
    <!-- Background grid -->
    <div class="bg-grid"></div>

    <!-- ── Header ── -->
    <header class="header">
      <div class="header-left">
        <div class="ticker-badge">
          <span class="ticker-symbol">{{ tickerSymbol || 'STOCK' }}</span>
          <span class="ticker-dot"></span>
        </div>
        <div class="header-text">
          <h1>Gap-Open Predictor</h1>
          <p>{{ currentAlgorithm.description }}</p>
        </div>
      </div>
      <div class="header-right">
        <div class="algo-select-wrap">
          <label class="algo-label">Algorithm</label>
          <select v-model="selectedAlgorithmId" class="algo-select" @change="onAlgorithmChange">
            <option v-for="a in ALGORITHMS" :key="a.id" :value="a.id">{{ a.label }}</option>
          </select>
        </div>
        <div class="filter-tabs">
          <button
            v-for="f in availableFilters"
            :key="f"
            :class="['filter-btn', { active: filter === f }]"
            @click="filter = f; expanded = null"
          >{{ f }}</button>
        </div>
      </div>
    </header>

    <!-- ── CSV Input Panel ── -->
    <section class="input-panel">
      <div class="input-header">
        <span class="input-label">📂 PASTE CSV DATA</span>
        <span class="input-hint">Columns: Date, Open, High, Low, Close, Adj Close, Volume</span>
        <div class="load-actions">
          <button class="load-btn" @click="loadSampleData">Load HUG.TO Sample</button>
          <div class="yahoo-load">
            <input
              v-model="yahooSymbol"
              type="text"
              class="yahoo-symbol-input"
              placeholder="Symbol (e.g. HUG.TO, AAPL)"
              @keydown.enter="loadFromYahoo"
            />
            <button
              class="load-btn load-btn-yahoo"
              :disabled="yahooLoading || !yahooSymbol.trim()"
              @click="loadFromYahoo"
            >
              {{ yahooLoading ? 'Loading…' : 'Load from Yahoo (2 months)' }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="yahooError" class="yahoo-error">⚠ {{ yahooError }}</div>
      <textarea
        v-model="csvInput"
        class="csv-area"
        placeholder="Paste your CSV here (include header row)..."
        rows="5"
        spellcheck="false"
      ></textarea>
      <div class="input-footer">
        <div v-if="parseError" class="parse-error">⚠ {{ parseError }}</div>
        <div v-else-if="parsedData.length" class="parse-ok">✓ {{ parsedData.length }} rows loaded · {{ parsedData[0]?.date }} → {{ parsedData[parsedData.length - 1]?.date }}</div>
        <button class="run-btn" @click="runSimulation" :disabled="!csvInput.trim()">
          <span>▶ RUN SIMULATION</span>
        </button>
      </div>
    </section>

    <!-- ── Stats Cards ── -->
    <section v-if="results.length" class="stats-grid">
      <div class="stat-card accent-green">
        <div class="stat-label">Overall Accuracy</div>
        <div class="stat-value">{{ accuracy }}%</div>
        <div class="stat-sub">{{ correctCount }} / {{ scoredResults.length }} days correct</div>
        <div class="stat-bar"><div class="stat-bar-fill green" :style="{ width: accuracy + '%' }"></div></div>
      </div>
      <div class="stat-card accent-purple">
        <div class="stat-label">★ Confirmed Signals</div>
        <div class="stat-value">{{ confirmedAccuracy }}%</div>
        <div class="stat-sub">{{ confirmedCorrect }} / {{ confirmedResults.length }} — gap + MA agree</div>
        <div class="stat-bar"><div class="stat-bar-fill purple" :style="{ width: confirmedAccuracy + '%' }"></div></div>
      </div>
      <div class="stat-card accent-amber">
        <div class="stat-label">⚠ Unconfirmed Signals</div>
        <div class="stat-value">{{ unconfirmedAccuracy }}%</div>
        <div class="stat-sub">{{ unconfirmedCorrect }} / {{ unconfirmedResults.length }} — gap only</div>
        <div class="stat-bar"><div class="stat-bar-fill amber" :style="{ width: unconfirmedAccuracy + '%' }"></div></div>
      </div>
      <div class="stat-card accent-blue">
        <div class="stat-label">MA Confirmation Lift</div>
        <div class="stat-value">{{ confirmationLift > 0 ? '+' : '' }}{{ confirmationLift }}%</div>
        <div class="stat-sub">accuracy gain from MA filter</div>
        <div class="stat-bar"><div class="stat-bar-fill blue" :style="{ width: Math.min(100, Math.abs(confirmationLift) + 50) + '%' }"></div></div>
      </div>
    </section>

    <!-- ── Algorithm Explainer ── -->
    <section v-if="results.length" class="algo-panel">
      <div class="algo-title">ALGORITHM — {{ currentAlgorithm.hasMaConfirmation ? '3 STEP' : '2 STEP' }} PATTERN</div>
      <div class="algo-steps">
        <div class="algo-step">
          <div class="step-num">01</div>
          <div class="step-body">
            <div class="step-name">Gap Check</div>
            <div class="step-desc">Today's Open − Yesterday's Close</div>
            <div class="step-signals">
              <span class="sig up">Open ↑ = PREDICT UP</span>
              <span class="sig down">Open ↓ = PREDICT DOWN</span>
            </div>
          </div>
        </div>
        <template v-if="currentAlgorithm.hasMaConfirmation">
          <div class="algo-divider">→</div>
          <div class="algo-step">
            <div class="step-num">02</div>
            <div class="step-body">
              <div class="step-name">MA Confirmation</div>
              <div class="step-desc">Open vs {{ currentAlgorithm.maPeriod || 5 }}-Day Moving Average</div>
              <div class="step-signals">
                <span class="sig confirmed">★ Aligned = HIGH confidence</span>
                <span class="sig conflict">⚠ Conflict = LOWER confidence</span>
              </div>
            </div>
          </div>
          <div class="algo-divider">→</div>
        </template>
        <div class="algo-step">
          <div class="step-num">{{ currentAlgorithm.hasMaConfirmation ? '03' : '02' }}</div>
          <div class="step-body">
            <div class="step-name">Confidence Score</div>
            <div class="step-desc">Base 50% + gap size{{ currentAlgorithm.hasMaConfirmation ? ' + MA bonus' : '' }}</div>
            <div class="step-signals">
              <span v-if="currentAlgorithm.hasMaConfirmation" class="sig confirmed">+20% if MA confirms</span>
              <span v-if="currentAlgorithm.hasMaConfirmation" class="sig conflict">−10% if MA conflicts</span>
              <span v-else class="sig up">Gap size only</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Results Table ── -->
    <section v-if="results.length" class="table-section">
      <div class="table-header">
        <span>DAY-BY-DAY RESULTS</span>
        <span class="table-hint">Click a row to expand signal breakdown</span>
      </div>
      <div class="table-wrap">
        <table class="results-table">
          <thead>
            <tr>
              <th>Date (n)</th>
              <th>Prev Close</th>
              <th>Today Open</th>
              <th>Gap $</th>
              <th>Gap %</th>
              <th>{{ currentAlgorithm.hasMaConfirmation ? (currentAlgorithm.maPeriod || 5) + '-Day MA' : 'MA' }}</th>
              <th>MA Signal</th>
              <th>Prediction</th>
              <th>Today Close</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(r, i) in displayResults" :key="r.date">
              <tr
                :class="['result-row', { expanded: expanded === i, hit: r.correct && r.actual !== 'FLAT', miss: !r.correct && r.actual !== 'FLAT', confirmed: r.maConfirms }]"
                @click="expanded = expanded === i ? null : i"
              >
                <td class="date-cell">{{ r.date }}</td>
                <td class="mono">${{ r.yesterdayClose.toFixed(2) }}</td>
                <td class="mono bold" :class="r.gapPositive ? 'text-green' : 'text-red'">${{ r.todayOpen.toFixed(2) }}</td>
                <td class="mono" :class="r.gapPositive ? 'text-green' : 'text-red'">{{ r.gapPositive ? '+' : '' }}{{ r.gap }}</td>
                <td class="mono" :class="r.gapPositive ? 'text-green' : 'text-red'">{{ r.gapPositive ? '+' : '' }}{{ r.gapPct }}%</td>
                <td class="mono text-muted">${{ r.ma5 }}</td>
                <td>
                  <span v-if="currentAlgorithm.hasMaConfirmation" :class="['badge', r.maConfirms ? 'badge-confirmed' : 'badge-conflict']">
                    {{ r.maConfirms ? '★ CONFIRMED' : '⚠ CONFLICTS' }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span :class="['badge', 'badge-predict', r.predicted === 'UP' ? 'badge-up' : 'badge-down']">
                    {{ r.predicted === 'UP' ? '▲' : '▼' }} {{ r.predicted }}{{ r.maConfirms ? ' ★' : '' }}
                  </span>
                </td>
                <td class="mono bold">${{ r.todayClose.toFixed(2) }}</td>
                <td>
                  <span v-if="r.actual === 'FLAT'" class="text-muted">—</span>
                  <span v-else-if="r.correct" class="result-hit">✓ HIT</span>
                  <span v-else class="result-miss">✗ MISS</span>
                </td>
              </tr>
              <!-- Expanded Detail Row -->
              <tr v-if="expanded === i" :key="r.date + '_detail'" class="detail-row">
                <td colspan="10">
                  <div class="detail-grid">
                    <div class="detail-card">
                      <div class="detail-title">STEP 1 — Gap Analysis</div>
                      <div class="detail-line">Yesterday Close: <strong>${{ r.yesterdayClose.toFixed(2) }}</strong></div>
                      <div class="detail-line">Today Open: <strong :class="r.gapPositive ? 'text-green' : 'text-red'">${{ r.todayOpen.toFixed(2) }}</strong></div>
                      <div class="detail-line">Gap: <strong :class="r.gapPositive ? 'text-green' : 'text-red'">{{ r.gapPositive ? '+' : '' }}{{ r.gap }} ({{ r.gapPositive ? '+' : '' }}{{ r.gapPct }}%)</strong></div>
                      <div class="detail-signal" :class="r.predicted === 'UP' ? 'text-green' : 'text-red'">
                        → {{ r.predicted === 'UP' ? '▲ Predict UP' : '▼ Predict DOWN' }}
                      </div>
                    </div>
                    <div class="detail-card">
                      <div class="detail-title">STEP 2 — {{ currentAlgorithm.hasMaConfirmation ? 'MA Confirmation' : 'MA' }}</div>
                      <div class="detail-line">{{ currentAlgorithm.maPeriod || 5 }}-Day MA: <strong>${{ r.ma5 }}</strong></div>
                      <div v-if="currentAlgorithm.hasMaConfirmation" class="detail-line">Open vs MA: <strong :class="r.aboveMA === true ? 'text-green' : r.aboveMA === false ? 'text-red' : 'text-muted'">{{ r.aboveMA === true ? 'Above ↑' : r.aboveMA === false ? 'Below ↓' : '—' }}</strong></div>
                      <div class="detail-signal" :class="r.maConfirms ? 'text-purple' : 'text-amber'">
                        {{ currentAlgorithm.hasMaConfirmation ? (r.maConfirms ? '★ MA confirms — HIGH confidence' : '⚠ MA conflicts — LOWER confidence') : '— Not used (Gap only)' }}
                      </div>
                    </div>
                    <div class="detail-card">
                      <div class="detail-title">STEP 3 — Outcome</div>
                      <div class="detail-line">Predicted: <strong :class="r.predicted === 'UP' ? 'text-green' : 'text-red'">{{ r.predicted }}</strong></div>
                      <div class="detail-line">Actual: <strong :class="r.actual === 'UP' ? 'text-green' : r.actual === 'DOWN' ? 'text-red' : 'text-muted'">{{ r.actual }} (${{ r.todayClose.toFixed(2) }})</strong></div>
                      <div class="detail-line">Confidence: <strong>{{ r.confidence }}%</strong></div>
                      <div class="detail-signal" :class="r.correct ? 'text-green' : 'text-red'">
                        {{ r.correct ? '✓ CORRECT PREDICTION' : '✗ MISSED PREDICTION' }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── Timeline Strip ── -->
    <section v-if="results.length" class="timeline-section">
      <div class="timeline-header">PREDICTION TIMELINE <span class="timeline-hint">★ = MA-confirmed signal · hover for details</span></div>
      <div class="timeline-strip">
        <div
          v-for="(r, i) in displayResults"
          :key="i"
          :class="['timeline-tile', r.correct ? 'tile-hit' : 'tile-miss', r.maConfirms ? 'tile-confirmed' : '']"
          :title="`${r.date}\nGap: ${r.gapPct}%\nPredicted: ${r.predicted} | Actual: ${r.actual}\n${r.correct ? '✓ HIT' : '✗ MISS'}`"
          @click="expanded = expanded === i ? null : i"
        >
          <div class="tile-arrow">{{ r.predicted === 'UP' ? '▲' : '▼' }}</div>
          <div class="tile-date">{{ r.date.replace(/[A-Za-z, ]+(\d+).*/, '$1') || r.date.split(' ')[1] }}</div>
          <div v-if="r.maConfirms" class="tile-star">★</div>
        </div>
      </div>
      <div class="timeline-legend">
        <span><span class="leg-green">■</span> Hit</span>
        <span><span class="leg-red">■</span> Miss</span>
        <span><span class="leg-purple">★</span> MA-confirmed (bright border)</span>
        <span>▲ Predicted UP &nbsp;▼ Predicted DOWN</span>
      </div>
    </section>

    <!-- ── Empty State ── -->
    <div v-if="!results.length && didRun" class="empty-state">
      Not enough data to run simulation. Need at least 6 trading days.
    </div>
  </div>
</template>

<script>
import { ALGORITHMS, getAlgorithmById } from '~/utils/stockGapAlgorithms'

const SAMPLE_CSV = `Date,Open,High,Low,Close,Adj Close,Volume
"Feb 23, 2026",38.25,38.56,38.25,38.56,38.56,"2,164"
"Feb 20, 2026",37.38,37.78,36.96,37.78,37.78,"12,500"
"Feb 19, 2026",36.91,37.14,36.8,37.04,37.04,"5,900"
"Feb 18, 2026",36.68,37.08,36.68,36.91,36.91,"5,500"
"Feb 17, 2026",36.26,36.32,35.94,36.15,36.15,"9,000"
"Feb 13, 2026",37.04,37.27,36.95,37.27,37.27,"10,600"
"Feb 12, 2026",37.5,37.5,36.17,36.38,36.38,"10,100"
"Feb 11, 2026",37.56,37.75,37.39,37.7,37.7,"4,000"
"Feb 10, 2026",37.51,37.62,37.1,37.3,37.3,"3,700"
"Feb 9, 2026",37.13,37.63,37.13,37.62,37.62,"7,300"
"Feb 6, 2026",36.31,36.77,36.31,36.66,36.66,"2,500"
"Feb 5, 2026",35.77,36.14,35.53,35.67,35.67,"11,800"
"Feb 4, 2026",37.26,37.26,36.06,36.65,36.65,"38,500"
"Feb 3, 2026",36.52,36.76,36.26,36.6,36.6,"13,800"
"Feb 2, 2026",34.94,35.5,34.3,34.51,34.51,"22,500"
"Jan 30, 2026",37.71,37.84,34.82,35.76,35.76,"50,100"
"Jan 29, 2026",41.1,41.1,37.92,40.07,40.07,"19,700"
"Jan 28, 2026",39.01,40.02,39.01,39.99,39.99,"9,600"
"Jan 27, 2026",37.68,38.52,37.6,38.43,38.43,"4,600"
"Jan 26, 2026",37.74,37.93,37.35,37.53,37.53,"10,700"
"Jan 23, 2026",36.76,37.08,36.76,37.04,37.04,"5,200"
"Jan 22, 2026",35.91,36.66,35.91,36.63,36.63,"10,200"
"Jan 21, 2026",36.14,36.22,35.49,35.79,35.79,"20,000"
"Jan 20, 2026",35.36,35.45,35.2,35.41,35.41,"6,500"
"Jan 19, 2026",34.75,34.87,34.75,34.75,34.75,"4,500"
"Jan 16, 2026",34.24,34.31,33.96,34.14,34.14,"4,700"
"Jan 15, 2026",34.27,34.38,34.26,34.29,34.29,"2,100"
"Jan 14, 2026",34.5,34.56,34.28,34.51,34.51,"15,400"
"Jan 13, 2026",34.41,34.51,34.07,34.17,34.17,"4,100"
"Jan 12, 2026",34.16,34.5,34.16,34.25,34.25,"8,000"
"Jan 9, 2026",33.49,33.6,33.46,33.59,33.59,"3,600"
"Jan 8, 2026",32.99,33.34,32.99,33.34,33.34,"2,800"
"Jan 7, 2026",33.11,33.27,33.1,33.25,33.25,"3,200"
"Jan 6, 2026",33.28,33.48,33.28,33.47,33.47,"3,100"
"Jan 5, 2026",32.95,33.18,32.95,33.12,33.12,"3,100"
"Jan 2, 2026",32.43,32.43,32.23,32.26,32.26,"3,300"`;

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) throw new Error('Need at least a header row and one data row.');

  const header = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
  const dateIdx   = header.findIndex(h => h.includes('date'));
  const openIdx   = header.findIndex(h => h === 'open');
  const highIdx   = header.findIndex(h => h === 'high');
  const lowIdx    = header.findIndex(h => h === 'low');
  const closeIdx  = header.findIndex(h => h === 'close' && !h.includes('adj'));
  const volIdx    = header.findIndex(h => h.includes('volume') || h.includes('vol'));

  if ([dateIdx, openIdx, closeIdx].some(i => i === -1))
    throw new Error('Missing required columns: Date, Open, Close');

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle quoted fields (e.g. "Feb 23, 2026" and "2,164")
    const raw = lines[i];
    const cols = [];
    let inQuote = false, cur = '';
    for (const ch of raw) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());

    const parseNum = (idx) => idx !== -1 ? parseFloat(cols[idx]?.replace(/,/g, '') || '0') : 0;
    const close = parseNum(closeIdx);
    const open  = parseNum(openIdx);
    if (!close || !open) continue;

    rows.push({
      date:   cols[dateIdx]?.replace(/"/g, '').trim() || `Row ${i}`,
      open,
      high:   parseNum(highIdx),
      low:    parseNum(lowIdx),
      close,
      volume: parseNum(volIdx),
    });
  }

  if (rows.length < 6) throw new Error('Need at least 6 data rows for the simulation.');
  return rows;
}

function pct(num, den) {
  return den === 0 ? '0.0' : ((num / den) * 100).toFixed(1);
}

export default {
  name: 'StockGapSimulator',

  data() {
    return {
      csvInput:    '',
      parsedData:  [],
      parseError:  '',
      allResults:  [],  // reactive so stats and table update when new data is run
      filter:      'All',
      expanded:    null,
      didRun:      false,
      tickerSymbol: '',
      yahooSymbol: '',
      yahooLoading: false,
      yahooError:   '',
      selectedAlgorithmId: 'gap-ma-5',
    };
  },

  computed: {
    currentAlgorithm() {
      return getAlgorithmById(this.selectedAlgorithmId);
    },
    availableFilters() {
      if (!this.parsedData.length) return ['All'];
      const months = new Set();
      this.parsedData.forEach(d => {
        const m = d.date.match(/^([A-Za-z]+)/);
        if (m) months.add(m[1]);
      });
      return ['All', ...Array.from(months)];
    },

    filteredResults() {
      if (this.filter === 'All') return this.allResults;
      return this.allResults.filter(r => r.date.startsWith(this.filter));
    },

    results() {
      return this.filteredResults;
    },

    /** Newest-first for table and timeline display */
    displayResults() {
      return [...this.filteredResults].reverse();
    },

    scoredResults()     { return this.filteredResults.filter(r => r.actual !== 'FLAT'); },
    correctCount()      { return this.scoredResults.filter(r => r.correct).length; },
    accuracy()          { return pct(this.correctCount, this.scoredResults.length); },
    confirmedResults()  { return this.scoredResults.filter(r => r.maConfirms); },
    confirmedCorrect()  { return this.confirmedResults.filter(r => r.correct).length; },
    confirmedAccuracy() { return pct(this.confirmedCorrect, this.confirmedResults.length); },
    unconfirmedResults(){ return this.scoredResults.filter(r => !r.maConfirms); },
    unconfirmedCorrect(){ return this.unconfirmedResults.filter(r => r.correct).length; },
    unconfirmedAccuracy(){ return pct(this.unconfirmedCorrect, this.unconfirmedResults.length); },
    confirmationLift()  { return (parseFloat(this.confirmedAccuracy) - parseFloat(this.unconfirmedAccuracy)).toFixed(1); },
  },

  watch: {
    filter() { this.expanded = null; },
  },

  methods: {
    onAlgorithmChange() {
      if (this.parsedData.length) this.runSimulation();
    },
    loadSampleData() {
      this.yahooError = '';
      this.csvInput    = SAMPLE_CSV;
      this.tickerSymbol = 'HUG.TO';
      this.runSimulation();
    },

    async loadFromYahoo() {
      const symbol = this.yahooSymbol?.trim();
      if (!symbol) return;
      this.yahooError = '';
      this.yahooLoading = true;
      try {
        const csv = await $fetch(`/api/yahoo-chart?symbol=${encodeURIComponent(symbol)}&months=2`, {
          responseType: 'text',
        });
        this.csvInput = csv;
        this.tickerSymbol = symbol;
        this.runSimulation();
      } catch (e) {
        const msg = e?.data?.message ?? e?.message ?? e?.statusMessage ?? 'Failed to load data from Yahoo';
        this.yahooError = typeof msg === 'string' ? msg : 'Failed to load data from Yahoo';
      } finally {
        this.yahooLoading = false;
      }
    },

    runSimulation() {
      this.parseError = '';
      this.yahooError = '';
      this.didRun     = true;
      this.expanded   = null;

      try {
        const raw = parseCSV(this.csvInput);
        // Sort ascending (oldest first); detect if data came in descending
        const sorted = raw[0] && raw[1] && new Date(raw[0].date) > new Date(raw[1].date)
          ? [...raw].reverse() : raw;

        this.parsedData = sorted;
        const algo = getAlgorithmById(this.selectedAlgorithmId);
        this.allResults = algo.run(sorted);
      } catch (e) {
        this.parseError = e.message;
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.simulator {
  position: relative;
  font-family: 'Syne', sans-serif;
  background: #080c14;
  min-height: 100vh;
  color: #c8d6e8;
  padding: 32px 40px 48px;
  overflow-x: hidden;
}

/* ── Background Grid ── */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(30, 200, 120, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 200, 120, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}
.simulator > * { position: relative; z-index: 1; }

/* ── Header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.header-left { display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ticker-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0a2a1a, #0d3b28);
  border: 1px solid #1ec87840;
  border-radius: 8px;
  padding: 10px 18px;
}
.ticker-symbol { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; color: #1ec878; letter-spacing: 2px; }
.ticker-dot { width: 8px; height: 8px; border-radius: 50%; background: #1ec878; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
.header-text h1 { font-size: 22px; font-weight: 800; color: #e8f4ff; letter-spacing: -.5px; }
.header-text p  { font-size: 12px; color: #4a6a8a; margin-top: 2px; font-family: 'Space Mono', monospace; }

.algo-select-wrap { display: flex; align-items: center; gap: 8px; }
.algo-label { font-family: 'Space Mono', monospace; font-size: 10px; color: #4a6a8a; font-weight: 700; letter-spacing: 1px; white-space: nowrap; }
.algo-select {
  padding: 6px 10px; border-radius: 6px; border: 1px solid #1a2d42;
  background: #0d1a28; color: #c8d6e8; font-family: 'Space Mono', monospace;
  font-size: 11px; cursor: pointer; outline: none; min-width: 140px;
}
.algo-select:hover { border-color: #1ec87840; }
.algo-select:focus { border-color: #1ec87860; }

.filter-tabs { display: flex; gap: 6px; }
.filter-btn {
  padding: 7px 18px; border-radius: 6px; border: 1px solid #1a2d42;
  background: #0d1a28; color: #4a6a8a; font-family: 'Space Mono', monospace;
  font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 1px;
  transition: all .2s;
}
.filter-btn:hover { border-color: #1ec87840; color: #1ec878; }
.filter-btn.active { background: #0a2a1a; border-color: #1ec878; color: #1ec878; }

/* ── Input Panel ── */
.input-panel {
  background: #0d1a28;
  border: 1px solid #1a2d42;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
}
.input-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.input-label { font-family: 'Space Mono', monospace; font-size: 11px; color: #1ec878; font-weight: 700; letter-spacing: 2px; }
.input-hint  { font-family: 'Space Mono', monospace; font-size: 11px; color: #3a5a7a; flex: 1; }
.load-btn {
  padding: 6px 14px; border-radius: 6px; border: 1px solid #1a3a5a;
  background: #0a1e30; color: #6ab0e0; font-family: 'Space Mono', monospace;
  font-size: 11px; cursor: pointer; font-weight: 700; letter-spacing: 1px;
  transition: all .2s;
}
.load-btn:hover { border-color: #4a8ab0; color: #90c8f0; }
.load-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.load-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.yahoo-load { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.yahoo-symbol-input {
  width: 140px; padding: 6px 10px; border-radius: 6px; border: 1px solid #1a3a5a;
  background: #0a1e30; color: #c8d6e8; font-family: 'Space Mono', monospace;
  font-size: 11px; outline: none;
}
.yahoo-symbol-input::placeholder { color: #3a5a7a; }
.yahoo-symbol-input:focus { border-color: #1ec87840; }
.load-btn-yahoo { flex-shrink: 0; }
.yahoo-error { font-family: 'Space Mono', monospace; font-size: 11px; color: #f05a5a; margin-top: 8px; }
.csv-area {
  width: 100%;
  background: #060e18;
  border: 1px solid #1a2d42;
  border-radius: 8px;
  color: #6ab0e0;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  padding: 12px;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color .2s;
}
.csv-area:focus { border-color: #1ec87840; }
.input-footer { display: flex; align-items: center; gap: 12px; margin-top: 10px; flex-wrap: wrap; }
.parse-error { font-family: 'Space Mono', monospace; font-size: 11px; color: #f05a5a; flex: 1; }
.parse-ok    { font-family: 'Space Mono', monospace; font-size: 11px; color: #1ec878; flex: 1; }
.run-btn {
  padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #0d3b28, #1a5a3a);
  color: #1ec878; font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
  letter-spacing: 2px; transition: all .2s; border: 1px solid #1ec87850;
}
.run-btn:hover:not(:disabled) { background: linear-gradient(135deg, #1a5a3a, #0d3b28); box-shadow: 0 0 20px #1ec87830; }
.run-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 4px 0;
}
.stat-card {
  background: #0d1a28;
  border-radius: 10px;
  padding: 16px;
  border-left: 3px solid transparent;
  border-top: 1px solid #1a2d42;
  border-right: 1px solid #1a2d42;
  border-bottom: 1px solid #1a2d42;
}
.accent-green  { border-left-color: #1ec878; }
.accent-purple { border-left-color: #8b5cf6; }
.accent-amber  { border-left-color: #f59e0b; }
.accent-blue   { border-left-color: #3b82f6; }
.stat-label { font-size: 11px; color: #4a6a8a; font-family: 'Space Mono', monospace; letter-spacing: 1px; margin-bottom: 6px; }
.stat-value { font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
.accent-green  .stat-value { color: #1ec878; }
.accent-purple .stat-value { color: #8b5cf6; }
.accent-amber  .stat-value { color: #f59e0b; }
.accent-blue   .stat-value { color: #3b82f6; }
.stat-sub { font-size: 11px; color: #4a6a8a; margin-bottom: 10px; }
.stat-bar { height: 3px; background: #1a2d42; border-radius: 2px; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width .8s ease; }
.stat-bar-fill.green  { background: #1ec878; }
.stat-bar-fill.purple { background: #8b5cf6; }
.stat-bar-fill.amber  { background: #f59e0b; }
.stat-bar-fill.blue   { background: #3b82f6; }

/* ── Algorithm Panel ── */
.algo-panel {
  background: #0d1a28;
  border: 1px solid #1a2d42;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 20px;
}
.algo-title { font-family: 'Space Mono', monospace; font-size: 11px; color: #1ec878; font-weight: 700; letter-spacing: 3px; margin-bottom: 14px; }
.algo-steps { display: flex; align-items: center; gap: 0; }
.algo-step { flex: 1; display: flex; gap: 14px; align-items: flex-start; }
.algo-divider { font-size: 20px; color: #1a3a5a; padding: 0 16px; }
.step-num { font-family: 'Space Mono', monospace; font-size: 28px; font-weight: 700; color: #1a2d42; line-height: 1; }
.step-name { font-size: 14px; font-weight: 700; color: #c8d6e8; margin-bottom: 4px; }
.step-desc { font-family: 'Space Mono', monospace; font-size: 11px; color: #4a6a8a; margin-bottom: 8px; }
.step-signals { display: flex; flex-direction: column; gap: 4px; }
.sig { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; width: fit-content; }
.sig.up        { background: rgba(30,200,120,.12); color: #1ec878; }
.sig.down      { background: rgba(240,90,90,.12); color: #f05a5a; }
.sig.confirmed { background: rgba(139,92,246,.12); color: #a78bfa; }
.sig.conflict  { background: rgba(245,158,11,.12); color: #f59e0b; }

/* ── Table ── */
.table-section {
  background: #0d1a28;
  border: 1px solid #1a2d42;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}
.table-header {
  padding: 14px 20px;
  border-bottom: 1px solid #1a2d42;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #1ec878;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-hint { color: #3a5a7a; letter-spacing: 0; font-size: 10px; }
.table-wrap { overflow-x: auto; }

.results-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.results-table thead tr { background: #060e18; }
.results-table th {
  padding: 10px 12px; text-align: left;
  font-family: 'Space Mono', monospace; font-size: 10px;
  color: #3a5a7a; font-weight: 700; letter-spacing: 1px;
  white-space: nowrap; border-bottom: 1px solid #1a2d42;
}

.result-row {
  cursor: pointer;
  transition: background .15s;
  border-bottom: 1px solid #0d1a28;
}
.result-row:hover { background: #111e2e !important; }
.result-row.hit   { background: rgba(30,200,120,.04); }
.result-row.miss  { background: rgba(240,90,90,.04); }
.result-row.confirmed.hit  { background: rgba(139,92,246,.06); }
.result-row.expanded { background: #111e2e !important; }

.results-table td { padding: 9px 12px; vertical-align: middle; }

.mono  { font-family: 'Space Mono', monospace; font-size: 11px; }
.bold  { font-weight: 700; }
.date-cell { font-family: 'Space Mono', monospace; font-size: 11px; color: #6a8ab0; font-weight: 700; white-space: nowrap; }
.text-green { color: #1ec878; }
.text-red   { color: #f05a5a; }
.text-muted { color: #3a5a7a; }
.text-purple { color: #a78bfa; }
.text-amber  { color: #f59e0b; }

.badge {
  display: inline-block;
  padding: 3px 8px; border-radius: 4px;
  font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .5px;
  white-space: nowrap;
}
.badge-confirmed { background: rgba(139,92,246,.15); color: #a78bfa; }
.badge-conflict  { background: rgba(245,158,11,.15); color: #f59e0b; }
.badge-up   { background: rgba(30,200,120,.15); color: #1ec878; }
.badge-down { background: rgba(240,90,90,.15); color: #f05a5a; }

.result-hit  { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #1ec878; }
.result-miss { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: #f05a5a; }

/* ── Detail Row ── */
.detail-row td { background: #070f1a; padding: 0; }
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 20px;
}
.detail-card {
  background: #0d1a28;
  border: 1px solid #1a2d42;
  border-radius: 8px;
  padding: 12px 14px;
}
.detail-title { font-family: 'Space Mono', monospace; font-size: 10px; color: #3a5a7a; letter-spacing: 2px; font-weight: 700; margin-bottom: 10px; }
.detail-line  { font-size: 12px; color: #8aa8c8; margin-bottom: 5px; }
.detail-signal { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; margin-top: 8px; }

/* ── Timeline ── */
.timeline-section {
  background: #0d1a28;
  border: 1px solid #1a2d42;
  border-radius: 12px;
  padding: 18px 20px;
}
.timeline-header {
  font-family: 'Space Mono', monospace;
  font-size: 11px; color: #1ec878; letter-spacing: 2px;
  margin-bottom: 14px;
}
.timeline-hint { color: #3a5a7a; letter-spacing: 0; font-size: 10px; margin-left: 12px; }
.timeline-strip { display: flex; flex-wrap: wrap; gap: 6px; }

.timeline-tile {
  width: 46px; height: 46px;
  border-radius: 6px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; position: relative;
  border: 1px solid #1a2d42;
  transition: transform .1s, box-shadow .1s;
}
.timeline-tile:hover { transform: translateY(-2px); }
.tile-hit  { background: rgba(30,200,120,.1); }
.tile-miss { background: rgba(240,90,90,.1); }
.tile-confirmed.tile-hit  { border: 2px solid #1ec878; }
.tile-confirmed.tile-miss { border: 2px solid #f05a5a; }

.tile-arrow { font-size: 14px; font-weight: 700; line-height: 1; }
.tile-hit  .tile-arrow { color: #1ec878; }
.tile-miss .tile-arrow { color: #f05a5a; }

.tile-date { font-family: 'Space Mono', monospace; font-size: 9px; color: #4a6a8a; margin-top: 2px; }
.tile-star { position: absolute; top: 2px; right: 4px; font-size: 9px; color: #8b5cf6; }

.timeline-legend { display: flex; gap: 20px; margin-top: 14px; font-family: 'Space Mono', monospace; font-size: 10px; color: #3a5a7a; flex-wrap: wrap; }
.leg-green  { color: #1ec878; }
.leg-red    { color: #f05a5a; }
.leg-purple { color: #8b5cf6; }

.empty-state {
  text-align: center;
  padding: 60px;
  font-family: 'Space Mono', monospace;
  color: #3a5a7a;
  font-size: 13px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .stats-grid   { grid-template-columns: repeat(2, 1fr); }
  .algo-steps   { flex-direction: column; }
  .algo-divider { transform: rotate(90deg); padding: 8px 0; }
  .detail-grid  { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .simulator    { padding: 20px 16px 32px; }
  .stats-grid   { grid-template-columns: 1fr; }
  .header       { flex-direction: column; align-items: flex-start; }
}
</style>
