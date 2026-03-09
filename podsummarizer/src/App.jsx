import { useState, useCallback, useRef } from "react";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs";

const css = String.raw;

const G = css`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #F4F6FA;
    --surface:  #FFFFFF;
    --card:     #FFFFFF;
    --border:   #E2E8F2;
    --border2:  #CBD5E8;
    --text:     #0F172A;
    --text2:    #475569;
    --text3:    #94A3B8;
    --blue:     #2563EB;
    --blue-lt:  #EFF6FF;
    --blue-mid: #BFDBFE;
    --indigo:   #4F46E5;
    --green:    #059669;
    --green-lt: #ECFDF5;
    --amber:    #D97706;
    --amber-lt: #FFFBEB;
    --red:      #DC2626;
    --red-lt:   #FEF2F2;
    --orange:   #EA580C;
    --orange-lt:#FFF7ED;
    --purple:   #7C3AED;
    --purple-lt:#F5F3FF;
    --shadow-sm:0 1px 3px rgba(15,23,42,.07), 0 1px 2px rgba(15,23,42,.04);
    --shadow:   0 4px 16px rgba(15,23,42,.08), 0 1px 4px rgba(15,23,42,.04);
    --shadow-lg:0 8px 32px rgba(15,23,42,.10), 0 2px 8px rgba(15,23,42,.06);
    --radius:   12px;
    --radius-sm:8px;
  }

  body, #root {
    min-height: 100vh; width: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 200;
    box-shadow: var(--shadow-sm);
  }

  .logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(37,99,235,.30);
  }
  .logo svg { width: 18px; height: 18px; color: #fff; }

  .brand { display: flex; flex-direction: column; gap: 1px; }
  .brand-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -.02em; }
  .brand-tag { font-size: 10px; font-weight: 500; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; }

  .divider-v { width: 1px; height: 28px; background: var(--border); margin: 0 8px; }

  .nav-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: var(--blue-lt);
    color: var(--blue);
    border-radius: 99px;
    font-size: 11px; font-weight: 600; letter-spacing: .02em;
  }
  .nav-chip-dot { width: 6px; height: 6px; background: var(--blue); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(.8); } }

  .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

  .export-btn {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%);
    border: none; border-radius: var(--radius-sm); padding: 9px 18px;
    color: #fff; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 12px;
    letter-spacing: .01em; cursor: pointer;
    box-shadow: 0 2px 8px rgba(37,99,235,.30); transition: all .18s ease;
  }
  .export-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,.40); }
  .export-btn:active { transform: translateY(0); }
  .export-btn svg { width: 14px; height: 14px; }

  .main { flex: 1; padding: 32px 40px 48px; max-width: 1280px; margin: 0 auto; width: 100%; }

  .upload-section { margin-bottom: 28px; }
  .upload-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; display: block; }

  .dropzone {
    background: var(--surface); border: 2px dashed var(--border2);
    border-radius: var(--radius); padding: 40px; text-align: center;
    cursor: pointer; transition: all .2s ease; position: relative; overflow: hidden;
  }
  .dropzone::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,.04) 0%, transparent 60%); pointer-events: none; }
  .dropzone:hover, .dropzone.drag { border-color: var(--blue); background: var(--blue-lt); box-shadow: 0 0 0 4px rgba(37,99,235,.08); }

  .dz-inner { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .dz-icon-wrap { width: 52px; height: 52px; background: var(--blue-lt); border: 1px solid var(--blue-mid); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; transition: all .2s; }
  .dropzone.drag .dz-icon-wrap { background: var(--blue); border-color: var(--blue); }
  .dz-icon-wrap svg { width: 22px; height: 22px; color: var(--blue); transition: color .2s; }
  .dropzone.drag .dz-icon-wrap svg { color: #fff; }
  .dz-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .dz-sub { font-size: 12px; color: var(--text3); max-width: 400px; }

  .file-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--green-lt); color: var(--green); border: 1px solid #A7F3D0; border-radius: 99px; padding: 4px 14px; font-size: 11px; font-weight: 600; margin-top: 4px; }
  .file-badge svg { width: 12px; height: 12px; }

  .alert { display: flex; gap: 12px; align-items: flex-start; border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.7; border: 1px solid; }
  .alert-icon { flex-shrink: 0; margin-top: 1px; }
  .alert-icon svg { width: 16px; height: 16px; }
  .alert.warn  { background: var(--amber-lt); color: var(--amber); border-color: #FDE68A; }
  .alert.err   { background: var(--red-lt);   color: var(--red);   border-color: #FECACA; }
  .alert.merge { background: var(--purple-lt);color: var(--purple);border-color: #DDD6FE; }
  .alert-title { font-weight: 700; margin-bottom: 4px; }
  .alert-list  { color: inherit; opacity: .85; }

  .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  @media(max-width:800px) { .stat-row { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:500px) { .stat-row { grid-template-columns: 1fr; } }

  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 24px; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 16px; transition: box-shadow .18s, transform .18s; }
  .stat-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
  .stat-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-icon svg { width: 20px; height: 20px; }
  .stat-num { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; line-height: 1; letter-spacing: -.02em; }
  .stat-label { font-size: 11px; font-weight: 500; color: var(--text3); letter-spacing: .04em; text-transform: uppercase; margin-top: 4px; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .section-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text3); }
  .section-count { font-size: 11px; font-weight: 600; color: var(--text3); font-family: 'JetBrains Mono', monospace; }

  .branch-block { margin-bottom: 20px; }
  .branch-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; transition: box-shadow .2s; }
  .branch-card:hover { box-shadow: var(--shadow); }

  .branch-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); background: var(--bg); flex-wrap: wrap; gap: 10px; }
  .branch-left { display: flex; align-items: center; gap: 10px; }
  .branch-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .branch-name { font-weight: 700; font-size: 14px; letter-spacing: -.01em; }
  .branch-pill { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 99px; font-size: 10px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; border: 1px solid; }
  .branch-stats { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .branch-stat-item { text-align: right; }
  .branch-stat-num { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; line-height: 1; }
  .branch-stat-lbl { font-size: 10px; font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: .04em; margin-top: 2px; }
  .branch-vdiv { width: 1px; height: 32px; background: var(--border); }

  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th { padding: 10px 16px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text3); background: var(--bg); border-bottom: 1px solid var(--border); white-space: nowrap; }
  thead th:first-child { width: 48px; text-align: center; }
  thead th.center { text-align: center; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover td { background: #F8FAFF; }
  tbody td { padding: 13px 16px; color: var(--text); vertical-align: middle; }
  tbody td:first-child { text-align: center; }

  .row-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text3); font-weight: 500; }
  .rider-name { font-weight: 600; font-size: 13.5px; }
  .rider-alias { font-size: 10px; color: var(--purple); font-weight: 500; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

  .hit-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 99px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
  .hit-badge svg { width: 12px; height: 12px; }

  .date-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .date-tag { padding: 3px 8px; border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; border: 1px solid; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; }
  .date-tag.hot { background: #ECFDF5 !important; color: #065F46 !important; border-color: #6EE7B7 !important; position: relative; }
  .date-tag.hot::before { content: '🔥'; font-size: 9px; }

  /* Reward badge */
  .reward-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 99px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
  .reward-badge.split { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
  .reward-badge svg { width: 12px; height: 12px; }

  /* Reward breakdown tooltip area */
  .reward-breakdown { font-size: 10px; color: var(--text3); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
  .reward-breakdown .hot-day { color: #059669; font-weight: 700; }
  .reward-breakdown .solo-day { color: #2563EB; }

  .tr-total td { background: var(--bg) !important; font-weight: 700; font-size: 12px; letter-spacing: .02em; padding: 11px 16px; }

  /* Rewards summary section */
  .rewards-section { margin-bottom: 28px; }
  .rewards-banner {
    background: linear-gradient(135deg, #064E3B 0%, #065F46 60%, #047857 100%);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 16px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 4px 20px rgba(5,150,105,.25);
  }
  .rewards-banner-left { display: flex; align-items: center; gap: 14px; }
  .rewards-banner-icon { width: 44px; height: 44px; background: rgba(255,255,255,.15); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .rewards-banner-title { font-size: 16px; font-weight: 700; color: #fff; }
  .rewards-banner-sub { font-size: 11px; color: rgba(255,255,255,.65); margin-top: 2px; }
  .rewards-banner-total { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -.02em; }
  .rewards-banner-total span { font-size: 16px; opacity: .7; font-weight: 500; }

  .rewards-legend { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .legend-pill { display: flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 600; border: 1px solid; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  .empty-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; box-shadow: var(--shadow-sm); }
  .how-title { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--blue); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .how-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .how-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .how-card { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; transition: border-color .2s, box-shadow .2s; }
  .how-card:hover { border-color: var(--blue-mid); box-shadow: 0 0 0 3px rgba(37,99,235,.06); }
  .how-card-icon { width: 34px; height: 34px; background: var(--blue-lt); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-bottom: 10px; }
  .how-card-title { font-weight: 700; font-size: 12.5px; margin-bottom: 5px; color: var(--text); }
  .how-card-desc { font-size: 11.5px; color: var(--text2); line-height: 1.6; }
  .col-detect { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; font-size: 12px; color: var(--text2); line-height: 2; }
  .col-kw { display: inline-block; background: var(--surface); border: 1px solid var(--border2); border-radius: 4px; padding: 0 6px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--text); font-weight: 600; margin: 1px 2px; }
`;

