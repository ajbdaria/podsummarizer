import { useState, useCallback, useRef } from "react";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs";

const C = {
  bg: "#07090F", card: "#0D1117", surface: "#111827", border: "#1C2A3A",
  accent: "#00E5FF", purple: "#8B5CF6", gold: "#F59E0B", green: "#10B981",
  red: "#F87171", orange: "#FB923C", text: "#E2E8F0", muted: "#4B6070", dim: "#1E3040",
};
const PALETTE = [C.accent, C.purple, C.green, C.gold, C.red, C.orange, "#EC4899", "#06B6D4"];
const css = String.raw;

const G = css`
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body, #root { min-height: 100vh; width: 100%; background: ${C.bg}; color: ${C.text}; font-family: 'IBM Plex Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header {
    background: linear-gradient(135deg,#07090F 0%,#0D1117 60%,#07090F 100%);
    border-bottom: 1px solid ${C.border}; padding: 20px 32px;
    display: flex; align-items: center; gap: 14px; position: sticky; top: 0; z-index: 100;
  }
  .logo {
    width: 40px; height: 40px; background: linear-gradient(135deg,${C.accent},${C.purple});
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0; box-shadow: 0 0 20px ${C.accent}44;
  }
  .header-title { font-family:'IBM Plex Mono',monospace; font-size: 18px; font-weight: 700; }
  .header-sub { font-size: 10px; color: ${C.muted}; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 2px; }
  .export-btn {
    margin-left: auto; background: linear-gradient(135deg,${C.accent},${C.purple});
    border: none; border-radius: 8px; padding: 10px 22px; color: #fff;
    font-family:'IBM Plex Mono',monospace; font-weight: 700; font-size: 11px;
    letter-spacing: .12em; cursor: pointer; text-transform: uppercase;
    box-shadow: 0 0 20px ${C.accent}33; transition: all .2s;
  }
  .export-btn:hover { transform: translateY(-1px); box-shadow: 0 0 30px ${C.accent}55; }
  .main { flex: 1; padding: 28px 32px; }
  .dropzone {
    border: 2px dashed ${C.border}; border-radius: 16px; padding: 50px 40px;
    text-align: center; background: ${C.card}; cursor: pointer;
    transition: all .2s; margin-bottom: 28px; position: relative; overflow: hidden;
  }
  .dropzone::before {
    content:''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at center,${C.accent}08 0%,transparent 70%);
    pointer-events: none;
  }
  .dropzone.drag { border-color:${C.accent}; background:rgba(0,229,255,.04); box-shadow:0 0 40px ${C.accent}22; }
  .dz-icon { font-size: 40px; margin-bottom: 12px; }
  .dz-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; font-family:'IBM Plex Mono',monospace; }
  .dz-sub { font-size: 12px; color: ${C.muted}; }
  .file-badge {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 12px;
    background:${C.accent}18; color:${C.accent}; border:1px solid ${C.accent}44;
    border-radius: 6px; padding: 4px 14px; font-size: 11px; font-weight: 700;
    font-family:'IBM Plex Mono',monospace;
  }
  .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 28px; }
  @media(max-width:700px){.stat-grid{grid-template-columns:1fr}}
  .stat-card {
    background:${C.surface}; border-radius: 12px; padding: 20px 22px;
    border:1px solid ${C.border}; transition: transform .2s;
  }
  .stat-card:hover { transform: translateY(-2px); }
  .stat-num { font-family:'IBM Plex Mono',monospace; font-size: 32px; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .stat-label { font-size: 10px; color:${C.muted}; letter-spacing:.15em; text-transform: uppercase; }
  .warn-box {
    background:${C.orange}12; border:1px solid ${C.orange}44; border-left:3px solid ${C.orange};
    border-radius:10px; padding:14px 18px; margin-bottom:20px;
    font-size:12px; color:${C.orange}; line-height:1.7; font-family:'IBM Plex Mono',monospace;
  }
  .err-box {
    background:${C.red}12; border:1px solid ${C.red}44; border-left:3px solid ${C.red};
    border-radius:10px; padding:14px 18px; margin-bottom:20px; font-size:13px; color:${C.red};
  }
  .merge-box {
    background:${C.purple}12; border:1px solid ${C.purple}44; border-left:3px solid ${C.purple};
    border-radius:10px; padding:14px 18px; margin-bottom:20px;
    font-size:12px; color:${C.purple}; line-height:1.7; font-family:'IBM Plex Mono',monospace;
  }
  .branch-block { margin-bottom: 36px; }
  .branch-header {
    display:flex; justify-content:space-between; align-items:center;
    padding:14px 20px; border-radius:10px 10px 0 0;
  }
  .branch-name { font-weight:700; font-size:14px; font-family:'IBM Plex Mono',monospace; }
  .table-wrap { background:${C.card}; border:1px solid ${C.border}; border-radius:0 0 10px 10px; overflow:hidden; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  thead th {
    text-align:left; padding:10px 16px; background:${C.surface}; color:${C.muted};
    font-weight:700; font-size:10px; letter-spacing:.14em; text-transform:uppercase;
    border-bottom:1px solid ${C.border}; font-family:'IBM Plex Mono',monospace;
  }
  tbody td { padding:12px 16px; border-bottom:1px solid ${C.border}44; color:${C.text}; vertical-align:top; }
  tbody tr:last-child td { border-bottom:none; }
  tbody tr:hover td { background:${C.dim}44; }
  .tr-total td { background:${C.dim}; }
  .badge {
    display:inline-block; border-radius:5px; padding:2px 10px;
    font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    font-family:'IBM Plex Mono',monospace;
  }
  .hit-pill {
    display:inline-flex; align-items:center; gap:5px;
    background:${C.gold}20; color:${C.gold}; border:1px solid ${C.gold}50;
    border-radius:20px; padding:3px 12px;
    font-size:13px; font-weight:700; font-family:'IBM Plex Mono',monospace;
  }
  .date-tags { display:flex; flex-wrap:wrap; gap:5px; }
  .date-tag {
    background:${C.green}15; color:${C.green}; border:1px solid ${C.green}33;
    border-radius:5px; padding:2px 9px; font-size:11px;
    font-family:'IBM Plex Mono',monospace; font-weight:600; white-space:nowrap;
  }
  .alias-hint { font-size:10px; color:${C.purple}; font-family:'IBM Plex Mono',monospace; margin-top:3px; }
  .info-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-bottom:20px; }
  .info-card { background:${C.surface}; border-radius:10px; padding:18px; border:1px solid ${C.border}; }
  .info-icon { font-size:22px; margin-bottom:10px; }
  .info-title { font-weight:700; font-size:12px; color:${C.accent}; margin-bottom:6px; font-family:'IBM Plex Mono',monospace; }
  .info-desc { font-size:12px; color:${C.muted}; line-height:1.6; }
  .col-hint {
    margin-top:4px; padding:16px 20px; background:${C.surface};
    border:1px solid ${C.border}; border-radius:10px; font-size:12px; color:${C.muted}; line-height:1.9;
  }
`;

