import { useState, useCallback, useRef } from "react";
const css = String.raw;

function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
const XLSXPromise = loadXLSX();

const G = css`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #F0F2F7;
    --surface:  #FFFFFF;
    --border:   #E3E8F0;
    --border2:  #C8D0DC;
    --text:     #0D1B2A;
    --text2:    #4A5568;
    --text3:    #8FA3BF;
    --blue:     #2563EB;
    --blue-lt:  #EFF6FF;
    --blue-mid: #BFDBFE;
    --indigo:   #4338CA;
    --green:    #059669;
    --green-lt: #ECFDF5;
    --amber:    #D97706;
    --amber-lt: #FFFBEB;
    --red:      #DC2626;
    --red-lt:   #FEF2F2;
    --purple:   #7C3AED;
    --purple-lt:#F5F3FF;
    --shadow-sm:0 1px 3px rgba(13,27,42,.06);
    --shadow:   0 4px 16px rgba(13,27,42,.08);
    --shadow-lg:0 8px 32px rgba(13,27,42,.12);
    --radius:   14px;
    --radius-sm:9px;
    --radius-xs:6px;
  }

  html, body, #root {
    height: 100%; width: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  .app { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

  /* ── HEADER ── */
  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    height: 58px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: sticky; top: 0; z-index: 200;
    box-shadow: 0 1px 0 var(--border), 0 2px 8px rgba(13,27,42,.04);
  }
  .logo {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(37,99,235,.28);
  }
  .logo svg { width: 17px; height: 17px; color: #fff; }
  .brand-name { font-weight: 800; font-size: 15px; color: var(--text); letter-spacing: -.03em; }
  .brand-tag { font-size: 10px; font-weight: 500; color: var(--text3); letter-spacing: .05em; text-transform: uppercase; margin-top: 1px; }
  .hdr-divider { width: 1px; height: 24px; background: var(--border); margin: 0 6px; }
  .hdr-chip {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 11px; background: var(--blue-lt); color: var(--blue);
    border-radius: 99px; font-size: 11px; font-weight: 700; letter-spacing: .01em;
  }
  .hdr-chip-dot { width: 5px; height: 5px; background: var(--blue); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .export-btn {
    display: flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%);
    border: none; border-radius: var(--radius-sm); padding: 8px 16px;
    color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 12px;
    cursor: pointer; box-shadow: 0 2px 8px rgba(37,99,235,.28); transition: all .18s;
  }
  .export-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,.4); }
  .export-btn svg { width: 13px; height: 13px; }

  /* ── LAYOUT ── */
  .layout { display: flex; flex: 1; min-height: 0; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 280px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .sidebar-head {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sidebar-title { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text3); display: flex; align-items: center; gap: 6px; }
  .hist-count { background: var(--blue); color: #fff; border-radius: 99px; padding: 1px 7px; font-size: 10px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .clear-btn { font-size: 10px; color: var(--text3); background: none; border: none; cursor: pointer; padding: 3px 7px; border-radius: 4px; transition: all .15s; font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .clear-btn:hover { color: var(--red); background: var(--red-lt); }
  .sidebar-list { flex: 1; overflow-y: auto; padding: 8px; }
  .sidebar-empty { padding: 28px 14px; text-align: center; color: var(--text3); font-size: 12px; line-height: 1.7; }
  .sidebar-empty svg { width: 28px; height: 28px; opacity: .25; margin: 0 auto 10px; display: block; }
  .hist-item {
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 12px; margin-bottom: 5px;
    cursor: pointer; transition: all .15s; position: relative; background: var(--surface);
  }
  .hist-item:hover { border-color: var(--blue-mid); background: #F5F8FF; }
  .hist-item.active { border-color: var(--blue); background: var(--blue-lt); box-shadow: 0 0 0 2px rgba(37,99,235,.1); }
  .hist-item.deleting { opacity: 0; transform: translateX(-8px); transition: all .28s; }
  .hist-item-name { font-size: 11.5px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 22px; }
  .hist-item-meta { font-size: 10px; color: var(--text3); margin-top: 4px; font-family: 'DM Mono', monospace; display: flex; gap: 8px; flex-wrap: wrap; }
  .hist-delete { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; background: none; border: none; cursor: pointer; color: var(--text3); border-radius: 3px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all .15s; font-size: 11px; }
  .hist-item:hover .hist-delete { opacity: 1; }
  .hist-delete:hover { color: var(--red); background: var(--red-lt); }

  /* ── MAIN CONTENT ── */
  .content-area { flex: 1; overflow: hidden; display: flex; flex-direction: column; min-width: 0; }

  /* ── TAB BAR ── */
  .tab-bar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
    box-shadow: 0 1px 0 var(--border);
  }
  .tab-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 18px 11px;
    border: none; background: none;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text3); cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all .15s; border-radius: 8px 8px 0 0;
    position: relative;
  }
  .tab-btn:hover { color: var(--text2); background: var(--bg); }
  .tab-btn.active { color: var(--blue); border-bottom-color: var(--blue); background: #F0F6FF; }
  .tab-btn .tab-icon { width: 16px; height: 16px; }
  .tab-divider { width: 1px; height: 20px; background: var(--border); margin: 0 4px 10px; }

  /* ── INPUT PANEL ── */
  .workspace { flex: 1; display: flex; min-height: 0; overflow: hidden; }
  .input-panel {
    width: 360px; flex-shrink: 0;
    border-right: 1px solid var(--border);
    background: var(--surface);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .input-panel-inner { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 0; }
  .panel-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; min-height: 0; padding-right: 2px; }
  .panel-footer { flex-shrink: 0; display: flex; flex-direction: column; gap: 7px; padding-top: 10px; border-top: 1px solid var(--border); }
  .results-area { flex: 1; overflow-y: auto; padding: 24px 28px; min-width: 0; }
  .input-panel.full-width { width: 100%; border-right: none; }
  .input-panel.full-width .input-panel-inner { max-width: 680px; margin: 0 auto; padding: 24px; }

  /* ── UPLOAD ZONE ── */
  .upload-label { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; display: block; }

  /* Full/large dropzone — when no results */
  .dropzone {
    background: var(--bg); border: 2px dashed var(--border2);
    border-radius: var(--radius); padding: 32px 20px; text-align: center;
    cursor: pointer; transition: all .2s ease;
  }
  .dropzone:hover, .dropzone.drag { border-color: var(--blue); background: var(--blue-lt); }
  .dz-icon-wrap { width: 48px; height: 48px; background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; transition: all .2s; }
  .dropzone:hover .dz-icon-wrap, .dropzone.drag .dz-icon-wrap { background: var(--blue); border-color: var(--blue); }
  .dz-icon-wrap svg { width: 20px; height: 20px; color: var(--text3); transition: color .2s; }
  .dropzone:hover .dz-icon-wrap svg, .dropzone.drag .dz-icon-wrap svg { color: #fff; }
  .dz-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .dz-sub { font-size: 11px; color: var(--text3); }
  .file-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--green-lt); color: var(--green); border: 1px solid #A7F3D0; border-radius: 99px; padding: 4px 12px; font-size: 11px; font-weight: 700; margin-top: 10px; }

  /* Compact dropzone — when results are shown on the right */
  .dropzone-compact {
    background: var(--bg); border: 2px dashed var(--border2);
    border-radius: var(--radius-sm); padding: 12px 14px;
    cursor: pointer; transition: all .2s ease;
    display: flex; align-items: center; gap: 12px;
  }
  .dropzone-compact:hover, .dropzone-compact.drag { border-color: var(--blue); background: var(--blue-lt); }
  .dz-compact-icon { width: 36px; height: 36px; background: var(--surface); border: 1px solid var(--border2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .2s; }
  .dropzone-compact:hover .dz-compact-icon, .dropzone-compact.drag .dz-compact-icon { background: var(--blue); border-color: var(--blue); }
  .dz-compact-icon svg { width: 16px; height: 16px; color: var(--text3); transition: color .2s; }
  .dropzone-compact:hover .dz-compact-icon svg, .dropzone-compact.drag .dz-compact-icon svg { color: #fff; }
  .dz-compact-text { min-width: 0; }
  .dz-compact-title { font-size: 12px; font-weight: 700; color: var(--text); }
  .dz-compact-sub { font-size: 10px; color: var(--text3); margin-top: 1px; }
  .file-badge-compact { display: inline-flex; align-items: center; gap: 4px; background: var(--green-lt); color: var(--green); border: 1px solid #A7F3D0; border-radius: 99px; padding: 3px 10px; font-size: 10px; font-weight: 700; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

  /* ── MANUAL ENTRY PANEL ── */
  .field-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--text3); margin-bottom: 5px; display: block; }
  .field-input {
    width: 100%; padding: 9px 11px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text);
    background: var(--surface); transition: border-color .15s, box-shadow .15s; outline: none;
  }
  .field-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
  .field-input::placeholder { color: var(--text3); }

  .branch-pills-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 4px; }
  .branch-pill-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 99px;
    border: 1.5px solid var(--border); background: var(--surface);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    color: var(--text2); cursor: pointer; transition: all .15s;
  }
  .branch-pill-btn:hover { border-color: var(--blue-mid); background: var(--blue-lt); color: var(--blue); }
  .branch-pill-btn.active { border-color: var(--blue); background: var(--blue); color: #fff; }
  .branch-pill-btn .del-x { opacity: .6; font-size: 10px; margin-left: 2px; }
  .branch-pill-btn.active .del-x { opacity: .8; color: #fff; }
  .branch-pill-btn .del-x:hover { opacity: 1; }

  .add-branch-row { display: flex; gap: 6px; }
  .add-branch-row input { flex: 1; padding: 8px 10px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text); background: var(--surface); outline: none; }
  .add-branch-row input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
  .btn-add-branch { padding: 8px 14px; background: var(--blue); color: #fff; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; line-height: 1; cursor: pointer; transition: background .15s; }
  .btn-add-branch:hover { background: #1D4ED8; }

  /* Rider list in manual panel */
  .rider-rows { display: flex; flex-direction: column; gap: 4px; }
  .rider-row-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: var(--surface);
    cursor: pointer; transition: all .15s;
  }
  .rider-row-item:hover { border-color: var(--blue-mid); background: #F5F8FF; }
  .rider-row-item.selected { border-color: var(--blue); background: var(--blue-lt); }
  .rider-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; background: var(--blue-lt); color: var(--blue); border: 2px solid var(--blue-mid); transition: all .15s; }
  .rider-row-item.selected .rider-avatar { background: var(--blue); color: #fff; border-color: var(--blue); }
  .rider-row-name { flex: 1; font-size: 12px; font-weight: 700; color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rider-row-hits { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700; color: var(--blue); background: var(--blue-lt); padding: 2px 8px; border-radius: 99px; border: 1px solid var(--blue-mid); white-space: nowrap; }
  .rider-row-reward { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700; color: var(--green); white-space: nowrap; }
  .rider-del-btn { background: none; border: none; cursor: pointer; color: var(--text3); font-size: 12px; padding: 2px 5px; border-radius: 3px; transition: all .12s; }
  .rider-del-btn:hover { color: var(--red); background: var(--red-lt); }

  /* Hit type chooser — inline card below selected rider */
  .hit-chooser {
    background: var(--bg); border: 1.5px solid var(--blue-mid);
    border-radius: var(--radius); padding: 14px;
    display: flex; flex-direction: column; gap: 10px;
    animation: slideDown .18s ease;
  }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .hit-chooser-header { display: flex; align-items: center; justify-content: space-between; }
  .hit-chooser-who { font-size: 11px; font-weight: 700; color: var(--blue); display: flex; align-items: center; gap: 6px; }
  .cancel-hit-btn { font-size: 10px; color: var(--text3); background: none; border: 1px solid var(--border2); border-radius: 5px; padding: 3px 9px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .cancel-hit-btn:hover { color: var(--red); border-color: #FECACA; background: var(--red-lt); }

  .hit-type-btns { display: flex; gap: 7px; }
  .hit-type-btn {
    flex: 1; padding: 11px 8px;
    border-radius: 10px; border: 2px solid var(--border);
    background: var(--surface); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    transition: all .15s;
  }
  .hit-type-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow); }
  .hit-type-btn.solo { border-color: var(--blue-mid); background: var(--blue-lt); }
  .hit-type-btn.solo:hover:not(:disabled) { border-color: var(--blue); }
  .hit-type-btn.hot { border-color: #FDE68A; background: var(--amber-lt); }
  .hit-type-btn.hot:hover:not(:disabled) { border-color: var(--amber); }
  .hit-type-btn:disabled { opacity: .45; cursor: not-allowed; }
  .hit-type-btn .hti-emoji { font-size: 20px; }
  .hit-type-btn .hti-label { font-size: 11px; font-weight: 800; }
  .hit-type-btn .hti-sub { font-size: 9px; opacity: .7; }
  .hit-type-btn .hti-badge { font-family: 'DM Mono', monospace; font-weight: 800; font-size: 13px; padding: 2px 10px; border-radius: 99px; margin-top: 2px; }
  .hit-type-btn.solo .hti-badge { background: var(--blue); color: #fff; }
  .hit-type-btn.hot .hti-badge { background: var(--amber); color: #fff; }

  /* Hot count step */
  .hot-count-box { display: flex; flex-direction: column; gap: 8px; }
  .hot-count-row { display: flex; align-items: center; justify-content: center; gap: 16px; }
  .count-btn { width: 34px; height: 34px; border: 1.5px solid var(--border2); border-radius: 7px; background: var(--surface); cursor: pointer; font-size: 18px; font-weight: 700; color: var(--text2); display: flex; align-items: center; justify-content: center; transition: all .12s; }
  .count-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-lt); }
  .count-display { text-align: center; }
  .count-num { font-family: 'DM Mono', monospace; font-weight: 900; font-size: 36px; color: var(--text); line-height: 1; }
  .count-sub { font-size: 10px; color: var(--text3); }
  .hot-preview { background: var(--amber-lt); border: 1.5px solid #FDE68A; border-radius: 8px; padding: 9px 12px; text-align: center; }
  .hot-preview-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #92400E; }
  .hot-preview-amt { font-family: 'DM Mono', monospace; font-weight: 900; font-size: 26px; color: var(--amber); }
  .hot-preview-sub { font-size: 10px; color: #B45309; }
  .hot-step-btns { display: flex; gap: 6px; }

  .day-label-row { display: flex; flex-direction: column; gap: 4px; }

  /* New rider form */
  .new-rider-form { background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px; display: flex; flex-direction: column; gap: 8px; animation: slideDown .18s ease; }
  .new-rider-form-header { font-size: 11px; font-weight: 700; color: var(--text2); display: flex; align-items: center; justify-content: space-between; }

  /* Totals bar in manual panel */
  .panel-totals-bar { background: linear-gradient(135deg, #064E3B 0%, #047857 100%); border-radius: var(--radius-sm); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .panel-totals-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.75); }
  .panel-totals-amount { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 800; color: #fff; }

  .panel-actions { display: flex; gap: 7px; flex-shrink: 0; }
  .panel-btn { flex: 1; padding: 10px 14px; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .panel-btn-secondary { background: var(--bg); color: var(--text2); border: 1.5px solid var(--border2); }
  .panel-btn-secondary:hover { border-color: var(--blue-mid); color: var(--blue); background: var(--blue-lt); }
  .panel-btn-primary { background: linear-gradient(135deg, var(--purple) 0%, #6D28D9 100%); color: #fff; box-shadow: 0 2px 10px rgba(124,58,237,.28); }
  .panel-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(124,58,237,.4); }
  .panel-btn-export { background: linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%); color: #fff; box-shadow: 0 2px 10px rgba(37,99,235,.28); }
  .panel-btn-export:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,.4); }
  .panel-btn svg { width: 13px; height: 13px; }

  .validation-msg { font-size: 11px; color: var(--red); background: var(--red-lt); border: 1px solid #FECACA; border-radius: var(--radius-xs); padding: 8px 11px; display: flex; align-items: center; gap: 5px; }

  /* ── ALERT BANNERS ── */
  .alert { display: flex; gap: 10px; align-items: flex-start; border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px; font-size: 12px; line-height: 1.7; border: 1px solid; }
  .alert-icon svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
  .alert.warn  { background: var(--amber-lt); color: var(--amber); border-color: #FDE68A; }
  .alert.err   { background: var(--red-lt);   color: var(--red);   border-color: #FECACA; }
  .alert.merge { background: var(--purple-lt); color: var(--purple); border-color: #DDD6FE; }
  .alert-title { font-weight: 800; margin-bottom: 3px; }

  /* ── STAT CARDS ── */
  .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  @media(max-width:900px){ .stat-row { grid-template-columns: repeat(2,1fr); } }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 14px; transition: box-shadow .18s, transform .18s; }
  .stat-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
  .stat-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-icon svg { width: 19px; height: 19px; }
  .stat-num { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 700; line-height: 1; letter-spacing: -.02em; }
  .stat-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: .04em; text-transform: uppercase; margin-top: 3px; }

  /* ── REWARDS BANNER ── */
  .rewards-banner {
    background: linear-gradient(135deg, #064E3B 0%, #047857 100%);
    border-radius: var(--radius); padding: 18px 22px; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
    box-shadow: 0 4px 20px rgba(5,150,105,.2);
  }
  .rewards-banner-icon { width: 42px; height: 42px; background: rgba(255,255,255,.15); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .rewards-banner-title { font-size: 15px; font-weight: 800; color: #fff; }
  .rewards-banner-sub { font-size: 10px; color: rgba(255,255,255,.6); margin-top: 2px; }
  .rewards-banner-total { font-family: 'DM Mono', monospace; font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -.02em; }

  .rewards-legend { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .legend-pill { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .legend-dot { width: 7px; height: 7px; border-radius: 50%; }

  /* ── BRANCH CARDS ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text3); }
  .section-count { font-size: 10px; font-weight: 700; color: var(--text3); font-family: 'DM Mono', monospace; }
  .branch-block { margin-bottom: 18px; }
  .branch-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
  .branch-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); background: var(--bg); flex-wrap: wrap; gap: 8px; }
  .branch-left { display: flex; align-items: center; gap: 9px; }
  .branch-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .branch-name-text { font-weight: 800; font-size: 13.5px; letter-spacing: -.01em; }
  .branch-pill-tag { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 99px; font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border: 1px solid; }
  .branch-stats-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .branch-stat-item { text-align: right; }
  .branch-stat-num { font-family: 'DM Mono', monospace; font-size: 17px; font-weight: 800; line-height: 1; }
  .branch-stat-lbl { font-size: 9px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .04em; margin-top: 2px; }
  .branch-vdiv { width: 1px; height: 28px; background: var(--border); }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th { padding: 9px 14px; text-align: left; font-size: 9px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text3); background: var(--bg); border-bottom: 1px solid var(--border); white-space: nowrap; }
  thead th:first-child { width: 44px; text-align: center; }
  thead th.center { text-align: center; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover td { background: #F5F8FF; }
  tbody td { padding: 12px 14px; color: var(--text); vertical-align: middle; }
  tbody td:first-child { text-align: center; }
  .row-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text3); font-weight: 600; }
  .rider-name-cell { font-weight: 700; font-size: 13px; }
  .rider-alias-cell { font-size: 9px; color: var(--purple); font-weight: 600; margin-top: 2px; font-family: 'DM Mono', monospace; }
  .hit-badge-cell { display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 99px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 800; }
  .date-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .date-tag { padding: 2px 7px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 700; border: 1px solid; white-space: nowrap; display: inline-flex; align-items: center; gap: 3px; }
  .date-tag.hot { background: #ECFDF5 !important; color: #065F46 !important; border-color: #6EE7B7 !important; }
  .date-tag.hot::before { content: '🔥'; font-size: 8px; }
  .reward-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 99px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 800; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
  .reward-badge.split { background: var(--amber-lt); color: #92400E; border-color: #FDE68A; }
  .reward-breakdown-cell { font-size: 9px; color: var(--text3); margin-top: 2px; font-family: 'DM Mono', monospace; }
  .reward-breakdown-cell .hot-day { color: #059669; font-weight: 700; }
  .reward-breakdown-cell .solo-day { color: #2563EB; }
  .tr-total td { background: var(--bg) !important; font-weight: 800; font-size: 11px; letter-spacing: .02em; padding: 10px 14px; }

  /* ── EMPTY STATE ── */
  .empty-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow-sm); }
  .how-title { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--blue); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .how-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .how-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 18px; }
  .how-card { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; transition: border-color .2s, box-shadow .2s; }
  .how-card:hover { border-color: var(--blue-mid); box-shadow: 0 0 0 3px rgba(37,99,235,.06); }
  .how-card-icon { width: 32px; height: 32px; background: var(--blue-lt); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; margin-bottom: 8px; }
  .how-card-title { font-weight: 700; font-size: 12px; margin-bottom: 4px; }
  .how-card-desc { font-size: 11px; color: var(--text2); line-height: 1.5; }
  .col-detect { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 18px; font-size: 11px; color: var(--text2); line-height: 2; }
  .col-kw { display: inline-block; background: var(--surface); border: 1px solid var(--border2); border-radius: 3px; padding: 0 5px; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text); font-weight: 600; margin: 1px 2px; }

  /* ── MANUAL RESULTS TABLE (matches sample image) ── */
  .manual-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
  .manual-table-banner { background: #1B3A6B; color: #fff; padding: 11px 18px; font-weight: 800; font-size: 13px; letter-spacing: .03em; text-align: center; }

  /* ── HISTORY VIEW BACK BUTTON ── */
  .back-btn { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 6px 13px; font-size: 11px; font-weight: 700; color: var(--text2); cursor: pointer; margin-bottom: 18px; font-family: 'DM Sans', sans-serif; transition: all .15s; }
  .back-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-lt); }
  .history-banner { display: flex; align-items: center; gap: 9px; background: var(--blue-lt); border: 1px solid var(--blue-mid); border-radius: var(--radius-sm); padding: 9px 14px; margin-bottom: 18px; }
  .history-banner span { font-size: 11.5px; color: var(--blue); font-weight: 700; }
  .history-banner .time { font-size: 10px; color: var(--text3); margin-left: auto; }
`;

