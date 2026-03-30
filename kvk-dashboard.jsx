import { useState } from "react";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: "#080c14",
  panel: "#0d1520",
  panelBorder: "#1a2a3a",
  accent: "#e8a020",
  accentDim: "#7a5010",
  blue: "#2a7eff",
  blueDim: "#0a2a60",
  red: "#e03030",
  redDim: "#4a0a0a",
  green: "#20c060",
  greenDim: "#0a3a1a",
  text: "#c8d8e8",
  textDim: "#5a7a9a",
  gold: "#ffd060",
};

const HEROES_RALLY = ["Petra","Eric","Jaeger","Zoe","Hilde","Marlin","Amadeus","Jabel","Saul","Helga","Chenko","Howard","Gordon","Quinn","Diana","Yeonwoo","Amane","Fahd","Alcar","Margot","Rosa","N/A"];
const HEROES_GARRISON = ["Petra","Eric","Jaeger","Zoe","Hilde","Marlin","Amadeus","Jabel","Saul","Helga","Chenko","Howard","Gordon","Quinn","Diana","Yeonwoo","Amane","Fahd","Alcar","Margot","Rosa","N/A"];
const ALLIANCES = ["LOR", "PAN", "KOE", "WAR", "STR"];
const AVAILABILITY_OPTS = ["Full", "1st Half", "2nd Half", "On/Off"];
const PRIMARY_TARGETS = ["Castle", "Turret (N)", "Turret (E)", "Turret (S)", "Turret (W)"];
const TC_LEVELS = ["TG1","TG2","TG3","TG4","TG5","TG6","TG7","TG8"];
const ROLES = ["Rally Leader", "Rally Joiner"];
const THREAT_TYPES = ["Scout", "Rally", "Garrison", "Attacker", "Unknown"];

let _uid = 100;
const uid = () => ++_uid;

const initMembers = [
  { id: 1, name: "IronWolf", tc: "TG8", available: "Full", role: "Rally Leader", heroRally: "Amadeus", heroGarrison: "Hilde", ratioRally: "70/20/10", ratioGarrison: "50/30/20", alliance: "LOR", primaryTarget: "Castle", notes: "Main rally commander" },
  { id: 2, name: "ShadowBlade", tc: "TG7", available: "Full", role: "Rally Joiner", heroRally: "Chenko", heroGarrison: "Gordon", ratioRally: "60/30/10", ratioGarrison: "40/40/20", alliance: "LOR", primaryTarget: "Turret (N)", notes: "" },
  { id: 3, name: "FrostQueen", tc: "TG8", available: "1st Half", role: "Rally Joiner", heroRally: "Amane", heroGarrison: "Hilde", ratioRally: "80/10/10", ratioGarrison: "60/20/20", alliance: "PAN", primaryTarget: "Castle", notes: "Prefers cavalry" },
  { id: 4, name: "ThunderKing", tc: "TG6", available: "On/Off", role: "Rally Leader", heroRally: "Jaeger", heroGarrison: "Gordon", ratioRally: "50/40/10", ratioGarrison: "50/25/25", alliance: "PAN", primaryTarget: "Turret (E)", notes: "Offline until weekend" },
  { id: 5, name: "StormRider", tc: "TG8", available: "Full", role: "Rally Joiner", heroRally: "Amadeus", heroGarrison: "Saul", ratioRally: "70/20/10", ratioGarrison: "60/30/10", alliance: "KOE", primaryTarget: "Castle", notes: "" },
  { id: 6, name: "NightHawk", tc: "TG5", available: "2nd Half", role: "Rally Joiner", heroRally: "Chenko", heroGarrison: "Hilde", ratioRally: "60/20/20", ratioGarrison: "40/30/30", alliance: "KOE", primaryTarget: "Turret (W)", notes: "New member" },
  { id: 7, name: "CrimsonAce", tc: "TG7", available: "Full", role: "Rally Leader", heroRally: "Amane", heroGarrison: "Gordon", ratioRally: "75/15/10", ratioGarrison: "55/25/20", alliance: "WAR", primaryTarget: "Castle", notes: "" },
  { id: 8, name: "VoidWalker", tc: "TG5", available: "On/Off", role: "Rally Joiner", heroRally: "Zoe", heroGarrison: "Hilde", ratioRally: "50/30/20", ratioGarrison: "40/40/20", alliance: "STR", primaryTarget: "Turret (S)", notes: "Hospital" },
  { id: 9, name: "GoldRush", tc: "TG6", available: "Full", role: "Rally Joiner", heroRally: "Petra", heroGarrison: "Saul", ratioRally: "65/25/10", ratioGarrison: "50/30/20", alliance: "STR", primaryTarget: "Castle", notes: "" },
  { id: 10, name: "BlazeHunter", tc: "TG7", available: "1st Half", role: "Rally Leader", heroRally: "Eric", heroGarrison: "Hilde", ratioRally: "70/20/10", ratioGarrison: "60/20/20", alliance: "WAR", primaryTarget: "Turret (N)", notes: "Secondary commander" },
];

function roleColor(r) { return r === "Rally Leader" ? C.gold : C.blue; }
function allianceColor(a) {
  return { LOR: "#e8a020", PAN: "#2a7eff", KOE: "#20c060", WAR: "#c060ff", STR: "#ff6060" }[a] || C.textDim;
}

const inputSt = {
  background: "#0a1820", border: "1px solid #1a2a3a", borderRadius: 4,
  color: "#c8d8e8", padding: "5px 9px", fontSize: 12, outline: "none",
  width: "100%", boxSizing: "border-box",
};
const btnSt = {
  background: "#1a2a3a", border: "none", borderRadius: 4,
  color: "#5a7a9a", cursor: "pointer", fontSize: 11, fontWeight: 700, padding: "5px 14px",
};