// ─── FUZZY NAME MERGE ─────────────────────────────────────────────────────────

function normalizeName(n) {
  return String(n||"").toLowerCase().replace(/[\r\n]+/g," ").replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim();
}
function levenshtein(a,b) {
  if(Math.abs(a.length-b.length)>3) return 999;
  const dp=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);
  for(let j=0;j<=b.length;j++) dp[0][j]=j;
  for(let i=1;i<=a.length;i++)
    for(let j=1;j<=b.length;j++)
      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[a.length][b.length];
}
function isSamePerson(A,B) {
  const a=normalizeName(A), b=normalizeName(B);
  if(!a||!b) return false;
  if(a===b) return true;
  const ta=a.split(" "), tb=b.split(" ");
  if(ta.length<2||tb.length<2) return false;
  if(ta[0]!==tb[0]) return false;
  const la=ta[ta.length-1], lb=tb[tb.length-1];
  if(la.length<=4||lb.length<=4) return la===lb;
  return levenshtein(la,lb)<=2 && Math.abs(a.length-b.length)<=5;
}
function fuzzyMerge(entries) {
  const merged=[], log=[];
  for(const e of entries) {
    let found=false;
    for(const m of merged) {
      if(isSamePerson(m.rider,e.rider)) {
        if(normalizeName(m.rider)!==normalizeName(e.rider)){
          m.aliases=m.aliases||new Set(); m.aliases.add(e.rider);
        }
        // merge dates — add any new dates not already in list
        for(const d of e.dates) if(!m.dates.includes(d)) m.dates.push(d);
        if(e.rider.length>m.rider.length){
          m.aliases=m.aliases||new Set(); m.aliases.add(m.rider); m.rider=e.rider;
        }
        found=true; break;
      }
    }
    if(!found) merged.push({...e, dates:[...e.dates], aliases:null});
  }
  for(const m of merged){
    if(m.aliases?.size>0) log.push({canonical:m.rider,aliases:[...m.aliases]});
    m.aliases=m.aliases?[...m.aliases]:[];
  }
  return {merged,log};
}