const PALETTE = [
  { dot:"#2563EB", pill:{bg:"#EFF6FF",color:"#2563EB",border:"#BFDBFE"}, hit:{bg:"#EFF6FF",color:"#2563EB"}, date:{bg:"#EFF6FF",color:"#1D4ED8",border:"#BFDBFE"} },
  { dot:"#7C3AED", pill:{bg:"#F5F3FF",color:"#7C3AED",border:"#DDD6FE"}, hit:{bg:"#F5F3FF",color:"#7C3AED"}, date:{bg:"#F5F3FF",color:"#6D28D9",border:"#DDD6FE"} },
  { dot:"#059669", pill:{bg:"#ECFDF5",color:"#059669",border:"#A7F3D0"}, hit:{bg:"#ECFDF5",color:"#059669"}, date:{bg:"#ECFDF5",color:"#047857",border:"#A7F3D0"} },
  { dot:"#D97706", pill:{bg:"#FFFBEB",color:"#D97706",border:"#FDE68A"}, hit:{bg:"#FFFBEB",color:"#D97706"}, date:{bg:"#FFFBEB",color:"#B45309",border:"#FDE68A"} },
  { dot:"#DC2626", pill:{bg:"#FEF2F2",color:"#DC2626",border:"#FECACA"}, hit:{bg:"#FEF2F2",color:"#DC2626"}, date:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"} },
  { dot:"#0891B2", pill:{bg:"#ECFEFF",color:"#0891B2",border:"#A5F3FC"}, hit:{bg:"#ECFEFF",color:"#0891B2"}, date:{bg:"#ECFEFF",color:"#0E7490",border:"#A5F3FC"} },
];

/* ── FUZZY MERGE ── */
function normalizeName(n) { return String(n||"").toLowerCase().replace(/[\r\n]+/g," ").replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim(); }
function levenshtein(a,b){if(Math.abs(a.length-b.length)>3)return 999;const dp=Array.from({length:a.length+1},(_,i)=>[i,...Array(b.length).fill(0)]);for(let j=0;j<=b.length;j++)dp[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);return dp[a.length][b.length];}
function isSamePerson(A,B){const a=normalizeName(A),b=normalizeName(B);if(!a||!b)return false;if(a===b)return true;const ta=a.split(" "),tb=b.split(" ");if(ta.length<2||tb.length<2)return false;if(ta[0]!==tb[0])return false;const la=ta[ta.length-1],lb=tb[tb.length-1];if(la.length<=4||lb.length<=4)return la===lb;return levenshtein(la,lb)<=2&&Math.abs(a.length-b.length)<=5;}
function fuzzyMerge(entries){const merged=[],log=[];for(const e of entries){let found=false;for(const m of merged){if(isSamePerson(m.rider,e.rider)){if(normalizeName(m.rider)!==normalizeName(e.rider)){m.aliases=m.aliases||new Set();m.aliases.add(e.rider);}for(const d of e.dates)if(!m.dates.includes(d))m.dates.push(d);if(e.rider.length>m.rider.length){m.aliases=m.aliases||new Set();m.aliases.add(m.rider);m.rider=e.rider;}found=true;break;}}if(!found)merged.push({...e,dates:[...e.dates],aliases:null});}for(const m of merged){if(m.aliases?.size>0)log.push({canonical:m.rider,aliases:[...m.aliases]});m.aliases=m.aliases?[...m.aliases]:[];}return{merged,log};}

/* ── COLUMN DETECTION ── */
function bestCol(headers,keywords){let best=-1,bestScore=0;headers.forEach((h,i)=>{const hh=String(h||"").toLowerCase().trim();let score=0;for(const kw of keywords){if(hh===kw)score+=10;else if(hh.startsWith(kw)||hh.endsWith(kw))score+=6;else if(hh.includes(kw))score+=3;}if(score>bestScore){bestScore=score;best=i;}});return bestScore>0?best:-1;}
function detectColumns(headers){const branch=bestCol(headers,["branch","hub","area","zone","region","depot","store","site","location"]);const rider=bestCol(headers,["rider","courier","driver","agent","name","employee","staff","personnel"]);const podRate=bestCol(headers,["pod rate","pod%","pod %","delivery rate","success rate","completion rate","rate","%"]);const date=bestCol(headers,["date","day","period","week","month","timestamp","time"]);const podQty=bestCol(headers,["pod quantity","pod qty","pod count","pod delivered","pod scan","delivered qty","delivered quantity"]);const totalQty=bestCol(headers,["delivery scan quantity","scan quantity","total scan","total quantity","delivery quantity","total parcels","waybill","total","quantity","qty","count"]);const safePodQty=(podQty!==-1&&podQty!==totalQty)?podQty:-1;const safeTotalQty=(totalQty!==-1&&totalQty!==podQty)?totalQty:-1;return{branch,rider,podRate,date,podQty:safePodQty,totalQty:safeTotalQty};}
function parseRate(val){if(val===null||val===undefined||val==="")return null;if(typeof val==="number"){if(val>=0&&val<=1)return Math.round(val*1000)/10;if(val>=0&&val<=100)return Math.round(val*10)/10;return null;}const n=parseFloat(String(val).replace(/%/g,"").trim());if(isNaN(n))return null;if(n>=0&&n<=1)return Math.round(n*1000)/10;if(n>=0&&n<=100)return Math.round(n*10)/10;return null;}

/* ── REWARDS ── */
function computeRewards(branches){const branchDateMap={};for(const[branch,riders]of Object.entries(branches)){branchDateMap[branch]={};for(const rider of riders){for(const date of rider.dates){if(!branchDateMap[branch][date])branchDateMap[branch][date]=[];branchDateMap[branch][date].push(rider.rider);}}}const riderRewardMap={},hotDateSet=new Set(),branchTotals={};let grandTotal=0;for(const[branch,dateMap]of Object.entries(branchDateMap)){riderRewardMap[branch]={};branchTotals[branch]=0;for(const[date,riderNames]of Object.entries(dateMap)){const count=riderNames.length;const isHot=count>=3;const rewardEach=isHot?(300/count):100;if(isHot)hotDateSet.add(`${branch}|||${date}`);for(const riderName of riderNames){if(!riderRewardMap[branch][riderName])riderRewardMap[branch][riderName]={total:0,breakdown:[]};riderRewardMap[branch][riderName].total+=rewardEach;riderRewardMap[branch][riderName].breakdown.push({date,amount:rewardEach,isHot,ridersOnDate:count});branchTotals[branch]+=rewardEach;grandTotal+=rewardEach;}}}return{riderRewardMap,hotDateSet,branchTotals,grandTotal};}

/* ── PROCESS SHEETS ── */
async function processSheets(workbook){const XLSX=await XLSXPromise;const allData={};const warnings=[];const SKIP_RIDERS=new Set(["rider","name","courier","driver","agent","employee","staff","personnel",""]);const SKIP_BRANCHES=new Set(["branch","hub","area","zone","region","none",""]);for(const sheetName of workbook.SheetNames){const ws=workbook.Sheets[sheetName];if(!ws)continue;let raw;try{raw=XLSX.utils.sheet_to_json(ws,{header:1,defval:"",raw:true});}catch{warnings.push(`Sheet "${sheetName}": could not parse, skipped.`);continue;}raw=raw.filter(r=>r.some(c=>c!==""&&c!==null&&c!==undefined));if(raw.length<2){warnings.push(`Sheet "${sheetName}": too few rows, skipped.`);continue;}let headerIdx=0,bestCount=0;for(let i=0;i<Math.min(8,raw.length);i++){const cnt=raw[i].filter(c=>c!=="").length;if(cnt>bestCount){bestCount=cnt;headerIdx=i;}}const headers=raw[headerIdx];const cols=detectColumns(headers);if(cols.rider===-1){warnings.push(`Sheet "${sheetName}": no Rider/Name column — skipped.`);continue;}if(cols.podRate===-1){warnings.push(`Sheet "${sheetName}": no POD Rate column — skipped.`);continue;}if(cols.branch===-1)warnings.push(`Sheet "${sheetName}": no Branch column — using sheet name for all rows.`);const isFormatA=cols.podQty!==-1&&cols.totalQty!==-1;let lastBranch=sheetName;for(const row of raw.slice(headerIdx+1)){const branchRaw=cols.branch!==-1?String(row[cols.branch]??"").trim():"";if(branchRaw&&!SKIP_BRANCHES.has(branchRaw.toLowerCase()))lastBranch=branchRaw;const branch=lastBranch;const rider=String(row[cols.rider]??"").replace(/\u00A0/g," ").replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim();if(!rider)continue;if(SKIP_RIDERS.has(rider.toLowerCase()))continue;if(SKIP_BRANCHES.has(branch.toLowerCase()))continue;const rate=parseRate(row[cols.podRate]);if(rate===null)continue;const key=`${branch}|||${rider}`;let dateLabel=sheetName;if(cols.date!==-1){const dv=row[cols.date];if(dv!==""&&dv!==null&&dv!==undefined){if(dv instanceof Date){const mm=String(dv.getMonth()+1).padStart(2,"0");const dd=String(dv.getDate()).padStart(2,"0");const yy=dv.getFullYear();dateLabel=`${mm}/${dd}/${yy}`;}else{dateLabel=String(dv).trim()||sheetName;}}}if(isFormatA){if(rate>=99.9){if(!allData[key])allData[key]={branch,rider,dates:[],failed:false};if(!allData[key].dates.includes(dateLabel))allData[key].dates.push(dateLabel);}}else{if(!allData[key])allData[key]={branch,rider,dates:[],failed:false};if(rate>=99.9){if(!allData[key].dates.includes(dateLabel))allData[key].dates.push(dateLabel);}else{allData[key].failed=true;}}}}const qualified=Object.values(allData).filter(e=>!e.failed&&e.dates.length>0);const byBranch={};for(const e of qualified){if(!byBranch[e.branch])byBranch[e.branch]=[];byBranch[e.branch].push(e);}const branches={};const allMergeEvents=[];for(const[branch,entries]of Object.entries(byBranch)){const{merged,log}=fuzzyMerge(entries);if(!merged.length)continue;merged.sort((a,b)=>b.dates.length-a.dates.length||a.rider.localeCompare(b.rider));branches[branch]=merged;for(const evt of log)allMergeEvents.push({branch,...evt});}return{branches,warnings,mergeEvents:allMergeEvents};}

/* ── MANUAL HELPERS ── */
function manualToBranches(manualBranches){const branches={};for(const[branchName,riders]of Object.entries(manualBranches)){if(!riders.length)continue;branches[branchName]=riders.map(r=>({rider:r.name,dates:r.hits.map(h=>h.dateKey),aliases:[],_manualReward:calcManualRiderReward(r.hits),}));}return branches;}
function manualBranchTotals(branches){const totals={};for(const[branch,riders]of Object.entries(branches)){totals[branch]=riders.reduce((s,r)=>s+(r._manualReward??0),0);}return totals;}
function calcManualRiderReward(hits){return hits.reduce((sum,h)=>sum+(h.type==="hot"?(300/h.ridersOnDay):100),0);}
function calcManualBranchReward(riders){return riders.reduce((s,r)=>s+calcManualRiderReward(r.hits),0);}
function fmtPeso(n){return n%1===0?n.toLocaleString("en"):n.toFixed(2);}

/* ── XLSX EXPORT (file upload) ── */
const BRANCH_COLORS_XLSX=[{header:"1E3A5F",headerFg:"FFFFFF",stripe:"EBF3FB",dot:"2563EB",subtotal:"DBEAFE"},{header:"3B1F6B",headerFg:"FFFFFF",stripe:"F3EEFF",dot:"7C3AED",subtotal:"EDE9FE"},{header:"064E3B",headerFg:"FFFFFF",stripe:"ECFDF5",dot:"059669",subtotal:"D1FAE5"},{header:"78350F",headerFg:"FFFFFF",stripe:"FFFBEB",dot:"D97706",subtotal:"FEF3C7"},{header:"7F1D1D",headerFg:"FFFFFF",stripe:"FEF2F2",dot:"DC2626",subtotal:"FEE2E2"},{header:"164E63",headerFg:"FFFFFF",stripe:"ECFEFF",dot:"0891B2",subtotal:"CFFAFE"}];
async function exportXLSX(branches,sourceFileName,summaryDate){const XLSX=await XLSXPromise;const wb=XLSX.utils.book_new();const allRiders=Object.values(branches).flat();const totalHits=allRiders.reduce((s,r)=>s+r.dates.length,0);const today=new Date();const dateStr=summaryDate?new Date(summaryDate).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):today.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});const generatedStr=today.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});const{riderRewardMap,hotDateSet,branchTotals,grandTotal}=computeRewards(branches);const sc=(ws,addr,v,s)=>{ws[addr]={...(typeof v==="object"&&v!==null&&"v"in v?v:{v,t:typeof v==="number"?"n":"s"}),s};};const headerStyle=(bg,fg)=>({font:{name:"Arial",bold:true,color:{rgb:fg||"FFFFFF"},sz:10},fill:{patternType:"solid",fgColor:{rgb:bg}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"thin",color:{rgb:"FFFFFF"}},bottom:{style:"thin",color:{rgb:"FFFFFF"}},left:{style:"thin",color:{rgb:"FFFFFF"}},right:{style:"thin",color:{rgb:"FFFFFF"}}}});const dataStyle=(bg,bold,align,color)=>({font:{name:"Arial",sz:10,bold:!!bold,color:{rgb:color||"1E293B"}},fill:{patternType:"solid",fgColor:{rgb:bg||"FFFFFF"}},alignment:{horizontal:align||"left",vertical:"center",wrapText:true},border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}}});const ws={};const merges=[];let r=0;const COL_COUNT=6;const bannerRow=(text,bg,fg,sz,height)=>{sc(ws,`A${r+1}`,text,{font:{name:"Arial",bold:true,sz:sz||12,color:{rgb:fg||"FFFFFF"}},fill:{patternType:"solid",fgColor:{rgb:bg||"1E3A5F"}},alignment:{horizontal:"center",vertical:"center"}});merges.push({s:{r,c:0},e:{r,c:COL_COUNT-1}});ws[`!rows`]=ws[`!rows`]||[];ws[`!rows`][r]={hpt:height||22};r++;};const emptyRow=(bg)=>{for(let c=0;c<COL_COUNT;c++){const addr=XLSX.utils.encode_cell({r,c});sc(ws,addr,"",{fill:{patternType:"solid",fgColor:{rgb:bg||"F8FAFC"}}});}merges.push({s:{r,c:0},e:{r,c:COL_COUNT-1}});ws[`!rows`]=ws[`!rows`]||[];ws[`!rows`][r]={hpt:8};r++;};bannerRow("","1E3A5F","FFFFFF",12,12);bannerRow("📦  POD RATE ACHIEVEMENT REPORT  —  100% PERFORMERS","1E3A5F","FFFFFF",14,34);bannerRow(`Report Period: ${dateStr}   ·   Generated: ${generatedStr}   ·   Branches: ${Object.keys(branches).length}   ·   Riders: ${allRiders.length}   ·   Hits: ${totalHits}   ·   Total Rewards: ₱${grandTotal.toLocaleString("en",{minimumFractionDigits:2})}`,"2C4A6E","BFD4F0",9,18);bannerRow("","1E3A5F","FFFFFF",12,8);emptyRow("F8FAFC");bannerRow("OVERALL SUMMARY","0F172A","94A3B8",9,20);const sumHdrStyle=headerStyle("334155","E2E8F0");["Branch","Riders at 100%","Total Hits","Branch Rewards (₱)","Top Performer","Top Hits"].forEach((h,i)=>sc(ws,XLSX.utils.encode_cell({r,c:i}),h,sumHdrStyle));ws[`!rows`]=ws[`!rows`]||[];ws[`!rows`][r]={hpt:20};r++;Object.entries(branches).forEach(([branch,riders],bi)=>{const pal=BRANCH_COLORS_XLSX[bi%BRANCH_COLORS_XLSX.length];const bHits=riders.reduce((s,rr)=>s+rr.dates.length,0);const top=riders[0];const branchReward=branchTotals[branch]||0;const isEven=bi%2===0;[branch,riders.length,bHits,`₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})}`,top?.rider||"",top?.dates.length||0].forEach((v,i)=>{sc(ws,XLSX.utils.encode_cell({r,c:i}),v,dataStyle(isEven?"FFFFFF":"F8FAFC",i===0,["left","center","center","center","left","center"][i],i===0?pal.header:"1E293B"));});ws[`!rows`][r]={hpt:18};r++;});const gtStyle={font:{name:"Arial",bold:true,sz:10,color:{rgb:"1E293B"}},fill:{patternType:"solid",fgColor:{rgb:"E2E8F0"}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"medium",color:{rgb:"94A3B8"}},bottom:{style:"medium",color:{rgb:"94A3B8"}}}};["GRAND TOTAL",Object.keys(branches).length,totalHits,`₱${grandTotal.toLocaleString("en",{minimumFractionDigits:2})}`,`${allRiders.length} riders total`,""].forEach((v,i)=>{sc(ws,XLSX.utils.encode_cell({r,c:i}),v,{...gtStyle,alignment:{horizontal:i===0?"left":"center",vertical:"center"}});});ws[`!rows`][r]={hpt:20};r++;emptyRow("F8FAFC");emptyRow("F8FAFC");Object.entries(branches).forEach(([branch,riders],bi)=>{const pal=BRANCH_COLORS_XLSX[bi%BRANCH_COLORS_XLSX.length];const bHits=riders.reduce((s,rr)=>s+rr.dates.length,0);const branchReward=branchTotals[branch]||0;sc(ws,`A${r+1}`,`  ${branch.toUpperCase()}`,{font:{name:"Arial",bold:true,sz:11,color:{rgb:pal.headerFg}},fill:{patternType:"solid",fgColor:{rgb:pal.header}},alignment:{horizontal:"left",vertical:"center"}});merges.push({s:{r,c:0},e:{r,c:3}});sc(ws,XLSX.utils.encode_cell({r,c:4}),`${riders.length} riders · ${bHits} hits · ₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})} rewards`,{font:{name:"Arial",sz:9,color:{rgb:pal.headerFg}},fill:{patternType:"solid",fgColor:{rgb:pal.header}},alignment:{horizontal:"right",vertical:"center"}});merges.push({s:{r,c:4},e:{r,c:5}});ws[`!rows`][r]={hpt:24};r++;["#","Rider Name","Times Hit 100%","Dates Achieved","Total Reward (₱)","Reward Breakdown"].forEach((h,i)=>{sc(ws,XLSX.utils.encode_cell({r,c:i}),h,headerStyle(pal.header,pal.headerFg));});ws[`!rows`][r]={hpt:18};r++;riders.forEach((rider,ri)=>{const isStripe=ri%2!==0;const bg=isStripe?pal.stripe:"FFFFFF";const rInfo=riderRewardMap[branch]?.[rider.rider]||{total:0,breakdown:[]};const breakdownStr=rInfo.breakdown.map(b=>`${b.date}: ₱${b.amount.toFixed(2)}${b.isHot?" (🔥 shared ÷"+b.ridersOnDate+")":""}`).join(" | ");sc(ws,XLSX.utils.encode_cell({r,c:0}),ri+1,dataStyle(bg,false,"center"));sc(ws,XLSX.utils.encode_cell({r,c:1}),rider.rider,dataStyle(bg,true,"left"));sc(ws,XLSX.utils.encode_cell({r,c:2}),rider.dates.length,{font:{name:"Arial",bold:true,sz:11,color:{rgb:pal.dot}},fill:{patternType:"solid",fgColor:{rgb:bg}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}}});const datesWithHot=rider.dates.map(d=>hotDateSet.has(`${branch}|||${d}`)?`🔥${d}`:d).join("  ·  ");sc(ws,XLSX.utils.encode_cell({r,c:3}),datesWithHot,dataStyle(bg,false,"left","374151"));sc(ws,XLSX.utils.encode_cell({r,c:4}),`₱${rInfo.total.toLocaleString("en",{minimumFractionDigits:2})}`,{font:{name:"Arial",bold:true,sz:11,color:{rgb:"059669"}},fill:{patternType:"solid",fgColor:{rgb:bg}},alignment:{horizontal:"center",vertical:"center"},border:{top:{style:"hair",color:{rgb:"E2E8F0"}},bottom:{style:"hair",color:{rgb:"E2E8F0"}},left:{style:"hair",color:{rgb:"E2E8F0"}},right:{style:"hair",color:{rgb:"E2E8F0"}}}});sc(ws,XLSX.utils.encode_cell({r,c:5}),breakdownStr,dataStyle(bg,false,"left","64748B"));ws[`!rows`][r]={hpt:rider.dates.length>6?30:18};r++;});["","Branch Total",bHits,"",`₱${branchReward.toLocaleString("en",{minimumFractionDigits:2})}`,""].forEach((v,i)=>{sc(ws,XLSX.utils.encode_cell({r,c:i}),v,{font:{name:"Arial",bold:true,sz:10,color:{rgb:i===2?pal.dot:i===4?"059669":"475569"}},fill:{patternType:"solid",fgColor:{rgb:pal.subtotal}},alignment:{horizontal:i===2||i===4?"center":"left",vertical:"center"},border:{top:{style:"thin",color:{rgb:pal.dot}},bottom:{style:"thin",color:{rgb:pal.dot}}}});});ws[`!rows`][r]={hpt:18};r++;emptyRow("F8FAFC");});emptyRow("F8FAFC");bannerRow("REWARD RULES: < 3 riders/day per branch = ₱100 each  ·  ≥ 3 riders/day per branch = ₱300 ÷ riders that day  ·  🔥 = hot day (3+ riders)","F1F5F9","64748B",8,18);bannerRow(`Report: ${sourceFileName}   ·   Period: ${dateStr}   ·   Generated: ${generatedStr}`,"F1F5F9","94A3B8",8,16);ws["!ref"]=XLSX.utils.encode_range({s:{r:0,c:0},e:{r,c:COL_COUNT-1}});ws["!cols"]=[{wch:5},{wch:30},{wch:16},{wch:55},{wch:18},{wch:50}];ws["!merges"]=merges;ws["!sheetView"]=[{showGridLines:false,state:"normal"}];XLSX.utils.book_append_sheet(wb,ws,"POD 100% Report");const baseName=sourceFileName?sourceFileName.replace(/\.[^.]+$/,""):"Report";XLSX.writeFile(wb,`POD_100pct_${baseName}.xlsx`);}

