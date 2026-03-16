const KEY = "flarepup-v5";
const CAL_INPUTS_KEY = "flarepup-cal-inputs-v1";
const EVO_NAMES = ["Egg", "Pup", "Blossom", "Fighter", "Queen"];
const EVO_THRESH = [1, 3, 6, 10, 15];
const DIET_XP = {
  water: 15,
  veggies: 15,
  protein: 20,
  nojunk: 20,
  balanced: 15,
};
const TIPS = [
  "consistency beats intensity 🌸",
  "rest days are part of the plan 💤",
  "so proud of you for showing up! 🌟",
  "a 300–500 kcal deficit is the sweet spot 🔥",
  "every rep is a vote for who you're becoming 💪",
  "you're glowing AND growing! 🌷",
  "hydration is self-love! 💧",
  "fuelling right = training right 🥗",
  "your future self is cheering you on! 👑",
  "deficit + strength = dream combo 💪",
];
const MOODS = {
  idle: { t: "every step counts! 🌸" },
  happy: { t: "you're amazing! 💖" },
  excited: { t: "level up!! 🎉" },
  str: { t: "getting stronger! 💪" },
  walk: { t: "keep stepping! 🌸" },
  box: { t: "knock knock!! 🥊" },
  ten: { t: "ace it, queen! 🎾" },
  diet: { t: "eating like a champ! 🥗" },
  calorie: { t: "deficit achieved! 🔥" },
  pb: { t: "new record queen! 👑" },
  streak: { t: "streak queen!! 🔥" },
  restore: { t: "welcome back, queen! 👋" },
  rename: { t: "love the new name! 💖" },
};

const BTN_STYLE =
  "display:block!important;width:100%!important;background:#fff0f8!important;color:#e8509a!important;border:1.5px solid #e8509a!important;border-radius:10px!important;padding:.55rem!important;font-family:DM Mono,monospace!important;font-size:11px!important;cursor:pointer!important;font-weight:700!important;letter-spacing:.04em!important;margin-bottom:.9rem!important;";
function forceAllBtns() {
  ["cal-log-btn", "reset-pet-btn", "log-custom-btn"].forEach((id) => {
    const b = document.getElementById(id);
    if (b) b.style.cssText = BTN_STYLE;
  });
}

// Egg SVG — uses hardcoded dark colours guaranteed visible on any background
function eggSVG() {
  return `<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <!-- shell body -->
    <ellipse cx="80" cy="108" rx="42" ry="34" fill="#e8509a" stroke="#9d1460" stroke-width="2.5"/>
    <!-- mid band -->
    <ellipse cx="80" cy="97" rx="30" ry="23" fill="#f472b6" stroke="#c0316e" stroke-width="1.5"/>
    <!-- face area -->
    <ellipse cx="80" cy="88" rx="20" ry="16" fill="#fce7f3" stroke="#e8509a" stroke-width="1.2"/>
    <!-- eyes -->
    <ellipse cx="73" cy="86" rx="4.5" ry="5" fill="#2d0a20" stroke="#9d1460" stroke-width=".8"/>
    <ellipse cx="87" cy="86" rx="4.5" ry="5" fill="#2d0a20" stroke="#9d1460" stroke-width=".8"/>
    <!-- eye shine -->
    <circle cx="74.5" cy="84" r="1.5" fill="#ffffff" opacity=".95"/>
    <circle cx="88.5" cy="84" r="1.5" fill="#ffffff" opacity=".95"/>
    <!-- cheeks -->
    <ellipse cx="66" cy="90" rx="5" ry="3" fill="#f9a8d4" opacity=".75"/>
    <ellipse cx="94" cy="90" rx="5" ry="3" fill="#f9a8d4" opacity=".75"/>
    <!-- nose -->
    <ellipse cx="80" cy="93" rx="2.5" ry="1.8" fill="#c0316e" opacity=".85"/>
    <!-- smile -->
    <path d="M74 97 Q80 102 86 97" fill="none" stroke="#9d1460" stroke-width="2" stroke-linecap="round"/>
    <!-- left leg -->
    <ellipse cx="57" cy="125" rx="11" ry="7" fill="#e8509a" stroke="#9d1460" stroke-width="1.5"/>
    <!-- right leg -->
    <ellipse cx="103" cy="125" rx="11" ry="7" fill="#e8509a" stroke="#9d1460" stroke-width="1.5"/>
    <!-- left arm nub -->
    <ellipse cx="42" cy="114" rx="7" ry="5.5" fill="#f472b6" stroke="#c0316e" stroke-width="1.2"/>
    <!-- right arm nub -->
    <ellipse cx="118" cy="114" rx="7" ry="5.5" fill="#f472b6" stroke="#c0316e" stroke-width="1.2"/>
    <!-- left antenna -->
    <path d="M64 78 Q58 62 62 54" fill="none" stroke="#c0316e" stroke-width="3" stroke-linecap="round"/>
    <!-- right antenna -->
    <path d="M96 78 Q102 62 98 54" fill="none" stroke="#c0316e" stroke-width="3" stroke-linecap="round"/>
    <!-- antenna tips — golden -->
    <circle cx="62" cy="53" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
    <circle cx="98" cy="53" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  </svg>`;
}