// ─── COLUMN DETECTION ────────────────────────────────────────────────────────

function bestCol(headers, keywords) {
  let best=-1, bestScore=0;
  headers.forEach((h,i)=>{
    const hh=String(h||"").toLowerCase().trim();
    let score=0;
    for(const kw of keywords){
      if(hh===kw) score+=10;
      else if(hh.startsWith(kw)||hh.endsWith(kw)) score+=6;
      else if(hh.includes(kw)) score+=3;
    }
    if(score>bestScore){bestScore=score;best=i;}
  });
  return bestScore>0?best:-1;
}

function detectColumns(headers) {
  const branch  = bestCol(headers,["branch","hub","area","zone","region","depot","store","site","location"]);
  const rider   = bestCol(headers,["rider","courier","driver","agent","name","employee","staff","personnel"]);
  const podRate = bestCol(headers,["pod rate","pod%","pod %","delivery rate","success rate","completion rate","rate","%"]);
  const date    = bestCol(headers,["date","day","period","week","month","timestamp","time"]);
  const podQty  = bestCol(headers,["pod quantity","pod qty","pod count","pod delivered","pod scan","delivered qty","delivered quantity"]);
  const totalQty= bestCol(headers,["delivery scan quantity","scan quantity","total scan","total quantity","delivery quantity","total parcels","waybill","total","quantity","qty","count"]);

  const safePodQty  = (podQty  !== -1 && podQty  !== totalQty) ? podQty  : -1;
  const safeTotalQty= (totalQty!== -1 && totalQty!== podQty)   ? totalQty: -1;

  return { branch, rider, podRate, date, podQty: safePodQty, totalQty: safeTotalQty };
}

// ─── VALUE PARSERS ────────────────────────────────────────────────────────────

function parseRate(val) {
  if(val===null||val===undefined||val==="") return null;
  if(typeof val==="number"){
    if(val>=0&&val<=1)   return Math.round(val*1000)/10;
    if(val>=0&&val<=100) return Math.round(val*10)/10;
    return null;
  }
  const n=parseFloat(String(val).replace(/%/g,"").trim());
  if(isNaN(n)) return null;
  if(n>=0&&n<=1)   return Math.round(n*1000)/10;
  if(n>=0&&n<=100) return Math.round(n*10)/10;
  return null;
}

// ─── CORE: PROCESS SHEETS ────────────────────────────────────────────────────
//
// For each rider with POD Rate = 100%, record:
//   - rider name
//   - branch
//   - dates[] — the list of dates/sheet-names when they hit 100%
//   - hitCount = dates.length
//
// The "date" comes from (in priority order):
//   1. A Date column in the row (if one exists)
//   2. The sheet name (e.g. "FEB 1", "FEB 3")
//
// Merged cells fix: carry forward last non-empty branch value (fill-down).