async function exportXLSXManual(branches,sourceFileName,summaryDate){const XLSX=await XLSXPromise;const wb=XLSX.utils.book_new();const bTotals=manualBranchTotals(branches);const label=(sourceFileName||"").replace(/^Manual — /i,"").replace(/\.[^.]+$/,"")||"POD Summary";const ws={};const merges=[];let r=0;const C=4;ws["!rows"]=ws["!rows"]||[];const rh=(height)=>{ws["!rows"][r]={hpt:height};};const border=(style="thin")=>({top:{style,color:{rgb:"000000"}},bottom:{style,color:{rgb:"000000"}},left:{style,color:{rgb:"000000"}},right:{style,color:{rgb:"000000"}},});const sc=(addr,v,s)=>{ws[addr]={...(typeof v==="object"&&v!==null&&"v"in v?v:{v,t:typeof v==="number"?"n":"s"}),s};};sc("A1",`POD SUMMARY 100% ${label.toUpperCase()}`,{font:{name:"Arial",bold:true,sz:12,color:{rgb:"FFFFFF"}},fill:{patternType:"solid",fgColor:{rgb:"1E3A8A"}},alignment:{horizontal:"center",vertical:"center"},border:border(),});merges.push({s:{r:0,c:0},e:{r:0,c:C-1}});rh(24);r++;const hdrStyle=(align="center")=>({font:{name:"Arial",bold:true,sz:10,color:{rgb:"000000"}},fill:{patternType:"solid",fgColor:{rgb:"FFFFFF"}},alignment:{horizontal:align,vertical:"center",wrapText:false},border:border("medium"),});sc(XLSX.utils.encode_cell({r,c:0}),"BRANCH",hdrStyle("center"));sc(XLSX.utils.encode_cell({r,c:1}),"RIDER",hdrStyle("center"));sc(XLSX.utils.encode_cell({r,c:2}),"NO. OF DAYS",hdrStyle("center"));sc(XLSX.utils.encode_cell({r,c:3}),"AMOUNT",hdrStyle("center"));rh(18);r++;const BRANCH_PALETTES=[{bg:"1E3A8A",fg:"FFFFFF",totalBg:"DBEAFE",totalFg:"1E3A8A"},{bg:"6B21A8",fg:"FFFFFF",totalBg:"EDE9FE",totalFg:"6B21A8"},{bg:"065F46",fg:"FFFFFF",totalBg:"D1FAE5",totalFg:"065F46"},{bg:"92400E",fg:"FFFFFF",totalBg:"FEF3C7",totalFg:"92400E"},{bg:"9B1C1C",fg:"FFFFFF",totalBg:"FEE2E2",totalFg:"9B1C1C"},{bg:"155E75",fg:"FFFFFF",totalBg:"CFFAFE",totalFg:"155E75"}];Object.entries(branches).forEach(([branch,riders],bi)=>{const bHits=riders.reduce((s,rr)=>s+rr.dates.length,0);const bReward=bTotals[branch]||0;const pal=BRANCH_PALETTES[bi%BRANCH_PALETTES.length];const riderCount=riders.length;const branchStart=r;riders.forEach((rider,ri)=>{const rReward=rider._manualReward??0;const dataCellStyle=(align="center")=>({font:{name:"Arial",sz:10,color:{rgb:"000000"}},fill:{patternType:"solid",fgColor:{rgb:"FFFFFF"}},alignment:{horizontal:align,vertical:"center"},border:border(),});if(ri===0){sc(XLSX.utils.encode_cell({r,c:0}),branch,{font:{name:"Arial",bold:true,sz:10,color:{rgb:pal.fg}},fill:{patternType:"solid",fgColor:{rgb:pal.bg}},alignment:{horizontal:"center",vertical:"center"},border:border("medium"),});}else{sc(XLSX.utils.encode_cell({r,c:0}),"",{fill:{patternType:"solid",fgColor:{rgb:pal.bg}},border:border("medium"),});}sc(XLSX.utils.encode_cell({r,c:1}),rider.rider,dataCellStyle("left"));sc(XLSX.utils.encode_cell({r,c:2}),rider.dates.length,dataCellStyle("center"));sc(XLSX.utils.encode_cell({r,c:3}),`\u20B1${rReward.toLocaleString("en",{minimumFractionDigits:2})}`,dataCellStyle("right"));rh(16);r++;});merges.push({s:{r:branchStart,c:0},e:{r:branchStart+riderCount,c:0}});sc(XLSX.utils.encode_cell({r,c:0}),"",{fill:{patternType:"solid",fgColor:{rgb:pal.bg}},border:border("medium"),});sc(XLSX.utils.encode_cell({r,c:1}),"TOTAL",{font:{name:"Arial",bold:true,sz:10,color:{rgb:pal.totalFg}},fill:{patternType:"solid",fgColor:{rgb:pal.totalBg}},alignment:{horizontal:"center",vertical:"center"},border:border("medium"),});sc(XLSX.utils.encode_cell({r,c:2}),bHits,{font:{name:"Arial",bold:true,sz:10,color:{rgb:pal.totalFg}},fill:{patternType:"solid",fgColor:{rgb:pal.totalBg}},alignment:{horizontal:"center",vertical:"center"},border:border("medium"),});sc(XLSX.utils.encode_cell({r,c:3}),`\u20B1${bReward.toLocaleString("en",{minimumFractionDigits:2})}`,{font:{name:"Arial",bold:true,sz:10,color:{rgb:pal.totalFg}},fill:{patternType:"solid",fgColor:{rgb:pal.totalBg}},alignment:{horizontal:"right",vertical:"center"},border:border("medium"),});merges.push({s:{r,c:1},e:{r,c:2}});rh(16);r++;for(let c=0;c<C;c++){sc(XLSX.utils.encode_cell({r,c}),"",{fill:{patternType:"solid",fgColor:{rgb:"FFFFFF"}},border:{top:{style:"thin",color:{rgb:"FFFFFF"}},bottom:{style:"thin",color:{rgb:"FFFFFF"}},left:{style:"thin",color:{rgb:"FFFFFF"}},right:{style:"thin",color:{rgb:"FFFFFF"}}},});}rh(8);r++;});ws["!ref"]=XLSX.utils.encode_range({s:{r:0,c:0},e:{r,c:C-1}});ws["!cols"]=[{wch:20},{wch:32},{wch:14},{wch:16}];ws["!merges"]=merges;ws["!sheetView"]=[{showGridLines:true,state:"normal"}];XLSX.utils.book_append_sheet(wb,ws,"POD Summary");const baseName=label.replace(/[^\w\s-]/g,"").trim()||"Report";XLSX.writeFile(wb,`POD_Summary_${baseName}.xlsx`);}

