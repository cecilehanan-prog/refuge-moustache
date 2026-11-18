/* =========================================================
   CŒUR DE L'APPLI : sauvegarde, voix, sons, dessins, outils
   ========================================================= */
window.Z = { screens: {} };

/* append() ignore les éléments vides (null/false) au lieu d'écrire "null" */
(function () {
  const ap = Element.prototype.append;
  Element.prototype.append = function (...n) { return ap.apply(this, n.filter(x => x != null && x !== false)); };
})();

/* ---------- Petits outils ---------- */
Z.$ = (sel, root = document) => root.querySelector(sel);
Z.rand = (n) => Math.floor(Math.random() * n);
Z.pick = (arr) => arr[Z.rand(arr.length)];
Z.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Z.rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
Z.wait = (ms) => new Promise(r => setTimeout(r, ms));

/* h('div', {class:'x', onclick: fn}, enfant1, enfant2...) */
Z.h = function (tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(kid) : kid);
  }
  return el;
};

/* ---------- Dates ---------- */
Z.today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
Z.dayNum = (iso = Z.today()) => { const [y, m, d] = iso.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };

/* ---------- Sauvegarde (reste sur le téléphone) ---------- */
/* Aides réglées dans profil.js (modifiables ensuite dans l'espace parents) */
Z.ADO = /cycle4|lycee/.test(PROFIL.niveau || '');
/* Le ton selon l'âge : 'enfant' (CP-6e), 'college' (5e-3e), 'lycee' (2de-Tle) */
Z.TON = /lycee/.test(PROFIL.niveau || '') ? 'lycee' : /cycle4/.test(PROFIL.niveau || '') ? 'college' : 'enfant';
/* Les façons de faire, cumulables :
   'moteur' · 'dys' · 'dyscalculie' · 'tdah' · 'hpi' · 'tsa' · 'malvoyance' · 'allophone'
   (profil.js → adaptations ; l'espace parents peut les changer ensuite) */
Z.ADAPTATIONS = [
  ['moteur', '✋ Moteur (main blessée, dyspraxie)'], ['dys', '📖 Dys (lecture, orthographe)'],
  ['dyscalculie', '🔢 Dyscalculie'], ['tdah', '⚡ TDAH'], ['hpi', '🧠 HPI'], ['tsa', '🧩 TSA'],
  ['malvoyance', '👓 Malvoyance'], ['allophone', '🌍 Allophone (UPE2A)']];
Z.ADAPT = (PROFIL.adaptations || []).map(x => String(x).toLowerCase());
Z.adaptActives = () => (Z.state && Z.state.settings && Array.isArray(Z.state.settings.adapt)) ? Z.state.settings.adapt : Z.ADAPT;
Z.adapte = (x) => Z.adaptActives().includes(x);
Z.GUIDES = !(PROFIL.style && PROFIL.style.guides === false);
Z.aidesParDefaut = () => {
  const A = PROFIL.aides || {};
  const lit = Z.TON === 'enfant' || ['dys', 'malvoyance', 'allophone'].some(x => Z.ADAPT.includes(x));
  return { autoRead: A.lectureAuto !== undefined ? A.lectureAuto !== false : lit, police: A.police || 'andika', taille: Z.ADAPT.includes('malvoyance') ? Math.max(A.taille || 1, 1.6) : (A.taille || 1),
    main: A.mainValide || null, calculatrice: !!A.calculatrice, lignes: A.lignesCouleur !== undefined ? !!A.lignesCouleur : Z.ADAPT.includes('dys'), espacement: A.espacement !== false,
    syllabes: A.syllabes !== false, cartoon: A.voixDessinAnime !== undefined ? !!A.voixDessinAnime : !Z.ADO };
};
/* Une clé de sauvegarde PAR élève : plusieurs applis sur la même adresse GitHub ne se mélangent pas */
const KEY = 'appli-eleve-' + (PROFIL.id || 'eleve') + '-v1';
Z.KEY = KEY;
function defaultState() {
  const owned = {}, equip = {};
  /* profil.js → depart : { model: 'electrique' } = un objet déjà offert et choisi au départ */
  const dep = PROFIL.depart || {};
  ZDATA.univers.onglets.forEach(o => { const d = o.items.find(x => x.id === dep[o.id]); owned[o.id] = [o.items[0].id].concat(d && d !== o.items[0] ? [d.id] : []); equip[o.id] = (d || o.items[0]).id; });
  PROFIL.animaux.forEach(a => { owned['animal_' + a.id] = ['aucun']; equip['animal_' + a.id] = 'aucun'; });
  return {
    name: PROFIL.enfant.pseudo, eclairs: 25, xp: 0,
    streak: { count: 0, last: null },
    words: {}, facts: {}, probs: {}, stickers: {}, route: {},
    owned, equip,
    daily: { date: null, games: 0, chest: false },
    customWords: [],
    settings: Object.assign({ rate: 0.9, sound: true }, Z.aidesParDefaut()),
    log: []
  };
}
Z.load = function () {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  const d = defaultState();
  if (!s) return d;
  for (const k in d) if (s[k] === undefined) s[k] = d[k];
  for (const k of ['owned', 'equip', 'settings', 'daily', 'streak']) s[k] = Object.assign({}, d[k], s[k]);
  return s;
};
Z.state = Z.load();
Z.save = () => { try { localStorage.setItem(KEY, JSON.stringify(Z.state)); } catch (e) { /* stockage indisponible */ } };
Z.reset = () => { Z.state = defaultState(); Z.save(); };

/* Mission du jour */
Z.daily = function () {
  if (Z.state.daily.date !== Z.today()) Z.state.daily = { date: Z.today(), games: 0, chest: false };
  return Z.state.daily;
};

/* Série de jours (flamme) */
Z.touchStreak = function () {
  const st = Z.state.streak, t = Z.today();
  if (st.last === t) return;
  if (st.last && Z.dayNum(t) - Z.dayNum(st.last) === 1) st.count += 1; else st.count = 1;
  st.last = t;
};
Z.streakAlive = () => {
  const st = Z.state.streak;
  return st.last && (Z.dayNum() - Z.dayNum(st.last)) <= 1 ? st.count : 0;
};

/* Niveau */
Z.levelInfo = function () {
  const xp = Z.state.xp;
  let lvl = 1, need = 40, base = 0;
  while (xp >= base + need) { base += need; lvl++; need = 40 + (lvl - 1) * 20; }
  return { lvl, cur: xp - base, need };
};