function processSheets(workbook) {
  // key = "branch|||rider"
  // value = { branch, rider, dates: string[], failed: bool }
  const allData = {};
  const warnings = [];
  const SKIP_RIDERS   = new Set(["rider","name","courier","driver","agent","employee","staff","personnel",""]);
  const SKIP_BRANCHES = new Set(["branch","hub","area","zone","region","none",""]);

  for(const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    if(!ws) continue;

    let raw;
    try { raw = XLSX.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}); }
    catch { warnings.push(`Sheet "${sheetName}": could not parse, skipped.`); continue; }

    raw = raw.filter(r=>r.some(c=>c!==""&&c!==null&&c!==undefined));
    if(raw.length<2){ warnings.push(`Sheet "${sheetName}": too few rows, skipped.`); continue; }

    // Find header row = most populated row in first 8 rows
    let headerIdx=0, bestCount=0;
    for(let i=0;i<Math.min(8,raw.length);i++){
      const cnt=raw[i].filter(c=>c!=="").length;
      if(cnt>bestCount){bestCount=cnt;headerIdx=i;}
    }

    const headers = raw[headerIdx];
    const cols    = detectColumns(headers);

    if(cols.rider===-1){
      warnings.push(`Sheet "${sheetName}": no Rider/Name column — skipped.`); continue;
    }
    if(cols.podRate===-1){
      warnings.push(`Sheet "${sheetName}": no POD Rate column — skipped.`); continue;
    }
    if(cols.branch===-1){
      warnings.push(`Sheet "${sheetName}": no Branch column — using sheet name for all rows.`);
    }

    // FORMAT A = has podQty AND totalQty → one summary row per rider
    const isFormatA = cols.podQty!==-1 && cols.totalQty!==-1;

    // Fill-down state for merged branch cells
    let lastBranch = sheetName;

    for(const row of raw.slice(headerIdx+1)) {
      // ── Fill-down branch (fix for merged cells) ──
      const branchRaw = cols.branch!==-1 ? String(row[cols.branch]??"").trim() : "";
      if(branchRaw && !SKIP_BRANCHES.has(branchRaw.toLowerCase())) {
        lastBranch = branchRaw;
      }
      const branch = lastBranch;

      const rider = String(row[cols.rider]??"")
        .replace(/\u00A0/g," ").replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim();

      if(!rider) continue;
      if(SKIP_RIDERS.has(rider.toLowerCase())) continue;
      if(SKIP_BRANCHES.has(branch.toLowerCase())) continue;

      const rate = parseRate(row[cols.podRate]);
      if(rate===null) continue;

      const key = `${branch}|||${rider}`;

      // ── Determine the label for this date/occasion ──
      // Priority: explicit date column → sheet name
      let dateLabel = sheetName; // default = sheet name (e.g. "FEB 1")
      if(cols.date!==-1) {
        const dv = row[cols.date];
        if(dv!==""&&dv!==null&&dv!==undefined) {
          // If it's a JS Date object (from cellDates:true), format it
          if(dv instanceof Date) {
            const mm = String(dv.getMonth()+1).padStart(2,"0");
            const dd = String(dv.getDate()).padStart(2,"0");
            const yy = dv.getFullYear();
            dateLabel = `${mm}/${dd}/${yy}`;
          } else {
            dateLabel = String(dv).trim() || sheetName;
          }
        }
      }

      if(isFormatA) {
        // FORMAT A: one row per rider — if 100%, record this date
        if(rate >= 99.9) {
          if(!allData[key]) allData[key]={branch,rider,dates:[],failed:false};
          if(!allData[key].dates.includes(dateLabel)) allData[key].dates.push(dateLabel);
        }
        // Below 100% → skip entirely, they don't qualify

      } else {
        // FORMAT B: one row per delivery record
        // Rider qualifies only if ALL their records are 100%
        if(!allData[key]) allData[key]={branch,rider,dates:[],failed:false};
        if(rate >= 99.9){
          if(!allData[key].dates.includes(dateLabel)) allData[key].dates.push(dateLabel);
        } else {
          allData[key].failed = true;
        }
      }
    }
  }

  // Only keep riders who hit 100% and never had a non-100% record
  const qualified = Object.values(allData).filter(e => !e.failed && e.dates.length > 0);

  // Group by branch
  const byBranch = {};
  for(const e of qualified){
    if(!byBranch[e.branch]) byBranch[e.branch]=[];
    byBranch[e.branch].push(e);
  }

  // Fuzzy merge per branch, sort by hitCount desc
  const branches = {};
  const allMergeEvents = [];
  for(const [branch,entries] of Object.entries(byBranch)){
    const {merged,log} = fuzzyMerge(entries);
    if(!merged.length) continue;
    merged.sort((a,b)=>b.dates.length-a.dates.length||a.rider.localeCompare(b.rider));
    branches[branch] = merged;
    for(const evt of log) allMergeEvents.push({branch,...evt});
  }

  return {branches, warnings, mergeEvents:allMergeEvents};
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