/* ── ICONS ── */
const IconPackage=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>);
const IconDownload=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IconUpload=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const IconCheck=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconWarn=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IconLink=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const IconBranch=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>);
const IconRiders=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconTrophy=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 2 8 8 12 11 16 8 16 2"/><path d="M8 2H4v6c0 3.31 2.69 6 6 6h0v4"/><path d="M16 2h4v6c0 3.31-2.69 6-6 6h0v4"/><rect x="8" y="20" width="8" height="2" rx="1"/></svg>);
const IconPeso=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="10" x2="13" y2="10"/><line x1="3" y1="14" x2="13" y2="14"/><path d="M7 20V4h5a5 5 0 0 1 0 10H7"/></svg>);
const IconEdit=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);

const HISTORY_KEY = "pod-tracker-history";
const MAX_HISTORY = 30;

/* ── MANUAL ENTRY PANEL (inline, not modal) ── */
function ManualEntryPanel({ onSubmit, state, setState }) {
  const { label, reportDate, branches, activeBranch, newBranch,
          riderName, dayLabel, hitStep, hotCount, validErr, selectedRiderIdx } = state;
  const set = k => v => setState(s => ({ ...s, [k]: typeof v === "function" ? v(s[k]) : v }));
  const hitCounterRef = useRef(0);
  const poolKeyRef = useRef({});
  const riderInputRef = useRef(null);

  const allRiders = Object.values(branches).flat();
  const totalHits = allRiders.reduce((s, r) => s + r.hits.length, 0);
  const grandTotal = Object.values(branches).reduce((s, riders) => s + calcManualBranchReward(riders), 0);
  const activeBranchRiders = activeBranch ? (branches[activeBranch] || []) : [];

  const addBranch = () => {
    const b = newBranch.trim();
    if (!b || branches[b]) return;
    setState(s => ({ ...s, branches: { ...s.branches, [b]: [] }, activeBranch: b, newBranch: "", hitStep: "idle", selectedRiderIdx: null }));
  };
  const deleteBranch = (b, e) => {
    e.stopPropagation();
    setState(s => { const n = { ...s.branches }; delete n[b]; return { ...s, branches: n, activeBranch: s.activeBranch === b ? null : s.activeBranch, selectedRiderIdx: null }; });
  };
  const selectBranch = (b) => setState(s => ({ ...s, activeBranch: b, hitStep: "idle", selectedRiderIdx: null, riderName: "" }));

  const selectRider = (idx) => {
    const rider = activeBranchRiders[idx];
    if (!rider) return;
    setState(s => ({ ...s, riderName: rider.name, selectedRiderIdx: idx, hitStep: "choosing", dayLabel: "" }));
    setTimeout(() => riderInputRef.current?.focus(), 50);
  };

  const addSoloHit = () => {
    const name = riderName.trim();
    if (!name || !activeBranch) return;
    hitCounterRef.current += 1;
    const lbl = dayLabel.trim() || `Hit ${hitCounterRef.current}`;
    const dateKey = `${lbl}__solo__${hitCounterRef.current}`;
    applyHit(name, { type: "solo", ridersOnDay: 1, label: lbl, dateKey });
  };
  const addHotHit = () => {
    const name = riderName.trim();
    const n = Math.max(3, Math.min(99, hotCount || 3));
    if (!name || !activeBranch) return;
    const lbl = dayLabel.trim() || `Hit ${hitCounterRef.current + 1}`;
    const poolKey = `${activeBranch}|${lbl}|${n}`;
    if (!poolKeyRef.current[poolKey]) { hitCounterRef.current += 1; poolKeyRef.current[poolKey] = `${lbl}__hot${n}__${hitCounterRef.current}`; }
    const dateKey = poolKeyRef.current[poolKey];
    applyHit(name, { type: "hot", ridersOnDay: n, label: lbl, dateKey });
    set("hotCount")(3);
  };
  const applyHit = (name, hit) => {
    setState(s => {
      const branch = s.activeBranch;
      const riders = s.branches[branch] || [];
      const idx = riders.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
      const updatedRiders = idx !== -1
        ? riders.map((r, i) => i === idx ? { ...r, hits: [...r.hits, hit] } : r)
        : [...riders, { name, hits: [hit] }];
      return { ...s, branches: { ...s.branches, [branch]: updatedRiders }, hitStep: "choosing", selectedRiderIdx: idx !== -1 ? idx : updatedRiders.length - 1, dayLabel: "" };
    });
  };
  const removeHit = (riderIdx, hitIdx) => {
    setState(s => {
      const updated = s.branches[s.activeBranch].map((r, i) => {
        if (i !== riderIdx) return r;
        const newHits = r.hits.filter((_, hi) => hi !== hitIdx);
        return newHits.length ? { ...r, hits: newHits } : null;
      }).filter(Boolean);
      return { ...s, branches: { ...s.branches, [s.activeBranch]: updated }, selectedRiderIdx: null, hitStep: "idle", riderName: "" };
    });
  };
  const removeRider = (idx) => {
    setState(s => ({
      ...s,
      branches: { ...s.branches, [s.activeBranch]: s.branches[s.activeBranch].filter((_, i) => i !== idx) },
      selectedRiderIdx: null, hitStep: "idle", riderName: ""
    }));
  };

  const handleSubmit = (andExport = false) => {
    if (!label.trim()) { setState(s => ({ ...s, validErr: "Please enter a Summary Label." })); return; }
    if (!Object.keys(branches).length) { setState(s => ({ ...s, validErr: "Add at least one branch." })); return; }
    if (!allRiders.length) { setState(s => ({ ...s, validErr: "Add at least one rider." })); return; }
    setState(s => ({ ...s, validErr: "" }));
    onSubmit({ label: label.trim(), date: reportDate, branches: manualToBranches(branches), andExport });
  };

  const isRiderSelected = selectedRiderIdx !== null && selectedRiderIdx >= 0 && selectedRiderIdx < activeBranchRiders.length;
  const branchKeys = Object.keys(branches);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden", padding: "14px", gap: 0 }}>

      {/* ── TOP: fixed inputs (label, date, branches) ── */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
        {/* Label + Date */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 2 }}>
            <label className="field-label">Summary Label *</label>
            <input className="field-input" placeholder="e.g. Weekly — Jan 2024" value={label} onChange={e => set("label")(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">Date</label>
            <input className="field-input" type="date" value={reportDate} onChange={e => set("reportDate")(e.target.value)} />
          </div>
        </div>

        {/* Branches */}
        <div>
          <label className="field-label" style={{ marginBottom: 5 }}>Branches ({branchKeys.length})</label>
          <div className="add-branch-row" style={{ marginBottom: branchKeys.length > 0 ? 7 : 0 }}>
            <input placeholder="Branch name…" value={newBranch} onChange={e => set("newBranch")(e.target.value)} onKeyDown={e => e.key === "Enter" && addBranch()} />
            <button className="btn-add-branch" onClick={addBranch} title="Add branch">+</button>
          </div>
          {branchKeys.length > 0 && (
            <div className="branch-pills-row">
              {branchKeys.map(b => (
                <button key={b} className={`branch-pill-btn${activeBranch === b ? " active" : ""}`} onClick={() => selectBranch(b)}>
                  {b}
                  <span className="del-x" onClick={e => deleteBranch(b, e)} title="Delete branch">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MIDDLE: riders area — flex 1, scrollable ── */}
      {activeBranch ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, paddingTop: 10 }}>
          {/* Branch header + ADD button always at top */}
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)", display: "flex", alignItems: "center", gap: 5, minWidth: 0, overflow: "hidden" }}>
              <span style={{ fontSize: 14 }}>🏢</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeBranch}</span>
              <span style={{ fontWeight: 500, fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>({activeBranchRiders.length}) · ₱{fmtPeso(calcManualBranchReward(activeBranchRiders))}</span>
            </div>
            {hitStep === "idle" && (
              <button
                onClick={() => setState(s => ({ ...s, hitStep: "choosing", riderName: "", selectedRiderIdx: null, dayLabel: "" }))}
                style={{
                  flexShrink: 0, padding: "7px 12px",
                  background: "linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%)",
                  border: "none", borderRadius: "var(--radius-sm)", color: "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                  boxShadow: "0 2px 6px rgba(37,99,235,.28)", transition: "all .15s",
                  whiteSpace: "nowrap"
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add Rider Hit
              </button>
            )}
          </div>

          {/* New rider form — pinned below header, above list */}
          {hitStep !== "idle" && !isRiderSelected && (
            <div className="new-rider-form" style={{ flexShrink: 0, marginBottom: 8 }}>
              <div className="new-rider-form-header">
                New Rider
                <button className="cancel-hit-btn" onClick={() => setState(s => ({ ...s, hitStep: "idle", riderName: "", selectedRiderIdx: null }))}>✕ Cancel</button>
              </div>
              <div>
                <label className="field-label" style={{ fontSize: 9 }}>Rider Name *</label>
                <input ref={riderInputRef} className="field-input" style={{ fontSize: 12, padding: "7px 10px" }} placeholder="e.g. Juan Dela Cruz" value={riderName} onChange={e => set("riderName")(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="field-label" style={{ fontSize: 9 }}>Day Label <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input className="field-input" style={{ fontSize: 12, padding: "7px 10px" }} placeholder="e.g. Jan 5, Week 2…" value={dayLabel} onChange={e => set("dayLabel")(e.target.value)} />
              </div>
              {hitStep === "choosing" && (
                <div className="hit-type-btns">
                  <button className="hit-type-btn solo" disabled={!riderName.trim()} onClick={addSoloHit}>
                    <span className="hti-emoji">💙</span><span className="hti-label">Solo Day</span>
                    <span className="hti-sub">1–2 riders</span><span className="hti-badge">₱100</span>
                  </button>
                  <button className="hit-type-btn hot" disabled={!riderName.trim()} onClick={() => set("hitStep")("hot-count")}>
                    <span className="hti-emoji">🔥</span><span className="hti-label">Hot Day</span>
                    <span className="hti-sub">3+ riders</span><span className="hti-badge">₱300÷n</span>
                  </button>
                </div>
              )}
              {hitStep === "hot-count" && (
                <div className="hot-count-box">
                  <div className="hot-count-row">
                    <button className="count-btn" onClick={() => set("hotCount")(v => Math.max(3, v - 1))}>−</button>
                    <div className="count-display"><div className="count-num">{hotCount}</div><div className="count-sub">riders</div></div>
                    <button className="count-btn" onClick={() => set("hotCount")(v => Math.min(99, v + 1))}>+</button>
                  </div>
                  <div className="hot-preview">
                    <div className="hot-preview-lbl">Each rider earns</div>
                    <div className="hot-preview-amt">₱{fmtPeso(300 / hotCount)}</div>
                    <div className="hot-preview-sub">₱300 ÷ {hotCount} riders</div>
                  </div>
                  <div className="hot-step-btns">
                    <button className="panel-btn panel-btn-secondary" style={{ flex: 1, padding: "7px" }} onClick={() => set("hitStep")("choosing")}>← Back</button>
                    <button className="panel-btn panel-btn-export" style={{ flex: 2, padding: "7px", fontSize: 11 }} disabled={!riderName.trim()} onClick={addHotHit}>✓ Add 🔥 — ₱{fmtPeso(300 / hotCount)}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scrollable rider list */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, minHeight: 0 }}>
            {activeBranchRiders.length === 0 && hitStep === "idle" && (
              <div style={{ padding: "20px 12px", textAlign: "center", color: "var(--text3)", fontSize: 11.5, background: "var(--bg)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border2)" }}>
                Click "+ Add Rider Hit" above to start
              </div>
            )}
            {activeBranchRiders.map((rider, rIdx) => {
              const rReward = calcManualRiderReward(rider.hits);
              const isSel = selectedRiderIdx === rIdx && hitStep !== "idle";
              return (
                <div key={rIdx}>
                  <div className={`rider-row-item${isSel ? " selected" : ""}`} onClick={() => selectRider(rIdx)} title="Click to add another hit">
                    <div className="rider-avatar">{rider.name.charAt(0).toUpperCase()}</div>
                    <div className="rider-row-name">{rider.name}</div>
                    <span className="rider-row-hits">{rider.hits.length}×</span>
                    <span className="rider-row-reward">₱{fmtPeso(rReward)}</span>
                    <button className="rider-del-btn" onClick={e => { e.stopPropagation(); removeRider(rIdx); }} title="Remove rider">✕</button>
                  </div>
                  {rider.hits.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, padding: "3px 6px 5px 38px" }}>
                      {rider.hits.map((h, hIdx) => {
                        const amt = h.type === "hot" ? (300 / h.ridersOnDay) : 100;
                        return (
                          <span key={hIdx} onClick={() => removeHit(rIdx, hIdx)} title="Click to remove"
                            style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 99, fontSize: 9, fontWeight: 700, cursor: "pointer", background: h.type === "hot" ? "#FFFBEB" : "#EFF6FF", color: h.type === "hot" ? "#B45309" : "#1D4ED8", border: `1px solid ${h.type === "hot" ? "#FDE68A" : "#BFDBFE"}`, transition: "all .12s", fontFamily: "'DM Mono', monospace" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#B91C1C"; e.currentTarget.style.borderColor = "#FECACA"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = h.type === "hot" ? "#FFFBEB" : "#EFF6FF"; e.currentTarget.style.color = h.type === "hot" ? "#B45309" : "#1D4ED8"; e.currentTarget.style.borderColor = h.type === "hot" ? "#FDE68A" : "#BFDBFE"; }}
                          >
                            {h.type === "hot" ? "🔥" : "💙"} {h.label} ₱{fmtPeso(amt)} <span style={{ opacity: .5 }}>✕</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* Inline hit chooser for already-added rider */}
                  {isSel && (
                    <div className="hit-chooser" style={{ marginLeft: 8, marginTop: 4, marginBottom: 4 }}>
                      <div className="hit-chooser-header">
                        <span className="hit-chooser-who">
                          <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{rider.name.charAt(0)}</span>
                          Adding hit for {rider.name}
                        </span>
                        <button className="cancel-hit-btn" onClick={() => setState(s => ({ ...s, hitStep: "idle", selectedRiderIdx: null, riderName: "" }))}>✕ Cancel</button>
                      </div>
                      <div>
                        <label className="field-label" style={{ fontSize: 9 }}>Day Label <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                        <input ref={riderInputRef} className="field-input" style={{ fontSize: 12, padding: "7px 10px" }} placeholder="e.g. Jan 5, Week 2…" value={dayLabel} onChange={e => set("dayLabel")(e.target.value)} autoFocus />
                      </div>
                      {hitStep === "choosing" && (
                        <div className="hit-type-btns">
                          <button className="hit-type-btn solo" onClick={addSoloHit}>
                            <span className="hti-emoji">💙</span><span className="hti-label">Solo Day</span>
                            <span className="hti-sub">1–2 riders</span><span className="hti-badge">₱100</span>
                          </button>
                          <button className="hit-type-btn hot" onClick={() => set("hitStep")("hot-count")}>
                            <span className="hti-emoji">🔥</span><span className="hti-label">Hot Day</span>
                            <span className="hti-sub">3+ riders</span><span className="hti-badge">₱300÷n</span>
                          </button>
                        </div>
                      )}
                      {hitStep === "hot-count" && (
                        <div className="hot-count-box">
                          <div className="hot-count-row">
                            <button className="count-btn" onClick={() => set("hotCount")(v => Math.max(3, v - 1))}>−</button>
                            <div className="count-display"><div className="count-num">{hotCount}</div><div className="count-sub">riders</div></div>
                            <button className="count-btn" onClick={() => set("hotCount")(v => Math.min(99, v + 1))}>+</button>
                          </div>
                          <div className="hot-preview">
                            <div className="hot-preview-lbl">Each rider earns</div>
                            <div className="hot-preview-amt">₱{fmtPeso(300 / hotCount)}</div>
                            <div className="hot-preview-sub">₱300 ÷ {hotCount} riders</div>
                          </div>
                          <div className="hot-step-btns">
                            <button className="panel-btn panel-btn-secondary" style={{ flex: 1, padding: "7px" }} onClick={() => set("hitStep")("choosing")}>← Back</button>
                            <button className="panel-btn panel-btn-export" style={{ flex: 2, padding: "7px", fontSize: 11 }} onClick={addHotHit}>✓ Add 🔥 — ₱{fmtPeso(300 / hotCount)}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 12, textAlign: "center", padding: "16px", background: "var(--bg)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border2)", margin: "10px 0" }}>
          {branchKeys.length === 0 ? "Add a branch above to get started" : "Select a branch above to manage its riders"}
        </div>
      )}

      {/* ── BOTTOM: always-visible footer ── */}
      <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
        {allRiders.length > 0 && (
          <div className="panel-totals-bar">
            <span className="panel-totals-label">{Object.keys(branches).length}B · {allRiders.length}R · {totalHits} hits</span>
            <span className="panel-totals-amount">₱{fmtPeso(grandTotal)}</span>
          </div>
        )}
        {validErr && <div className="validation-msg"><IconWarn /> {validErr}</div>}
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 99, fontWeight: 700, fontSize: 9 }}>💙 ≤2 → ₱100</span>
          <span style={{ background: "#FFFBEB", color: "#D97706", padding: "2px 8px", borderRadius: 99, fontWeight: 700, fontSize: 9 }}>🔥 ≥3 → ₱300÷n</span>
        </div>
        <div className="panel-actions">
          <button className="panel-btn panel-btn-primary" onClick={() => handleSubmit(false)}>✓ Create Report</button>
          <button className="panel-btn panel-btn-export" onClick={() => handleSubmit(true)}><IconDownload /> Create & Export</button>
        </div>
      </div>
    </div>
  );
}

/* ── RESULTS PANEL ── */
function ResultsPanel({ branches, fileName, uploadedAt, isHistory, isManual }) {
  const allRiders = Object.values(branches).flat();
  const totalHits = allRiders.reduce((s, r) => s + r.dates.length, 0);
  const _computed = computeRewards(branches);
  const riderRewardMap = _computed.riderRewardMap;
  const hotDateSet = _computed.hotDateSet;
  const branchTotals = isManual ? manualBranchTotals(branches) : _computed.branchTotals;
  const grandTotal = isManual
    ? Object.values(branches).flat().reduce((s, r) => s + (r._manualReward ?? 0), 0)
    : _computed.grandTotal;

  const statCards = [
    { label: "Branches",       value: Object.keys(branches).length, icon: <IconBranch />, iconBg: "#EFF6FF", iconColor: "#2563EB", numColor: "#2563EB" },
    { label: "Riders at 100%", value: allRiders.length,             icon: <IconRiders />, iconBg: "#F5F3FF", iconColor: "#7C3AED", numColor: "#7C3AED" },
    { label: "Total Hits",     value: totalHits,                    icon: <IconTrophy />, iconBg: "#FFFBEB", iconColor: "#D97706", numColor: "#D97706" },
    { label: "Total Rewards",  value: `₱${grandTotal.toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: <IconPeso />, iconBg: "#ECFDF5", iconColor: "#059669", numColor: "#059669" },
  ];

  if (isManual) {
    const borderStyle = "1px solid #C8D0DC";
    const thStyle = { padding: "9px 14px", background: "#1B3A6B", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "center", border: borderStyle, letterSpacing: ".02em", whiteSpace: "nowrap" };
    const tdStyle = (align = "center") => ({ padding: "8px 14px", border: borderStyle, fontSize: 12, textAlign: align, verticalAlign: "middle", color: "#1E293B" });
    const totalTdStyle = (align = "center") => ({ ...tdStyle(align), fontWeight: 800, background: "#F0F4FA", fontSize: 12 });
    return (
      <>
        <div className="stat-row">{statCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
            <div><div className="stat-num" style={{ color: s.numColor, fontSize: typeof s.value === "string" ? 16 : 22 }}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}</div>
        <div className="manual-table-wrap">
          <div className="manual-table-banner">📦 POD SUMMARY — 100% {fileName?.replace(/^Manual — /i, "").toUpperCase()}</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "18%" }}>BRANCH</th>
                  <th style={{ ...thStyle, width: "46%", textAlign: "left" }}>RIDER</th>
                  <th style={{ ...thStyle, width: "18%" }}>NO. OF DAYS</th>
                  <th style={{ ...thStyle, width: "18%" }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(branches).map(([branch, riders], bi) => {
                  const pal = PALETTE[bi % PALETTE.length];
                  const bHits = riders.reduce((s, r) => s + r.dates.length, 0);
                  const bReward = branchTotals[branch] || 0;
                  return riders.map((rider, ri) => {
                    const rRew = rider._manualReward ?? 0;
                    const isEvenRow = ri % 2 === 0;
                    const rowBg = isEvenRow ? "#FFFFFF" : "#F8FAFD";
                    return (
                      <tr key={`${branch}-${ri}`}>
                        {ri === 0 && (
                          <td rowSpan={riders.length + 1} style={{ ...tdStyle("center"), fontWeight: 700, fontSize: 12, color: pal.dot, background: "#FAFBFF", borderRight: `3px solid ${pal.dot}`, verticalAlign: "middle" }}>
                            {branch}
                          </td>
                        )}
                        <td style={{ ...tdStyle("left"), background: rowBg, fontWeight: 500 }}>{rider.rider}</td>
                        <td style={{ ...tdStyle("center"), background: rowBg, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{rider.dates.length}</td>
                        <td style={{ ...tdStyle("center"), background: rowBg, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#059669" }}>₱{rRew.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  }).concat(
                    <tr key={`${branch}-total`}>
                      <td colSpan={2} style={{ ...totalTdStyle("center"), letterSpacing: ".06em" }}>TOTAL</td>
                      <td style={{ ...totalTdStyle("center"), fontFamily: "'DM Mono',monospace", color: "#1B3A6B" }}>{bHits}</td>
                      <td style={{ ...totalTdStyle("center"), fontFamily: "'DM Mono',monospace", color: "#059669" }}>₱{bReward.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="stat-row">{statCards.map(s => (
        <div key={s.label} className="stat-card">
          <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
          <div><div className="stat-num" style={{ color: s.numColor, fontSize: typeof s.value === "string" ? 16 : 22 }}>{s.value}</div><div className="stat-label">{s.label}</div></div>
        </div>
      ))}</div>

      <div className="rewards-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="rewards-banner-icon">💰</div>
          <div>
            <div className="rewards-banner-title">Rewards Summary</div>
            <div className="rewards-banner-sub">Computed across all branches and dates</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="rewards-banner-total">₱{grandTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 2 }}>Total payout</div>
        </div>
      </div>
      <div className="rewards-legend">
        <div className="legend-pill" style={{ background: "#ECFDF5", color: "#065F46", borderColor: "#6EE7B7" }}><div className="legend-dot" style={{ background: "#059669" }} />₱100 — Solo day (&lt;3 riders)</div>
        <div className="legend-pill" style={{ background: "#FFFBEB", color: "#92400E", borderColor: "#FDE68A" }}><div className="legend-dot" style={{ background: "#D97706" }} />₱300÷n — Hot day 🔥 (≥3 riders)</div>
      </div>

      <div className="section-header">
        <div className="section-label">Branch Performance</div>
        <div className="section-count">{Object.keys(branches).length} branches · {allRiders.length} riders</div>
      </div>

      {Object.entries(branches).map(([branch, riders], bi) => {
        const pal = PALETTE[bi % PALETTE.length];
        const bHits = riders.reduce((s, r) => s + r.dates.length, 0);
        const branchReward = branchTotals[branch] || 0;
        return (
          <div className="branch-block" key={branch}>
            <div className="branch-card">
              <div className="branch-header">
                <div className="branch-left">
                  <div className="branch-dot" style={{ background: pal.dot }} />
                  <span className="branch-name-text">{branch}</span>
                  <span className="branch-pill-tag" style={pal.pill}>{riders.length} rider{riders.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="branch-stats-row">
                  <div className="branch-stat-item"><div className="branch-stat-num" style={{ color: pal.dot }}>{bHits}</div><div className="branch-stat-lbl">Hits</div></div>
                  <div className="branch-vdiv" />
                  <div className="branch-stat-item"><div className="branch-stat-num" style={{ color: "#059669" }}>₱{branchReward.toLocaleString("en", { minimumFractionDigits: 2 })}</div><div className="branch-stat-lbl">Rewards</div></div>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Rider Name</th><th className="center">Hits</th><th>Dates</th><th className="center">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((rider, ri) => {
                      const rInfo = riderRewardMap[branch]?.[rider.rider] || { total: 0, breakdown: [] };
                      const isSplit = rInfo.breakdown.some(b => b.isHot);
                      return (
                        <tr key={rider.rider + ri}>
                          <td><span className="row-num">{ri + 1}</span></td>
                          <td>
                            <div className="rider-name-cell">{rider.rider}</div>
                            {rider.aliases?.length > 0 && <div className="rider-alias-cell">Also: {rider.aliases.join(", ")}</div>}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className="hit-badge-cell" style={{ background: pal.hit.bg, color: pal.hit.color }}><IconTrophy />{rider.dates.length}×</span>
                          </td>
                          <td>
                            <div className="date-tags">
                              {rider.dates.map((d, di) => {
                                const isHotDate = hotDateSet.has(`${branch}|||${d}`);
                                return isHotDate
                                  ? <span key={di} className="date-tag hot">{d}</span>
                                  : <span key={di} className="date-tag" style={{ background: pal.date.bg, color: pal.date.color, borderColor: pal.date.border }}>{d}</span>;
                              })}
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`reward-badge${isSplit ? " split" : ""}`}><IconPeso />₱{rInfo.total.toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                            <div className="reward-breakdown-cell">
                              {rInfo.breakdown.map((b, bi2) => (
                                <div key={bi2} className={b.isHot ? "hot-day" : "solo-day"}>{b.date}: ₱{b.amount.toFixed(2)}{b.isHot ? ` ÷${b.ridersOnDate}` : ""}</div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="tr-total">
                      <td /><td style={{ color: pal.dot }}>Branch Total</td>
                      <td style={{ textAlign: "center", fontFamily: "'DM Mono',monospace", color: pal.dot }}>{bHits}</td>
                      <td />
                      <td style={{ textAlign: "center", fontFamily: "'DM Mono',monospace", color: "#059669" }}>₱{branchReward.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
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

/* ── APP ── */
function App() {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "manual"
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("");
  const [branches, setBranches] = useState(null);
  const [summaryDate, setSummaryDate] = useState(null);
  const [isManualReport, setIsManualReport] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [mergeEvents, setMergeEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyView, setHistoryView] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [manualState, setManualState] = useState({
    label: "", reportDate: new Date().toISOString().split("T")[0],
    branches: {}, activeBranch: null, newBranch: "",
    riderName: "", dayLabel: "", hitStep: "idle", hotCount: 3, validErr: "",
    selectedRiderIdx: null
  });
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
    if (!["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase())) { setError("Please upload an Excel file (.xlsx or .xls)."); return; }
    setLoading(true); setError(""); setWarnings([]); setMergeEvents([]);
    setBranches(null); setFileName(file.name); setHistoryView(null); setIsManualReport(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await XLSXPromise;
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array", cellDates: true });
        if (!wb.SheetNames?.length) { setError("The file has no sheets."); setLoading(false); return; }
        const { branches: result, warnings: warns, mergeEvents: merges } = await processSheets(wb);
        setWarnings(warns); setMergeEvents(merges);
        if (!Object.keys(result).length) {
          setError("No riders with 100% POD Rate found.");
        } else {
          setBranches(result);
          const entry = { id: Date.now().toString(), fileName: file.name, uploadedAt: new Date().toISOString(), branches: result, isManual: false };
          setHistory(prev => {
            const updated = [entry, ...prev].slice(0, MAX_HISTORY);
            (async () => { try { await window.storage.set(HISTORY_KEY, JSON.stringify(updated)); } catch (_) {} })();
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

  const handleManualSubmit = ({ label, date, branches: result, andExport }) => {
    const fName = `Manual — ${label}`;
    setBranches(result); setSummaryDate(date); setFileName(fName);
    setIsManualReport(true); setHistoryView(null);
    setError(""); setWarnings([]); setMergeEvents([]);
    setManualState({
      label: "", reportDate: new Date().toISOString().split("T")[0],
      branches: {}, activeBranch: null, newBranch: "",
      riderName: "", dayLabel: "", hitStep: "idle", hotCount: 3, validErr: "", selectedRiderIdx: null
    });
    const entry = { id: Date.now().toString(), fileName: fName, uploadedAt: new Date().toISOString(), branches: result, summaryDate: date, isManual: true };
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      (async () => { try { await window.storage.set(HISTORY_KEY, JSON.stringify(updated)); } catch (_) {} })();
      return updated;
    });
    if (andExport) setTimeout(() => exportXLSXManual(result, fName, date), 200);
  };

  const handleExport = (data) => {
    const useManual = data.isManual ?? (data.fileName?.startsWith("Manual") ?? false);
    if (useManual) exportXLSXManual(data.branches, data.fileName, data.summaryDate);
    else exportXLSX(data.branches, data.fileName, data.summaryDate);
  };

  const viewData = historyView || (branches ? { branches, fileName, uploadedAt: new Date().toISOString(), summaryDate, isManual: isManualReport } : null);
  const isHistoryView = !!historyView;
  const hasResults = !!viewData;

  return (
    <>
      <style>{G}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo"><IconPackage /></div>
          <div>
            <div className="brand-name">POD Rate Tracker</div>
            <div className="brand-tag">Logistics Intelligence</div>
          </div>
          <div className="hdr-divider" />
          <div className="hdr-chip"><div className="hdr-chip-dot" />100% Achievers</div>
          {viewData && (
            <div className="hdr-right">
              <button className="export-btn" onClick={() => handleExport(viewData)}>
                <IconDownload />Export Report
              </button>
            </div>
          )}
        </header>

        <div className="layout">
          {/* SIDEBAR — history */}
          <aside className="sidebar">
            <div className="sidebar-head">
              <div className="sidebar-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                History
                {history.length > 0 && <span className="hist-count">{history.length}</span>}
              </div>
              {history.length > 0 && <button className="clear-btn" onClick={clearAllHistory}>Clear all</button>}
            </div>
            <div className="sidebar-list">
              {!storageReady && <div className="sidebar-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Loading…</div>}
              {storageReady && history.length === 0 && (
                <div className="sidebar-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  No records yet.<br />Upload a file or create a manual entry.
                </div>
              )}
              {storageReady && history.map(entry => {
                const riders = Object.values(entry.branches).flat();
                const hits = riders.reduce((s, r) => s + r.dates.length, 0);
                const { grandTotal: _gt } = computeRewards(entry.branches);
                const grandTotal = entry.isManual ? Object.values(entry.branches).flat().reduce((s, r) => s + (r._manualReward ?? 0), 0) : _gt;
                const isActive = historyView?.id === entry.id;
                const isDeleting = deletingId === entry.id;
                const d = new Date(entry.uploadedAt);
                return (
                  <div key={entry.id} className={`hist-item${isActive ? " active" : ""}${isDeleting ? " deleting" : ""}`} onClick={() => setHistoryView(isActive ? null : entry)}>
                    <div className="hist-item-name">{entry.fileName.startsWith("Manual") ? "✍️" : "📄"} {entry.fileName}</div>
                    <div className="hist-item-meta">
                      <span>🏢 {Object.keys(entry.branches).length}</span>
                      <span>👤 {riders.length}</span>
                      <span>🏆 {hits}</span>
                      <span>💰 ₱{grandTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="hist-item-meta" style={{ marginTop: 2 }}>
                      <span style={{ opacity: .65 }}>{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <button className="hist-delete" title="Remove" onClick={ev => { ev.stopPropagation(); deleteEntry(entry.id); }}>✕</button>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="content-area">
            {/* TAB BAR */}
            {!historyView && (
              <div className="tab-bar">
                <button
                  className={`tab-btn${activeTab === "upload" ? " active" : ""}`}
                  onClick={() => setActiveTab("upload")}
                >
                  <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Excel
                </button>
                <div className="tab-divider" />
                <button
                  className={`tab-btn${activeTab === "manual" ? " active" : ""}`}
                  onClick={() => setActiveTab("manual")}
                >
                  <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Manual Entry
                </button>
              </div>
            )}

            <div className="workspace">
              {/* INPUT PANEL — left side when results are showing, full width otherwise */}
              {!historyView && (
                <div className={`input-panel${hasResults ? "" : " full-width"}`}>
                  <div className="input-panel-inner">
                    {activeTab === "upload" && (
                      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* COMPACT dropzone when results already shown */}
                        {hasResults ? (
                          <>
                            <span className="upload-label">Upload Another File</span>
                            <div
                              className={`dropzone-compact${drag ? " drag" : ""}`}
                              onDragOver={e => { e.preventDefault(); setDrag(true); }}
                              onDragLeave={() => setDrag(false)}
                              onDrop={onDrop}
                              onClick={() => inputRef.current.click()}
                            >
                              <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
                              <div className="dz-compact-icon">
                                {loading
                                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                                  : drag ? <IconDownload /> : <IconUpload />}
                              </div>
                              <div className="dz-compact-text">
                                <div className="dz-compact-title">{loading ? "Processing…" : drag ? "Release to upload" : "Drop file or click to browse"}</div>
                                <div className="dz-compact-sub">.xlsx or .xls</div>
                                {fileName && !loading && !isManualReport && (
                                  <div className="file-badge-compact"><IconCheck />{fileName}</div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* FULL dropzone when no results yet */
                          <>
                            <span className="upload-label">Data Source</span>
                            <div
                              className={`dropzone${drag ? " drag" : ""}`}
                              onDragOver={e => { e.preventDefault(); setDrag(true); }}
                              onDragLeave={() => setDrag(false)}
                              onDrop={onDrop}
                              onClick={() => inputRef.current.click()}
                            >
                              <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
                              <div className="dz-icon-wrap">
                                {loading
                                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                                  : drag ? <IconDownload /> : <IconUpload />}
                              </div>
                              <div className="dz-title">{loading ? "Processing…" : drag ? "Release to upload" : "Drop Excel file here"}</div>
                              <div className="dz-sub">Click to browse · .xlsx or .xls</div>
                            </div>
                          </>
                        )}

                        {error && <div className="alert err"><div className="alert-icon"><IconWarn /></div><div><div className="alert-title">Error</div>{error}</div></div>}
                        {warnings.length > 0 && <div className="alert warn"><div className="alert-icon"><IconWarn /></div><div><div className="alert-title">Notices ({warnings.length})</div><div>{warnings.map((w, i) => <div key={i}>• {w}</div>)}</div></div></div>}
                        {mergeEvents.length > 0 && <div className="alert merge"><div className="alert-icon"><IconLink /></div><div><div className="alert-title">Name Merges ({mergeEvents.length})</div><div>{mergeEvents.map((e, i) => <div key={i}><strong>[{e.branch}]</strong> {e.canonical} ← {e.aliases.join(", ")}</div>)}</div></div></div>}

                        {!hasResults && (
                          <div className="empty-card">
                            <div className="how-title">How It Works</div>
                            <div className="how-grid">
                              {[
                                { icon: "📁", title: "Upload Excel", desc: "Drop any .xlsx or .xls with delivery data." },
                                { icon: "✅", title: "100% Only", desc: "Only riders with exactly 100% POD Rate are listed." },
                                { icon: "🏆", title: "Hit Count", desc: "Shows how many times each rider hit 100%." },
                                { icon: "📅", title: "Dates Tracked", desc: "Each date where the rider hit 100% is shown." },
                                { icon: "🔥", title: "Hot Days", desc: "3+ riders on a day split ₱300 pool." },
                                { icon: "💰", title: "Rewards", desc: "<3 riders → ₱100 each · ≥3 → ₱300÷n." },
                              ].map(item => (
                                <div className="how-card" key={item.title}>
                                  <div className="how-card-icon">{item.icon}</div>
                                  <div className="how-card-title">{item.title}</div>
                                  <div className="how-card-desc">{item.desc}</div>
                                </div>
                              ))}
                            </div>
                            <div className="col-detect">
                              <strong style={{ color: "var(--blue)" }}>Auto-detected columns</strong> ·
                              <strong> Branch:</strong> <span className="col-kw">Branch</span><span className="col-kw">Hub</span><span className="col-kw">Zone</span> ·
                              <strong> Rider:</strong> <span className="col-kw">Rider</span><span className="col-kw">Courier</span><span className="col-kw">Name</span> ·
                              <strong> Rate:</strong> <span className="col-kw">POD Rate</span><span className="col-kw">POD%</span> ·
                              <strong> Date:</strong> <span className="col-kw">Date</span><span className="col-kw">Day</span> — or sheet name is used.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "manual" && (
                      <ManualEntryPanel
                        onSubmit={handleManualSubmit}
                        state={manualState}
                        setState={setManualState}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* RESULTS AREA */}
              {(hasResults) && (
                <div className="results-area">
                  {isHistoryView && (
                    <>
                      <button className="back-btn" onClick={() => setHistoryView(null)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to input
                      </button>
                      <div className="history-banner">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>{viewData.fileName}</span>
                        <span className="time">{new Date(viewData.uploadedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </>
                  )}
                  <ResultsPanel
                    branches={viewData.branches}
                    fileName={viewData.fileName}
                    uploadedAt={viewData.uploadedAt}
                    isHistory={isHistoryView}
                    isManual={viewData.isManual}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── SPLASH SCREEN ── */
const splashCSS = css`
  @keyframes sp-fade-in  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes sp-fade-out { from{opacity:1;transform:scale(1)}   to{opacity:0;transform:scale(1.04)} }
  @keyframes sp-ring-rot { from{transform:rotate(-90deg)} to{transform:rotate(270deg)} }
  @keyframes sp-ring-draw{ from{stroke-dashoffset:240} to{stroke-dashoffset:30} }
  @keyframes sp-bar      { from{width:0%} to{width:100%} }
  @keyframes sp-dot-pop  { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
  @keyframes sp-txt-up   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sp-glow-pulse{ 0%,100%{box-shadow:0 0 28px rgba(37,99,235,.35),0 0 0 0 rgba(37,99,235,.0)} 50%{box-shadow:0 0 56px rgba(37,99,235,.6),0 0 80px rgba(67,56,202,.18)} }
  @keyframes sp-particles { 0%{opacity:0;transform:translate(0,0) scale(0)} 30%{opacity:1} 100%{opacity:0;transform:translate(var(--px),var(--py)) scale(1)} }

  .sp-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(145deg, #060C18 0%, #0D1B2A 55%, #091422 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    animation: sp-fade-in .35s ease both;
    overflow: hidden;
  }
  .sp-overlay.sp-exit { animation: sp-fade-out .45s ease forwards; pointer-events: none; }

  /* subtle grid pattern */
  .sp-overlay::before {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(37,99,235,.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(37,99,235,.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }

  .sp-logo-wrap {
    position: relative; margin-bottom: 30px;
    animation: sp-glow-pulse 2s ease-in-out infinite;
    border-radius: 22px; flex-shrink: 0;
  }
  .sp-logo-box {
    width: 76px; height: 76px;
    background: linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 1;
  }
  .sp-logo-box svg { width: 36px; height: 36px; color: #fff; }

  .sp-ring {
    position: absolute; top: -11px; left: -11px;
    width: 98px; height: 98px;
    animation: sp-ring-rot 2s linear infinite;
    z-index: 0; pointer-events: none;
  }
  .sp-ring circle {
    fill: none; stroke: url(#spg); stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 240;
    animation: sp-ring-draw 2s ease-in-out infinite;
  }

  .sp-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 24px; font-weight: 800; color: #fff;
    letter-spacing: -.05em; margin-bottom: 6px;
    animation: sp-txt-up .5s .15s ease both;
  }
  .sp-title em { font-style: normal; color: #60A5FA; }

  .sp-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 10.5px; font-weight: 600;
    color: rgba(255,255,255,.35);
    letter-spacing: .18em; text-transform: uppercase;
    margin-bottom: 38px;
    animation: sp-txt-up .5s .28s ease both;
  }

  .sp-bar-track {
    width: 210px; height: 2.5px;
    background: rgba(255,255,255,.07);
    border-radius: 99px; overflow: hidden;
    animation: sp-txt-up .4s .4s ease both; opacity: 0;
    animation-fill-mode: both;
  }
  .sp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1D4ED8 0%, #818CF8 50%, #1D4ED8 100%);
    background-size: 300%;
    border-radius: 99px;
    animation: sp-bar 1.9s .45s cubic-bezier(.22,1,.36,1) forwards;
  }

  .sp-dots {
    display: flex; gap: 7px; margin-top: 22px;
    animation: sp-txt-up .4s .52s ease both; opacity: 0;
    animation-fill-mode: both;
  }
  .sp-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(96,165,250,.5);
  }
  .sp-dot:nth-child(1) { animation: sp-dot-pop 1.4s .55s ease-in-out infinite; }
  .sp-dot:nth-child(2) { animation: sp-dot-pop 1.4s .72s ease-in-out infinite; }
  .sp-dot:nth-child(3) { animation: sp-dot-pop 1.4s .89s ease-in-out infinite; }

  /* floating particle dots */
  .sp-particle {
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: #3B82F6; opacity: 0;
    animation: sp-particles 2.4s ease-out infinite;
  }
`;

function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);
  useState(() => {
    const t1 = setTimeout(() => setExiting(true), 2300);
    const t2 = setTimeout(() => onDone(), 2750);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  const particles = [
    { style: { left: "48%", top: "38%", "--px": "-60px", "--py": "-80px", animationDelay: ".2s" } },
    { style: { left: "52%", top: "38%", "--px": "55px",  "--py": "-75px", animationDelay: ".7s" } },
    { style: { left: "50%", top: "40%", "--px": "-40px", "--py": "90px",  animationDelay: "1.1s" } },
    { style: { left: "49%", top: "39%", "--px": "70px",  "--py": "65px",  animationDelay: "1.6s" } },
    { style: { left: "51%", top: "37%", "--px": "-80px", "--py": "30px",  animationDelay: "2s"   } },
  ];

  return (
    <>
      <style>{splashCSS}</style>
      <div className={`sp-overlay${exiting ? " sp-exit" : ""}`}>
        {/* SVG gradient defs */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="spg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#2563EB" stopOpacity="0" />
              <stop offset="40%"  stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div key={i} className="sp-particle" style={p.style} />
        ))}

        {/* Logo + ring */}
        <div className="sp-logo-wrap">
          <svg className="sp-ring" viewBox="0 0 98 98">
            <circle cx="49" cy="49" r="45" />
          </svg>
          <div className="sp-logo-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.29 7 12 12 20.71 7"/>
              <line x1="12" y1="22" x2="12" y2="12"/>
            </svg>
          </div>
        </div>

        <div className="sp-title">POD Rate <em>Tracker</em></div>
        <div className="sp-subtitle">Logistics Intelligence</div>

        <div className="sp-bar-track">
          <div className="sp-bar-fill" />
        </div>

        <div className="sp-dots">
          <div className="sp-dot" />
          <div className="sp-dot" />
          <div className="sp-dot" />
        </div>
      </div>
    </>
  );
}

/* ── ROOT WRAPPER WITH SPLASH ── */
export default function AppWithSplash() {
  const [ready, setReady] = useState(false);
  return (
    <>
      {!ready && <SplashScreen onDone={() => setReady(true)} />}
      {ready && <App />}
    </>
  );
}