/* Plus l'enfant progresse, plus sa « jauge » monte (vitesse, force… selon l'univers) */
Z.speedOf = (lvl) => Math.min(45, 10 + (lvl - 1) * 4);
/* L'objet choisi dans un onglet de la boutique ('model', 'color', 'acc') */
Z.onglet = (tab) => ZDATA.univers.onglets.find(o => o.id === tab);
Z.item = (tab, id) => { const o = Z.onglet(tab); return o.items.find(m => m.id === (id || Z.state.equip[tab])) || o.items[0]; };
Z.modelOf = (id) => Z.item('model', id);
/* jauge = celle du niveau + le bonus de l'objet principal */
Z.speed = () => Z.speedOf(Z.levelInfo().lvl) + (Z.modelOf().bonus || 0);
Z.jauge = (v = Z.speed()) => ZDATA.univers.jauge(v, Z.modelOf());
/* Le dessin du héros de l'univers (avec ce qui est équipé, ou un essai) */
Z.hero = (o = {}) => ZDATA.univers.dessin({ model: Z.item('model', o.model), color: Z.item('color', o.color), acc: Z.item('acc', o.acc), rider: o.rider !== false });
/* Les roues, la route et le décor tournent/défilent selon la vitesse */
Z.applySpeed = function () {
  const v = Z.speed(), r = document.documentElement.style;
  r.setProperty('--spin', (14 / v).toFixed(2) + 's');     // 10 km/h : 1,4 s par tour ; 45 km/h : 0,3 s
  r.setProperty('--dash', (5 / v).toFixed(2) + 's');
  r.setProperty('--deco', (90 / v).toFixed(1) + 's');
  r.setProperty('--ground', (12 / v).toFixed(2) + 's');
};

/* Fin d'un jeu : récompense + journal */
Z.finishGame = function (kind, eclairs, xp, detail) {
  const before = Z.levelInfo().lvl;
  Z.state.eclairs += eclairs;
  Z.state.xp += xp;
  Z.touchStreak();
  Z.daily().games += 1;
  Z.state.log.push({ d: Z.today(), k: kind, e: eclairs, x: detail || '' });
  /* Un jeu intégré lancé depuis une rubrique compte comme activité faite */
  if (Z.actEnCours && kind !== 'act') { const A = (Z.state.acts = Z.state.acts || {}); A[Z.actEnCours] = A[Z.actEnCours] || { n: 0, best: 0 }; A[Z.actEnCours].n++; }
  if (Z.state.log.length > 300) Z.state.log = Z.state.log.slice(-300);
  Z.save();
  return Z.levelInfo().lvl > before;
};

/* ---------- Répétition espacée (boîtes de Leitner) ----------
   boîte 1 = à revoir aujourd'hui, 2 = demain, 3 = dans 3 j, 4 = 7 j, 5 = 16 j (maîtrisé) */
Z.INTERVALS = [0, 0, 1, 3, 7, 16];
Z.srsUpdate = function (store, id, success) {
  const it = store[id] || { box: 0, due: Z.dayNum(), seen: 0, ok: 0 };
  it.seen += 1;
  if (success) { it.ok += 1; it.box = Math.min(5, it.box + 1); }
  else it.box = 1;
  it.due = Z.dayNum() + Z.INTERVALS[it.box];
  store[id] = it;
  return it;
};
Z.isDue = (it) => it && it.due <= Z.dayNum();

/* ---------- Voix (synthèse vocale du téléphone) ---------- */
let voice = null, maleVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('fr'));
  voice = vs.find(v => /google/i.test(v.name) && /fr-FR/i.test(v.lang.replace('_', '-')))
       || vs.find(v => /fr-FR/i.test(v.lang.replace('_', '-')))
       || vs[0] || null;
  // Une voix d'homme si le téléphone en a une (Thomas sur iPhone, voix « frd » sur Android…)
  maleVoice = vs.find(v => /fr-FR/i.test(v.lang.replace('_', '-')) && /thomas|nicolas|daniel|henri|jacques|paul|male|homme|frd/i.test(v.name)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

let speakToken = 0;
/* Pauses de lecture (choix pédagogique) : 0,25 s après une virgule, 1,5 s après un point final.
   Le texte est découpé en morceaux lus l'un après l'autre, avec un vrai silence entre eux :
   l'enfant a le temps de comprendre chaque morceau avant le suivant. */
Z.PAUSE_COMMA = 250;
Z.PAUSE_END = 1500;
function chunksOf(text) {
  const parts = text.match(/[^,;:.!?…]+[,;:.!?…]*/g) || [text];
  return parts.map(t => t.trim()).filter(t => /[\p{L}\p{N}]/u.test(t)).map(t => {
    const last = t.slice(-1);
    const pause = /[.!?…]/.test(last) ? Z.PAUSE_END : /[,;:]/.test(last) ? Z.PAUSE_COMMA : 0;
    return { t, pause };
  });
}
function speakOne(text, rate, pitch, my, v) {
  return new Promise(resolve => {
    if (my !== speakToken) return resolve();
    // Prononciation (facultatif, dans profil.js) : { 'Nom': 'comment le dire' }
    let said = text;
    for (const k in (PROFIL.prononciation || {})) said = said.split(k).join(PROFIL.prononciation[k]);
    const u = new SpeechSynthesisUtterance(said);
    u.lang = 'fr-FR';
    if (v || voice) u.voice = v || voice;
    u.rate = rate; u.pitch = pitch;
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
    setTimeout(fin, 3000 + text.length * 150);
  });
}
/* Lecture automatique coupée (réglage) : on ne lit que si l'élève touche un bouton 🔊,
   ou si c'est un mot seul à apprendre. Un appui sur 🔊 autorise la lecture
   jusqu'au prochain appui ailleurs. */
let forceUntil = 0;
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest && e.target.closest('button');
  forceUntil = b && /🔊/.test(b.textContent) ? Date.now() + 60000 : 0;
}, true);
Z.speak = function (text, opts = {}) {
  if (!('speechSynthesis' in window) || !text) return Promise.resolve();
  if (Z.state.settings.autoRead === false && !opts.force && Date.now() > forceUntil && /\s/.test(String(text).trim())) return Promise.resolve();
  const my = ++speakToken;
  speechSynthesis.cancel();
  /* Voix "dessin animé" des animaux guides (chacun la sienne, réglée dans profil.js).
     Un mot seul à apprendre est lu avec une voix NATURELLE : le cerveau doit entendre
     les vrais sons du mot, sans déformation. */
  const singleWord = !/\s/.test(text.trim());
  const cartoon = Z.GUIDES && Z.state.settings.cartoon !== false && !opts.natural && !singleWord && opts.pitch === undefined;
  const gv = (Z.guide(Z.narrator).voix) || {};
  const vc = { p: gv.hauteur || 1.6, r: gv.vitesse || 1 };
  const rate = (opts.rate || 1) * Z.state.settings.rate * (cartoon ? vc.r : 1);
  const pitch = opts.pitch !== undefined ? opts.pitch : cartoon ? vc.p : 1.0;
  return (async () => {
    await Z.wait(60);
    const chunks = singleWord ? [{ t: text.trim(), pause: 0 }] : chunksOf(text);
    for (const c of chunks) {
      if (my !== speakToken) return;
      await speakOne(c.t, rate, pitch, my, opts.male ? maleVoice : null);
      if (my !== speakToken) return;
      if (c.pause) await Z.wait(c.pause);
    }
  })();
};
Z.stopSpeak = () => { speakToken++; if ('speechSynthesis' in window) speechSynthesis.cancel(); };