function petSVG(i) {
  if (i === 0) return eggSVG();
  if (i === 1)
    return `<svg width="165" height="160" viewBox="0 0 170 160" id="pet-svg"><ellipse cx="85" cy="103" rx="44" ry="34" fill="#fce8f5" stroke="#e8509a" stroke-width="2"/><path d="M127 103 Q148 88 142 70 Q136 56 125 65" fill="none" stroke="#e8509a" stroke-width="4" stroke-linecap="round" id="tail"/><ellipse cx="64" cy="133" rx="12" ry="7" fill="#fbd0ec" stroke="#e8509a" stroke-width="1.5"/><ellipse cx="106" cy="133" rx="12" ry="7" fill="#fbd0ec" stroke="#e8509a" stroke-width="1.5"/><path id="arm-l" d="M44 98 Q28 93 23 101" fill="none" stroke="#e8509a" stroke-width="5" stroke-linecap="round"/><path id="arm-r" d="M126 98 Q142 93 147 101" fill="none" stroke="#e8509a" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="58" r="3" fill="#f9a8d4" opacity=".8" id="sp1"/><circle cx="152" cy="62" r="2.5" fill="#c084fc" opacity=".7" id="sp2"/><ellipse id="head" cx="85" cy="79" rx="32" ry="27" fill="#fce8f5" stroke="#e8509a" stroke-width="2"/><polygon points="60,60 53,41 70,55" fill="#fce8f5" stroke="#e8509a" stroke-width="1.5"/><polygon points="110,60 117,41 100,55" fill="#fce8f5" stroke="#e8509a" stroke-width="1.5"/><polygon points="62,57 57,46 68,54" fill="#f9c8e4"/><polygon points="108,57 113,46 102,54" fill="#f9c8e4"/><ellipse cx="74" cy="77" rx="8" ry="8.5" fill="#fff" stroke="#e8509a" stroke-width="1.2"/><ellipse cx="96" cy="77" rx="8" ry="8.5" fill="#fff" stroke="#e8509a" stroke-width="1.2"/><circle id="pupil-l" cx="75" cy="77" r="4.5" fill="#3d1f35"/><circle id="pupil-r" cx="97" cy="77" r="4.5" fill="#3d1f35"/><circle cx="76" cy="75" r="1.5" fill="#fff" opacity=".9"/><circle cx="98" cy="75" r="1.5" fill="#fff" opacity=".9"/><ellipse cx="85" cy="88" rx="3" ry="2" fill="#e8509a"/><path id="mouth" d="M78 93 Q85 99 92 93" fill="none" stroke="#e8509a" stroke-width="2" stroke-linecap="round"/><ellipse id="ck-l" cx="65" cy="88" rx="7" ry="4" fill="#f9a8d4" opacity=".45"/><ellipse id="ck-r" cx="105" cy="88" rx="7" ry="4" fill="#f9a8d4" opacity=".45"/></svg>`;
  if (i === 2)
    return `<svg width="175" height="175" viewBox="0 0 190 175" id="pet-svg"><ellipse cx="42" cy="72" rx="28" ry="38" fill="#f9c8e4" stroke="#e8509a" stroke-width="1.5" opacity=".85"/><ellipse cx="148" cy="72" rx="28" ry="38" fill="#f9c8e4" stroke="#e8509a" stroke-width="1.5" opacity=".85"/><ellipse cx="38" cy="110" rx="18" ry="22" fill="#fde8f5" stroke="#e8509a" stroke-width="1.2" opacity=".7"/><ellipse cx="152" cy="110" rx="18" ry="22" fill="#fde8f5" stroke="#e8509a" stroke-width="1.2" opacity=".7"/><ellipse cx="95" cy="115" rx="38" ry="32" fill="#fce4f5" stroke="#d83090" stroke-width="2"/><ellipse cx="72" cy="140" rx="11" ry="7" fill="#f5b8e8" stroke="#d83090" stroke-width="1.2"/><ellipse cx="118" cy="140" rx="11" ry="7" fill="#f5b8e8" stroke="#d83090" stroke-width="1.2"/><path id="arm-l" d="M60 108 Q44 103 40 112" fill="none" stroke="#d83090" stroke-width="4.5" stroke-linecap="round"/><path id="arm-r" d="M130 108 Q146 103 150 112" fill="none" stroke="#d83090" stroke-width="4.5" stroke-linecap="round"/><path id="tail" d="M130 112 Q155 94 148 70 Q142 52 127 62" fill="none" stroke="#d83090" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="52" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1"/><circle cx="95" cy="47" r="7" fill="#f9a8d4" stroke="#be185d" stroke-width="1"/><circle cx="110" cy="52" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1"/><circle cx="95" cy="47" r="3.5" fill="#fbbf24"/><ellipse id="head" cx="95" cy="85" rx="30" ry="27" fill="#fce4f5" stroke="#d83090" stroke-width="2"/><ellipse cx="73" cy="63" rx="8" ry="10" fill="#fce4f5" stroke="#d83090" stroke-width="1.5"/><ellipse cx="117" cy="63" rx="8" ry="10" fill="#fce4f5" stroke="#d83090" stroke-width="1.5"/><ellipse cx="73" cy="63" rx="4.5" ry="6" fill="#f9c8e4"/><ellipse cx="117" cy="63" rx="4.5" ry="6" fill="#f9c8e4"/><circle cx="22" cy="50" r="2.5" fill="#f9a8d4" opacity=".7" id="sp1"/><circle cx="168" cy="55" r="2" fill="#fbbf24" opacity=".65" id="sp2"/><ellipse cx="83" cy="83" rx="9.5" ry="10" fill="#fff" stroke="#d83090" stroke-width="1.2"/><ellipse cx="107" cy="83" rx="9.5" ry="10" fill="#fff" stroke="#d83090" stroke-width="1.2"/><circle id="pupil-l" cx="84" cy="83" r="5.5" fill="#3d1f35"/><circle id="pupil-r" cx="108" cy="83" r="5.5" fill="#3d1f35"/><circle cx="85" cy="80" r="2" fill="#fff" opacity=".95"/><circle cx="109" cy="80" r="2" fill="#fff" opacity=".95"/><ellipse id="ck-l" cx="70" cy="93" rx="8" ry="5" fill="#f9a8d4" opacity=".55"/><ellipse id="ck-r" cx="120" cy="93" rx="8" ry="5" fill="#f9a8d4" opacity=".55"/><ellipse cx="95" cy="94" rx="3" ry="2.2" fill="#d83090"/><path id="mouth" d="M87 100 Q95 107 103 100" fill="none" stroke="#d83090" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  if (i === 3)
    return `<svg width="178" height="170" viewBox="0 0 190 175" id="pet-svg"><ellipse cx="95" cy="118" rx="56" ry="40" fill="#f0b8d8" stroke="#a01050" stroke-width="2.5"/><ellipse cx="30" cy="100" rx="16" ry="24" fill="#f0b8d8" stroke="#a01050" stroke-width="2"/><ellipse cx="160" cy="100" rx="16" ry="24" fill="#f0b8d8" stroke="#a01050" stroke-width="2"/><ellipse cx="18" cy="118" rx="13" ry="11" fill="#f4436c" stroke="#800" stroke-width="1.5" id="glove-l"/><ellipse cx="172" cy="118" rx="13" ry="11" fill="#f4436c" stroke="#800" stroke-width="1.5" id="glove-r"/><path d="M83 110 Q95 108 107 110" fill="none" stroke="#a01050" stroke-width="1.2" opacity=".5"/><path d="M81 120 Q95 118 109 120" fill="none" stroke="#a01050" stroke-width="1.2" opacity=".5"/><line x1="95" y1="107" x2="95" y2="128" stroke="#a01050" stroke-width="1" opacity=".4"/><ellipse cx="68" cy="150" rx="15" ry="9" fill="#f0b8d8" stroke="#a01050" stroke-width="1.5"/><ellipse cx="122" cy="150" rx="15" ry="9" fill="#f0b8d8" stroke="#a01050" stroke-width="1.5"/><path id="tail" d="M148 115 Q175 95 167 65 Q158 40 140 54" fill="none" stroke="#a01050" stroke-width="5.5" stroke-linecap="round"/><ellipse id="head" cx="95" cy="82" rx="36" ry="30" fill="#f8d0ee" stroke="#a01050" stroke-width="2.5"/><rect x="66" y="98" width="58" height="14" rx="6" fill="#f8d0ee" stroke="#a01050" stroke-width="1.5"/><polygon points="68,64 55,32 80,58" fill="#f8d0ee" stroke="#a01050" stroke-width="2"/><polygon points="122,64 135,32 110,58" fill="#f8d0ee" stroke="#a01050" stroke-width="2"/><polygon points="70,62 60,38 78,56" fill="#f4436c" opacity=".4"/><polygon points="120,62 130,38 112,56" fill="#f4436c" opacity=".4"/><path d="M72 72 Q82 68 90 72" fill="none" stroke="#a01050" stroke-width="2.5" stroke-linecap="round"/><path d="M100 72 Q108 68 118 72" fill="none" stroke="#a01050" stroke-width="2.5" stroke-linecap="round"/><circle cx="14" cy="57" r="3.5" fill="#f9a8d4" opacity=".75" id="sp1"/><circle cx="176" cy="62" r="3" fill="#c084fc" opacity=".7" id="sp2"/><ellipse cx="81" cy="80" rx="10" ry="10.5" fill="#fff" stroke="#a01050" stroke-width="1.5"/><ellipse cx="109" cy="80" rx="10" ry="10.5" fill="#fff" stroke="#a01050" stroke-width="1.5"/><circle id="pupil-l" cx="82" cy="80" r="6" fill="#1a0010"/><circle id="pupil-r" cx="110" cy="80" r="6" fill="#1a0010"/><circle cx="83" cy="77" r="2" fill="#fff" opacity=".9"/><circle cx="111" cy="77" r="2" fill="#fff" opacity=".9"/><ellipse id="ck-l" cx="66" cy="92" rx="9" ry="5" fill="#f9a8d4" opacity=".5"/><ellipse id="ck-r" cx="124" cy="92" rx="9" ry="5" fill="#f9a8d4" opacity=".5"/><path id="mouth" d="M84 100 Q95 105 106 100" fill="none" stroke="#a01050" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  return `<svg width="182" height="195" viewBox="0 0 195 200" id="pet-svg"><ellipse cx="97" cy="165" rx="58" ry="30" fill="#fba8d8" stroke="#7a0848" stroke-width="1.5" opacity=".5"/><ellipse cx="97" cy="130" rx="48" ry="44" fill="#fcd8ef" stroke="#9a1860" stroke-width="2.5"/><rect x="68" y="140" width="58" height="10" rx="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" opacity=".85"/><circle cx="97" cy="145" r="4" fill="#fff" stroke="#d97706" stroke-width="1"/><ellipse cx="74" cy="168" rx="13" ry="10" fill="#fcd8ef" stroke="#9a1860" stroke-width="1.5"/><ellipse cx="120" cy="168" rx="13" ry="10" fill="#fcd8ef" stroke="#9a1860" stroke-width="1.5"/><path id="tail" d="M142 128 Q178 100 172 62 Q165 30 144 44" fill="none" stroke="#9a1860" stroke-width="5" stroke-linecap="round"/><path d="M145 132 Q182 110 178 72 Q174 44 155 52" fill="none" stroke="#f9a8d4" stroke-width="2.5" stroke-linecap="round" opacity=".6"/><path id="arm-l" d="M52 118 Q30 108 22 120" fill="none" stroke="#9a1860" stroke-width="6" stroke-linecap="round"/><path id="arm-r" d="M142 118 Q164 108 172 120" fill="none" stroke="#9a1860" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="122" r="8" fill="#c084fc" stroke="#7c3aed" stroke-width="1.2"/><circle cx="20" cy="122" r="4" fill="#e9d5ff"/><circle cx="174" cy="122" r="8" fill="#c084fc" stroke="#7c3aed" stroke-width="1.2"/><circle cx="174" cy="122" r="4" fill="#e9d5ff"/><ellipse id="head" cx="97" cy="80" rx="36" ry="34" fill="#fcd8ef" stroke="#9a1860" stroke-width="2.5"/><polygon points="68,60 56,22 82,54" fill="#fcd8ef" stroke="#9a1860" stroke-width="2"/><polygon points="126,60 138,22 112,54" fill="#fcd8ef" stroke="#9a1860" stroke-width="2"/><polygon points="70,58 62,30 79,52" fill="#f9a8d4" opacity=".6"/><polygon points="124,58 132,30 115,52" fill="#f9a8d4" opacity=".6"/><circle cx="64" cy="26" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/><circle cx="130" cy="26" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/><rect x="68" y="30" width="58" height="14" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/><polygon points="68,30 74,12 80,30" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/><polygon points="88,30 95,8 102,30" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/><polygon points="114,30 120,12 126,30" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/><circle cx="95" cy="12" r="4" fill="#f472b6" stroke="#be185d" stroke-width="1"/><circle cx="74" cy="16" r="3" fill="#c084fc" stroke="#7c3aed" stroke-width="1"/><circle cx="120" cy="16" r="3" fill="#c084fc" stroke="#7c3aed" stroke-width="1"/><circle cx="18" cy="55" r="3.5" fill="#f9a8d4" opacity=".8" id="sp1"/><circle cx="176" cy="50" r="3" fill="#fbbf24" opacity=".75" id="sp2"/><circle cx="25" cy="36" r="2.5" fill="#c084fc" opacity=".65" id="sp3"/><ellipse cx="82" cy="80" rx="12" ry="12" fill="#fff" stroke="#9a1860" stroke-width="1.8"/><ellipse cx="112" cy="80" rx="12" ry="12" fill="#fff" stroke="#9a1860" stroke-width="1.8"/><circle id="pupil-l" cx="83" cy="80" r="7.5" fill="#1a0408"/><circle id="pupil-r" cx="113" cy="80" r="7.5" fill="#1a0408"/><polygon points="83,72 84.5,77 89,77 85.5,80 87,85 83,82 79,85 80.5,80 77,77 81.5,77" fill="#fbbf24" opacity=".9"/><polygon points="113,72 114.5,77 119,77 115.5,80 117,85 113,82 109,85 110.5,80 107,77 111.5,77" fill="#fbbf24" opacity=".9"/><circle cx="79" cy="75" r="1.8" fill="#fff" opacity=".9"/><circle cx="109" cy="75" r="1.8" fill="#fff" opacity=".9"/><ellipse id="ck-l" cx="66" cy="93" rx="10" ry="6" fill="#f9a8d4" opacity=".6"/><ellipse id="ck-r" cx="128" cy="93" rx="10" ry="6" fill="#f9a8d4" opacity=".6"/><ellipse cx="97" cy="93" rx="4" ry="3" fill="#9a1860"/><path id="mouth" d="M84 101 Q97 114 110 101" fill="none" stroke="#9a1860" stroke-width="2.8" stroke-linecap="round"/></svg>`;
}

