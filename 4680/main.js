// 4680 - a 90 year life calendar. One square per week: 90 rows of 52.

var YEARS = 90;
var WEEKS_PER_YEAR = 52;
var TOTAL_WEEKS = YEARS * WEEKS_PER_YEAR; // 4680
var ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;
var STORAGE_KEY = '4680-life-calendar';

var SQ_SIZE = 8;
var STEP = 12;     // square size + gap
var MARGIN = 12;   // space around the grid
var AXIS_W = 30;   // room for year labels on the right

var COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231',
              '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe',
              '#008080', '#e6beff', '#aa6e28', '#fffac8', '#800000',
              '#aaffc3', '#808000', '#ffd8b1', '#000080', '#808080'];
// Grid colors follow the browser's light/dark setting.
var LIGHT_GRID = { lived: '#bbb', empty: 'white', now: '#222', stroke: '#555', axis: '#aaa' };
var DARK_GRID  = { lived: '#7a7a7a', empty: '#1c1c1c', now: '#f0f0f0', stroke: '#3c3c3c', axis: '#888' };
var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function grid() { return darkQuery && darkQuery.matches ? DARK_GRID : LIGHT_GRID; }

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var tooltip = document.getElementById('tooltip');

var state = { birthdate: null, events: [] };

// ---------- dates ----------

function parseDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  var d = new Date(str + 'T00:00:00Z');
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

// Week index of `date` counted from the birthdate (can be negative).
function weekIndex(date) {
  return Math.floor((date.getTime() - state.birthdate.getTime()) / ONE_WEEK_MS);
}

function weekToDate(i) {
  return new Date(state.birthdate.getTime() + i * ONE_WEEK_MS);
}

// ---------- storage ----------

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      birthdate: state.birthdate ? formatDate(state.birthdate) : null,
      events: state.events.map(function (e) {
        return { start: formatDate(e.start), end: formatDate(e.end), label: e.label, color: e.color };
      })
    }));
  } catch (err) { /* storage unavailable: keep working in memory */ }
}

function load() {
  try {
    var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;
    state.birthdate = data.birthdate ? parseDate(data.birthdate) : null;
    state.events = (data.events || []).map(function (e) {
      return { start: parseDate(e.start), end: parseDate(e.end), label: e.label, color: e.color };
    }).filter(function (e) { return e.start && e.end; });
  } catch (err) { /* ignore bad or missing data */ }
}

// ---------- drawing ----------

function setupCanvas() {
  var w = MARGIN * 2 + WEEKS_PER_YEAR * STEP + AXIS_W;
  var h = MARGIN * 2 + YEARS * STEP;
  var dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function square(i, color) {
  var x = MARGIN + (i % WEEKS_PER_YEAR) * STEP + 0.5;
  var y = MARGIN + Math.floor(i / WEEKS_PER_YEAR) * STEP + 0.5;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, SQ_SIZE, SQ_SIZE);
  ctx.lineWidth = 1;
  ctx.strokeStyle = grid().stroke;
  ctx.strokeRect(x, y, SQ_SIZE, SQ_SIZE);
}

function axisLabel(year) {
  ctx.font = '12px Arial';
  ctx.fillStyle = grid().axis;
  ctx.textBaseline = 'middle';
  ctx.fillText(String(year), MARGIN + WEEKS_PER_YEAR * STEP + 6,
               MARGIN + (year - 1) * STEP + SQ_SIZE / 2);
}