/* Bouton haut-parleur */
Z.ear = (text, opts) => Z.h('button', {
  class: 'ear', 'aria-label': 'Écouter',
  onclick: (ev) => { ev.stopPropagation(); Z.sfx.tap(); Z.speak(typeof text === 'function' ? text() : text, Object.assign({ force: true }, opts)); }
}, '🔊');

/* ---------- Sons (fabriqués, aucun fichier) ---------- */
let ac = null;
function actx() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
function tone(freq, dur, type = 'sine', vol = 0.15, when = 0, slide = 0) {
  if (!Z.state.settings.sound) return;
  const c = actx(); if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
Z.sfx = {
  tap() { tone(700, 0.06, 'triangle', 0.08); },
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 'triangle', 0.13, i * 0.07)); buzz(25); },
  bad() { tone(330, 0.15, 'sine', 0.1, 0, -80); tone(262, 0.22, 'sine', 0.08, 0.12, -60); buzz([20, 40, 20]); },
  coin() { tone(988, 0.07, 'square', 0.05); tone(1319, 0.25, 'square', 0.05, 0.07); },
  drum() { tone(140, 0.18, 'sine', 0.35, 0, -90); tone(90, 0.25, 'triangle', 0.15, 0.01, -40); buzz(30); },
  vroum() { tone(90, 0.6, 'sawtooth', 0.06, 0, 260); tone(120, 0.6, 'square', 0.03, 0.05, 300); },
  click() { tone(1500, 0.03, 'square', 0.05); },
  win() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, i * 0.12)); buzz([40, 60, 40]); },
  camera() { tone(2000, 0.04, 'square', 0.06); tone(600, 0.12, 'triangle', 0.08, 0.05); }
};