const def = () => ({
  xp: 0,
  level: 1,
  totalWk: 0,
  streak: 0,
  lastDate: "",
  log: [],
  petName: "flarepup",
  dietStreak: 0,
  dietLastDate: "",
  dietDone: {},
  calGoal: 1800,
  calStreak: 0,
  calLastDate: "",
  calResult: null,
  calHistory: [],
  firstLogDate: "",
  cats: {
    str: { xp: 0, sess: 0, goal: 150 },
    walk: { xp: 0, sess: 0, goal: 150 },
    box: { xp: 0, sess: 0, goal: 150 },
    ten: { xp: 0, sess: 0, goal: 150 },
  },
});
let S = def(),
  saveTimer = null,
  calInputTimer = null,
  activeTab = "cal",
  currentEvoIdx = -1;
async function save() {
  const el = document.getElementById("save-ind");
  el.textContent = "saving...";
  try {
    await window.storage.set(KEY, JSON.stringify(S));
    el.textContent = "saved ✓";
  } catch (e) {
    el.textContent = "save failed";
  }
}
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 600);
}
async function saveCalInputs() {
  const today = new Date().toDateString();
  const data = {
    date: today,
    eaten: document.getElementById("cal-eaten").value,
    burned: document.getElementById("cal-burned").value,
    goal: document.getElementById("cal-goal-input").value,
  };
  clearTimeout(calInputTimer);
  calInputTimer = setTimeout(async () => {
    try {
      await window.storage.set(CAL_INPUTS_KEY, JSON.stringify(data));
    } catch (e) {}
  }, 400);
}
async function loadCalInputs() {
  try {
    const r = await window.storage.get(CAL_INPUTS_KEY);
    if (!r || !r.value) return;
    const d = JSON.parse(r.value);
    if (d.date !== new Date().toDateString()) return;
    if (d.goal) document.getElementById("cal-goal-input").value = d.goal;
    if (d.eaten) document.getElementById("cal-eaten").value = d.eaten;
    if (d.burned) document.getElementById("cal-burned").value = d.burned;
  } catch (e) {}
}
async function load() {
  try {
    const r = await window.storage.get(KEY);
    if (r && r.value) {
      S = JSON.parse(r.value);
      if (!S.cats.ten) S.cats.ten = { xp: 0, sess: 0, goal: 150 };
      if (!S.calStreak) S.calStreak = 0;
      if (!S.calGoal) S.calGoal = 1800;
      if (!S.petName) S.petName = "flarepup";
      if (!S.calHistory) S.calHistory = [];
      if (!S.firstLogDate) S.firstLogDate = "";
      renderAll();
      await loadCalInputs();
      restoreCalResult();
      renderPredictions();
      setMood("restore");
      document.getElementById("save-ind").textContent = "restored ✓";
      setTimeout(() => setMood("idle"), 2500);
    } else {
      setMood("idle");
      await loadCalInputs();
      renderPredictions();
      document.getElementById("save-ind").textContent = "no data yet";
    }
  } catch (e) {
    setMood("idle");
    renderPredictions();
    document.getElementById("save-ind").textContent = "fresh start!";
  }
}
function restoreCalResult() {
  if (!S.calResult) return;
  if (S.calResult.date !== new Date().toDateString()) {
    S.calResult = null;
    return;
  }
  const r = S.calResult;
  document.getElementById("cal-summary").style.display = "block";
  document.getElementById("cal-bar-wrap").style.display = "block";
  document.getElementById("cs-eaten").textContent = r.eaten + " kcal";
  document.getElementById("cs-burned").textContent =
    r.burned > 0 ? r.burned + " kcal" : "0 kcal";
  document.getElementById("cs-net").textContent = r.net + " kcal net";
  document.getElementById("cs-deficit").textContent = r.deficitText;
  document.getElementById("cs-deficit").style.color = r.deficitColor;
  document.getElementById("cal-bar-goal-lbl").textContent =
    r.goal + " kcal goal";
  const fill = document.getElementById("cal-bar-fill");
  fill.style.width = r.pct + "%";
  fill.className = "cal-bar-fill" + (r.fillClass ? " " + r.fillClass : "");
  document.getElementById("cal-streak-pill").textContent =
    (S.calStreak || 0) + " day streak";
}
function getEvoIdx() {
  let idx = EVO_THRESH.findIndex(
    (l, i) => S.level < (EVO_THRESH[i + 1] || 999),
  );
  return idx < 0 ? 4 : idx;
}
function renderPet(evoIdx, animated) {
  if (evoIdx === currentEvoIdx && !animated) return;
  currentEvoIdx = evoIdx;
  document.getElementById("pet-svg-wrap").innerHTML = petSVG(evoIdx);
  if (animated && evoIdx > 0) {
    const head = document.getElementById("head");
    if (head) {
      const bases = [0, 32, 30, 36, 36];
      const base = bases[evoIdx] || 32;
      let t = 0;
      const a = setInterval(() => {
        t++;
        head.setAttribute("rx", base * (1 + 0.08 * Math.sin(t * 0.9)));
        if (t > 20) {
          clearInterval(a);
          head.setAttribute("rx", base);
        }
      }, 40);
    }
  }
}
function setMood(m) {
  const d = MOODS[m] || MOODS.idle;
  document.getElementById("mood-bubble").textContent = d.t;
  const big = [
    "happy",
    "excited",
    "pb",
    "streak",
    "restore",
    "box",
    "ten",
    "calorie",
    "rename",
  ].includes(m);
  const op = big ? "0.7" : "0.45";
  ["ck-l", "ck-r"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.setAttribute("opacity", op);
  });
  const mth = document.getElementById("mouth");
  if (mth) {
    const evoIdx = getEvoIdx();
    if (evoIdx === 0) return;
    const bases = [
      [],
      [78, 93, 85, 99, 92, 93],
      [87, 100, 95, 107, 103, 100],
      [84, 100, 95, 105, 106, 100],
      [84, 101, 97, 114, 110, 101],
    ];
    const b = bases[evoIdx] || bases[1];
    const lift = big ? -5 : 0;
    mth.setAttribute(
      "d",
      `M${b[0]} ${b[1]} Q${b[2]} ${b[3] + lift} ${b[4]} ${b[5]}`,
    );
  }
}
function bounceEyes() {
  const evoIdx = getEvoIdx();
  if (evoIdx === 0) return;
  const bases = [0, 77, 83, 80, 80];
  ["pupil-l", "pupil-r"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) {
      const base = bases[evoIdx] || 77;
      e.setAttribute("cy", base - 5);
      setTimeout(() => e.setAttribute("cy", base), 210);
    }
  });
}
function wagTail() {
  const tl = document.getElementById("tail");
  if (!tl) return;
  const evoIdx = getEvoIdx();
  const p = [
    [
      "M127 103 Q148 88 142 70 Q136 56 125 65",
      "M127 103 Q155 95 150 72 Q144 54 130 60",
    ],
    [
      "M130 112 Q155 94 148 70 Q142 52 127 62",
      "M130 112 Q158 100 153 74 Q145 50 128 58",
    ],
    [
      "M148 115 Q175 95 167 65 Q158 40 140 54",
      "M148 115 Q178 100 172 68 Q162 38 142 50",
    ],
    [
      "M142 128 Q178 100 172 62 Q165 30 144 44",
      "M142 128 Q180 106 175 66 Q167 28 146 40",
    ],
  ];
  const pp = p[evoIdx - 1] || p[0];
  let t = 0;
  const a = setInterval(() => {
    t++;
    tl.setAttribute("d", t % 2 === 0 ? pp[0] : pp[1]);
    if (t > 10) {
      clearInterval(a);
      tl.setAttribute("d", pp[0]);
    }
  }, 110);
}
function punchAnim() {
  const gl = document.getElementById("glove-l");
  if (!gl) return;
  let t = 0;
  const cx0 = gl.getAttribute("cx");
  const a = setInterval(() => {
    t++;
    gl.setAttribute("cx", t % 2 === 0 ? cx0 : parseFloat(cx0) + 16);
    if (t > 8) {
      clearInterval(a);
      gl.setAttribute("cx", cx0);
    }
  }, 90);
}
function racketAnim() {
  const ar = document.getElementById("arm-r");
  if (!ar) return;
  let t = 0;
  const orig = ar.getAttribute("d");
  const evoIdx = getEvoIdx();
  const alt =
    evoIdx === 1
      ? "M126 90 Q144 80 150 90"
      : evoIdx === 2
        ? "M130 100 Q148 90 152 100"
        : evoIdx === 3
          ? "M142 110 Q162 100 168 108"
          : "M142 110 Q165 100 173 108";
  const a = setInterval(() => {
    t++;
    ar.setAttribute("d", t % 2 === 0 ? orig : alt);
    if (t > 8) {
      clearInterval(a);
      ar.setAttribute("d", orig);
    }
  }, 100);
}
function animateHead() {
  const h = document.getElementById("head");
  if (!h) return;
  const evoIdx = getEvoIdx();
  const bases = [0, 32, 30, 36, 36];
  const base = bases[evoIdx] || 32;
  let t = 0;
  const a = setInterval(() => {
    t++;
    h.setAttribute("rx", base * (1 + 0.09 * Math.sin(t * 0.8)));
    if (t > 28) {
      clearInterval(a);
      h.setAttribute("rx", base);
    }
  }, 38);
}
function updateEvo() {
  const idx = getEvoIdx();
  for (let i = 0; i < 5; i++) {
    const d = document.getElementById("e" + i);
    d.classList.remove("active", "future");
    if (i <= idx) d.classList.add("active");
    else d.classList.add("future");
    if (i < 4)
      document.getElementById("el" + i).classList.toggle("active", i < idx);
  }
  const was = currentEvoIdx;
  renderPet(idx, was >= 0 && was !== idx);
  renderPetName();
}
function renderPetName() {
  document.getElementById("pet-name-lbl").textContent =
    S.petName + " · " + EVO_NAMES[getEvoIdx()].toLowerCase();
}
function startEditName() {
  document.getElementById("pet-name-lbl").style.display = "none";
  const inp = document.getElementById("pet-name-input");
  inp.style.display = "inline-block";
  inp.value = S.petName;
  inp.focus();
  inp.select();
}
function saveName() {
  const inp = document.getElementById("pet-name-input");
  const raw = inp.value.trim();
  if (raw) S.petName = raw.toLowerCase().slice(0, 20);
  inp.style.display = "none";
  document.getElementById("pet-name-lbl").style.display = "inline";
  renderPetName();
  setMood("rename");
  showToast("renamed to " + S.petName + "! 💖");
  setTimeout(() => setMood("idle"), 2500);
  scheduleSave();
}
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}
function renderStreak() {
  document.getElementById("streak-num").textContent = S.streak;
  document.getElementById("streak-sub").textContent =
    S.streak === 0
      ? "log a workout to start!"
      : S.streak === 1
        ? "day 1 — amazing start! 💖"
        : S.streak < 7
          ? S.streak + " days strong 🌸"
          : "🔥 " + S.streak + " days on fire!";
  document.getElementById("streak-dots").innerHTML = Array.from(
    { length: 7 },
    (_, i) =>
      `<div class="sdot${i < S.streak ? " done" : i === S.streak ? " today" : ""}"></div>`,
  ).join("");
}
function updateStreak() {
  const today = new Date().toDateString();
  if (S.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  S.streak = S.lastDate === yesterday ? S.streak + 1 : 1;
  S.lastDate = today;
  if (S.streak > 0 && S.streak % 7 === 0) {
    setMood("streak");
    showToast("🔥 " + S.streak + " day streak!");
  }
}
function getDaysSinceStart() {
  if (!S.firstLogDate) return 1;
  return Math.max(
    1,
    Math.round(
      (new Date() - new Date(S.firstLogDate)) / (1000 * 60 * 60 * 24),
    ) + 1,
  );
}
function formatDay1(d) {
  if (!d) return null;
  const dt = new Date(d);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const ord = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return `${days[dt.getDay()]}, ${months[dt.getMonth()]} ${ord(dt.getDate())} ${dt.getFullYear()}`;
}
function switchTab(tab) {
  activeTab = tab;
  ["cal", "workout", "xp"].forEach((t) =>
    document.getElementById("ptab-" + t).classList.toggle("active", t === tab),
  );
  renderPredictions();
}
function day1Banner() {
  if (!S.firstLogDate) return "";
  const days = getDaysSinceStart();
  const since =
    days === 1
      ? "started today! 🌸"
      : days < 7
        ? `${days} days in 🔥`
        : `${days} days strong 👑`;
  return `<div class="day1-banner"><div class="day1-icon">🌸</div><div class="day1-text"><div class="day1-label">your journey started on</div><div class="day1-date">${formatDay1(S.firstLogDate)}</div><div class="day1-since">${since}</div></div></div>`;
}
function renderPredictions() {
  const el = document.getElementById("predict-content");
  const days = getDaysSinceStart();
  const totalWk = S.totalWk || 0;
  if (activeTab === "cal") {
    const hist = S.calHistory || [];
    if (!hist.length) {
      el.innerHTML = `<div class="predict-empty">log your first calorie day to unlock predictions! 🔥</div>`;
      return;
    }
    const avg = Math.round(hist.reduce((a, b) => a + b, 0) / hist.length);
    const kg = (Math.abs(avg * 30) / 7700).toFixed(1);
    const isSurp = avg < 0;
    const abs = Math.abs(avg);
    const bars = hist
      .slice(-6)
      .map(
        (v, i) =>
          `<div class="mini-bar-wrap"><div class="mini-bar ${v > 0 ? "filled" : ""}" style="height:${Math.max(4, Math.min(36, Math.round(Math.abs(v) / 25)))}px"></div><div class="mini-lbl">d${hist.length - Math.min(6, hist.length) + i + 1}</div></div>`,
      )
      .join("");
    el.innerHTML = `${day1Banner()}<div class="mini-chart">${bars}</div><div class="predict-grid"><div class="pstat"><div class="pstat-val">${abs} kcal</div><div class="pstat-lbl">avg daily ${isSurp ? "surplus" : "deficit"}</div><div class="pstat-note">over ${hist.length} day${hist.length !== 1 ? "s" : ""}</div></div><div class="pstat"><div class="pstat-val">${Math.abs(avg * 30).toLocaleString()} kcal</div><div class="pstat-lbl">projected 30-day</div></div><div class="pstat"><div class="pstat-val" style="color:#16a34a">${kg} kg</div><div class="pstat-lbl">est. ${isSurp ? "gain" : "loss"} / month</div></div><div class="pstat"><div class="pstat-val" style="color:#16a34a">${(parseFloat(kg) * 3).toFixed(1)} kg</div><div class="pstat-lbl">est. in 3 months</div></div></div><div class="predict-msg">${isSurp ? `in a <strong>${abs} kcal surplus</strong> — tighten meals to flip it! 💪` : avg < 100 ? `small deficit of <strong>${abs} kcal/day</strong> = ~${kg}kg/month 🌸` : avg < 400 ? `great pace! <strong>${abs} kcal deficit</strong> = ~${kg}kg/month 🔥` : `strong! <strong>${abs} kcal/day</strong> → ~${kg}kg projected 💪`}</div>`;
  } else if (activeTab === "workout") {
    if (!totalWk) {
      el.innerHTML = `<div class="predict-empty">log your first workout to unlock! 💪</div>`;
      return;
    }
    const wpd = totalWk / days;
    const wpw = Math.round(wpd * 7 * 10) / 10;
    const wpm = Math.round(wpd * 30);
    const top = Object.entries(S.cats)
      .map(([k, v]) => ({ k, s: v.sess || 0 }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)[0];
    const cl = {
      str: "strength 💪",
      walk: "walking 👟",
      box: "boxing 🥊",
      ten: "tennis 🎾",
    };
    el.innerHTML = `${day1Banner()}<div class="predict-grid"><div class="pstat"><div class="pstat-val">${wpw}</div><div class="pstat-lbl">workouts / week</div></div><div class="pstat"><div class="pstat-val">${wpm}</div><div class="pstat-lbl">projected / month</div></div><div class="pstat"><div class="pstat-val">${Math.round(wpd * 30 * 4)}</div><div class="pstat-lbl">in 4 months</div></div><div class="pstat"><div class="pstat-val" style="color:#e8509a">${top ? cl[top.k] : "—"}</div><div class="pstat-lbl">your favourite</div></div></div><div class="predict-msg">${wpw < 2 ? `<strong>${wpw}/week</strong> — aim for 3+ to feel the change! 🌸` : wpw < 4 ? `solid! <strong>${wpw}/week</strong> = ~${wpm} sessions this month 💖` : `queen energy! <strong>${wpw}/week</strong> → ${wpm} sessions 👑`}</div>`;
  } else {
    const tot = (S.level - 1) * 100 + S.xp;
    if (!tot) {
      el.innerHTML = `<div class="predict-empty">earn some XP to unlock level predictions! ✨</div>`;
      return;
    }
    const xpd = tot / days;
    const xpm = Math.round(xpd * 30);
    let sx = S.xp,
      sl = S.level,
      rem = xpm;
    while (rem > 0) {
      const n = sl * 100 - sx;
      if (rem >= n) {
        rem -= n;
        sl++;
        sx = 0;
      } else {
        sx += rem;
        rem = 0;
      }
    }
    const lg = sl - S.level;
    const ei = EVO_THRESH.findIndex((l, i) => sl < (EVO_THRESH[i + 1] || 999));
    const pe = EVO_NAMES[ei < 0 ? 4 : ei];
    const ee = ["🥚", "🐾", "🌸", "💪", "👑"];
    el.innerHTML = `${day1Banner()}<div class="predict-grid"><div class="pstat"><div class="pstat-val">${Math.round(xpd)}</div><div class="pstat-lbl">xp per day</div></div><div class="pstat"><div class="pstat-val">${xpm.toLocaleString()}</div><div class="pstat-lbl">projected / month</div></div><div class="pstat"><div class="pstat-val">+${lg} lvl${lg !== 1 ? "s" : ""}</div><div class="pstat-lbl">levels this month</div></div><div class="pstat"><div class="pstat-val">${ee[ei < 0 ? 4 : ei]} ${pe}</div><div class="pstat-lbl">evo in 30 days</div></div></div><div class="predict-msg">${lg === 0 ? `at <strong>${Math.round(xpd)} xp/day</strong> — one more session levels you up! 🌸` : lg <= 2 ? `on track for <strong>${lg} level${lg !== 1 ? "s" : ""}</strong> → ${ee[ei < 0 ? 4 : ei]} <strong>${pe}</strong> 💖` : `flying! <strong>+${lg} levels</strong> → ${ee[ei < 0 ? 4 : ei]} <strong>${pe}</strong> awaits! 👑`}</div>`;
  }
}
function addGlobalXP(gain) {
  if (!S.firstLogDate) S.firstLogDate = new Date().toDateString();
  S.xp += gain;
  const needed = S.level * 100;
  if (S.xp >= needed) {
    S.xp -= needed;
    S.level++;
    document.getElementById("level-badge").textContent = "lvl " + S.level;
    document.getElementById("st-lvl").textContent = S.level;
    showToast("level up! lvl " + S.level + " 🎉");
    setMood("excited");
    animateHead();
    setTimeout(() => setMood("idle"), 3200);
    updateEvo();
  }
  const nn = S.level * 100;
  document.getElementById("xp-fill").style.width =
    Math.round((S.xp / nn) * 100) + "%";
  document.getElementById("xp-lbl").textContent = S.xp + " / " + nn;
  renderPredictions();
}
function renderCat(cat) {
  const c = S.cats[cat];
  if (!c) return;
  const pct = Math.min(100, Math.round((c.xp / c.goal) * 100));
  document.getElementById(cat + "-bar").style.width = pct + "%";
  document.getElementById(cat + "-lbl").textContent =
    c.xp + " / " + c.goal + " xp";
  document.getElementById(cat + "-sess").textContent =
    c.sess + " session" + (c.sess !== 1 ? "s" : "");
}
function renderLog() {
  const el = document.getElementById("log-list");
  if (!S.log || !S.log.length) {
    el.innerHTML =
      '<div class="log-item"><span style="color:#a07090">nothing yet — your first workout awaits! 🌸</span><span></span></div>';
    return;
  }
  el.innerHTML = S.log
    .map(
      (l) =>
        `<div class="log-item"><span>${l.msg}</span><span class="log-xp">+${l.xp} xp · ${l.time}</span></div>`,
    )
    .join("");
}
function renderCalorieSection() {
  document.getElementById("cal-goal-input").value = S.calGoal || 1800;
  document.getElementById("cal-streak-pill").textContent =
    (S.calStreak || 0) + " day streak";
}
function renderDiet() {
  const today = new Date().toDateString();
  if (S.dietLastDate !== today) S.dietDone = {};
  document
    .querySelectorAll(".diet-row")
    .forEach((row) =>
      row.classList.toggle("done", !!S.dietDone[row.dataset.habit]),
    );
  document.getElementById("diet-streak-pill").textContent =
    (S.dietStreak || 0) + " day streak";
}
function toggleDiet(row) {
  const today = new Date().toDateString();
  if (S.dietLastDate !== today) S.dietDone = {};
  const h = row.dataset.habit;
  if (S.dietDone[h]) {
    showToast("already logged today! 🌸");
    return;
  }
  S.dietDone[h] = true;
  S.dietLastDate = today;
  row.classList.add("done");
  const xp = DIET_XP[h] || 15;
  const allDone = Object.keys(DIET_XP).every((k) => S.dietDone[k]);
  if (allDone) {
    if (!S.dietStreak) S.dietStreak = 0;
    S.dietStreak++;
    showToast("all diet habits done! 🌟");
  } else showToast("+" + xp + " xp — great choice! 🥗");
  setMood("diet");
  addGlobalXP(xp);
  bounceEyes();
  setTimeout(() => setMood("happy"), 2000);
  document.getElementById("diet-streak-pill").textContent =
    (S.dietStreak || 0) + " day streak";
  document.getElementById("tip-banner").innerHTML =
    "<strong>tip:</strong> " + TIPS[Math.floor(Math.random() * TIPS.length)];
  scheduleSave();
}
function logCalories() {
  const eaten = parseInt(document.getElementById("cal-eaten").value) || 0;
  const burned = parseInt(document.getElementById("cal-burned").value) || 0;
  const goal =
    parseInt(document.getElementById("cal-goal-input").value) || 1800;
  S.calGoal = goal;
  if (!eaten) {
    showToast("enter calories eaten first! 🌸");
    return;
  }
  const net = eaten - burned,
    deficit = goal - net,
    today = new Date().toDateString();
  const pct = Math.min(100, Math.round((net / goal) * 100));
  let dt,
    dc,
    fc,
    xp = 0;
  if (deficit > 0) {
    dt = "+" + deficit + " kcal deficit 🔥";
    dc = "#16a34a";
    fc = "perfect";
    xp = deficit >= 500 ? 50 : deficit >= 300 ? 35 : deficit >= 100 ? 20 : 10;
    if (S.calLastDate !== today) {
      const y = new Date(Date.now() - 86400000).toDateString();
      S.calStreak = S.calLastDate === y ? (S.calStreak || 0) + 1 : 1;
      S.calLastDate = today;
    }
    setMood("calorie");
    showToast("deficit! +" + xp + " xp 🔥");
    bounceEyes();
    wagTail();
    addGlobalXP(xp);
    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
    if (!S.log) S.log = [];
    S.log.unshift({ msg: "calorie deficit: " + deficit + " kcal", xp, time });
    if (S.log.length > 7) S.log.pop();
    renderLog();
    setTimeout(() => setMood("happy"), 2500);
  } else if (!deficit) {
    dt = "exactly at goal! 🎯";
    dc = "#f59e0b";
    fc = "";
    showToast("right on target! 🎯");
  } else {
    dt = Math.abs(deficit) + " kcal over goal";
    dc = "#f4436c";
    fc = "over";
    showToast("over today — tomorrow is new! 💖");
    setMood("happy");
  }
  if (!S.calHistory) S.calHistory = [];
  if (S.calLastDate === today && S.calHistory.length > 0)
    S.calHistory[S.calHistory.length - 1] = deficit;
  else S.calHistory.push(deficit);
  if (S.calHistory.length > 60) S.calHistory.shift();
  if (!S.firstLogDate) S.firstLogDate = today;
  S.calResult = {
    date: today,
    eaten,
    burned,
    net,
    goal,
    pct,
    deficitText: dt,
    deficitColor: dc,
    fillClass: fc,
  };
  document.getElementById("cal-summary").style.display = "block";
  document.getElementById("cal-bar-wrap").style.display = "block";
  document.getElementById("cs-eaten").textContent = eaten + " kcal";
  document.getElementById("cs-burned").textContent =
    burned > 0 ? burned + " kcal" : "0 kcal";
  document.getElementById("cs-net").textContent = net + " kcal net";
  document.getElementById("cs-deficit").textContent = dt;
  document.getElementById("cs-deficit").style.color = dc;
  document.getElementById("cal-bar-goal-lbl").textContent = goal + " kcal goal";
  const fill = document.getElementById("cal-bar-fill");
  fill.style.width = pct + "%";
  fill.className = "cal-bar-fill" + (fc ? " " + fc : "");
  document.getElementById("cal-streak-pill").textContent =
    (S.calStreak || 0) + " day streak";
  renderPredictions();
  document.getElementById("tip-banner").innerHTML =
    "<strong>tip:</strong> " + TIPS[Math.floor(Math.random() * TIPS.length)];
  scheduleSave();
}
function renderAll() {
  document.getElementById("level-badge").textContent = "lvl " + S.level;
  document.getElementById("st-lvl").textContent = S.level;
  const nn = S.level * 100;
  document.getElementById("xp-fill").style.width =
    Math.round((S.xp / nn) * 100) + "%";
  document.getElementById("xp-lbl").textContent = S.xp + " / " + nn;
  ["str", "walk", "box", "ten"].forEach((cat) => {
    if (S.cats[cat]) renderCat(cat);
  });
  document.getElementById("st-str").textContent = S.cats.str.xp;
  document.getElementById("st-box").textContent = S.cats.box.xp;
  document.getElementById("st-ten").textContent = S.cats.ten
    ? S.cats.ten.xp
    : 0;
  document.getElementById("st-walk").textContent = S.cats.walk.xp;
  renderLog();
  renderStreak();
  renderDiet();
  renderCalorieSection();
  updateEvo();
}
function log(cat, xp, label) {
  if (!S.cats[cat]) S.cats[cat] = { xp: 0, sess: 0, goal: 150 };
  if (!S.firstLogDate) S.firstLogDate = new Date().toDateString();
  const c = S.cats[cat];
  const wb = c.xp < c.goal;
  c.xp += xp;
  c.sess++;
  S.totalWk++;
  updateStreak();
  renderCat(cat);
  const el = document.getElementById("st-" + cat);
  if (el) el.textContent = c.xp;
  renderStreak();
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  if (!S.log) S.log = [];
  S.log.unshift({ msg: label, xp, time });
  if (S.log.length > 7) S.log.pop();
  renderLog();
  document.getElementById("tip-banner").innerHTML =
    "<strong>tip:</strong> " + TIPS[Math.floor(Math.random() * TIPS.length)];
  if (wb && c.xp >= c.goal) {
    setMood("pb");
    showToast("👑 " + cat + " mastery!");
  } else {
    setMood(cat);
    showToast("+" + xp + " xp — " + label + "! 🌸");
    setTimeout(() => setMood("happy"), 2200);
  }
  addGlobalXP(xp);
  bounceEyes();
  wagTail();
  if (cat === "box") punchAnim();
  if (cat === "ten") racketAnim();
  scheduleSave();
}
function logCustom() {
  const name = document.getElementById("custom-input").value.trim();
  const xp = parseInt(document.getElementById("custom-xp").value);
  if (!name) {
    showToast("enter a workout name first!");
    return;
  }
  if (!S.firstLogDate) S.firstLogDate = new Date().toDateString();
  S.totalWk++;
  updateStreak();
  renderStreak();
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  if (!S.log) S.log = [];
  S.log.unshift({ msg: name, xp, time });
  if (S.log.length > 7) S.log.pop();
  renderLog();
  addGlobalXP(xp);
  bounceEyes();
  wagTail();
  setMood("happy");
  showToast("+" + xp + " xp for " + name + "! 💖");
  document.getElementById("custom-input").value = "";
  setTimeout(() => setMood("idle"), 2200);
  scheduleSave();
}
async function resetAll() {
  if (!confirm("Reset your pet and start over? This cannot be undone. 🥚"))
    return;
  S = def();
  try {
    await window.storage.delete(KEY);
    await window.storage.delete(CAL_INPUTS_KEY);
  } catch (e) {}
  document.getElementById("cal-eaten").value = "";
  document.getElementById("cal-burned").value = "";
  document.getElementById("cal-summary").style.display = "none";
  document.getElementById("cal-bar-wrap").style.display = "none";
  currentEvoIdx = -1;
  renderAll();
  renderPredictions();
  setMood("idle");
  document.getElementById("save-ind").textContent = "reset ✓";
  showToast("flarepup reset — back to egg! 🥚");
}

let t = 0;
setInterval(() => {
  t += 0.05;
  const evoIdx = getEvoIdx();
  if (evoIdx === 0) return;
  [
    [20, 58, 7],
    [152, 55, 5.5],
    [26, 38, 4.5],
  ].forEach(([bx, by, amp], i) => {
    const el = document.getElementById("sp" + (i + 1));
    if (el) el.setAttribute("cy", by + amp * Math.sin(t + i * 1.2));
  });
}, 50);

load().then(() => forceAllBtns());
setTimeout(forceAllBtns, 300);
setTimeout(forceAllBtns, 700);