// Color for every week: lived weeks are grey, event weeks take the event color.
function weekColors() {
  var colors = new Array(TOTAL_WEEKS).fill(grid().empty);
  if (!state.birthdate) return colors;

  var now = weekIndex(new Date());
  for (var i = 0; i < Math.min(now, TOTAL_WEEKS); i++) colors[i] = grid().lived;

  state.events.forEach(function (e) {
    var from = Math.max(0, weekIndex(e.start));
    var to = Math.min(TOTAL_WEEKS - 1, weekIndex(e.end));
    for (var k = from; k <= to; k++) colors[k] = e.color;
  });

  if (now >= 0 && now < TOTAL_WEEKS) colors[now] = grid().now;
  return colors;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var colors = weekColors();
  for (var i = 0; i < TOTAL_WEEKS; i++) square(i, colors[i]);
  axisLabel(1);
  for (var y = 5; y <= YEARS; y += 5) axisLabel(y);
}

// ---------- page ----------

function showMessage(text, ok) {
  var el = document.getElementById('message');
  el.textContent = text || '';
  el.className = ok ? 'ok' : '';
}

function nextColor() {
  var used = state.events.map(function (e) { return e.color; });
  var free = COLORS.filter(function (c) { return used.indexOf(c) === -1; });
  return free.length ? free[0] : COLORS[state.events.length % COLORS.length];
}

function renderEvents() {
  var tbody = document.querySelector('#myEvents tbody');
  tbody.innerHTML = '';
  state.events.forEach(function (e, idx) {
    var row = tbody.insertRow();
    var swatch = row.insertCell();
    swatch.className = 'swatch';
    swatch.style.backgroundColor = e.color;
    row.insertCell().textContent = e.label;
    var dates = row.insertCell();
    dates.className = 'dates';
    dates.textContent = formatDate(e.start) + ' → ' + formatDate(e.end);
    var btn = document.createElement('button');
    btn.className = 'remove';
    btn.title = 'Remove event';
    btn.textContent = '×';
    btn.onclick = function () { removeEvent(idx); };
    row.insertCell().appendChild(btn);
  });
  document.getElementById('myEvents').hidden = state.events.length === 0;
}

function renderStats() {
  var el = document.getElementById('stats');
  if (!state.birthdate) {
    el.textContent = 'Set your birthdate to see the weeks you have lived.';
    return;
  }
  var lived = Math.max(0, Math.min(weekIndex(new Date()), TOTAL_WEEKS));
  var pct = (lived / TOTAL_WEEKS * 100).toFixed(1);
  el.textContent = lived + ' weeks lived · ' + (TOTAL_WEEKS - lived) +
                   ' weeks left · ' + pct + '% of 90 years';
}

function render() {
  renderEvents();
  renderStats();
  draw();
}

function setBirth(evt) {
  if (evt) evt.preventDefault();
  var d = parseDate(document.getElementById('birthdate').value);
  if (!d) return showMessage('Please enter a valid birthdate.');
  if (d > new Date()) return showMessage('Birthdate cannot be in the future.');
  showMessage('');
  state.birthdate = d;
  save();
  render();
}

function addEvent(evt) {
  if (evt) evt.preventDefault();
  if (!state.birthdate) return showMessage('Set your birthdate first.');
  var start = parseDate(document.getElementById('ev_start').value);
  var end = parseDate(document.getElementById('ev_end').value);
  var label = document.getElementById('ev_label').value.trim();
  if (!start || !end) return showMessage('Please enter valid start and end dates.');
  if (end < start) return showMessage('End date must be on or after the start date.');
  if (!label) return showMessage('Please enter a label.');
  showMessage('');

  state.events.push({ start: start, end: end, label: label, color: nextColor() });
  state.events.sort(function (a, b) { return a.start - b.start; });
  document.getElementById('event_input').reset();
  save();
  render();
}

function removeEvent(idx) {
  state.events.splice(idx, 1);
  save();
  render();
}

// ---------- import / export ----------
// File format (CSV, one row per line; header row required):
//   type,start,end,label,color
//   birthdate,1990-06-15,,,
//   event,1996-09-01,2008-06-15,School,#e6194b
// "color" is optional. Blank rows are ignored. JSON exports of the same
// shape ({birthdate, events:[{start,end,label,color}]}) are accepted too.