/* ---------- Confettis ---------- */
Z.confetti = function (n = 110) {
  if (Z.adapte('tsa')) return;
  const cv = Z.h('canvas', { class: 'confetti' });
  document.body.appendChild(cv);
  const W = cv.width = innerWidth, H = cv.height = innerHeight, g = cv.getContext('2d');
  const cols = ['#facc15', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f97316'];
  const ps = Array.from({ length: n }, () => ({
    x: W / 2 + (Math.random() - .5) * 80, y: H * .45, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 4,
    s: 6 + Math.random() * 8, c: Z.pick(cols), r: Math.random() * 6, vr: (Math.random() - .5) * .4
  }));
  let t = 0;
  (function frame() {
    g.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
    if (++t < 130) requestAnimationFrame(frame); else cv.remove();
  })();
};

/* Petit message volant (+5 ⚡, Bravo…) */
Z.pop = function (text, cls = '') {
  const el = Z.h('div', { class: 'pop ' + cls }, text);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
};

/* Fenêtre par-dessus l'écran */
Z.modal = function (content, { onClose, closable = true } = {}) {
  const box = Z.h('div', { class: 'modal-box' }, content);
  const bg = Z.h('div', { class: 'modal' }, box);
  const close = () => { bg.remove(); onClose && onClose(); };
  if (closable) bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
  document.body.appendChild(bg);
  return close;
};

/* ---------- Mots : lecture du format "b[eau]-cou(p)" ---------- */
Z.parseWord = function (spec) {
  const syl = spec.split('-').map(part => {
    const segs = []; let i = 0;
    while (i < part.length) {
      const ch = part[i];
      if (ch === '[' || ch === '(') {
        const close = ch === '[' ? ']' : ')';
        const j = part.indexOf(close, i);
        segs.push({ t: part.slice(i + 1, j), k: ch === '[' ? 'trick' : 'mute' });
        i = j + 1;
      } else {
        let j = i; while (j < part.length && !'[('.includes(part[j])) j++;
        segs.push({ t: part.slice(i, j), k: 'n' });
        i = j;
      }
    }
    return { segs, text: segs.map(s => s.t).join('') };
  });
  return { syl, word: syl.map(s => s.text).join('') };
};

/* Affiche un mot en syllabes colorées (bleu / rouge), piège surligné, lettres muettes grisées */
Z.wordEl = function (parsed, { big = false, tricks = true, cls = '' } = {}) {
  return Z.h('span', { class: 'word ' + (big ? 'big ' : '') + cls },
    parsed.syl.map((s, i) => Z.h('span', { class: 'syl s' + (i % 2) },
      s.segs.map(sg => Z.h('span', { class: tricks ? ('seg-' + sg.k) : '' }, sg.t)))));
};

/* Tous les mots (programme + mots ajoutés par les parents) */
Z.allWords = () => ZDATA.words.concat(Z.state.customWords || []);

/* ---------- Dessins (SVG) ---------- */
Z.art = {};
/* L'enfant sur une trottinette générique (vue de côté).
   Sert à l'univers « trottinette » ET au jeu du permis de la route.
   Les modèles, couleurs et casques viennent de l'univers trottinette ;
   dans un autre univers, on prend la trottinette de base. */
Z.art.rider = function (o = {}) {
  const T = UNIVERS.trottinette, mine = PROFIL.univers === 'trottinette';
  const find = (tab, x, def) => { const L = T.onglets.find(t => t.id === tab).items; return (x && typeof x === 'object') ? x : (L.find(i => i.id === x) || L.find(i => i.id === def) || L[0]); };
  const colorIt = find('color', o.color, mine ? Z.state.equip.color : null);
  const c = mine || o.color ? colorIt.c : ((PROFIL.couleurs && PROFIL.couleurs.principale) || colorIt.c);
  const M = find('model', o.model, mine ? Z.state.equip.model : null);
  const rider = o.rider !== false;
  const AP = PROFIL.enfant.apparence || {};
  const skin = AP.peau || '#f2c9a8', hairC = AP.cheveux || '#3b2416', shirtC = AP.tshirt || '#1d4ed8';
  /* Chaque modèle a sa silhouette :
     classique = compacte · sport = longue, roues fines, grand guidon à clignotants
     turbo = roues larges, moteur doré, rétros, double phare, néons
     tout-terrain = haute, grosses roues à crampons, garde-boue moto, gros ressorts
     fusée = la plus grande : crampons géants, rampe de LED, selle, néons */
  const SPEC = {
    classique:      { R: 22, rx: 58, fx: 166, lift: 0,  th: 12, A: 34, B: 172, bar: [134, 172], stemW: 11, tyre: 'med',    springs: 'front', spr: '#fbbf24', fender: 'small', light: 'one' },
    sport:   { R: 25, rx: 46, fx: 178, lift: 3,  th: 14, A: 20, B: 188, bar: [122, 186], stemW: 12, tyre: 'thin',   springs: 'both',  spr: '#fbbf24', fender: 'small', light: 'big', signals: 1, battery: 1, accent: '#22d3ee' },
    turbo:   { R: 26, rx: 46, fx: 178, lift: 5,  th: 16, A: 20, B: 188, bar: [120, 188], stemW: 15, tyre: 'fat',    springs: 'both',  spr: '#ef4444', fender: 'sport', light: 'dual', signals: 1, mirrors: 1, battery: 1, glow: 1, gold: 1, accent: '#facc15' },
    tt:      { R: 30, rx: 42, fx: 182, lift: 12, th: 14, A: 18, B: 190, bar: [126, 182], stemW: 14, tyre: 'knobby', springs: 'big',   spr: '#fbbf24', fender: 'moto',  light: 'round', cross: 1, dual: 1, accent: '#84cc16' },
    fusee:   { R: 33, rx: 40, fx: 186, lift: 16, th: 18, A: 14, B: 194, bar: [118, 190], stemW: 17, tyre: 'knobby', springs: 'big',   spr: '#ef4444', fender: 'moto',  light: 'bar', cross: 1, dual: 1, signals: 1, mirrors: 1, battery: 1, glow: 1, gold: 1, seat: 1, accent: '#facc15' }
  };
  const P = SPEC[M.id] || SPEC.classique;
  const R = P.R, cy = 176 - R, L = P.lift;
  const t = 120 - L, bt = t + P.th + 10, A = P.A, B = P.B, barY = 38 - L;
  const rimC = P.gold ? '#d4a017' : c;
  const wheelG = (x) => {
    let w = '';
    if (P.tyre === 'thin') {        // pneu fin + grande jante alu à 5 branches
      w = `<circle cx="${x}" cy="${cy}" r="${R}" fill="#111827"/><circle cx="${x}" cy="${cy}" r="${R - 5}" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.5"/>`
        + [0, 72, 144, 216, 288].map(d => { const r = (d - 90) * Math.PI / 180; return `<path d="M${x} ${cy} L${(x + Math.cos(r) * (R - 7)).toFixed(1)} ${(cy + Math.sin(r) * (R - 7)).toFixed(1)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`; }).join('')
        + `<circle cx="${x}" cy="${cy}" r="5" fill="#111827"/>`;
    } else if (P.tyre === 'fat') {  // pneu très large + moteur doré
      w = `<circle cx="${x}" cy="${cy}" r="${R}" fill="#111827"/><circle cx="${x}" cy="${cy}" r="${R - 3}" fill="none" stroke="#374151" stroke-width="5" stroke-dasharray="3 3"/><circle cx="${x}" cy="${cy}" r="${R - 13}" fill="${rimC}" stroke="#92400e" stroke-width="1.5"/><path d="M${x + 2} ${cy - 8} l-5 8 h4 l-3 7 l8 -10 h-4 l3 -5z" fill="#111827"/>`;
    } else if (P.tyre === 'knobby') { // gros crampons tout-terrain
      w = `<circle cx="${x}" cy="${cy}" r="${R - 3}" fill="#111827"/><circle cx="${x}" cy="${cy}" r="${R - 2}" fill="none" stroke="#111827" stroke-width="7" stroke-dasharray="6 4"/><circle cx="${x}" cy="${cy}" r="${R - 9}" fill="none" stroke="#374151" stroke-width="3"/><circle cx="${x}" cy="${cy}" r="${R - 15}" fill="${rimC}"/><circle cx="${x}" cy="${cy}" r="${R - 20}" fill="#111827"/>`
        + (P.gold ? `<path d="M${x + 2} ${cy - 8} l-5 8 h4 l-3 7 l8 -10 h-4 l3 -5z" fill="#fde047"/>` : '');
    } else {                         // classique : pneu moyen, jante couleur
      w = `<circle cx="${x}" cy="${cy}" r="${R}" fill="#111827"/><circle cx="${x}" cy="${cy}" r="${R}" fill="none" stroke="#4b5563" stroke-width="4" stroke-dasharray="5 3"/><circle cx="${x}" cy="${cy}" r="${R - 11}" fill="${c}"/><circle cx="${x}" cy="${cy}" r="4" fill="#111827"/><path d="M${x} ${cy - 10} V${cy + 10} M${x - 10} ${cy} H${x + 10}" stroke="#111827" stroke-width="2.5"/>`;
    }
    return `<g class="wheel" style="transform-origin:${x}px ${cy}px">${w}</g>`;
  };
  // ressort en zigzag entre deux points
  const coil = (x1, y1, x2, y2, n, col, amp, sw) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    let d = `M${x1} ${y1}`;
    for (let i = 1; i < n; i++) { const k = i / n, sgn = i % 2 ? 1 : -1; d += ` L${(x1 + dx * k + nx * amp * sgn).toFixed(1)} ${(y1 + dy * k + ny * amp * sgn).toFixed(1)}`; }
    return `<path d="${d} L${x2} ${y2}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linejoin="round"/>`;
  };
  const sx = B - 14, sy = t + 4;   // pied de la tige
  const two = !!colorIt.two && (mine || !!o.color);
  const deck = two ? '#111827' : c, band = two ? c : '#111827', label = two ? '#fff' : '#111827';
  const hm = find('acc', o.acc || o.helmet, mine ? Z.state.equip.acc : null);
  /* Formes de casque (la tête est centrée en 112,41) */
  const D = { // dôme
    aucun: `<path d="M94 38 a18 18 0 0 1 36 0 z" fill="${hm.c}" stroke="#374151" stroke-width="2"/><path d="M100 30 q12 -8 24 0" stroke="#d1d5db" stroke-width="2" fill="none"/>`
  };
  const dome = `<path d="M94 38 a18 18 0 0 1 36 0 z" fill="${hm.c}" stroke="#374151" stroke-width="2"/>`;
  const shapes = {
    oreilles: `<path d="M97 28 l-2 -15 l11 9 z M127 28 l2 -15 l-11 9 z" fill="${hm.c}" stroke="#374151" stroke-width="1.5"/><path d="M98 25 l-1 -8 l6 5 z M126 25 l1 -8 l-6 5 z" fill="#f2b3b3"/>`,
    flamme: `<path d="M96 30 q-4 -14 6 -18 q-2 8 4 10 q0 -12 10 -16 q-3 9 3 13 q4 -9 12 -8 q-5 6 -1 12 q6 -2 6 6" fill="#facc15" stroke="#dc2626" stroke-width="2"/>`,
    dino: `<path d="M96 24 l3 -9 l5 7 l4 -10 l5 9 l5 -10 l4 10 l5 -7 l2 9" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>`,
    requin: `<path d="M104 21 l10 -18 l8 20 z" fill="${hm.c}" stroke="#374151" stroke-width="2"/><path d="M118 36 l3 -4 l3 4 l3 -4 l3 4" stroke="#fff" stroke-width="2" fill="none"/>`,
    eclair: `<path d="M114 2 l-8 14 h7 l-5 12 l14 -17 h-7 l5 -9z" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`,
    viking: `<path d="M96 30 q-14 -2 -12 -20 q5 10 14 12 z M128 30 q14 -2 12 -20 q-5 10 -14 12 z" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/><path d="M94 36 h36" stroke="#a16207" stroke-width="3"/><circle cx="104" cy="31" r="1.5" fill="#a16207"/><circle cx="112" cy="29" r="1.5" fill="#a16207"/><circle cx="120" cy="31" r="1.5" fill="#a16207"/>`,
    crete: `<path d="M98 24 l1 -14 l5 10 l3 -15 l5 13 l4 -15 l4 14 l5 -11 l2 13 z" fill="#ec4899" stroke="#9d174d" stroke-width="1.5"/>`,
    antennes: `<path d="M104 22 l-6 -14 M120 22 l6 -14" stroke="#4d7c0f" stroke-width="2.5"/><circle cx="98" cy="7" r="4" fill="#facc15"/><circle cx="126" cy="7" r="4" fill="#facc15"/><circle cx="106" cy="30" r="2.5" fill="#fff"/><circle cx="118" cy="30" r="2.5" fill="#fff"/>`,
    integral: `<path d="M94 38 L94 50 Q96 59 108 60 L110 46 L113 38 Z" fill="${hm.c}" stroke="#374151" stroke-width="1.5"/><path d="M110 61 Q123 63 131 53 L131 49 L127 49 Q122 57 111 57 Z" fill="${hm.c}" stroke="#374151" stroke-width="1.5"/><path d="M113 36 h18 v11 q-8 3 -18 0 z" fill="#38bdf8" opacity=".45" stroke="#111827" stroke-width="1.5"/>`,
    pilote: `<rect x="112" y="30" width="20" height="7" rx="3" fill="#111827"/><path d="M96 30 h30" stroke="#fff" stroke-width="3"/><path d="M100 24 h22" stroke="#facc15" stroke-width="2"/>`
  };
  const helmetSvg = (hm.id === 'aucun' ? D.aucun : dome) + (shapes[hm.id] || '');
  const kid = rider ? `
    <!-- jambes -->
    <path d="M92 128 L98 96" stroke="#1e3a8a" stroke-width="11" stroke-linecap="round"/>
    <path d="M110 128 L106 96" stroke="#1e3a8a" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="90" cy="129" rx="10" ry="5" fill="#111827"/><ellipse cx="112" cy="129" rx="10" ry="5" fill="#111827"/>
    <!-- corps (t-shirt aux couleurs du profil) -->
    <rect x="88" y="56" width="30" height="44" rx="12" fill="${shirtC}"/>
    <text x="103" y="86" font-size="16" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">${PROFIL.enfant.numero ?? ''}</text>
    <!-- bras vers le guidon -->
    <path d="M112 66 Q135 64 150 46" stroke="${shirtC}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="151" cy="45" r="5" fill="${skin}"/>
    <!-- tête (couleurs de profil.js) -->
    ${AP.coiffure === 'longs' || AP.coiffure === 'queue' ? `<path d="M96 34 Q90 60 100 66 L106 40 Z" fill="${hairC}"/>` : ''}
    <path d="M95 36 Q94 52 102 55 L104 40 Z" fill="${hairC}"/>
    <circle cx="112" cy="41" r="17" fill="${skin}"/>
    <ellipse cx="103" cy="43" rx="3.5" ry="5" fill="${skin}" opacity=".8"/>
    <path d="M100 37 Q112 44 129 40 L129 35 L100 35 Z" fill="${hairC}"/>
    <ellipse cx="120" cy="45" rx="2.8" ry="3.4" fill="${AP.yeux || '#4a2c1a'}"/>
    <circle cx="121" cy="44" r="1" fill="#fff"/>
    <path d="M117 41 q3 -1.5 6 0" stroke="${hairC}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M114 51 q5 4 10 -1" stroke="#9a3b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="115" cy="49" r="2.4" fill="#f4a7a0" opacity=".55"/>
    <!-- casque -->
    ${helmetSvg}` : '';
  const F = P.fender === 'moto'
    ? `<path d="M${P.fx - R - 6} ${cy - R + 4} Q${P.fx} ${cy - R - 18} ${P.fx + R + 10} ${cy - R + 8} L${P.fx + R + 6} ${cy - R + 15} Q${P.fx} ${cy - R - 8} ${P.fx - R} ${cy - R + 10} Z" fill="${c}" stroke="#111827" stroke-width="2"/>
       <path d="M${P.rx - R - 4} ${cy - 2} Q${P.rx - R} ${cy - R - 10} ${P.rx + 10} ${cy - R - 6}" stroke="#111827" stroke-width="9" fill="none" stroke-linecap="round"/>`
    : `<path d="M${P.rx - R} ${cy - 4} Q${P.rx - R + 6} ${cy - R - 6} ${P.rx + 8} ${cy - R - 2}" stroke="#111827" stroke-width="${P.fender === 'sport' ? 8 : 5}" fill="none" stroke-linecap="round"/>
       <path d="M${P.fx - R + 2} ${cy - R + 4} Q${P.fx + 2} ${cy - R - 8} ${P.fx + R} ${cy - 4}" stroke="${two ? '#111827' : c}" stroke-width="${P.fender === 'sport' ? 8 : 5}" fill="none" stroke-linecap="round"/>`;
  const lights = {
    one: `<path d="M156 ${52 - L} l14 -3 l1 8 l-14 2 z" fill="#fef9c3" stroke="#111827" stroke-width="2"/><path d="M173 ${50 - L} l16 -6 M173 ${54 - L} l18 0" stroke="#fde68a" stroke-width="2"/>`,
    big: `<path d="M155 ${50 - L} l18 -4 l2 12 l-18 3 z" fill="#fef9c3" stroke="#111827" stroke-width="2"/><path d="M177 ${48 - L} l20 -8 M177 ${53 - L} l22 0 M177 ${58 - L} l20 7" stroke="#fde68a" stroke-width="2.2"/>`,
    dual: `<circle cx="162" cy="${48 - L}" r="5" fill="#fef9c3" stroke="#111827" stroke-width="2"/><circle cx="164" cy="${60 - L}" r="5" fill="#fef9c3" stroke="#111827" stroke-width="2"/><path d="M169 ${46 - L} l22 -6 M171 ${59 - L} l22 2" stroke="#fde68a" stroke-width="2.5"/>`,
    round: `<circle cx="164" cy="${54 - L}" r="9" fill="#fef9c3" stroke="#111827" stroke-width="3"/><circle cx="164" cy="${54 - L}" r="4" fill="#fde047"/><path d="M175 ${50 - L} l20 -6 M175 ${56 - L} l22 2" stroke="#fde68a" stroke-width="2.5"/>`,
    bar: `<rect x="146" y="${44 - L}" width="30" height="7" rx="3" fill="#e0f2fe" stroke="#111827" stroke-width="2"/><path d="M150 ${47.5 - L} h22" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 2"/><path d="M178 ${44 - L} l20 -8 M178 ${48 - L} l22 0 M178 ${52 - L} l20 8" stroke="#bae6fd" stroke-width="2.5"/><circle cx="165" cy="${60 - L}" r="6" fill="#fef9c3" stroke="#111827" stroke-width="2"/>`
  };
  const [b0, b1] = P.bar;
  return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="112" cy="172" rx="${86 + (R - 22)}" ry="6" fill="rgba(0,0,0,.18)"/>
    <!-- traits de vitesse -->
    <path d="M4 112 h26 M0 124 h20 M8 100 h16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${(0.15 + Z.speed() / 50).toFixed(2)}"/>
    ${P.glow ? `<ellipse cx="${(A + B) / 2}" cy="${bt + 8}" rx="${(B - A) / 2}" ry="7" fill="#22d3ee" opacity=".6"/>` : ''}
    ${P.seat ? `<path d="M${A + 30} ${t} L${A + 34} ${t - 28}" stroke="#111827" stroke-width="5"/><path d="M${A + 16} ${t - 30} Q${A + 34} ${t - 38} ${A + 52} ${t - 30} Q${A + 34} ${t - 24} ${A + 16} ${t - 30} Z" fill="#111827"/><path d="M${A + 22} ${t - 31} q12 -4 24 0" stroke="${c}" stroke-width="2" fill="none"/>` : ''}
    <!-- tige + fourche + suspension avant -->
    <path d="M${sx} ${sy} L152 ${40 - L}" stroke="${c}" stroke-width="${P.stemW}" stroke-linecap="round"/>
    ${P.dual ? `<path d="M${sx - 7} ${sy} L146 ${44 - L}" stroke="#111827" stroke-width="4" stroke-linecap="round"/>` : `<path d="M${sx - 3} ${sy - 22} L155 ${58 - L}" stroke="#111827" stroke-width="3" stroke-linecap="round"/>`}
    ${P.accent ? `<path d="M${sx + 3} ${sy - 10} L${155} ${48 - L}" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round"/>` : ''}
    <path d="M${sx} ${sy} L${P.fx} ${cy}" stroke="#111827" stroke-width="${P.springs === 'big' ? 10 : 8}" stroke-linecap="round"/>
    ${coil(sx + 1, sy + 3, sx + (P.fx - sx) * 0.7, sy + (cy - sy) * 0.7, P.springs === 'big' ? 9 : 7, P.spr, P.springs === 'big' ? 6 : 4.5, P.springs === 'big' ? 3.5 : 2.5)}
    <!-- guidon -->
    <path d="M${b0} ${barY + 2} Q152 ${barY - 4} ${b1} ${barY - 2}" stroke="#111827" stroke-width="${P.cross ? 8 : 7}" fill="none" stroke-linecap="round"/>
    ${P.cross ? `<path d="M${b0 + 10} ${barY - 6} L${b1 - 10} ${barY - 9}" stroke="#111827" stroke-width="3" stroke-linecap="round"/>` : ''}
    <rect x="${b0}" y="${barY - 3}" width="10" height="8" rx="3" fill="${c}"/><rect x="${b1 - 9}" y="${barY - 6}" width="10" height="8" rx="3" fill="${c}"/>
    ${P.signals ? `<circle cx="${b0 - 2}" cy="${barY + 1}" r="3.5" fill="#fb923c" stroke="#111827" stroke-width="1.2"/><circle cx="${b1 + 2}" cy="${barY - 2}" r="3.5" fill="#fb923c" stroke="#111827" stroke-width="1.2"/>` : ''}
    ${P.mirrors ? `<path d="M${b0 + 6} ${barY - 2} L${b0 + 2} ${barY - 14} M${b1 - 6} ${barY - 4} L${b1 - 2} ${barY - 16}" stroke="#111827" stroke-width="2"/><ellipse cx="${b0 + 1}" cy="${barY - 17}" rx="6" ry="4" fill="#94a3b8" stroke="#111827" stroke-width="1.5"/><ellipse cx="${b1 - 1}" cy="${barY - 19}" rx="6" ry="4" fill="#94a3b8" stroke="#111827" stroke-width="1.5"/>` : ''}
    <rect x="${P.R > 28 ? 144 : 146}" y="${barY - 11}" width="${P.R > 28 ? 22 : 18}" height="10" rx="2.5" fill="#111827" stroke="${c}" stroke-width="1.5"/>
    <text x="${P.R > 28 ? 155 : 155}" y="${barY - 3}" font-size="7" font-weight="700" text-anchor="middle" fill="#38bdf8" font-family="Arial">${Z.speed()}</text>
    ${lights[P.light]}
    <!-- plateau -->
    <path d="M${A + 4} ${t} L${A + 22} ${t + 4} L${B - 12} ${t + 2} L${B} ${t + 10} L${B - 6} ${bt - 2} L${A + 14} ${bt} L${A} ${t + 14} Z" fill="${deck}" stroke="#111827" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M${A + 20} ${t + 10} L${B - 10} ${t + 8} L${B - 14} ${t + 14} L${A + 18} ${t + 16} Z" fill="${band}"/>
    ${two ? `<path d="M${B - 50} ${t + 4} l14 0 l-10 ${P.th + 4} l-14 0 z M${B - 32} ${t + 4} l8 0 l-10 ${P.th + 4} l-8 0 z" fill="${c}"/>` : ''}
    ${P.accent ? `<path d="M${A + 22} ${t + 5} L${B - 14} ${t + 3}" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>` : ''}
    ${P.battery ? `<rect x="${A + 30}" y="${bt - 1}" width="${B - A - 60}" height="${P.R > 28 ? 10 : 7}" rx="3" fill="#374151" stroke="#111827" stroke-width="1.5"/>` : ''}
    <text x="${(A + B) / 2}" y="${bt - 4}" font-size="${M.label.length > 8 ? 7 : 9}" font-weight="700" text-anchor="middle" fill="${label}" font-family="Arial" letter-spacing="1">${M.label}</text>
    <!-- aileron arrière + bras arrière + suspension arrière -->
    <path d="M${A - 4} ${t} L${A + 18} ${t - 4} L${A + 22} ${t + 4} L${A + 4} ${t + 6} Z" fill="#111827"/>
    <path d="M${A + 30} ${bt - 2} L${P.rx} ${cy}" stroke="#111827" stroke-width="${P.springs === 'big' ? 10 : 8}" stroke-linecap="round"/>
    ${P.springs !== 'front' ? coil(A + 44, t + 6, A + 28, bt + 2, P.springs === 'big' ? 7 : 5, P.spr, P.springs === 'big' ? 5 : 3.5, P.springs === 'big' ? 3.5 : 2.5) : ''}
    <!-- garde-boue -->
    ${F}
    <!-- roues -->
    ${wheelG(P.rx)}
    ${wheelG(P.fx)}
    <g transform="translate(0 ${-L})">${kid}</g>
  </svg>`;
};


/* =========================================================
   LES ANIMAUX GUIDES (voir profil.js et animaux.js)
   Z.guide(rôle ou id) → l'animal ; Z.narrator = rôle de l'écran en cours
   ========================================================= */
Z.guide = function (who) {
  const L = PROFIL.animaux;
  return L.find(a => a.id === who) || L.find(a => (a.roles || []).includes(who))
    || L.find(a => (a.roles || []).includes('accueil')) || L[0];
};
/* Comment ce guide appelle l'élève (profil : appelle: 'ma chérie'), sinon son prénom */
Z.nomPour = (who) => Z.guide(who).appelle || Z.state.name;
/* Comment l'élève présente ce guide (profil : presente: 'mon chéri Sylvain'), sinon son nom */
Z.presente = (who) => Z.guide(who).presente || Z.guide(who).nom;
Z.catKey = (id) => 'animal_' + Z.guide(id).id;
/* Dessin d'un guide (avec l'accessoire acheté dans la boutique) */
Z.art.cat = function ({ acc, mood = 'happy', who } = {}) {
  const g = Z.guide(who || Z.narrator);
  const a = acc || Z.state.equip[Z.catKey(g.id)] || 'aucun';
  const accColor = PROFIL.univers === 'trottinette' ? Z.item('color').c : (PROFIL.couleurs || {}).principale;
  return Z.art.animal({ espece: g.espece, couleurs: g.couleurs, acc: a, mood, accColor });
};
Z.svg = (str, cls = '') => Z.h('div', { class: 'art ' + cls, html: str });

/* Bulle du guide qui parle (texte affiché + lu à voix haute) */
Z.guideSays = function (text, { speak = true, mood, who } = {}) {
  const prev = Z.narrator;
  if (who) Z.narrator = who;
  if (speak) Z.speak(text);
  const R = Z.rubrique && Z.rubrique(who || Z.narrator);
  const el = Z.h('div', { class: 'guide-says' },
    Z.GUIDES ? Z.svg(Z.art.cat({ mood, who: who || Z.narrator }), 'mini-cat')
      : Z.h('div', { class: 'art mini-cat emoji-face' }, R ? R.icone : '💬'),
    Z.h('div', { class: 'bubble' }, Z.h('span', null, text), Z.ear(text)));
  Z.narrator = prev;
  return el;
};

/* Une personne de l'entourage qui encourage (emoji + bulle + voix) */
Z.familyVoice = (p) => p && p.homme ? { pitch: 0.75, rate: 0.96, male: true } : { pitch: 0.95 };
Z.familySays = function (p, text, { speak = true } = {}) {
  const fv = Z.familyVoice(p);
  if (speak) Z.speak(text, fv);
  return Z.h('div', { class: 'guide-says' },
    (() => { const g = PROFIL.animaux.find(a => a.espece === 'humain' && a.nom === p.name);
      return g && Z.GUIDES ? Z.svg(Z.art.cat({ who: g.id }), 'mini-cat') : Z.h('div', { class: 'art mini-cat emoji-face' }, p.emoji || '🙂'); })(),
    Z.h('div', { class: 'bubble' }, Z.h('span', null, text), Z.ear(text, fv)));
};

/* ---------- Typographie française : la ponctuation ne commence jamais une ligne ----------
   Partout dans la page (même le texte ajouté plus tard), l'espace avant ? ! : ; » % € ) … . ,
   et après « ( devient une espace insécable : le signe reste collé au mot qui le précède. */
(function () {
  const AVANT = /[ \t\n]+(?=[?!:;»%€)….,])/g, APRES = /([«(])[ \t\n]+/g, NB = ' ';
  const SAUTE = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1 };
  function fixe(n) {
    const p = n.parentNode;
    if (!p || SAUTE[p.nodeName] || (p.closest && p.closest('[contenteditable]'))) return;
    const t = n.data.replace(AVANT, NB).replace(APRES, '$1' + NB);
    /* « Bonjour » et « ! » dans deux morceaux de texte voisins */
    const prev = n.previousSibling;
    if (/^[?!:;»…]/.test(t) && prev && prev.nodeType === 3 && /[ \t]$/.test(prev.data)) prev.data = prev.data.replace(/[ \t]+$/, NB);
    if (t !== n.data) n.data = t;
  }
  function parcourt(root) {
    if (root.nodeType === 3) return fixe(root);
    if (root.nodeType !== 1 || SAUTE[root.nodeName]) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const l = [];
    while (w.nextNode()) l.push(w.currentNode);
    l.forEach(fixe);
  }
  function demarre() {
    parcourt(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'characterData') fixe(m.target); else m.addedNodes.forEach(parcourt);
    })).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) demarre(); else document.addEventListener('DOMContentLoaded', demarre);
})();

/* =========================================================
   AMÉNAGEMENTS : dictée, autre langue, pictos, consignes, outils
   ========================================================= */
/* Réponse dictée à la voix (Chrome, Safari) */
Z.peutDicter = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
Z.dicter = ({ lang = 'fr-FR', alts = 4 } = {}) => new Promise((res, rej) => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return rej('absent');
  const r = new SR(); let fini = false;
  r.lang = lang; r.interimResults = false; r.maxAlternatives = alts; r.continuous = false;
  r.onresult = (e) => { fini = true; res([...e.results[0]].map(x => x.transcript)); };
  r.onerror = (e) => { if (!fini) { fini = true; rej(e.error || 'erreur'); } };
  r.onend = () => { if (!fini) { fini = true; res([]); } };
  Z.stopSpeak();
  try { r.start(); } catch (e) { rej(e); }
});
Z.micBtn = (quandTexte, label = '🎤 Dire ma réponse') => {
  if (!Z.peutDicter) return null;
  const b = Z.h('button', { class: 'btn ghost wide mic', onclick: async () => {
    Z.sfx.tap(); b.classList.add('ecoute'); b.textContent = '🎤 J’écoute…';
    try {
      const t = await Z.dicter();
      b.classList.remove('ecoute'); b.textContent = label;
      if (!t.length) { Z.pop('Je n’ai rien entendu. Réessaie 🙂', 'soft'); return; }
      quandTexte(t);
    } catch (e) {
      b.classList.remove('ecoute'); b.textContent = label;
      Z.pop(e === 'not-allowed' ? 'Le micro est bloqué : autorise-le dans le navigateur.' : 'Le micro ne marche pas ici.', 'soft');
    }
  } }, label);
  return b;
};
/* « vingt-trois », « 23 », « trois virgule cinq »… → nombre (ou null) */
Z.nombreDit = (textes) => {
  const U = { zero: 0, 'zéro': 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20, vingts: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 };
  for (const brut of [].concat(textes)) {
    const t = String(brut).toLowerCase().replace(/(\d)\s+(?=\d{3}\b)/g, '$1').replace(/\s*virgule\s*/g, ',');
    const m = t.match(/-?\d+(?:[.,]\d+)?/);
    if (m) return parseFloat(m[0].replace(',', '.'));
    const [ent, dec] = t.split(',');
    const lire = (s) => {
      let total = 0, cur = 0, vu = false, prev = '';
      for (const w of s.split(/[\s-]+/).filter(Boolean)) {
        if (w === 'et') continue;
        if (w === 'cent' || w === 'cents') { cur = (cur || 1) * 100; vu = true; }
        else if (w === 'mille') { total += (cur || 1) * 1000; cur = 0; vu = true; }
        else if ((w === 'vingt' || w === 'vingts') && prev === 'quatre') { cur += 76; vu = true; }
        else if (w in U) { cur += U[w]; vu = true; }
        prev = w;
      }
      return vu ? total + cur : null;
    };
    const e = lire(ent || '');
    if (e !== null) { const d = dec ? lire(dec) : null; return d !== null ? parseFloat(e + '.' + d) : e; }
  }
  return null;
};
/* Lire un texte dans une autre langue (élève allophone) */
Z.speakLang = (text, lang) => {
  if (!('speechSynthesis' in window) || !text) return;
  Z.stopSpeak();
  const u = new SpeechSynthesisUtterance(text); u.lang = lang || 'en-GB'; u.rate = 0.9;
  const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith((lang || 'en').slice(0, 2).toLowerCase()));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
};
/* TSA : des pictogrammes pour les verbes d'action de la consigne */
Z.PICTOS = [
  [/\b(lis|lire|relis|relire)\b/i, '👀', 'Lire'], [/\b(écoute|écouter)\b/i, '👂', 'Écouter'],
  [/\b(observe|regarde)\b/i, '🔍', 'Observer'], [/\b(choisis|touche|clique|sélectionne|trouve)\b/i, '👆', 'Toucher'],
  [/\b(écris|complète|recopie|remplis)\b/i, '✍️', 'Écrire'], [/\b(calcule|pose|compte)\b/i, '🧮', 'Calculer'],
  [/\b(relie|associe)\b/i, '🔗', 'Relier'], [/\b(range|remets|classe)\b/i, '🔢', 'Ranger'],
  [/\b(souligne)\b/i, '〰️', 'Souligner'], [/\b(entoure|encadre)\b/i, '⭕', 'Entourer'],
  [/\b(apprends|retiens|mémorise)\b/i, '🧠', 'Apprendre'], [/\b(dis|récite|explique)\b/i, '🗣️', 'Dire']];
Z.pictos = (texte) => {
  const t = String(texte || '');
  const vus = Z.PICTOS.map(([re, e, n]) => { const m = t.match(re); return m ? { i: m.index, e, n } : null; }).filter(Boolean).sort((a, b) => a.i - b.i);
  if (!vus.length) return null;
  return Z.h('div', { class: 'pictos' }, vus.map(p => Z.h('span', { class: 'picto' }, Z.h('b', null, p.e), p.n)));
};
/* Ce qui accompagne une consigne, selon les aménagements :
   pictos (TSA), étapes numérotées (TDAH), consigne d'origine (si on l'a simplifiée),
   traduction (allophone). */
Z.consigneBloc = (a) => {
  const h = Z.h, out = [], c = a.consigne || '';
  if (Z.adapte('tsa')) { const p = Z.pictos(c); if (p) out.push(p); }
  if (Z.adapte('tdah')) {
    const ph = c.split(/(?<=[.!?…])\s+/).map(x => x.trim()).filter(Boolean);
    if (ph.length >= 2) out.push(h('div', { class: 'card etapes' }, h('b', null, '🪜 Étape par étape'), h('ol', null, ph.map(x => h('li', null, x))), Z.ear(ph.map((x, i) => `Étape ${i + 1}. ${x}`).join(' '))));
  }
  if (a.consigneOrigine) {
    const box = h('div', { class: 'card', style: { display: 'none' } }, h('b', null, '📄 Consigne du professeur : '), h('span', null, a.consigneOrigine), Z.ear(a.consigneOrigine));
    out.push(h('button', { class: 'btn ghost wide', onclick: (e) => { Z.sfx.tap(); const v = box.style.display === 'none'; box.style.display = v ? '' : 'none'; e.currentTarget.textContent = v ? '📄 Cacher la consigne d’origine' : '📄 Voir la consigne d’origine'; } }, '📄 Voir la consigne d’origine'), box);
  }
  const L = PROFIL.langue;
  if (Z.adapte('allophone') && a.traduction && L) {
    out.push(h('div', { class: 'card traduction', dir: L.sens || 'auto' }, h('b', null, `🌍 ${L.nom || 'Dans ta langue'} : `), h('span', { lang: L.code }, a.traduction),
      h('button', { class: 'ear', 'aria-label': 'Écouter', onclick: (e) => { e.stopPropagation(); Z.speakLang(a.traduction, L.code); } }, '🔊')));
  }
  return out;
};

/* Aide-mémoire : la table de Pythagore (dyscalculie) */
Z.aideMemoire = () => {
  const h = Z.h; let sel = null;
  const cells = [];
  const grille = h('div', { class: 'pytha' });
  for (let r = 0; r <= 10; r++) for (let c = 0; c <= 10; c++) {
    const head = r === 0 || c === 0;
    const el = h('button', { class: 'pc' + (head ? ' tete' : ''), onclick: () => {
      if (head) return;
      cells.forEach(x => x.el.classList.toggle('lit', x.r === r && x.c <= c || x.c === c && x.r <= r));
      Z.speak(`${r} fois ${c} égale ${r * c}`, { force: true });
    } }, r === 0 && c === 0 ? '×' : head ? String(r || c) : String(r * c));
    cells.push({ r, c, el }); grille.append(el);
  }
  Z.modal(h('div', { class: 'col' }, h('h2', null, '📋 Aide-mémoire'), h('p', { class: 'small-note' }, 'Touche une case : la ligne et la colonne s’allument, et j’explique le calcul.'), grille));
};
/* Calculatrice (seulement si le PAP l'autorise : réglage de l'espace parents) */
Z.calculatrice = () => {
  const h = Z.h; let v = '';
  const ecran = h('div', { class: 'calc-ecran' }, '0');
  const maj = () => { ecran.textContent = v || '0'; };
  const calc = () => {
    const s = v.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/−/g, '-');
    if (!/^[0-9+\-*/.() ]+$/.test(s)) return;
    try { const r = Function('"use strict";return (' + s + ')')(); if (isFinite(r)) { v = String(Math.round(r * 1e6) / 1e6).replace('.', ','); Z.speak(v, { force: true }); } } catch (e) { Z.pop('Calcul incomplet', 'soft'); }
    maj();
  };
  const k = (t) => h('button', { class: 'tile small', onclick: () => {
    Z.sfx.click();
    if (t === 'C') v = ''; else if (t === '⌫') v = v.slice(0, -1); else if (t === '=') return calc(); else v += t;
    maj();
  } }, t);
  Z.modal(h('div', { class: 'col' }, h('h2', null, '🧮 Calculatrice'), ecran,
    h('div', { class: 'pad calc' }, ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', ',', '+', '=', 'C', '⌫', '(', ')'].map(k))));
};