function exportXLSX(branches) {
  const wb  = XLSX.utils.book_new();
  const setW = (ws,widths) => { ws["!cols"]=widths.map(w=>({wch:w})); };

  // SUMMARY sheet
  const sRows=[["Branch","Rider Name","Times Hit 100%","Dates Hit 100%"]];
  for(const [branch,riders] of Object.entries(branches))
    for(const r of riders)
      sRows.push([branch, r.rider, r.dates.length, r.dates.join(", ")]);
  const allR = Object.values(branches).flat();
  sRows.push(["GRAND TOTAL","", allR.reduce((s,r)=>s+r.dates.length,0), ""]);
  const sWs = XLSX.utils.aoa_to_sheet(sRows);
  setW(sWs,[22,30,16,60]);
  XLSX.utils.book_append_sheet(wb,sWs,"SUMMARY");

  // Per-branch sheets
  for(const [branch,riders] of Object.entries(branches)){
    const rows=[["Rider Name","Times Hit 100%","Dates Hit 100%"]];
    for(const r of riders)
      rows.push([r.rider, r.dates.length, r.dates.join(", ")]);
    rows.push(["TOTAL", riders.reduce((s,r)=>s+r.dates.length,0), ""]);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    setW(ws,[30,16,60]);
    XLSX.utils.book_append_sheet(wb,ws,branch.substring(0,31).replace(/[:\\/?*[\]]/g,"_")||"Branch");
  }
  XLSX.writeFile(wb,"POD_100pct_Riders.xlsx");
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [drag,setDrag]             = useState(false);
  const [fileName,setFileName]     = useState("");
  const [branches,setBranches]     = useState(null);
  const [warnings,setWarnings]     = useState([]);
  const [mergeEvents,setMergeEvents] = useState([]);
  const [error,setError]           = useState("");
  const [loading,setLoading]       = useState(false);
  const inputRef = useRef();

  const processFile = useCallback((file)=>{
    if(!file) return;
    if(!["xlsx","xls"].includes(file.name.split(".").pop().toLowerCase())){
      setError("Please upload an Excel file (.xlsx or .xls)."); return;
    }
    setLoading(true); setError(""); setWarnings([]); setMergeEvents([]); setBranches(null); setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const wb = XLSX.read(new Uint8Array(e.target.result),{type:"array",cellDates:true});
        if(!wb.SheetNames?.length){ setError("The file has no sheets."); setLoading(false); return; }
        const {branches:result,warnings:warns,mergeEvents:merges} = processSheets(wb);
        setWarnings(warns); setMergeEvents(merges);
        if(!Object.keys(result).length){
          setError("No riders with 100% POD Rate found. Check that your file has Branch, Rider/Name, and POD Rate columns.");
        } else {
          setBranches(result);
        }
      } catch(err){ setError("Failed to read file: "+(err.message||"Unknown error")); }
      setLoading(false);
    };
    reader.onerror=()=>{ setError("Could not read the file."); setLoading(false); };
    reader.readAsArrayBuffer(file);
  },[]);

  const onDrop = useCallback((e)=>{ e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); },[processFile]);

  const allRiders  = branches ? Object.values(branches).flat() : [];
  const totalHits  = allRiders.reduce((s,r)=>s+r.dates.length, 0);

  return (
    <>
      <style>{G}</style>
      <div className="app">
        <header className="header">
          <div className="logo">📦</div>
          <div>
            <div className="header-sub">Logistics Intelligence</div>
            <div className="header-title">100% POD Rate Tracker</div>
          </div>
          {branches && <button className="export-btn" onClick={()=>exportXLSX(branches)}>⬇ Export XLSX</button>}
        </header>

        <main className="main">
          <div className={`dropzone${drag?" drag":""}`}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={onDrop}
            onClick={()=>inputRef.current.click()}>
            <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{display:"none"}}
              onChange={e=>processFile(e.target.files[0])}/>
            <div className="dz-icon">{loading?"⏳":drag?"⬇":"📂"}</div>
            <div className="dz-title">{loading?"Processing…":drag?"Release to Upload":"Drop your Excel file here"}</div>
            <div className="dz-sub">Supports .xlsx / .xls · Multiple sheets · Dates auto-detected from sheet names or date column</div>
            {fileName&&!loading&&<div className="file-badge">✓ {fileName}</div>}
          </div>

          {error&&<div className="err-box">⚠ {error}</div>}

          {warnings.length>0&&(
            <div className="warn-box">
              <strong>⚠ Notices ({warnings.length}):</strong><br/>
              {warnings.map((w,i)=><span key={i}>• {w}<br/></span>)}
            </div>
          )}

          {mergeEvents.length>0&&(
            <div className="merge-box">
              <strong>🔗 Name Merges ({mergeEvents.length}):</strong><br/>
              {mergeEvents.map((e,i)=>(
                <span key={i}>• [{e.branch}] <strong style={{color:"#C4B5FD"}}>{e.canonical}</strong> ← {e.aliases.join(", ")}<br/></span>
              ))}
            </div>
          )}

          {branches&&(
            <>
              <div className="stat-grid">
                {[
                  {label:"Branches",        value:Object.keys(branches).length, color:C.accent},
                  {label:"Riders at 100%",  value:allRiders.length,             color:C.purple},
                  {label:"Total 100% Hits", value:totalHits,                    color:C.gold},
                ].map(s=>(
                  <div key={s.label} className="stat-card"
                    style={{borderLeft:`3px solid ${s.color}`,boxShadow:`inset 0 0 40px ${s.color}08`}}>
                    <div className="stat-num" style={{color:s.color}}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {Object.entries(branches).map(([branch,riders],bi)=>{
                const color = PALETTE[bi%PALETTE.length];
                const bHits = riders.reduce((s,r)=>s+r.dates.length,0);
                return (
                  <div className="branch-block" key={branch}>
                    <div className="branch-header" style={{
                      background:`linear-gradient(90deg,${color}18,transparent)`,
                      border:`1px solid ${color}33`, borderLeft:`3px solid ${color}`
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:16}}>🏢</span>
                        <span className="branch-name" style={{color}}>{branch}</span>
                        <span className="badge" style={{background:color+"22",color,border:`1px solid ${color}44`}}>
                          {riders.length} rider{riders.length!==1?"s":""}
                        </span>
                      </div>
                      <div style={{fontSize:12,color:C.muted}}>
                        <span style={{color:C.gold,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{bHits}</span>
                        <span> total hits</span>
                      </div>
                    </div>

                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th style={{width:36}}>#</th>
                            <th>Rider Name</th>
                            <th style={{textAlign:"center",width:140}}>Times Hit 100%</th>
                            <th>Dates Hit 100%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riders.map((r,ri)=>(
                            <tr key={r.rider+ri} style={{background:ri%2===0?"transparent":C.surface+"55"}}>
                              <td style={{color:C.muted,fontFamily:"'IBM Plex Mono',monospace"}}>{ri+1}</td>
                              <td>
                                <div style={{fontWeight:600}}>{r.rider}</div>
                                {r.aliases?.length>0&&
                                  <div className="alias-hint">🔗 also: {r.aliases.join(", ")}</div>}
                              </td>
                              <td style={{textAlign:"center"}}>
                                <span className="hit-pill">🏆 {r.dates.length}×</span>
                              </td>
                              <td>
                                <div className="date-tags">
                                  {r.dates.map((d,di)=>(
                                    <span key={di} className="date-tag">{d}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                          <tr className="tr-total">
                            <td colSpan={2}>
                              <strong style={{color,fontFamily:"'IBM Plex Mono',monospace"}}>Branch Total</strong>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <strong style={{color:C.gold,fontFamily:"'IBM Plex Mono',monospace"}}>{bHits}</strong>
                            </td>
                            <td/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {!branches&&!loading&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
              <div style={{fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:C.accent,fontWeight:700,marginBottom:16,fontFamily:"'IBM Plex Mono',monospace"}}>
                How It Works
              </div>
              <div className="info-grid">
                {[
                  {icon:"📁",title:"Upload Excel",   desc:"Drop any .xlsx or .xls with one or more sheets."},
                  {icon:"✅",title:"100% Only",       desc:"Only riders with exactly 100% POD Rate are listed. Anyone below is excluded."},
                  {icon:"🏆",title:"Hit Count",       desc:"Shows how many times each rider achieved 100% — one count per sheet/date they appeared at 100%."},
                  {icon:"📅",title:"Dates Tracked",   desc:"Each date or sheet name where the rider hit 100% is shown as a tag. Matches your actual records."},
                  {icon:"📋",title:"Merged Cells",    desc:"Handles Excel merged Branch cells — all riders in a group get the correct branch automatically."},
                  {icon:"⬇",title:"Export",           desc:"Downloads a clean Excel: Summary tab + one tab per branch with rider name, hit count, and dates."},
                ].map(item=>(
                  <div className="info-card" key={item.title}>
                    <div className="info-icon">{item.icon}</div>
                    <div className="info-title">{item.title}</div>
                    <div className="info-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="col-hint">
                <strong style={{color:C.accent}}>Auto-detected columns:</strong><br/>
                • <strong style={{color:C.text}}>Branch</strong>: Branch, Hub, Area, Zone, Region, Depot, Store, Location<br/>
                • <strong style={{color:C.text}}>Rider</strong>: Rider, Courier, Driver, Agent, Name, Employee<br/>
                • <strong style={{color:C.text}}>POD Rate</strong>: POD Rate, POD%, Rate, Delivery Rate, Completion Rate<br/>
                • <strong style={{color:C.text}}>Date</strong>: Date, Day, Period, Week, Month — if found, used as the hit date label.<br/>
                • If no Date column, the <strong style={{color:C.green}}>sheet name</strong> is used as the date (e.g. "FEB 1", "FEB 3").<br/>
                • If no Branch column, the sheet name is used as the branch name.
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}