const PALETTE = [
  { dot: "#2563EB", pill: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" }, hit: { bg: "#EFF6FF", color: "#2563EB" }, date: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" } },
  { dot: "#7C3AED", pill: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" }, hit: { bg: "#F5F3FF", color: "#7C3AED" }, date: { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" } },
  { dot: "#059669", pill: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" }, hit: { bg: "#ECFDF5", color: "#059669" }, date: { bg: "#ECFDF5", color: "#047857", border: "#A7F3D0" } },
  { dot: "#D97706", pill: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" }, hit: { bg: "#FFFBEB", color: "#D97706" }, date: { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" } },
  { dot: "#DC2626", pill: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" }, hit: { bg: "#FEF2F2", color: "#DC2626" }, date: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" } },
  { dot: "#0891B2", pill: { bg: "#ECFEFF", color: "#0891B2", border: "#A5F3FC" }, hit: { bg: "#ECFEFF", color: "#0891B2" }, date: { bg: "#ECFEFF", color: "#0E7490", border: "#A5F3FC" } },
  { dot: "#DB2777", pill: { bg: "#FDF2F8", color: "#DB2777", border: "#FBCFE8" }, hit: { bg: "#FDF2F8", color: "#DB2777" }, date: { bg: "#FDF2F8", color: "#BE185D", border: "#FBCFE8" } },
  { dot: "#EA580C", pill: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" }, hit: { bg: "#FFF7ED", color: "#EA580C" }, date: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" } },
];

// ─── FUZZY NAME MERGE ─────────────────────────────────────────────────────────
function normalizeName(n) {
  return String(n || "").toLowerCase().replace(/[\r\n]+/g, " ").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 999;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}
function isSamePerson(A, B) {
  const a = normalizeName(A), b = normalizeName(B);
  if (!a || !b) return false;
  if (a === b) return true;
  const ta = a.split(" "), tb = b.split(" ");
  if (ta.length < 2 || tb.length < 2) return false;
  if (ta[0] !== tb[0]) return false;
  const la = ta[ta.length - 1], lb = tb[tb.length - 1];
  if (la.length <= 4 || lb.length <= 4) return la === lb;
  return levenshtein(la, lb) <= 2 && Math.abs(a.length - b.length) <= 5;
}
function fuzzyMerge(entries) {
  const merged = [], log = [];
  for (const e of entries) {
    let found = false;
    for (const m of merged) {
      if (isSamePerson(m.rider, e.rider)) {
        if (normalizeName(m.rider) !== normalizeName(e.rider)) { m.aliases = m.aliases || new Set(); m.aliases.add(e.rider); }
        for (const d of e.dates) if (!m.dates.includes(d)) m.dates.push(d);
        if (e.rider.length > m.rider.length) { m.aliases = m.aliases || new Set(); m.aliases.add(m.rider); m.rider = e.rider; }
        found = true; break;
      }
    }
    if (!found) merged.push({ ...e, dates: [...e.dates], aliases: null });
  }
  for (const m of merged) {
    if (m.aliases?.size > 0) log.push({ canonical: m.rider, aliases: [...m.aliases] });
    m.aliases = m.aliases ? [...m.aliases] : [];
  }
  return { merged, log };
}

// ─── COLUMN DETECTION ─────────────────────────────────────────────────────────
function bestCol(headers, keywords) {
  let best = -1, bestScore = 0;
  headers.forEach((h, i) => {
    const hh = String(h || "").toLowerCase().trim();
    let score = 0;
    for (const kw of keywords) {
      if (hh === kw) score += 10;
      else if (hh.startsWith(kw) || hh.endsWith(kw)) score += 6;
      else if (hh.includes(kw)) score += 3;
    }
    if (score > bestScore) { bestScore = score; best = i; }
  });
  return bestScore > 0 ? best : -1;
}
function detectColumns(headers) {
  const branch   = bestCol(headers, ["branch","hub","area","zone","region","depot","store","site","location"]);
  const rider    = bestCol(headers, ["rider","courier","driver","agent","name","employee","staff","personnel"]);
  const podRate  = bestCol(headers, ["pod rate","pod%","pod %","delivery rate","success rate","completion rate","rate","%"]);
  const date     = bestCol(headers, ["date","day","period","week","month","timestamp","time"]);
  const podQty   = bestCol(headers, ["pod quantity","pod qty","pod count","pod delivered","pod scan","delivered qty","delivered quantity"]);
  const totalQty = bestCol(headers, ["delivery scan quantity","scan quantity","total scan","total quantity","delivery quantity","total parcels","waybill","total","quantity","qty","count"]);
  const safePodQty   = (podQty !== -1 && podQty !== totalQty) ? podQty : -1;
  const safeTotalQty = (totalQty !== -1 && totalQty !== podQty) ? totalQty : -1;
  return { branch, rider, podRate, date, podQty: safePodQty, totalQty: safeTotalQty };
}

function parseRate(val) {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") {
    if (val >= 0 && val <= 1)   return Math.round(val * 1000) / 10;
    if (val >= 0 && val <= 100) return Math.round(val * 10) / 10;
    return null;
  }
  const n = parseFloat(String(val).replace(/%/g, "").trim());
  if (isNaN(n)) return null;
  if (n >= 0 && n <= 1)   return Math.round(n * 1000) / 10;
  if (n >= 0 && n <= 100) return Math.round(n * 10) / 10;
  return null;
}

// ─── REWARDS COMPUTATION ──────────────────────────────────────────────────────
// Rules:
//  • Count how many riders hit 100% in a branch on a given day.
//  • < 3 riders that day  → each gets ₱100
//  • ≥ 3 riders that day  → pool = ₱300 ÷ number of riders that hit 100% that day (each rider gets equal share)
//
// Returns { riderRewards: Map<riderName, totalReward>, hotDates: Set<"branch|||date">, branchTotals: Map<branch, total>, grandTotal }
function computeRewards(branches) {
  // Step 1: build per-branch-per-date rider list
  // branchDateMap[branch][date] = [riderName, ...]
  const branchDateMap = {};
  for (const [branch, riders] of Object.entries(branches)) {
    branchDateMap[branch] = {};
    for (const rider of riders) {
      for (const date of rider.dates) {
        if (!branchDateMap[branch][date]) branchDateMap[branch][date] = [];
        branchDateMap[branch][date].push(rider.rider);
      }
    }
  }

  // Step 2: compute per-rider reward and collect hot dates
  // riderRewardMap[branch][riderName] = { total, breakdown: [{date, amount, isHot}] }
  const riderRewardMap = {};
  const hotDateSet = new Set(); // "branch|||date"
  const branchTotals = {};
  let grandTotal = 0;

  for (const [branch, dateMap] of Object.entries(branchDateMap)) {
    riderRewardMap[branch] = {};
    branchTotals[branch] = 0;

    for (const [date, riderNames] of Object.entries(dateMap)) {
      const count = riderNames.length;
      const isHot = count >= 3;
      const rewardEach = isHot ? (300 / count) : 100;

      if (isHot) hotDateSet.add(`${branch}|||${date}`);

      for (const riderName of riderNames) {
        if (!riderRewardMap[branch][riderName]) {
          riderRewardMap[branch][riderName] = { total: 0, breakdown: [] };
        }
        riderRewardMap[branch][riderName].total += rewardEach;
        riderRewardMap[branch][riderName].breakdown.push({ date, amount: rewardEach, isHot, ridersOnDate: count });
        branchTotals[branch] += rewardEach;
        grandTotal += rewardEach;
      }
    }
  }

  return { riderRewardMap, hotDateSet, branchTotals, grandTotal };
}

// ─── PROCESS SHEETS ───────────────────────────────────────────────────────────
function processSheets(workbook) {
  const allData = {};
  const warnings = [];
  const SKIP_RIDERS   = new Set(["rider","name","courier","driver","agent","employee","staff","personnel",""]);
  const SKIP_BRANCHES = new Set(["branch","hub","area","zone","region","none",""]);

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) continue;
    let raw;
    try { raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: true }); }
    catch { warnings.push(`Sheet "${sheetName}": could not parse, skipped.`); continue; }
    raw = raw.filter(r => r.some(c => c !== "" && c !== null && c !== undefined));
    if (raw.length < 2) { warnings.push(`Sheet "${sheetName}": too few rows, skipped.`); continue; }
    let headerIdx = 0, bestCount = 0;
    for (let i = 0; i < Math.min(8, raw.length); i++) {
      const cnt = raw[i].filter(c => c !== "").length;
      if (cnt > bestCount) { bestCount = cnt; headerIdx = i; }
    }
    const headers = raw[headerIdx];
    const cols = detectColumns(headers);
    if (cols.rider === -1)   { warnings.push(`Sheet "${sheetName}": no Rider/Name column — skipped.`); continue; }
    if (cols.podRate === -1) { warnings.push(`Sheet "${sheetName}": no POD Rate column — skipped.`); continue; }
    if (cols.branch === -1)  warnings.push(`Sheet "${sheetName}": no Branch column — using sheet name for all rows.`);
    const isFormatA = cols.podQty !== -1 && cols.totalQty !== -1;
    let lastBranch = sheetName;
    for (const row of raw.slice(headerIdx + 1)) {
      const branchRaw = cols.branch !== -1 ? String(row[cols.branch] ?? "").trim() : "";
      if (branchRaw && !SKIP_BRANCHES.has(branchRaw.toLowerCase())) lastBranch = branchRaw;
      const branch = lastBranch;
      const rider = String(row[cols.rider] ?? "").replace(/\u00A0/g," ").replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim();
      if (!rider) continue;
      if (SKIP_RIDERS.has(rider.toLowerCase())) continue;
      if (SKIP_BRANCHES.has(branch.toLowerCase())) continue;
      const rate = parseRate(row[cols.podRate]);
      if (rate === null) continue;
      const key = `${branch}|||${rider}`;
      let dateLabel = sheetName;
      if (cols.date !== -1) {
        const dv = row[cols.date];
        if (dv !== "" && dv !== null && dv !== undefined) {
          if (dv instanceof Date) {
            const mm = String(dv.getMonth()+1).padStart(2,"0");
            const dd = String(dv.getDate()).padStart(2,"0");
            const yy = dv.getFullYear();
            dateLabel = `${mm}/${dd}/${yy}`;
          } else { dateLabel = String(dv).trim() || sheetName; }
        }
      }
      if (isFormatA) {
        if (rate >= 99.9) {
          if (!allData[key]) allData[key] = { branch, rider, dates: [], failed: false };
          if (!allData[key].dates.includes(dateLabel)) allData[key].dates.push(dateLabel);
        }
      } else {
        if (!allData[key]) allData[key] = { branch, rider, dates: [], failed: false };
        if (rate >= 99.9) { if (!allData[key].dates.includes(dateLabel)) allData[key].dates.push(dateLabel); }
        else { allData[key].failed = true; }
      }
    }
  }

  const qualified = Object.values(allData).filter(e => !e.failed && e.dates.length > 0);
  const byBranch = {};
  for (const e of qualified) { if (!byBranch[e.branch]) byBranch[e.branch] = []; byBranch[e.branch].push(e); }
  const branches = {};
  const allMergeEvents = [];
  for (const [branch, entries] of Object.entries(byBranch)) {
    const { merged, log } = fuzzyMerge(entries);
    if (!merged.length) continue;
    merged.sort((a,b) => b.dates.length - a.dates.length || a.rider.localeCompare(b.rider));
    branches[branch] = merged;
    for (const evt of log) allMergeEvents.push({ branch, ...evt });
  }
  return { branches, warnings, mergeEvents: allMergeEvents };
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function exportXLSX(branches, sourceFileName) {
  const wb = XLSX.utils.book_new();
  const allRiders = Object.values(branches).flat();
  const totalHits = allRiders.reduce((s,r) => s + r.dates.length, 0);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const { riderRewardMap, hotDateSet, branchTotals, grandTotal } = computeRewards(branches);

  const sc = (ws, addr, v, s) => { ws[addr] = { ...(typeof v === "object" && v !== null && "v" in v ? v : { v, t: typeof v === "number" ? "n" : "s" }), s }; };
  const headerStyle = (bg,fg) => ({ font:{name:"Arial",bold:true,color:{rgb:fg||"FFFFFF"},sz:10}, fill:{patternType:"solid",fgColor:{rgb:bg}}, alignment:{horizontal:"center",vertical:"center"}, border:{top:{style:"thin",color:{rgb:"FFFFFF"}},bottom:{style:"thin",color:{rgb:"FFFFFF"}},left:{style:"thin",color:{rgb:"FFFFFF"}},right:{style:"thin",color:{rgb:"FFFFFF"}}} });
  const dataStyle = (bg,bold,align,color) => ({ font:{name:"Arial",sz:10,bold:!!bold,color:{rgb:color||"1E293B"}}, fill:{patternType:"solid",fgColor:{rgb:bg||"FFFFFF"}}, alignment:{horizontal:align||"left",vertical:"center",wrapText:true}, border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}} });

  const BRANCH_COLORS = [
    {header:"1E3A5F",headerFg:"FFFFFF",stripe:"EBF3FB",dot:"2563EB",subtotal:"DBEAFE"},
    {header:"3B1F6B",headerFg:"FFFFFF",stripe:"F3EEFF",dot:"7C3AED",subtotal:"EDE9FE"},
    {header:"064E3B",headerFg:"FFFFFF",stripe:"ECFDF5",dot:"059669",subtotal:"D1FAE5"},
    {header:"78350F",headerFg:"FFFFFF",stripe:"FFFBEB",dot:"D97706",subtotal:"FEF3C7"},
    {header:"7F1D1D",headerFg:"FFFFFF",stripe:"FEF2F2",dot:"DC2626",subtotal:"FEE2E2"},
    {header:"164E63",headerFg:"FFFFFF",stripe:"ECFEFF",dot:"0891B2",subtotal:"CFFAFE"},
    {header:"831843",headerFg:"FFFFFF",stripe:"FDF2F8",dot:"DB2777",subtotal:"FCE7F3"},
    {header:"7C2D12",headerFg:"FFFFFF",stripe:"FFF7ED",dot:"EA580C",subtotal:"FED7AA"},
  ];

  const ws = {};
  const merges = [];
  let r = 0;
  const COL_COUNT = 6; // added Reward column

  const bannerRow = (text, bg, fg, sz, height) => {
    sc(ws, `A${r+1}`, text, { font:{name:"Arial",bold:true,sz:sz||12,color:{rgb:fg||"FFFFFF"}}, fill:{patternType:"solid",fgColor:{rgb:bg||"1E3A5F"}}, alignment:{horizontal:"center",vertical:"center"} });
    merges.push({s:{r,c:0},e:{r,c:COL_COUNT-1}});
    ws[`!rows`] = ws[`!rows`] || [];
    ws[`!rows`][r] = {hpt:height||22};
    r++;
  };
  const emptyRow = (bg) => {
    for (let c=0;c<COL_COUNT;c++) { const addr=XLSX.utils.encode_cell({r,c}); sc(ws,addr,"",{fill:{patternType:"solid",fgColor:{rgb:bg||"F8FAFC"}}}); }
    merges.push({s:{r,c:0},e:{r,c:COL_COUNT-1}});
    ws[`!rows`]=ws[`!rows`]||[];
    ws[`!rows`][r]={hpt:8};
    r++;
  };

  bannerRow("","1E3A5F","FFFFFF",12,12);
  bannerRow("📦  POD RATE ACHIEVEMENT REPORT  —  100% PERFORMERS","1E3A5F","FFFFFF",14,34);
  bannerRow(`Generated: ${dateStr}   ·   Branches: ${Object.keys(branches).length}   ·   Riders: ${allRiders.length}   ·   Hits: ${totalHits}   ·   Total Rewards: ₱${grandTotal.toLocaleString("en",{minimumFractionDigits:2})}`, "2C4A6E","BFD4F0",9,18);
  bannerRow("","1E3A5F","FFFFFF",12,8);
  emptyRow("F8FAFC");

  // Summary
  bannerRow("OVERALL SUMMARY","0F172A","94A3B8",9,20);
  const sumHdrStyle = headerStyle("334155","E2E8F0");
  ["Branch","Riders at 100%","Total Hits","Branch Rewards (₱)","Top Performer","Top Hits"].forEach((h,i) => sc(ws,XLSX.utils.encode_cell({r,c:i}),h,sumHdrStyle));
  ws[`!rows`]=ws[`!rows`]||[];
  ws[`!rows`][r]={hpt:20};
  r++;

  Object.entries(branches).forEach(([branch,riders],bi) => {
    const pal = BRANCH_COLORS[bi%BRANCH_COLORS.length];
    const bHits = riders.reduce((s,rr)=>s+rr.dates.length,0);
    const top = riders[0];
    const branchReward = branchTotals[branch] || 0;
    const isEven = bi%2===0;
    [branch, riders.length, bHits, `₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})}`, top?.rider||"", top?.dates.length||0].forEach((v,i) => {
      sc(ws,XLSX.utils.encode_cell({r,c:i}),v,dataStyle(isEven?"FFFFFF":"F8FAFC",i===0,["left","center","center","center","left","center"][i],i===0?pal.header:"1E293B"));
    });
    ws[`!rows`][r]={hpt:18};
    r++;
  });

  const gtStyle = {font:{name:"Arial",bold:true,sz:10,color:{rgb:"1E293B"}},fill:{patternType:"solid",fgColor:{rgb:"E2E8F0"}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"medium",color:{rgb:"94A3B8"}},bottom:{style:"medium",color:{rgb:"94A3B8"}}}};
  ["GRAND TOTAL",Object.keys(branches).length,totalHits,`₱${grandTotal.toLocaleString("en",{minimumFractionDigits:2})}`,`${allRiders.length} riders total`,""].forEach((v,i) => {
    sc(ws,XLSX.utils.encode_cell({r,c:i}),v,{...gtStyle,alignment:{horizontal:i===0?"left":"center",vertical:"center"}});
  });
  ws[`!rows`][r]={hpt:20};
  r++;
  emptyRow("F8FAFC");
  emptyRow("F8FAFC");

  // Per-branch detail
  Object.entries(branches).forEach(([branch,riders],bi) => {
    const pal = BRANCH_COLORS[bi%BRANCH_COLORS.length];
    const bHits = riders.reduce((s,rr)=>s+rr.dates.length,0);
    const branchReward = branchTotals[branch] || 0;

    sc(ws,`A${r+1}`,`  ${branch.toUpperCase()}`,{font:{name:"Arial",bold:true,sz:11,color:{rgb:pal.headerFg}},fill:{patternType:"solid",fgColor:{rgb:pal.header}},alignment:{horizontal:"left",vertical:"center"}});
    merges.push({s:{r,c:0},e:{r,c:3}});
    sc(ws,XLSX.utils.encode_cell({r,c:4}),`${riders.length} riders · ${bHits} hits · ₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})} rewards`,{font:{name:"Arial",sz:9,color:{rgb:pal.headerFg}},fill:{patternType:"solid",fgColor:{rgb:pal.header}},alignment:{horizontal:"right",vertical:"center"}});
    merges.push({s:{r,c:4},e:{r,c:5}});
    ws[`!rows`][r]={hpt:24};
    r++;

    ["#","Rider Name","Times Hit 100%","Dates Achieved (🔥=3+ riders that day)","Total Reward (₱)","Reward Breakdown"].forEach((h,i) => {
      sc(ws,XLSX.utils.encode_cell({r,c:i}),h,headerStyle(pal.header,pal.headerFg));
    });
    ws[`!rows`][r]={hpt:18};
    r++;

    riders.forEach((rider,ri) => {
      const isStripe = ri%2!==0;
      const bg = isStripe ? pal.stripe : "FFFFFF";
      const rInfo = riderRewardMap[branch]?.[rider.rider] || {total:0,breakdown:[]};
      const breakdownStr = rInfo.breakdown.map(b=>`${b.date}: ₱${b.amount.toFixed(2)}${b.isHot?" (🔥 shared ÷"+b.ridersOnDate+")":""}`).join(" | ");
      sc(ws,XLSX.utils.encode_cell({r,c:0}),ri+1,dataStyle(bg,false,"center"));
      sc(ws,XLSX.utils.encode_cell({r,c:1}),rider.rider,dataStyle(bg,true,"left"));
      sc(ws,XLSX.utils.encode_cell({r,c:2}),rider.dates.length,{font:{name:"Arial",bold:true,sz:11,color:{rgb:pal.dot}},fill:{patternType:"solid",fgColor:{rgb:bg}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}}});
      const datesWithHot = rider.dates.map(d => hotDateSet.has(`${branch}|||${d}`) ? `🔥${d}` : d).join("  ·  ");
      sc(ws,XLSX.utils.encode_cell({r,c:3}),datesWithHot,dataStyle(bg,false,"left","374151"));
      sc(ws,XLSX.utils.encode_cell({r,c:4}),`₱${rInfo.total.toLocaleString("en",{minimumFractionDigits:2})}`,{font:{name:"Arial",bold:true,sz:11,color:{rgb:"059669"}},fill:{patternType:"solid",fgColor:{rgb:bg}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}}});
      sc(ws,XLSX.utils.encode_cell({r,c:5}),breakdownStr,dataStyle(bg,false,"left","64748B"));
      ws[`!rows`][r]={hpt:rider.dates.length>6?30:18};
      r++;
    });

    ["","Branch Total",bHits,"",`₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})}`,""].forEach((v,i) => {
      sc(ws,XLSX.utils.encode_cell({r,c:i}),v,{font:{name:"Arial",bold:true,sz:10,color:{rgb:i===2?pal.dot:i===4?"059669":"475569"}},fill:{patternType:"solid",fgColor:{rgb:pal.subtotal}},alignment:{horizontal:i===2||i===4?"center":"left",vertical:"center"},border:{top:{style:"thin",color:{rgb:pal.dot}},bottom:{style:"thin",color:{rgb:pal.dot}}}});
    });
    ws[`!rows`][r]={hpt:18};
    r++;
    emptyRow("F8FAFC");
  });

  // Rewards legend
  emptyRow("F8FAFC");
  bannerRow("REWARD RULES: < 3 riders/day per branch = ₱100 each  ·  ≥ 3 riders/day per branch = ₱300 ÷ riders that day  ·  🔥 = hot day (3+ riders)","F1F5F9","64748B",8,18);
  bannerRow(`Auto-generated · Only 100% POD Rate riders included · ${dateStr}`,"F1F5F9","94A3B8",8,16);

  ws["!ref"] = XLSX.utils.encode_range({s:{r:0,c:0},e:{r,c:COL_COUNT-1}});
  ws["!cols"] = [{wch:5},{wch:30},{wch:16},{wch:55},{wch:18},{wch:50}];
  ws["!merges"] = merges;
  ws["!sheetView"] = [{showGridLines:false,state:"normal"}];
  XLSX.utils.book_append_sheet(wb, ws, "POD 100% Report");
  const baseName = sourceFileName ? sourceFileName.replace(/\.[^.]+$/,"") : "Report";
  XLSX.writeFile(wb, `POD_100pct_${baseName}.xlsx`);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconPackage = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>);