var CSV_HEADER = 'type,start,end,label,color';

var TEMPLATE_CSV = [
  CSV_HEADER,
  'birthdate,,,,',
  'event,,,,', 'event,,,,', 'event,,,,', 'event,,,,', 'event,,,,'
].join('\n') + '\n';

var SAMPLE_CSV = [
  CSV_HEADER,
  'birthdate,1990-06-15,,,',
  'event,1996-09-01,2008-06-15,School,',
  'event,2008-09-01,2012-05-20,University,',
  'event,2012-07-01,2019-03-01,First job,',
  'event,2019-04-01,2026-11-01,"Living abroad, Lisbon",'
].join('\n') + '\n';

// Minimal CSV parser: handles quoted fields, "" escapes and CRLF.
function parseCSV(text) {
  var rows = [], row = [], field = '', quoted = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvField(v) {
  v = String(v == null ? '' : v);
  return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}

// Accepts YYYY-MM-DD or YYYY/MM/DD (some spreadsheet apps save slashes).
function parseLooseDate(str) {
  return parseDate(String(str || '').trim().replace(/\//g, '-').replace(/^(\d{4})-(\d)-/, '$1-0$2-').replace(/-(\d)$/, '-0$1'));
}

// Turns file text into {birthdate, events, errors}.
function readImport(text) {
  text = text.replace(/^﻿/, ''); // strip Excel's byte-order mark
  var out = { birthdate: null, events: [], errors: [] };
  var trimmed = text.trim();

  if (trimmed.charAt(0) === '{') {
    var data = JSON.parse(trimmed);
    if (data.birthdate) out.birthdate = parseLooseDate(data.birthdate);
    (data.events || []).forEach(function (e, i) {
      addImported(out, e.start, e.end, e.label, e.color, 'event ' + (i + 1));
    });
    return out;
  }

  var rows = parseCSV(text);
  var header = (rows.shift() || []).map(function (h) { return h.trim().toLowerCase(); });
  var col = {};
  ['type', 'start', 'end', 'label', 'color'].forEach(function (k) { col[k] = header.indexOf(k); });
  if (col.start === -1) throw new Error('Missing header row. The first line should be: ' + CSV_HEADER);

  rows.forEach(function (r, i) {
    var get = function (k) { return col[k] === -1 ? '' : (r[col[k]] || '').trim(); };
    var line = 'line ' + (i + 2);
    var type = get('type').toLowerCase() || 'event';
    if (!get('start') && !get('end') && !get('label')) return; // blank row
    if (type === 'birthdate' || type === 'birthday' || type === 'birth') {
      var b = parseLooseDate(get('start'));
      if (b) out.birthdate = b;
      else out.errors.push(line + ': invalid birthdate "' + get('start') + '"');
    } else {
      addImported(out, get('start'), get('end'), get('label'), get('color'), line);
    }
  });
  return out;
}

function addImported(out, s, e, label, color, where) {
  var start = parseLooseDate(s);
  var end = parseLooseDate(e || s); // a missing end date means a one-day event
  label = String(label || '').trim();
  if (!start) return out.errors.push(where + ': invalid start date "' + (s || '') + '"');
  if (!end) return out.errors.push(where + ': invalid end date "' + e + '"');
  if (end < start) return out.errors.push(where + ': end date is before start date');
  if (!label) return out.errors.push(where + ': missing label');
  color = /^#[0-9a-f]{6}$/i.test(String(color || '').trim()) ? color.trim() : null;
  out.events.push({ start: start, end: end, label: label, color: color });
}

function importText(text) {
  var data;
  try { data = readImport(text); }
  catch (err) { return showMessage('Could not read file: ' + err.message); }

  if (data.birthdate) {
    if (data.birthdate > new Date()) data.errors.push('birthdate is in the future, ignored');
    else {
      state.birthdate = data.birthdate;
      document.getElementById('birthdate').value = formatDate(data.birthdate);
    }
  }
  if (!state.birthdate) {
    return showMessage('No birthdate found. Add a "birthdate" row to the file or set it above first.');
  }

  var added = 0;
  data.events.forEach(function (e) {
    var dupe = state.events.some(function (x) {
      return x.label === e.label && +x.start === +e.start && +x.end === +e.end;
    });
    if (dupe) return;
    e.color = e.color || nextColor();
    state.events.push(e);
    added++;
  });
  state.events.sort(function (a, b) { return a.start - b.start; });
  save();
  render();

  var msg = 'Imported ' + added + ' event' + (added === 1 ? '' : 's') + '.';
  if (data.errors.length) {
    showMessage(msg + ' Skipped ' + data.errors.length + ': ' + data.errors.join('; '));
  } else {
    showMessage(msg, true);
  }
}

function exportCSV() {
  var lines = [CSV_HEADER];
  if (state.birthdate) lines.push('birthdate,' + formatDate(state.birthdate) + ',,,');
  state.events.forEach(function (e) {
    lines.push(['event', formatDate(e.start), formatDate(e.end), e.label, e.color].map(csvField).join(','));
  });
  return lines.join('\n') + '\n';
}

function download(filename, text) {
  var blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function clearAll() {
  if (!confirm('Remove your birthdate and all events?')) return;
  state.birthdate = null;
  state.events = [];
  document.getElementById('birthdate').value = '';
  save();
  render();
  showMessage('Cleared.', true);
}

function onHover(evt) {
  if (!state.birthdate) { tooltip.hidden = true; return; }
  var rect = canvas.getBoundingClientRect();
  var scale = rect.width / parseFloat(canvas.style.width);
  var x = (evt.clientX - rect.left) / scale - MARGIN;
  var y = (evt.clientY - rect.top) / scale - MARGIN;
  var col = Math.floor(x / STEP), row = Math.floor(y / STEP);
  if (x < 0 || y < 0 || col >= WEEKS_PER_YEAR || row >= YEARS) { tooltip.hidden = true; return; }

  var i = row * WEEKS_PER_YEAR + col;
  var date = weekToDate(i);
  var text = 'Age ' + row + ', week ' + (col + 1) + ' · ' + formatDate(date);
  state.events.forEach(function (e) {
    if (i >= weekIndex(e.start) && i <= weekIndex(e.end)) text += ' · ' + e.label;
  });
  tooltip.textContent = text;
  tooltip.style.left = (evt.clientX - rect.left) + 'px';
  tooltip.style.top = (evt.clientY - rect.top) + 'px';
  tooltip.hidden = false;
}

function main() {
  load();
  if (state.birthdate) document.getElementById('birthdate').value = formatDate(state.birthdate);
  document.getElementById('bday_input').addEventListener('submit', setBirth);
  document.getElementById('event_input').addEventListener('submit', addEvent);
  var fileInput = document.getElementById('file_input');
  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    if (!file) return;
    file.text().then(importText);
    fileInput.value = ''; // allow importing the same file again
  });
  document.querySelector('label[for=file_input]').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  document.getElementById('btn_export').onclick = function () {
    download('4680-life-calendar.csv', exportCSV());
  };
  document.getElementById('btn_template').onclick = function () {
    download('4680-template.csv', TEMPLATE_CSV);
  };
  document.getElementById('btn_sample').onclick = function () {
    download('4680-sample.csv', SAMPLE_CSV);
  };
  document.getElementById('btn_clear').onclick = clearAll;
  canvas.addEventListener('mousemove', onHover);
  canvas.addEventListener('mouseleave', function () { tooltip.hidden = true; });
  if (darkQuery) {
    // Redraw when the system switches between light and dark (older Safari only has addListener).
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', draw);
    else if (darkQuery.addListener) darkQuery.addListener(draw);
  }
  setupCanvas();
  render();
}

main();