function Pill({ color, children }) {
  return <span style={{ background: color + "22", border: `1px solid ${color}44`, color, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>;
}

function StatCard({ label, value, sub, color = C.accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: "14px 18px", flex: "1 1 120px", minWidth: 110 }}>
      <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Bebas Neue',sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: C.text }}>{label}</span><span style={{ color, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ background: "#1a2a3a", borderRadius: 3, height: 6 }}>
        <div style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function DonutSlice({ label, value, total, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 11, color: C.textDim, minWidth: 32, textAlign: "right" }}>{total > 0 ? Math.round(value / total * 100) : 0}%</span>
    </div>
  );
}

// ── Add Member ─────────────────────────────────────────────────────────────
function AddMemberForm({ onAdd }) {
  const blank = { name: "", tc: "TG8", available: "Full", role: "Rally Joiner", heroRally: "Amadeus", heroGarrison: "Hilde", ratioRally: "70/20/10", ratioGarrison: "50/30/20", alliance: "LOR", primaryTarget: "Castle", notes: "" };
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  if (!open) return <button onClick={() => setOpen(true)} style={{ ...btnSt, background: C.accentDim, color: C.accent, padding: "7px 20px", fontWeight: 700, fontSize: 13, fontFamily: "'Roboto Condensed', 'Arial Narrow', sans-serif", letterSpacing: 0.5 }}>+ Add Member</button>;
  return (
    <div style={{ background: "#0a1820", border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: C.accent, letterSpacing: 1, marginBottom: 14 }}>NEW MEMBER</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 10, marginBottom: 14 }}>
        {[["name","Name *","text","Member name"],["ratioRally","Rally Ratio","text","70/20/10"],["ratioGarrison","Garrison Ratio","text","50/30/20"],["notes","Notes","text","Optional…"]].map(([k,label,type,ph]) => (
          <div key={k}><div style={{ fontSize: 10, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
          <input style={inputSt} type={type} value={form[k]} placeholder={ph} onChange={e => f(k, type === "number" ? +e.target.value : e.target.value)} /></div>
        ))}
        {[["tc","TC Level",TC_LEVELS],["role","Role",ROLES],["heroRally","Joiner Hero",HEROES_RALLY],["heroGarrison","Garrison Hero",HEROES_GARRISON],["alliance","Alliance",ALLIANCES],["available","Available",AVAILABILITY_OPTS],["primaryTarget","Primary Target",PRIMARY_TARGETS]].map(([k,label,opts]) => (
          <div key={k}><div style={{ fontSize: 10, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
          <select style={inputSt} value={form[k]} onChange={e => f(k, e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { if (form.name.trim()) { onAdd({ ...form, id: uid() }); setForm(blank); setOpen(false); } }} style={{ ...btnSt, background: C.accentDim, color: C.accent, fontWeight: 800, padding: "7px 22px" }}>Add Member</button>
        <button onClick={() => setOpen(false)} style={{ ...btnSt, padding: "7px 16px" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Member Table Row ───────────────────────────────────────────────────────
function MemberRow({ m, onEdit, onDelete, editingId, onSaveEdit, editDraft, setEditDraft }) {
  const isE = editingId === m.id;
  const td = { padding: "8px 10px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.panelBorder}` };
  if (isE) {
    const ed = editDraft;
    const f = (k, v) => setEditDraft(d => ({ ...d, [k]: v }));
    return (
      <tr style={{ background: "#1a2a3a33" }}>
        <td style={td}><input style={{ ...inputSt, width: 110 }} value={ed.name} onChange={e => f("name", e.target.value)} /></td>
        <td style={td}><select style={inputSt} value={ed.tc} onChange={e => f("tc", e.target.value)}>{TC_LEVELS.map(t => <option key={t}>{t}</option>)}</select></td>
        <td style={td}><select style={inputSt} value={ed.available} onChange={e => f("available", e.target.value)}>{AVAILABILITY_OPTS.map(o => <option key={o}>{o}</option>)}</select></td>
        <td style={td}><select style={inputSt} value={ed.role} onChange={e => f("role", e.target.value)}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></td>
        <td style={td}><select style={inputSt} value={ed.heroRally} onChange={e => f("heroRally", e.target.value)}>{HEROES_RALLY.map(h => <option key={h}>{h}</option>)}</select></td>
        <td style={td}><select style={inputSt} value={ed.heroGarrison} onChange={e => f("heroGarrison", e.target.value)}>{HEROES_GARRISON.map(h => <option key={h}>{h}</option>)}</select></td>
        <td style={td}><input style={{ ...inputSt, width: 80 }} value={ed.ratioRally} onChange={e => f("ratioRally", e.target.value)} /></td>
        <td style={td}><input style={{ ...inputSt, width: 80 }} value={ed.ratioGarrison} onChange={e => f("ratioGarrison", e.target.value)} /></td>
        <td style={td}><select style={inputSt} value={ed.alliance} onChange={e => f("alliance", e.target.value)}>{ALLIANCES.map(a => <option key={a}>{a}</option>)}</select></td>
        <td style={td}><select style={inputSt} value={ed.primaryTarget} onChange={e => f("primaryTarget", e.target.value)}>{PRIMARY_TARGETS.map(t => <option key={t}>{t}</option>)}</select></td>
        <td style={td}><input style={inputSt} value={ed.notes} onChange={e => f("notes", e.target.value)} /></td>
        <td style={td}>
          <button onClick={() => onSaveEdit(ed)} style={{ ...btnSt, background: C.greenDim, color: C.green, marginRight: 4, padding: "3px 10px" }}>Save</button>
          <button onClick={() => onEdit(null)} style={{ ...btnSt, padding: "3px 10px" }}>✕</button>
        </td>
      </tr>
    );
  }
  const availColor = { Full: C.green, "1st Half": C.blue, "2nd Half": C.gold, "On/Off": C.red }[m.available] || C.textDim;
  const targetColor = { Castle: C.accent, "Turret (N)": "#20d0d0", "Turret (E)": "#c060ff", "Turret (S)": "#ff8040", "Turret (W)": "#40c080" }[m.primaryTarget] || C.textDim;
  return (
    <tr onMouseEnter={e => e.currentTarget.style.background = "#1a2a3a22"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <td style={td}><span style={{ fontWeight: 700 }}>{m.name}</span></td>
      <td style={{ ...td, textAlign: "center" }}><Pill color={C.accent}>{m.tc}</Pill></td>
      <td style={{ ...td, textAlign: "center" }}><Pill color={availColor}>{m.available}</Pill></td>
      <td style={td}><Pill color={roleColor(m.role)}>{m.role === "Rally Leader" ? "Leader" : "Joiner"}</Pill></td>
      <td style={{ ...td, color: C.textDim }}>{m.heroRally}</td>
      <td style={{ ...td, color: C.textDim }}>{m.heroGarrison}</td>
      <td style={td}><code style={{ color: C.blue, fontSize: 11 }}>{m.ratioRally}</code></td>
      <td style={td}><code style={{ color: C.blue, fontSize: 11 }}>{m.ratioGarrison}</code></td>
      <td style={td}><Pill color={allianceColor(m.alliance)}>{m.alliance}</Pill></td>
      <td style={td}><Pill color={targetColor}>{m.primaryTarget}</Pill></td>
      <td style={{ ...td, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.textDim }}>{m.notes || "—"}</td>
      <td style={td}>
        <button onClick={() => onEdit(m.id)} style={{ ...btnSt, marginRight: 4, padding: "3px 10px" }}>Edit</button>
        <button onClick={() => onDelete(m.id)} style={{ ...btnSt, background: C.redDim, color: C.red, padding: "3px 10px" }}>✕</button>
      </td>
    </tr>
  );
}

// ── Tile Assignment Panel ──────────────────────────────────────────────────
function TilePanel({ modal, members, assignments, onFriendly, onEnemy, onClear, onClose }) {
  const [tab, setTab] = useState("friendly");
  const [sel, setSel] = useState("");
  const [en, setEn] = useState({ name: "", kingdom: "", threat: "Scout", notes: "" });
  const existing = modal?.existing;
  const assignedIds = new Set(Object.values(assignments).filter(a => a.type === "friendly").map(a => a.member.id));
  if (!modal) return null;
  return (
    <div style={{ background: C.panel, border: `2px solid ${C.accent}88`, borderRadius: 10, padding: 20, width: 285, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: C.accent, letterSpacing: 1 }}>TILE [{modal.r},{modal.c}]</span>
        <button onClick={onClose} style={{ ...btnSt, padding: "2px 9px", fontSize: 13 }}>✕</button>
      </div>
      {existing && (
        <div style={{ background: existing.type === "friendly" ? "#0a2a4a" : C.redDim, border: `1px solid ${existing.type === "friendly" ? C.blue : C.red}55`, borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: existing.type === "friendly" ? C.blue : C.red, fontSize: 13, marginBottom: 4 }}>
            {existing.type === "friendly" ? `🤝 ${existing.member.name}` : `⚔ ${existing.name || "Enemy"}`}
          </div>
          {existing.type === "friendly" && <div style={{ fontSize: 11, color: C.textDim }}>{existing.member.role} · {existing.member.alliance}</div>}
          {existing.type === "enemy" && existing.kingdom && <div style={{ fontSize: 11, color: C.textDim }}>{existing.kingdom} · {existing.threat}</div>}
          <button onClick={() => onClear(modal.r, modal.c)} style={{ ...btnSt, background: C.redDim, color: C.red, marginTop: 8, width: "100%", padding: 4, fontSize: 11 }}>Clear Tile</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {["friendly","enemy"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...btnSt, flex: 1, textTransform: "capitalize", background: tab === t ? (t === "friendly" ? "#0a2a4a" : C.redDim) : "#1a2a3a", color: tab === t ? (t === "friendly" ? C.blue : C.red) : C.textDim }}>
            {t === "friendly" ? "🤝 Friendly" : "⚔ Enemy"}
          </button>
        ))}
      </div>
      {tab === "friendly" && (
        <>
          <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Select member</div>
          <select style={{ ...inputSt, marginBottom: 10 }} value={sel} onChange={e => setSel(e.target.value)}>
            <option value="">-- Choose member --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.alliance}){assignedIds.has(m.id) ? " ★" : ""}</option>)}
          </select>
          {sel && (() => { const m = members.find(x => x.id === +sel); return m ? (
            <div style={{ background: "#0a1820", borderRadius: 6, padding: "10px 12px", marginBottom: 12, fontSize: 11 }}>
              <div style={{ fontWeight: 800, color: C.text, marginBottom: 6 }}>{m.name}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                <Pill color={roleColor(m.role)}>{m.role === "Rally Leader" ? "Leader" : "Joiner"}</Pill>
                <Pill color={allianceColor(m.alliance)}>{m.alliance}</Pill>
                <Pill color={m.available ? C.green : C.red}>{m.available ? "Avail." : "Busy"}</Pill>
              </div>
              <div style={{ color: C.textDim }}>Hero: <span style={{ color: C.text }}>{m.heroRally}</span></div>
              <div style={{ color: C.textDim }}>Ratio: <code style={{ color: C.blue }}>{m.ratioRally}</code></div>
            </div>
          ) : null; })()}
          <button onClick={() => sel && onFriendly(modal.r, modal.c, +sel)} disabled={!sel}
            style={{ ...btnSt, width: "100%", background: sel ? "#0a2a4a" : "#1a2a3a", color: sel ? C.blue : C.textDim, padding: 8, fontWeight: 800 }}>
            Assign to Tile
          </button>
        </>
      )}
      {tab === "enemy" && (
        <>
          {[["name","Enemy Name","e.g. KingSlayer"],["kingdom","Kingdom / Alliance","e.g. K99 · Alliance"]].map(([k,label,ph]) => (
            <div key={k} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
              <input style={inputSt} placeholder={ph} value={en[k]} onChange={e => setEn(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Threat Type</div>
            <select style={inputSt} value={en.threat} onChange={e => setEn(p => ({ ...p, threat: e.target.value }))}>{THREAT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Notes</div>
            <input style={inputSt} placeholder="Additional intel..." value={en.notes} onChange={e => setEn(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <button onClick={() => onEnemy(modal.r, modal.c, en)} style={{ ...btnSt, width: "100%", background: C.redDim, color: C.red, padding: 8, fontWeight: 800 }}>Mark as Enemy</button>
        </>
      )}
    </div>
  );
}

// ── Castle Map ─────────────────────────────────────────────────────────────
//
// Layout matches blueprint exactly:
//   • 13×13 uniform grid of assignable tiles
//   • All tiles gray / light — fully assignable (no "enemy zone" tiles baked in)
//   • Red rectangle border drawn around the inner 11×11 area (rows 1–11, cols 1–11)
//   • Castle = white 6×6 zone in center (rows 3–8, cols 3–8), NOT assignable
//   • 4 turret tiles at castle corners labeled North/East/West/South
//     - North: top-left corner of castle (r=3, c=3)
//     - East:  top-right corner (r=3, c=8)
//     - West:  bottom-left corner (r=8, c=3)
//     - South: bottom-right corner (r=8, c=8)
//   • Castle interior (non-turret cells) rendered as white overlay, no tile grid shown

// 14×14 grid. Layout:
//   Row/Col 0        → outer ring (assignable, outside red border)
//   Row/Col 1        → red border line sits on outer edge of this row/col
//   Rows/Cols 2–3    → 3-tile gap between red border and castle  (wait: border at col1 inner edge, gap cols 2,3,4 = 3 tiles... let's be precise)
//
// Precise layout (0-indexed):
//   Col 0            : outer tile (assignable)
//   Col 1            : red border left edge passes between col0 and col1 outer edges
//   Cols 1,2,3       : 3 gap tiles inside red border on left  → castle starts col 4
//   Cols 4–9         : castle (6 wide)
//   Cols 10,11,12    : 3 gap tiles inside red border on right
//   Col 13           : outer tile (assignable)
//   Red border: left edge at col1 left, right edge at col12 right → spans cols 1–12
//   Same logic for rows.
//
// 14 cols total: 0 | 1,2,3(gap) | 4,5,6,7,8,9(castle) | 10,11,12(gap) | 13
// Red border rect encompasses rows 1–12, cols 1–12

const ROWS = 14, COLS = 14;
const TILE = 36, GAP = 2;

// Castle occupies rows 4-9, cols 4-9 (inclusive) — 6×6
const CR1 = 4, CR2 = 9, CC1 = 4, CC2 = 9;

const TURRETS = [
  { r: CR1, c: CC1, label: "North" },
  { r: CR1, c: CC2, label: "East" },
  { r: CR2, c: CC1, label: "West" },
  { r: CR2, c: CC2, label: "South" },
];

function isCastle(r, c) { return r >= CR1 && r <= CR2 && c >= CC1 && c <= CC2; }
function isTurret(r, c) { return TURRETS.some(t => t.r === r && t.c === c); }
function getTurretLabel(r, c) { return TURRETS.find(t => t.r === r && t.c === c)?.label || null; }

function CastleMap({ members, assignments, setAssignments }) {
  const [modal, setModal] = useState(null);
  const [hover, setHover] = useState(null);
  const [filter, setFilter] = useState("all");

  const key = (r, c) => `${r},${c}`;
  const getA = (r, c) => assignments[key(r, c)];

  function handleClick(r, c) {
    if (isCastle(r, c) && !isTurret(r, c)) return;
    if (isTurret(r, c)) return; // turrets not assignable
    setModal({ r, c, existing: getA(r, c) });
  }

  function assignFriendly(r, c, memberId) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    setAssignments(p => ({ ...p, [key(r, c)]: { type: "friendly", member } }));
    setModal(null);
  }
  function assignEnemy(r, c, data) {
    setAssignments(p => ({ ...p, [key(r, c)]: { type: "enemy", ...data } }));
    setModal(null);
  }
  function clearTile(r, c) {
    setAssignments(p => { const n = { ...p }; delete n[key(r, c)]; return n; });
    setModal(null);
  }

  const friendlyCount = Object.values(assignments).filter(a => a.type === "friendly").length;
  const enemyCount = Object.values(assignments).filter(a => a.type === "enemy").length;

  const gridW = COLS * TILE + (COLS - 1) * GAP;
  const gridH = ROWS * TILE + (ROWS - 1) * GAP;

  // Castle interior overlay — 4×4 inner zone between the turrets (rows CR1+1 to CR2-1, cols CC1+1 to CC2-1)
  const interiorX = (CC1 + 1) * (TILE + GAP);
  const interiorY = (CR1 + 1) * (TILE + GAP);
  const interiorW = 4 * TILE + 3 * GAP;
  const interiorH = 4 * TILE + 3 * GAP;

  // Red border: encompasses rows 1–12, cols 1–12 (3 gap tiles each side around 6×6 castle)
  const bx = 1 * (TILE + GAP) - 1;
  const by = 1 * (TILE + GAP) - 1;
  const bw = 12 * TILE + 11 * GAP + 2;
  const bh = 12 * TILE + 11 * GAP + 2;

  // Gold castle outline: rows CR1–CR2, cols CC1–CC2
  const cx = CC1 * (TILE + GAP) - 1;
  const cy = CR1 * (TILE + GAP) - 1;
  const cw = 6 * TILE + 5 * GAP + 2;
  const ch = 6 * TILE + 5 * GAP + 2;

  // ── Sidebar derived data ──────────────────────────────────────────────────
  const friendlyByAlliance = {};
  Object.values(assignments).filter(a => a.type === "friendly").forEach(a => {
    const al = a.member.alliance;
    friendlyByAlliance[al] = (friendlyByAlliance[al] || 0) + 1;
  });
  const targetCounts = {};
  members.forEach(m => { targetCounts[m.primaryTarget] = (targetCounts[m.primaryTarget] || 0) + 1; });
  const assignedMemberIds = new Set(Object.values(assignments).filter(a => a.type === "friendly").map(a => a.member.id));
  const unassignedMembers = members.filter(m => !assignedMemberIds.has(m.id));
  const availColorMap = { Full: C.green, "1st Half": C.blue, "2nd Half": C.gold, "On/Off": C.red };
  const targetColorMap = { Castle: C.accent, "Turret (N)": "#20d0d0", "Turret (E)": "#c060ff", "Turret (S)": "#ff8040", "Turret (W)": "#40c080" };

  const SideSection = ({ title, children }) => (
    <div style={{ background: "#0a1820", border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: 12 }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

      {/* ── LEFT: Map ── */}
      <div style={{ flex: "0 0 auto" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 5, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
          {[["all","All"],["friendly","🤝 Friendly"],["enemy","⚔ Enemy"],["unassigned","○ Unassigned"]].map(([v, label]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ ...btnSt, fontSize: 10, padding: "3px 9px", background: filter === v ? C.accentDim : "#1a2a3a", color: filter === v ? C.accent : C.textDim, border: filter === v ? `1px solid ${C.accent}44` : "1px solid transparent" }}>{label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => setAssignments({})} style={{ ...btnSt, fontSize: 10, padding: "3px 9px", background: C.redDim, color: C.red, border: `1px solid ${C.red}33` }}>Reset</button>
        </div>

        {/* Grid */}
        <div style={{ position: "relative", width: gridW, height: gridH, flexShrink: 0 }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const castle = isCastle(r, c);
              const turret = isTurret(r, c);
              const assignment = getA(r, c);
              const x = c * (TILE + GAP);
              const y = r * (TILE + GAP);
              const tLabel = getTurretLabel(r, c);
              const isSelected = modal?.r === r && modal?.c === c;
              if (castle && !turret) return null;
              let dimmed = false;
              if (filter === "friendly" && assignment?.type !== "friendly") dimmed = true;
              if (filter === "enemy" && assignment?.type !== "enemy") dimmed = true;
              if (filter === "unassigned" && assignment) dimmed = true;
              let bg, border;
              if (dimmed) { bg = "#10181f"; border = "1px solid #1a2a3a"; }
              else if (turret) { bg = "#f5f0e0"; border = `1.5px solid ${C.accent}`; }
              else if (assignment?.type === "friendly") { bg = "#0d2e52"; border = `1.5px solid ${C.blue}`; }
              else if (assignment?.type === "enemy") { bg = "#3a0d0d"; border = `1.5px solid ${C.red}`; }
              else { bg = "#d0d8df"; border = "1px solid #a8b4be"; }
              if (isSelected) border = `2px solid ${C.accent}`;
              return (
                <div key={`${r},${c}`}
                  onClick={() => !turret && handleClick(r, c)}
                  onMouseEnter={e => {
                    if (assignment && !turret) setHover({ r, c, a: assignment, x: e.clientX, y: e.clientY });
                    if (!turret && !dimmed && !isSelected) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.filter = "brightness(1.08)"; }
                  }}
                  onMouseLeave={e => {
                    setHover(null);
                    e.currentTarget.style.borderColor = ""; e.currentTarget.style.filter = "";
                  }}
                  style={{
                    position: "absolute", left: x, top: y, width: TILE, height: TILE,
                    background: bg, border, borderRadius: 3,
                    cursor: turret ? "default" : "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", boxSizing: "border-box", zIndex: turret ? 25 : 1,
                  }}>
                  {turret && <span style={{ fontSize: 7, fontWeight: 800, color: "#6a4a08", textAlign: "center", lineHeight: 1.2, fontFamily: "'Roboto Condensed','Arial Narrow',sans-serif" }}>{tLabel}</span>}
                  {!turret && !dimmed && assignment?.type === "friendly" && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#90c8ff", textAlign: "center", wordBreak: "break-all", padding: "0 1px", lineHeight: 1.2, fontFamily: "'Roboto Condensed','Arial Narrow',sans-serif" }}>
                      {assignment.member.name.slice(0, 8)}
                    </span>
                  )}
                  {!turret && !dimmed && assignment?.type === "enemy" && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: "#ff9090", textAlign: "center", wordBreak: "break-all", padding: "0 1px", lineHeight: 1.2, fontFamily: "'Roboto Condensed','Arial Narrow',sans-serif" }}>
                      {(assignment.name || "ENM").slice(0, 8)}
                    </span>
                  )}
                </div>
              );
            })
          )}

          {/* Castle interior */}
          <div style={{ position: "absolute", left: interiorX, top: interiorY, width: interiorW, height: interiorH, background: "white", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15, pointerEvents: "none" }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, fontWeight: 900, color: "#1a1a1a", letterSpacing: 3 }}>CASTLE</span>
          </div>

          {/* SVG borders */}
          <svg style={{ position: "absolute", left: 0, top: 0, width: gridW, height: gridH, pointerEvents: "none", zIndex: 30 }}>
            <rect x={cx} y={cy} width={cw} height={ch} fill="none" stroke={C.accent} strokeWidth={1.5} />
            <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={C.red} strokeWidth={2} rx={1} />
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {[["#d0d8df","#a8b4be","Empty"],["#0d2e52",C.blue,"Friendly"],["#3a0d0d",C.red,"Enemy"],["#f5f0e0",C.accent,"Turret"],["white",C.accent,"Castle"]].map(([bg, border, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.textDim }}>
              <div style={{ width: 10, height: 10, background: bg, border: `1.5px solid ${border}`, borderRadius: 2, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Sidebar ── */}
      <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 8, maxHeight: gridH + 50, overflowY: "auto" }}>

        {/* Tile assignment panel — shown when a tile is selected */}
        {modal ? (
          <TilePanel modal={modal} members={members} assignments={assignments}
            onFriendly={assignFriendly} onEnemy={assignEnemy} onClear={clearTile} onClose={() => setModal(null)} />
        ) : (
          <div style={{ background: "#0a1820", border: `1px solid ${C.panelBorder}`, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🗺</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Click any tile on the map to assign a member or mark an enemy position.</div>
          </div>
        )}

        {/* Map overview stats */}
        <SideSection title="MAP OVERVIEW">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
            {[
              { label: "Friendly", value: friendlyCount, color: C.blue },
              { label: "Enemy", value: enemyCount, color: C.red },
              { label: "Open Tiles", value: (ROWS * COLS) - 32 - friendlyCount - enemyCount, color: C.textDim },
              { label: "Unpositioned", value: unassignedMembers.length, color: C.gold },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#0d1520", borderRadius: 5, padding: "7px 8px", border: `1px solid ${C.panelBorder}` }}>
                <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 1 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Bebas Neue'", lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>
          {friendlyCount > 0 && (
            <>
              <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Friendly by Alliance</div>
              {Object.entries(friendlyByAlliance).map(([al, cnt]) => (
                <div key={al} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: allianceColor(al), flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: C.text, flex: 1 }}>{al}</span>
                  <span style={{ fontSize: 10, color: allianceColor(al), fontWeight: 700 }}>{cnt}</span>
                  <div style={{ width: 40, height: 3, background: "#1a2a3a", borderRadius: 2 }}>
                    <div style={{ width: `${(cnt / friendlyCount) * 100}%`, height: "100%", background: allianceColor(al), borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </SideSection>

        {/* Target assignment breakdown */}
        <SideSection title="TARGET ASSIGNMENTS">
          {PRIMARY_TARGETS.map(t => {
            const cnt = targetCounts[t] || 0;
            const col = targetColorMap[t] || C.textDim;
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: C.text, flex: 1 }}>{t}</span>
                <span style={{ fontSize: 10, color: col, fontWeight: 700 }}>{cnt}</span>
                <div style={{ width: 40, height: 3, background: "#1a2a3a", borderRadius: 2 }}>
                  <div style={{ width: `${members.length > 0 ? (cnt / members.length) * 100 : 0}%`, height: "100%", background: col, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </SideSection>

        {/* Unpositioned members */}
        <SideSection title={`UNPOSITIONED (${unassignedMembers.length})`}>
          {unassignedMembers.length === 0 ? (
            <div style={{ fontSize: 10, color: C.green, textAlign: "center", padding: "6px 0" }}>✓ All members positioned</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {unassignedMembers.map(m => (
                <div key={m.id} style={{ background: "#0d1520", borderRadius: 4, padding: "5px 8px", border: `1px solid ${C.panelBorder}`, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: availColorMap[m.available] || C.textDim, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.text, flex: 1 }}>{m.name}</span>
                  <span style={{ fontSize: 9, color: C.textDim }}>TC{m.tc}</span>
                  <span style={{ fontSize: 9, color: allianceColor(m.alliance), fontWeight: 700 }}>{m.alliance}</span>
                </div>
              ))}
            </div>
          )}
        </SideSection>

        {/* Full member roster with availability */}
        <SideSection title="MEMBER ROSTER">
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {members.map(m => {
              const isOnMap = assignedMemberIds.has(m.id);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", borderRadius: 4, background: isOnMap ? "#0a2040" : "#0d1520", border: `1px solid ${isOnMap ? C.blue + "44" : C.panelBorder}` }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: availColorMap[m.available] || C.textDim, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: isOnMap ? "#90c8ff" : C.text, flex: 1 }}>{m.name}</span>
                  <span style={{ fontSize: 9, color: C.textDim }}>{m.tc}</span>
                  <span style={{ fontSize: 9, color: allianceColor(m.alliance), fontWeight: 700 }}>{m.alliance}</span>
                  {isOnMap && <span style={{ fontSize: 8, color: C.blue }}>●</span>}
                </div>
              );
            })}
          </div>
        </SideSection>
      </div>

      {/* Hover tooltip */}
      {hover && (
        <div style={{
          position: "fixed", top: hover.y - 8, left: hover.x + 14,
          background: "#0d1520f2", border: `1px solid ${C.panelBorder}`,
          borderRadius: 7, padding: "10px 14px", zIndex: 9999, fontSize: 12, color: C.text,
          maxWidth: 220, pointerEvents: "none", boxShadow: "0 4px 20px #000a",
        }}>
          {hover.a.type === "friendly" ? (
            <>
              <div style={{ fontWeight: 800, color: C.blue, marginBottom: 5 }}>{hover.a.member.name}</div>
              <div style={{ color: C.textDim, marginBottom: 2 }}>Role: <span style={{ color: C.text }}>{hover.a.member.role}</span></div>
              <div style={{ color: C.textDim, marginBottom: 2 }}>Alliance: <span style={{ color: allianceColor(hover.a.member.alliance) }}>{hover.a.member.alliance}</span></div>
              <div style={{ color: C.textDim, marginBottom: 2 }}>Hero: <span style={{ color: C.text }}>{hover.a.member.heroRally}</span></div>
              <div style={{ color: C.textDim }}>Ratio: <code style={{ color: C.blue }}>{hover.a.member.ratioRally}</code></div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 800, color: C.red, marginBottom: 5 }}>{hover.a.name || "Enemy"}</div>
              {hover.a.kingdom && <div style={{ color: C.textDim, marginBottom: 2 }}>Kingdom: <span style={{ color: C.text }}>{hover.a.kingdom}</span></div>}
              <div style={{ color: C.textDim, marginBottom: 2 }}>Threat: <span style={{ color: C.red }}>{hover.a.threat}</span></div>
              {hover.a.notes && <div style={{ color: C.textDim, marginTop: 4, fontStyle: "italic" }}>{hover.a.notes}</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [members, setMembers] = useState(initMembers);
  const [assignments, setAssignments] = useState({});
  const [tab, setTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [filterRole, setFilterRole] = useState("all");
  const [filterAlliance, setFilterAlliance] = useState("all");
  const [filterAvail, setFilterAvail] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState(1);
  const [search, setSearch] = useState("");

  function startEdit(id) {
    if (!id) { setEditingId(null); return; }
    setEditDraft({ ...members.find(m => m.id === id) });
    setEditingId(id);
  }
  function saveEdit(d) { setMembers(p => p.map(m => m.id === d.id ? d : m)); setEditingId(null); }
  function deleteMember(id) {
    setMembers(p => p.filter(m => m.id !== id));
    setAssignments(p => { const n = { ...p }; Object.keys(n).forEach(k => { if (n[k].type === "friendly" && n[k].member.id === id) delete n[k]; }); return n; });
  }

  const avail = members.filter(m => m.available === "Full").length;
  const leaders = members.filter(m => m.role === "Rally Leader").length;
  const joiners = members.filter(m => m.role === "Rally Joiner").length;
  const friendlyAsgn = Object.values(assignments).filter(a => a.type === "friendly").length;
  const enemyAsgn = Object.values(assignments).filter(a => a.type === "enemy").length;
  const heroRallyDist = [...new Set(members.map(m => m.heroRally))].map(h => ({ label: h, value: members.filter(m => m.heroRally === h).length })).sort((a,b) => b.value - a.value).slice(0, 8);
  const allianceDist = ALLIANCES.map(a => ({ label: a, value: members.filter(m => m.alliance === a).length }));
  const availDist = AVAILABILITY_OPTS.map(o => ({ label: o, value: members.filter(m => m.available === o).length }));
  const targetDist = PRIMARY_TARGETS.map(t => ({ label: t, value: members.filter(m => m.primaryTarget === t).length }));

  let filtered = members.filter(m => {
    if (filterRole !== "all" && m.role !== filterRole) return false;
    if (filterAlliance !== "all" && m.alliance !== filterAlliance) return false;
    if (filterAvail !== "all" && m.available !== filterAvail) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return av < bv ? -sortDir : av > bv ? sortDir : 0;
  });

  function toggleSort(k) { if (sortKey === k) setSortDir(d => -d); else { setSortKey(k); setSortDir(1); } }

  const thSt = { padding: "10px 10px", fontSize: 10, color: C.textDim, textAlign: "left", borderBottom: `1px solid ${C.panelBorder}`, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.8, userSelect: "none", whiteSpace: "nowrap" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Syne','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=Roboto+Condensed:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: #1a2a3a; border-radius: 3px; }
        select option { background: #0d1520; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg,#0d1520,#101c2c 50%,#0d1520)", borderBottom: `1px solid ${C.panelBorder}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 20, height: 56 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: C.accent, letterSpacing: 3 }}>⚔ KINGSHOT KvK</div>
        <div style={{ fontSize: 11, color: C.textDim, borderLeft: `1px solid ${C.panelBorder}`, paddingLeft: 16 }}>ALLIANCE COMMAND CENTER</div>
        <div style={{ flex: 1 }} />
        {[["dashboard","📊 Dashboard"],["members","👥 Members"],["map","🗺 Battle Map"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...btnSt, padding: "6px 18px", fontSize: 13, fontWeight: 700, fontFamily: "'Roboto Condensed', 'Arial Narrow', sans-serif", letterSpacing: 0.5, background: tab === k ? C.accentDim : "transparent", color: tab === k ? C.accent : C.textDim, border: tab === k ? `1px solid ${C.accent}44` : "1px solid transparent" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 1600, margin: "0 auto" }}>

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <StatCard label="Total Members" value={members.length} sub={`${avail} full availability`} />
              <StatCard label="Full Avail." value={avail} sub={`${Math.round(avail / members.length * 100)}% ready`} color={C.green} />
              <StatCard label="Rally Leaders" value={leaders} color={C.gold} />
              <StatCard label="Rally Joiners" value={joiners} color={C.blue} />
              <StatCard label="Friendly Tiles" value={friendlyAsgn} sub="on map" color={C.blue} />
              <StatCard label="Enemy Tiles" value={enemyAsgn} sub="tracked" color={C.red} />
              <StatCard label="Off-Map" value={members.length - friendlyAsgn} sub="unpositioned" color={C.textDim} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(265px,1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { title: "AVAILABILITY", content: <>
                  {availDist.map(({ label, value }) => {
                    const col = { Full: C.green, "1st Half": C.blue, "2nd Half": C.gold, "On/Off": C.red }[label] || C.textDim;
                    return <MiniBar key={label} label={label} value={value} max={members.length} color={col} />;
                  })}
                </> },
                { title: "ROLES", content: <><DonutSlice label="Rally Leaders" value={leaders} total={members.length} color={C.gold} /><DonutSlice label="Rally Joiners" value={joiners} total={members.length} color={C.blue} /></> },
                { title: "ALLIANCES", content: allianceDist.map(({ label, value }) => <MiniBar key={label} label={label} value={value} max={members.length} color={allianceColor(label)} />) },
                { title: "JOINER HEROES", content: heroRallyDist.map(({ label, value }, i) => <MiniBar key={label} label={label} value={value} max={members.length} color={[C.gold, C.blue, C.green, "#c060ff","#ff6060","#20d0d0","#ff8040","#40c080"][i % 8]} />) },
                { title: "PRIMARY TARGETS", content: targetDist.map(({ label, value }) => {
                  const col = { Castle: C.accent, "Turret (N)": "#20d0d0", "Turret (E)": "#c060ff", "Turret (S)": "#ff8040", "Turret (W)": "#40c080" }[label] || C.textDim;
                  return <MiniBar key={label} label={label} value={value} max={members.length} color={col} />;
                }) },
                { title: "MAP OCCUPANCY", content: <><DonutSlice label="Friendly" value={friendlyAsgn} total={friendlyAsgn + enemyAsgn + 1} color={C.blue} /><DonutSlice label="Enemy" value={enemyAsgn} total={friendlyAsgn + enemyAsgn + 1} color={C.red} /></> },
                { title: "TC LEVELS", content: TC_LEVELS.slice().reverse().map(tg => { const cnt = members.filter(m => m.tc === tg).length; return cnt > 0 ? <MiniBar key={tg} label={tg} value={cnt} max={members.length} color={C.accent} /> : null; }) },
              ].map(({ title, content }) => (
                <div key={title} style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: 18 }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 15, color: C.accent, letterSpacing: 1, marginBottom: 12 }}>{title}</div>
                  {content}
                </div>
              ))}
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 15, color: C.accent, letterSpacing: 1, marginBottom: 12 }}>QUICK ROSTER</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {members.map(m => (
                  <div key={m.id} style={{ background: m.available ? "#0a2a1a" : "#2a0a0a", border: `1px solid ${m.available ? C.green : C.red}33`, borderRadius: 6, padding: "6px 12px", fontSize: 12 }}>
                    <span style={{ fontWeight: 700 }}>{m.name}</span>
                    <span style={{ color: C.textDim, marginLeft: 6, fontSize: 11 }}>{m.tc}</span>
                    <span style={{ marginLeft: 6 }}><Pill color={allianceColor(m.alliance)}>{m.alliance}</Pill></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Members ── */}
        {tab === "members" && (
          <div>
            <AddMemberForm onAdd={m => setMembers(p => [...p, m])} />
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input style={{ ...inputSt, width: 200 }} placeholder="🔍 Search name…" value={search} onChange={e => setSearch(e.target.value)} />
              <select style={{ ...inputSt, width: 150 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option value="all">All Roles</option>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select style={{ ...inputSt, width: 150 }} value={filterAlliance} onChange={e => setFilterAlliance(e.target.value)}>
                <option value="all">All Alliances</option>{ALLIANCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select style={{ ...inputSt, width: 160 }} value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
                <option value="all">All Availability</option>
                {AVAILABILITY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <span style={{ fontSize: 12, color: C.textDim }}>{filtered.length} / {members.length}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: C.panel, borderRadius: 10, overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#0a1820" }}>
                    {[["name","Name"],["tc","TC"],["available","Avail."],["role","Role"],["heroRally","Joiner Hero"],["heroGarrison","Garrison Hero"],["ratioRally","Rally Ratio"],["ratioGarrison","Garrison Ratio"],["alliance","Alliance"],["primaryTarget","Primary Target"],["notes","Notes"],[null,"Actions"]].map(([k, label]) => (
                      <th key={label} style={thSt} onClick={() => k && toggleSort(k)}>{label}{k && sortKey === k ? (sortDir === 1 ? " ↑" : " ↓") : ""}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <MemberRow key={m.id} m={m} onEdit={startEdit} onDelete={deleteMember}
                      editingId={editingId} onSaveEdit={saveEdit} editDraft={editDraft} setEditDraft={setEditDraft} />
                  ))}
                  {!filtered.length && <tr><td colSpan={12} style={{ padding: 40, textAlign: "center", color: C.textDim }}>No members match filters</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Map ── */}
        {tab === "map" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: C.accent, letterSpacing: 2, marginBottom: 4 }}>⚔ KVK BATTLE MAP</div>
              <div style={{ fontSize: 12, color: C.textDim }}>Click any gray tile to assign a member or mark an enemy position. The red border defines the active battlefield zone. Hover assigned tiles for intel.</div>
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 10, padding: 20 }}>
              <CastleMap members={members} assignments={assignments} setAssignments={setAssignments} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