const IconDownload = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IconUpload = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const IconCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconWarn = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IconLink = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const IconBranch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>);
const IconRiders = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconTrophy = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 2 8 8 12 11 16 8 16 2"/><path d="M8 2H4v6c0 3.31 2.69 6 6 6h0v4"/><path d="M16 2h4v6c0 3.31-2.69 6-6 6h0v4"/><rect x="8" y="20" width="8" height="2" rx="1"/></svg>);
const IconPeso = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="10" x2="13" y2="10"/><line x1="3" y1="14" x2="13" y2="14"/><path d="M7 20V4h5a5 5 0 0 1 0 10H7"/></svg>);

const HISTORY_KEY = "pod-tracker-history";
const MAX_HISTORY = 30;

// ─── RESULTS PANEL ────────────────────────────────────────────────────────────
function ResultsPanel({ branches, fileName, uploadedAt, isHistory }) {
  const allRiders  = Object.values(branches).flat();
  const totalHits  = allRiders.reduce((s,r) => s + r.dates.length, 0);
  const { riderRewardMap, hotDateSet, branchTotals, grandTotal } = computeRewards(branches);

  return (
    <>
      {isHistory && (
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--blue-lt)", border:"1px solid var(--blue-mid)", borderRadius:"var(--radius-sm)", padding:"10px 16px", marginBottom:20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span style={{fontSize:12,color:"var(--blue)",fontWeight:600}}>History record — {fileName}</span>
          <span style={{fontSize:11,color:"var(--text3)",marginLeft:"auto"}}>{new Date(uploadedAt).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="stat-row">
        {[
          { label:"Branches",        value:Object.keys(branches).length, icon:<IconBranch />, iconBg:"#EFF6FF", iconColor:"#2563EB", numColor:"#2563EB" },
          { label:"Riders at 100%",  value:allRiders.length,             icon:<IconRiders />, iconBg:"#F5F3FF", iconColor:"#7C3AED", numColor:"#7C3AED" },
          { label:"Total 100% Hits", value:totalHits,                    icon:<IconTrophy />, iconBg:"#FFFBEB", iconColor:"#D97706", numColor:"#D97706" },
          { label:"Total Rewards",   value:`₱${grandTotal.toLocaleString("en",{minimumFractionDigits:2})}`, icon:<IconPeso />, iconBg:"#ECFDF5", iconColor:"#059669", numColor:"#059669" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{background:s.iconBg,color:s.iconColor}}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-num" style={{color:s.numColor,fontSize:typeof s.value==="string"?18:24}}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards banner */}
      <div className="rewards-section">
        <div className="rewards-banner">
          <div className="rewards-banner-left">
            <div className="rewards-banner-icon">💰</div>
            <div>
              <div className="rewards-banner-title">Rewards Summary</div>
              <div className="rewards-banner-sub">Computed across all branches and dates</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="rewards-banner-total"><span>₱ </span>{grandTotal.toLocaleString("en",{minimumFractionDigits:2})}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:2}}>Total payout</div>
          </div>
        </div>

        {/* Legend */}
        <div className="rewards-legend">
          <div className="legend-pill" style={{background:"#ECFDF5",color:"#065F46",borderColor:"#6EE7B7"}}>
            <div className="legend-dot" style={{background:"#059669"}} />
            ₱100 each — Solo day (&lt; 3 riders in branch)
          </div>
          <div className="legend-pill" style={{background:"#FFFBEB",color:"#92400E",borderColor:"#FDE68A"}}>
            <div className="legend-dot" style={{background:"#D97706"}} />
            ₱300 ÷ riders — Hot day (≥ 3 riders in branch) 🔥
          </div>
          <div className="legend-pill" style={{background:"#ECFDF5",color:"#065F46",borderColor:"#6EE7B7"}}>
            🔥 Green date tag = 3+ riders hit 100% in that branch on that day
          </div>
        </div>
      </div>

      {/* Branch sections */}
      <div className="section-header">
        <div className="section-label">Branch Performance</div>
        <div className="section-count">{Object.keys(branches).length} branches · {allRiders.length} riders</div>
      </div>

      {Object.entries(branches).map(([branch,riders],bi) => {
        const pal  = PALETTE[bi % PALETTE.length];
        const bHits = riders.reduce((s,r) => s + r.dates.length, 0);
        const branchReward = branchTotals[branch] || 0;

        return (
          <div className="branch-block" key={branch}>
            <div className="branch-card">
              <div className="branch-header">
                <div className="branch-left">
                  <div className="branch-dot" style={{background:pal.dot}} />
                  <span className="branch-name">{branch}</span>
                  <span className="branch-pill" style={pal.pill}>{riders.length} rider{riders.length!==1?"s":""}</span>
                </div>
                <div className="branch-stats">
                  <div className="branch-stat-item">
                    <div className="branch-stat-num" style={{color:pal.dot}}>{bHits}</div>
                    <div className="branch-stat-lbl">Total Hits</div>
                  </div>
                  <div className="branch-vdiv" />
                  <div className="branch-stat-item">
                    <div className="branch-stat-num" style={{color:"#059669"}}>₱{branchReward.toLocaleString("en",{minimumFractionDigits:2})}</div>
                    <div className="branch-stat-lbl">Branch Rewards</div>
                  </div>
                  <div className="branch-vdiv" />
                  <div className="branch-stat-item">
                    <div className="branch-stat-num" style={{color:pal.dot}}>{riders.length}</div>
                    <div className="branch-stat-lbl">Riders</div>
                  </div>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Rider Name</th>
                      <th className="center">Times Hit 100%</th>
                      <th>Dates Achieved</th>
                      <th className="center">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((rider,ri) => {
                      const rInfo = riderRewardMap[branch]?.[rider.rider] || {total:0,breakdown:[]};
                      const isSplit = rInfo.breakdown.some(b => b.isHot);
                      const isSolo  = rInfo.breakdown.every(b => !b.isHot);
                      return (
                        <tr key={rider.rider+ri}>
                          <td><span className="row-num">{ri+1}</span></td>
                          <td>
                            <div className="rider-name">{rider.rider}</div>
                            {rider.aliases?.length > 0 && <div className="rider-alias">Also known as: {rider.aliases.join(", ")}</div>}
                          </td>
                          <td style={{textAlign:"center"}}>
                            <span className="hit-badge" style={{background:pal.hit.bg,color:pal.hit.color}}>
                              <IconTrophy />{rider.dates.length}×
                            </span>
                          </td>
                          <td>
                            <div className="date-tags">
                              {rider.dates.map((d,di) => {
                                const isHotDate = hotDateSet.has(`${branch}|||${d}`);
                                if (isHotDate) {
                                  return (
                                    <span key={di} className="date-tag hot" title="3+ riders in this branch hit 100% on this day — pool reward divided">{d}</span>
                                  );
                                }
                                return (
                                  <span key={di} className="date-tag" style={{background:pal.date.bg,color:pal.date.color,borderColor:pal.date.border}}>{d}</span>
                                );
                              })}
                            </div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div>
                              <span className={`reward-badge${isSplit?" split":""}`}>
                                <IconPeso />
                                ₱{rInfo.total.toLocaleString("en",{minimumFractionDigits:2})}
                              </span>
                              <div className="reward-breakdown">
                                {rInfo.breakdown.map((b,bi2) => (
                                  <div key={bi2} className={b.isHot?"hot-day":"solo-day"}>
                                    {b.date}: ₱{b.amount.toFixed(2)}{b.isHot ? ` ÷${b.ridersOnDate}` : ""}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="tr-total">
                      <td /><td style={{color:pal.dot}}>Branch Total</td>
                      <td style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",color:pal.dot}}>{bHits}</td>
                      <td />
                      <td style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",color:"#059669",fontWeight:700}}>₱{branchReward.toLocaleString("en",{minimumFractionDigits:2})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [drag, setDrag]               = useState(false);
  const [fileName, setFileName]       = useState("");
  const [branches, setBranches]       = useState(null);
  const [warnings, setWarnings]       = useState([]);
  const [mergeEvents, setMergeEvents] = useState([]);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [history, setHistory]         = useState([]);
  const [historyView, setHistoryView] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [deletingId, setDeletingId]   = useState(null);
  const inputRef = useRef();

  useState(() => {
    (async () => {
      try { const res = await window.storage.get(HISTORY_KEY); if (res?.value) setHistory(JSON.parse(res.value)); } catch (_) {}
      setStorageReady(true);
    })();
  });

  const saveHistory = async (newHistory) => {
    setHistory(newHistory);
    try { await window.storage.set(HISTORY_KEY, JSON.stringify(newHistory)); } catch (_) {}
  };

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!["xlsx","xls"].includes(file.name.split(".").pop().toLowerCase())) { setError("Please upload an Excel file (.xlsx or .xls)."); return; }
    setLoading(true); setError(""); setWarnings([]); setMergeEvents([]);
    setBranches(null); setFileName(file.name); setHistoryView(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type:"array", cellDates:true });
        if (!wb.SheetNames?.length) { setError("The file has no sheets."); setLoading(false); return; }
        const { branches: result, warnings: warns, mergeEvents: merges } = processSheets(wb);
        setWarnings(warns); setMergeEvents(merges);
        if (!Object.keys(result).length) {
          setError("No riders with 100% POD Rate found. Check that your file has Branch, Rider/Name, and POD Rate columns.");
        } else {
          setBranches(result);
          const entry = { id:Date.now().toString(), fileName:file.name, uploadedAt:new Date().toISOString(), branches:result };
          setHistory(prev => {
            const updated = [entry, ...prev].slice(0, MAX_HISTORY);
            (async()=>{ try { await window.storage.set(HISTORY_KEY, JSON.stringify(updated)); } catch(_){} })();
            return updated;
          });
        }
      } catch (err) { setError("Failed to read file: " + (err.message || "Unknown error")); }
      setLoading(false);
    };
    reader.onerror = () => { setError("Could not read the file."); setLoading(false); };
    reader.readAsArrayBuffer(file);
  }, []);

  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }, [processFile]);

  const deleteEntry = async (id) => {
    setDeletingId(id);
    setTimeout(async () => {
      const updated = history.filter(h => h.id !== id);
      await saveHistory(updated);
      if (historyView?.id === id) setHistoryView(null);
      setDeletingId(null);
    }, 300);
  };

  const clearAllHistory = async () => { await saveHistory([]); setHistoryView(null); };

  const viewData     = historyView || (branches ? { branches, fileName, uploadedAt:new Date().toISOString() } : null);
  const isHistoryView = !!historyView;

  return (
    <>
      <style>{G}
        {`
        .layout { display:flex; flex:1; min-height:0; }
        .sidebar { width:300px; flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; }
        .sidebar-head { padding:16px 18px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
        .sidebar-title { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text3); display:flex; align-items:center; gap:7px; }
        .sidebar-title svg { width:13px; height:13px; }
        .history-count { background:var(--blue); color:#fff; border-radius:99px; padding:1px 7px; font-size:10px; font-weight:700; font-family:'JetBrains Mono',monospace; }
        .clear-btn { font-size:10px; color:var(--text3); background:none; border:none; cursor:pointer; padding:3px 6px; border-radius:4px; transition:color .15s,background .15s; font-family:'Sora',sans-serif; }
        .clear-btn:hover { color:var(--red); background:var(--red-lt); }
        .sidebar-list { flex:1; overflow-y:auto; padding:8px; }
        .sidebar-empty { padding:32px 16px; text-align:center; color:var(--text3); font-size:12px; line-height:1.7; }
        .sidebar-empty svg { width:32px; height:32px; opacity:.3; margin:0 auto 10px; display:block; }
        .hist-item { border:1px solid var(--border); border-radius:var(--radius-sm); padding:11px 13px; margin-bottom:6px; cursor:pointer; transition:all .15s; position:relative; background:var(--surface); }
        .hist-item:hover { border-color:var(--blue-mid); background:var(--blue-lt); }
        .hist-item.active { border-color:var(--blue); background:var(--blue-lt); box-shadow:0 0 0 2px rgba(37,99,235,.12); }
        .hist-item.deleting { opacity:0; transform:translateX(-10px); transition:all .3s; }
        .hist-item-name { font-size:12px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-right:24px; }
        .hist-item-meta { font-size:10px; color:var(--text3); margin-top:4px; font-family:'JetBrains Mono',monospace; display:flex; gap:10px; flex-wrap:wrap; }
        .hist-item-meta span { display:flex; align-items:center; gap:4px; }
        .hist-delete { position:absolute; top:8px; right:8px; width:20px; height:20px; background:none; border:none; cursor:pointer; color:var(--text3); border-radius:4px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .15s,color .15s,background .15s; font-size:13px; line-height:1; }
        .hist-item:hover .hist-delete { opacity:1; }
        .hist-delete:hover { color:var(--red); background:var(--red-lt); }
        .hist-export-btn { width:calc(100% - 24px); margin:0 12px 12px; background:none; border:1px solid var(--border2); border-radius:var(--radius-sm); padding:8px 12px; font-size:11px; font-weight:600; color:var(--text2); cursor:pointer; display:flex; align-items:center; gap:7px; transition:all .15s; font-family:'Sora',sans-serif; }
        .hist-export-btn:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-lt); }
        .hist-export-btn svg { width:13px; height:13px; }
        .content-area { flex:1; overflow-y:auto; }
        `}
      </style>
      <div className="app">
        <header className="header">
          <div className="logo"><IconPackage /></div>
          <div className="brand">
            <div className="brand-name">POD Rate Tracker</div>
            <div className="brand-tag">Logistics Intelligence</div>
          </div>
          <div className="divider-v" />
          <div className="nav-chip"><div className="nav-chip-dot" />100% Achievers</div>
          {viewData && (
            <div className="hdr-right">
              <button className="export-btn" onClick={() => exportXLSX(viewData.branches, viewData.fileName)}>
                <IconDownload />Export Report
              </button>
            </div>
          )}
        </header>

        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-head">
              <div className="sidebar-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Upload History
                {history.length > 0 && <span className="history-count">{history.length}</span>}
              </div>
              {history.length > 0 && <button className="clear-btn" onClick={clearAllHistory}>Clear all</button>}
            </div>
            <div className="sidebar-list">
              {!storageReady && <div className="sidebar-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Loading…</div>}
              {storageReady && history.length === 0 && <div className="sidebar-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>No uploads yet.<br />Files you process will appear here so you can re-export them anytime.</div>}
              {storageReady && history.map(entry => {
                const riders = Object.values(entry.branches).flat();
                const hits   = riders.reduce((s,r) => s+r.dates.length, 0);
                const { grandTotal } = computeRewards(entry.branches);
                const isActive   = historyView?.id === entry.id;
                const isDeleting = deletingId === entry.id;
                const d = new Date(entry.uploadedAt);
                const dateLabel = d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
                const timeLabel = d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
                return (
                  <div key={entry.id} className={`hist-item${isActive?" active":""}${isDeleting?" deleting":""}`} onClick={() => setHistoryView(isActive ? null : entry)}>
                    <div className="hist-item-name" title={entry.fileName}>📄 {entry.fileName}</div>
                    <div className="hist-item-meta">
                      <span>🏢 {Object.keys(entry.branches).length} branch</span>
                      <span>👤 {riders.length} riders</span>
                      <span>🏆 {hits} hits</span>
                    </div>
                    <div className="hist-item-meta">
                      <span>💰 ₱{grandTotal.toLocaleString("en",{minimumFractionDigits:2})}</span>
                      <span style={{opacity:.7}}>{dateLabel} · {timeLabel}</span>
                    </div>
                    <button className="hist-delete" title="Remove from history" onClick={ev=>{ev.stopPropagation();deleteEntry(entry.id);}}>✕</button>
                  </div>
                );
              })}
            </div>
            {historyView && (
              <button className="hist-export-btn" onClick={() => exportXLSX(historyView.branches, historyView.fileName)}>
                <IconDownload />Export "{historyView.fileName}"
              </button>
            )}
          </aside>

          <div className="content-area">
            <main className="main">
              {!historyView && (
                <div className="upload-section">
                  <span className="upload-label">Data Source</span>
                  <div className={`dropzone${drag?" drag":""}`}
                    onDragOver={e=>{e.preventDefault();setDrag(true);}}
                    onDragLeave={()=>setDrag(false)}
                    onDrop={onDrop}
                    onClick={()=>inputRef.current.click()}>
                    <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])} />
                    <div className="dz-inner">
                      <div className="dz-icon-wrap">
                        {loading ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> : drag ? <IconDownload /> : <IconUpload />}
                      </div>
                      <div className="dz-title">{loading ? "Processing your file…" : drag ? "Release to upload" : "Drop Excel file here or click to browse"}</div>
                      <div className="dz-sub">Supports .xlsx and .xls · Multiple sheets · Auto-detects columns and dates</div>
                      {fileName && !loading && <div className="file-badge"><IconCheck />{fileName}</div>}
                    </div>
                  </div>
                </div>
              )}

              {historyView && (
                <button onClick={()=>setHistoryView(null)} style={{display:"flex",alignItems:"center",gap:7,background:"none",border:"1px solid var(--border2)",borderRadius:"var(--radius-sm)",padding:"7px 14px",fontSize:12,fontWeight:600,color:"var(--text2)",cursor:"pointer",marginBottom:20,fontFamily:"'Sora',sans-serif",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="var(--blue)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)";}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back to current upload
                </button>
              )}

              {!historyView && error && (<div className="alert err"><div className="alert-icon"><IconWarn /></div><div><div className="alert-title">Unable to Process File</div><div>{error}</div></div></div>)}
              {!historyView && warnings.length > 0 && (<div className="alert warn"><div className="alert-icon"><IconWarn /></div><div><div className="alert-title">Processing Notices ({warnings.length})</div><div className="alert-list">{warnings.map((w,i)=><div key={i}>• {w}</div>)}</div></div></div>)}
              {!historyView && mergeEvents.length > 0 && (<div className="alert merge"><div className="alert-icon"><IconLink /></div><div><div className="alert-title">Name Merges Applied ({mergeEvents.length})</div><div className="alert-list">{mergeEvents.map((e,i)=><div key={i}><strong>[{e.branch}]</strong> {e.canonical} ← {e.aliases.join(", ")}</div>)}</div></div></div>)}

              {viewData && <ResultsPanel branches={viewData.branches} fileName={viewData.fileName} uploadedAt={viewData.uploadedAt} isHistory={isHistoryView} />}

              {!viewData && !loading && (
                <div className="empty-card">
                  <div className="how-title">How It Works</div>
                  <div className="how-grid">
                    {[
                      {icon:"📁",title:"Upload Excel",desc:"Drop any .xlsx or .xls file with one or more sheets of delivery data."},
                      {icon:"✅",title:"100% Only",desc:"Only riders with exactly 100% POD Rate are listed. Anyone below is excluded."},
                      {icon:"🏆",title:"Hit Count",desc:"Shows how many times each rider achieved 100% — one count per sheet or date."},
                      {icon:"📅",title:"Dates Tracked",desc:"Each date or sheet name where the rider hit 100% is shown as a tag."},
                      {icon:"🔥",title:"Hot Days",desc:"Days where 3+ riders in a branch hit 100% show as green tags — those riders split ₱300."},
                      {icon:"💰",title:"Rewards",desc:"< 3 riders on a day → ₱100 each. ≥ 3 riders → ₱300 pool split equally among them."},
                      {icon:"🕑",title:"Upload History",desc:"Every file you process is saved. Click any history entry to re-view or re-export it."},
                      {icon:"⬇",title:"Export Report",desc:"Downloads a polished Excel report with rewards breakdown, beautifully formatted by branch."},
                    ].map(item => (
                      <div className="how-card" key={item.title}>
                        <div className="how-card-icon">{item.icon}</div>
                        <div className="how-card-title">{item.title}</div>
                        <div className="how-card-desc">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="col-detect">
                    <strong style={{color:"var(--blue)",fontWeight:700}}>Auto-detected columns</strong>
                    <span style={{color:"var(--text3)",margin:"0 8px"}}>·</span>
                    <strong>Branch:</strong> <span className="col-kw">Branch</span><span className="col-kw">Hub</span><span className="col-kw">Area</span><span className="col-kw">Zone</span>
                    <span style={{color:"var(--text3)",margin:"0 8px"}}>·</span>
                    <strong>Rider:</strong> <span className="col-kw">Rider</span><span className="col-kw">Courier</span><span className="col-kw">Driver</span><span className="col-kw">Name</span>
                    <span style={{color:"var(--text3)",margin:"0 8px"}}>·</span>
                    <strong>Rate:</strong> <span className="col-kw">POD Rate</span><span className="col-kw">POD%</span>
                    <span style={{color:"var(--text3)",margin:"0 8px"}}>·</span>
                    <strong>Date:</strong> <span className="col-kw">Date</span><span className="col-kw">Day</span><span className="col-kw">Period</span>
                    — if no date column, the <strong>sheet name</strong> is used automatically.
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}