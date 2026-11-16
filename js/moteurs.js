/* =========================================================
   LES RUBRIQUES ET LES MOTEURS D'ACTIVITÉ (code générique)
   ---------------------------------------------------------
   Une RUBRIQUE = une matière (Français, Maths…).
   Une ACTIVITÉ = un exercice écrit dans contenu.js, avec un « type »
   qui choisit le MOTEUR qui le fait tourner :

     qcm         questions à choix (la 1re réponse est la bonne)
     trous       texte à trous : {bonne|fausse|fausse}
     paires      relier deux colonnes
     ordre       remettre dans l'ordre (frise, étapes, phrase…)
     cartes      cartes mémoire avec répétition espacée
     calcul      réponse en nombre, avec figure facultative
     orthographe écrire des mots (syllabes, pièges, lettres muettes)
     redaction   écrire un texte étape par étape, validé par l'adulte
     schema      légender un dessin
     jeu         un des jeux intégrés : 'mots', 'tables', 'problemes', 'route'

   Ce fichier ne contient AUCUN contenu d'élève.
   ========================================================= */
(function () {
  const h = Z.h;

  /* ---------- Les rubriques ---------- */
  const BASE = [
    { id: 'francais', titre: 'Français', icone: '📖', couleur: '#2563eb' },
    { id: 'maths', titre: 'Maths', icone: '🔢', couleur: '#ea580c' },
    { id: 'geometrie', titre: 'Géométrie', icone: '📐', couleur: '#7c3aed' },
    { id: 'histoire', titre: 'Histoire-Géo', icone: '🌍', couleur: '#a16207' },
    { id: 'svt', titre: 'SVT', icone: '🌱', couleur: '#15803d' }
  ];
  Z.rubriques = function () {
    const R = PROFIL.rubriques || {};
    const actives = R.actives || BASE.map(r => r.id);
    return BASE.filter(r => actives.includes(r.id)).concat(R.enPlus || [])
      .map(r => Object.assign({}, r, { activites: ((window.ZCONTENU || {})[r.id] || []) }));
  };
  Z.rubrique = (id) => Z.rubriques().find(r => r.id === id);
  const actOf = (rid, aid) => (Z.rubrique(rid) || { activites: [] }).activites.find(a => a.id === aid);
  const actKey = (rid, a) => rid + ':' + a.id;
  const rec = (rid, a) => ((Z.state.acts = Z.state.acts || {})[actKey(rid, a)]);

  const ICO = { qcm: '❓', trous: '🧩', paires: '🔗', ordre: '🔢', cartes: '🃏', calcul: '🧮', orthographe: '✍️', redaction: '📝', schema: '🏷️', jeu: '🎮' };
  const JEUX = { mots: 'mots', tables: 'tables', problemes: 'problemes', route: 'route', parcours: 'route' };
  const titreAct = (a) => a.titre || (a.type === 'jeu' ? Z.titre(a.jeu === 'route' ? 'parcours' : a.jeu) : 'Activité');

  /* ---------- Écran d'une rubrique : la liste des activités ---------- */
  Z.screens.rubrique = function (rid) {
    const r = Z.rubrique(rid);
    const shell = Z.shell({ title: r.titre });
    shell.setSteps(0, 0);
    const t = r.activites.length ? `${r.titre}. Choisis une activité !` : `${r.titre}. Il n'y a pas encore d'activité ici.`;
    shell.root.append(h('h2', null, r.icone + ' ' + r.titre), Z.guideSays(t),
      ...r.activites.map(a => {
        const rr = rec(rid, a);
        return h('button', { class: 'devoir' + (rr ? ' fait' : ''), onclick: () => { Z.sfx.vroum(); Z.go('activite', rid, a.id); } },
          h('span', { class: 'd-ico' }, rr ? '✅' : (a.icone || ICO[a.type] || '⭐')),
          h('span', { class: 'grow' }, titreAct(a), h('small', null, (a.notion || '') + (rr ? `${a.notion ? ' · ' : ''}fait ${rr.n} fois` : ''))),
          h('span', { class: 'd-go' }, '▶'));
      }));
  };

  /* ---------- Lancer une activité ---------- */
  Z.screens.activite = function (rid, aid) {
    const a = actOf(rid, aid);
    if (!a) return Z.go('rubrique', rid);
    /* Jeux intégrés : la fin du jeu sera comptée pour cette activité */
    if (a.type === 'jeu') { Z.go(JEUX[a.jeu] || 'home'); Z.actEnCours = actKey(rid, a); return; }
    if (a.type === 'orthographe') { Z.go('mots', { rid, aid }); Z.actEnCours = actKey(rid, a); return; }
    const M = MOTEURS[a.type];
    if (!M) { Z.go('rubrique', rid); Z.pop('Type inconnu : ' + a.type, 'soft'); return; }
    const shell = Z.shell({ title: titreAct(a) });
    const ctx = makeCtx(shell, rid, a);
    /* Intro : titre + consigne lue, puis on commence */
    shell.setSteps(0, 0);
    const t = a.consigne || DEF_CONSIGNE[a.type] || 'C\'est parti !';
    shell.root.append(h('h2', null, (a.icone || ICO[a.type]) + ' ' + titreAct(a)), Z.guideSays(t),
      a.rappel ? h('div', { class: 'card rule' }, h('b', null, '📌 À retenir : '), a.rappel, Z.ear(a.rappel)) : null,
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); M(ctx, a); } }, '▶️ C\'est parti !'));
  };
  /* Pour le jeu d'orthographe : les mots d'une activité */
  Z.motsActivite = (o) => { const a = actOf(o.rid, o.aid); return (a && a.mots) || []; };

  const DEF_CONSIGNE = {
    qcm: 'Lis bien la question, puis choisis la bonne réponse.',
    trous: 'Complète chaque trou avec le bon mot.',
    paires: 'Relie chaque élément de gauche à celui qui va avec, à droite.',
    ordre: 'Remets les éléments dans le bon ordre. Touche-les l\'un après l\'autre.',
    cartes: 'Lis la question, réfléchis, puis retourne la carte. Dis honnêtement si tu savais.',
    calcul: 'Calcule, puis tape ta réponse.',
    redaction: 'On écrit ensemble, étape par étape.',
    schema: 'Trouve le nom de chaque partie du dessin.'
  };

  /* Outils communs aux moteurs : étapes, score, fin */
  function makeCtx(shell, rid, a) {
    let firstTry = 0, total = 0;
    return {
      shell, rid, a,
      ok(first) { total++; if (first) firstTry++; },
      clear(step, n) { shell.clear(); shell.setSteps(n, step); },
      next(btnLabel, fn) { return h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); fn(); } }, btnLabel || 'Suivant ➡️'); },
      finish(lines = []) {
        const r = (Z.state.acts = Z.state.acts || {});
        const k = actKey(rid, a);
        r[k] = r[k] || { n: 0, best: 0 };
        r[k].n++; r[k].best = Math.max(r[k].best, firstTry);
        const parfait = total && firstTry === total;
        Z.endScreen(shell, {
          medal: parfait ? '🥇' : firstTry >= total / 2 ? '🥈' : '🥉', kind: 'act', detail: k,
          eclairs: 6 + firstTry * 2, xp: 10 + firstTry * 3,
          title: parfait ? 'Parfait, tout du premier coup !' : 'Activité terminée !',
          lines: [total ? `${firstTry} réussite(s) du premier coup sur ${total}` : '', ...lines].filter(Boolean),
          again: () => Z.go('activite', rid, a.id), againLabel: '🔁 Recommencer'
        });
        shell.root.append(h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('rubrique', rid); } }, '⬅️ ' + Z.rubrique(rid).titre));
      }
    };
  }
  const say = (t) => Z.speak(t, { natural: true });
  const okSay = () => Z.pick(ZDATA.praise);
  const retrySay = () => Z.pick(ZDATA.retry);

  /* =========================================================
     LES MOTEURS
     ========================================================= */
  const MOTEURS = {};

  /* ---------- QCM ---------- */
  MOTEURS.qcm = function (ctx, a) {
    const items = a.questions || [];
    let i = 0;
    const show = () => {
      if (i >= items.length) return ctx.finish();
      const it = items[i]; let miss = 0;
      ctx.clear(i, items.length);
      const opts = Z.shuffle(it.choix.map((c, k) => ({ t: c, ok: k === 0 })));
      const after = h('div', { class: 'col' });
      const list = h('div', { class: 'col' }, opts.map(o => {
        const b = h('button', {
          class: 'opt', onclick: () => {
            if (list.dataset.done || b.classList.contains('bad')) return;
            if (o.ok) {
              list.dataset.done = 1; b.classList.add('good'); Z.sfx.good(); ctx.ok(!miss);
              const ex = it.explication ? `${okSay()} ${it.explication}` : okSay();
              after.append(h('div', { class: 'card rule' }, '✅ ', ex, Z.ear(ex)), ctx.next(null, () => { i++; show(); }));
              say(ex);
            } else {
              miss++; b.classList.add('bad'); Z.sfx.bad();
              const t = it.aide && miss === 1 ? `${retrySay()} ${it.aide}` : retrySay();
              say(t); if (it.aide && miss === 1) after.append(h('div', { class: 'card' }, '💡 ', it.aide));
            }
          }
        }, h('span', null, o.t), Z.ear(o.t));
        return b;
      }));
      ctx.shell.root.append(h('div', { class: 'card' }, h('div', { style: { fontWeight: 700, fontSize: '1.1em' } }, it.q), Z.ear(it.q)), list, after);
      say(it.q);
    };
    show();
  };

  /* ---------- Texte à trous : « Le {chien|chat} aboie. » ---------- */
  MOTEURS.trous = function (ctx, a) {
    const items = a.phrases || [];
    let i = 0;
    const parse = (t) => {
      const parts = []; const re = /\{([^}]+)\}/g; let m, last = 0;
      while ((m = re.exec(t))) { if (m.index > last) parts.push({ t: t.slice(last, m.index) }); const c = m[1].split('|').map(x => x.trim()); parts.push({ bonne: c[0], choix: c }); last = re.lastIndex; }
      if (last < t.length) parts.push({ t: t.slice(last) });
      return parts;
    };
    const show = () => {
      if (i >= items.length) return ctx.finish();
      const it = typeof items[i] === 'string' ? { t: items[i] } : items[i];
      const parts = parse(it.t), gaps = parts.filter(p => p.bonne !== undefined);
      let g = 0, miss = 0;
      ctx.clear(i, items.length);
      const line = h('div', { class: 'card', style: { fontSize: '1.15em', lineHeight: '2' } });
      const render = () => {
        line.innerHTML = '';
        let k = 0;
        parts.forEach(p => {
          if (p.t !== undefined) return line.append(p.t);
          const idx = k++;
          line.append(h('span', { class: 'slot small' + (idx < g ? ' filled' : idx === g ? ' next' : ''), style: { display: 'inline-grid', minWidth: '70px', margin: '0 4px', verticalAlign: 'middle' } }, idx < g ? p.bonne : '?'));
        });
      };
      const plain = () => parts.map(p => p.t !== undefined ? p.t : p.bonne).join('');
      const choices = h('div', { class: 'tiles' });
      const after = h('div', { class: 'col' });
      const ask = () => {
        render(); choices.innerHTML = '';
        if (g >= gaps.length) {
          ctx.ok(!miss); Z.sfx.good();
          const ex = it.explication || '';
          after.append(h('div', { class: 'card rule' }, '✅ ', plain(), Z.ear(plain())), ex ? h('div', { class: 'card' }, '💡 ', ex) : null, ctx.next(null, () => { i++; show(); }));
          say(plain() + (ex ? ' ' + ex : ''));
          return;
        }
        Z.shuffle(gaps[g].choix).forEach(c => {
          const b = h('button', {
            class: 'tile small', onclick: () => {
              if (c === gaps[g].bonne) { Z.sfx.tap(); g++; ask(); }
              else { miss++; Z.sfx.bad(); b.classList.add('shake'); say(it.aide && miss === 1 ? it.aide : retrySay()); }
            }
          }, c);
          choices.append(b);
        });
      };
      ctx.shell.root.append(line, choices, after);
      ask();
    };
    show();
  };

  /* ---------- Appariement : paires: [[gauche, droite], …] ---------- */
  MOTEURS.paires = function (ctx, a) {
    const P = a.paires || [];
    let done = 0, sel = null, miss = 0;
    ctx.clear(0, P.length);
    const L = Z.shuffle(P.map((p, k) => ({ t: p[0], k }))), R = Z.shuffle(P.map((p, k) => ({ t: p[1], k })));
    const mk = (o, side) => {
      const b = h('button', { class: 'opt', style: { minHeight: '64px', fontSize: '.95em' } }, h('span', null, o.t));
      b.onclick = () => {
        if (b.classList.contains('good')) return;
        if (side === 'g') { colG.querySelectorAll('.opt').forEach(x => x.style.outline = ''); sel = { o, b }; b.style.outline = '4px solid var(--gold)'; Z.sfx.tap(); say(o.t); return; }
        if (!sel) { Z.pop('Choisis d\'abord à gauche', 'soft'); return; }
        if (sel.o.k === o.k) {
          sel.b.classList.add('good'); b.classList.add('good'); sel.b.style.outline = ''; Z.sfx.good(); ctx.ok(!miss); miss = 0; done++; sel = null;
          ctx.shell.setSteps(P.length, done);
          if (done === P.length) setTimeout(() => ctx.finish(), 700);
        } else { miss++; Z.sfx.bad(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); say(retrySay()); }
      };
      return b;
    };
    const colG = h('div', { class: 'col' }, L.map(o => mk(o, 'g'))), colD = h('div', { class: 'col' }, R.map(o => mk(o, 'd')));
    ctx.shell.root.append(h('div', { class: 'hint center' }, '👈 Touche à gauche, puis à droite 👉'),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }, colG, colD));
  };

  /* ---------- Remettre dans l'ordre ---------- */
  MOTEURS.ordre = function (ctx, a) {
    const series = a.series || [a.elements || []];
    let i = 0;
    const show = () => {
      if (i >= series.length) return ctx.finish();
      const S = series[i]; let k = 0, miss = 0;
      ctx.clear(i, series.length);
      const ans = h('div', { class: 'col' });
      const pool = h('div', { class: 'col' }, Z.shuffle(S.map((t, idx) => ({ t, idx }))).map(o => {
        const b = h('button', {
          class: 'opt', onclick: () => {
            if (o.idx === k) {
              Z.sfx.tap(); b.remove(); ans.append(h('div', { class: 'opt good' }, h('b', null, (k + 1) + '. '), h('span', null, o.t))); k++;
              if (k === S.length) { ctx.ok(!miss); Z.sfx.good(); ctx.shell.root.append(ctx.next(null, () => { i++; show(); })); say(okSay()); }
            } else { miss++; Z.sfx.bad(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); say(k === 0 ? 'Cherche celui qui vient en premier.' : 'Qu\'est-ce qui vient juste après ?'); }
          }
        }, h('span', null, o.t), Z.ear(o.t));
        return b;
      }));
      ctx.shell.root.append(a.sousTitre ? h('div', { class: 'hint center' }, a.sousTitre) : null, ans, h('div', { class: 'hint center' }, '👇 Touche le suivant'), pool);
    };
    show();
  };

  /* ---------- Cartes mémoire (répétition espacée) ---------- */
  MOTEURS.cartes = function (ctx, a) {
    const st = (Z.state.cartes = Z.state.cartes || {});
    const all = (a.cartes || []).map((c, n) => Object.assign({ key: actKey(ctx.rid, a) + ':' + n }, c));
    const due = all.filter(c => st[c.key] && Z.isDue(st[c.key])), fresh = all.filter(c => !st[c.key]);
    let list = due.concat(fresh).slice(0, a.parSeance || 8);
    if (!list.length) list = Z.shuffle(all).slice(0, a.parSeance || 8);
    let i = 0;
    const show = () => {
      if (i >= list.length) return ctx.finish(['Les cartes reviendront au bon moment pour bien les retenir 🧠']);
      const c = list[i];
      ctx.clear(i, list.length);
      const verso = h('div', { class: 'card rule', style: { display: 'none' } }, c.verso, Z.ear(c.verso));
      const btns = h('div', { class: 'col', style: { display: 'none' } },
        h('button', { class: 'btn green wide', onclick: () => { Z.srsUpdate(st, c.key, true); ctx.ok(true); Z.sfx.good(); Z.save(); i++; show(); } }, '✅ Je savais'),
        h('button', { class: 'btn ghost wide', onclick: () => { Z.srsUpdate(st, c.key, false); ctx.ok(false); Z.save(); i++; show(); } }, '🔁 À revoir'));
      const flip = h('button', { class: 'btn purple wide', onclick: () => { Z.sfx.tap(); verso.style.display = ''; btns.style.display = ''; flip.remove(); say(c.verso); } }, '🔄 Retourner la carte');
      ctx.shell.root.append(h('div', { class: 'card center', style: { minHeight: '120px', fontSize: '1.2em', fontWeight: 700, display: 'grid', placeItems: 'center' } }, c.recto), Z.ear(c.recto), flip, verso, btns);
      say(c.recto);
    };
    show();
  };

  /* ---------- Calcul / réponse en nombre (figure facultative) ---------- */
  MOTEURS.calcul = function (ctx, a) {
    const items = a.questions || [];
    let i = 0;
    const show = () => {
      if (i >= items.length) return ctx.finish();
      const it = items[i]; let miss = 0, val = '';
      ctx.clear(i, items.length);
      const screen = h('div', { class: 'question', style: { fontSize: '2em', minHeight: '1.4em', background: '#fff', borderRadius: '14px', border: '3px solid var(--line)' } }, '');
      const upd = () => { screen.textContent = (val || '…') + (it.unite ? ' ' + it.unite : ''); };
      const after = h('div', { class: 'col' });
      const key = (k) => h('button', {
        class: 'tile small', style: { minWidth: '0' }, onclick: () => {
          Z.sfx.click();
          if (k === '⌫') val = val.slice(0, -1); else if (k === ',') { if (!val.includes(',')) val += val ? ',' : '0,'; } else if (val.length < 9) val += k;
          upd();
        }
      }, k);
      const pad = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } }, ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '⌫'].map(key));
      const valider = h('button', {
        class: 'btn orange wide', onclick: () => {
          if (!val) return;
          const n = parseFloat(val.replace(',', '.')), tol = it.tolerance !== undefined ? it.tolerance : 0.001;
          if (Math.abs(n - it.reponse) <= tol) {
            Z.sfx.good(); ctx.ok(!miss); pad.remove(); valider.remove();
            const ex = it.solution ? `${okSay()} ${it.solution}` : okSay();
            after.append(h('div', { class: 'card rule' }, '✅ ', ex, Z.ear(ex)), ctx.next(null, () => { i++; show(); }));
            say(ex);
          } else {
            miss++; Z.sfx.bad(); screen.classList.add('shake'); setTimeout(() => screen.classList.remove('shake'), 500); val = ''; upd();
            const t = miss === 1 ? (it.aide || retrySay()) : (it.solution ? 'Voici comment faire. ' + it.solution : `La réponse est ${String(it.reponse).replace('.', ',')}.`);
            after.innerHTML = ''; after.append(h('div', { class: 'card' }, miss === 1 ? '💡 ' : '👀 ', t));
            if (miss >= 2) { pad.remove(); valider.remove(); after.append(ctx.next(null, () => { i++; show(); })); }
            say(t);
          }
        }
      }, '✔️ Valider');
      upd();
      ctx.shell.root.append(h('div', { class: 'card' }, h('div', { style: { fontWeight: 700 } }, it.q), Z.ear(it.q)),
        it.figure ? Z.svg(figure(it.figure), 'card') : null, screen, pad, valider, after);
      say(it.q);
    };
    show();
  };

  /* Figures de géométrie dessinées en SVG.
     { type: 'triangle-rectangle', a: '3 cm', b: '4 cm', c: '?', sommets: ['A','B','C'] }
       a = côté vertical, b = côté horizontal, c = hypoténuse
     { type: 'rectangle', longueur: '8 cm', largeur: '5 cm' }
     { type: 'cercle', rayon: '3 cm' } */
  function figure(f) {
    const T = (x, y, t, col = '#1f2937', size = 18) => t ? `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" text-anchor="middle" font-family="Andika, Verdana" fill="${col}">${t}</text>` : '';
    let s = '';
    if (f.type === 'triangle-rectangle') {
      const S = f.sommets || ['A', 'B', 'C'];
      s = `<path d="M60 30 L60 170 L260 170 Z" fill="#ede9fe" stroke="#4c1d95" stroke-width="3" stroke-linejoin="round"/>
        <path d="M60 150 h20 v20" fill="none" stroke="#4c1d95" stroke-width="2.5"/>
        ${T(30, 104, f.a, f.a === '?' ? '#dc2626' : '#1f2937')}${T(160, 194, f.b, f.b === '?' ? '#dc2626' : '#1f2937')}${T(178, 90, f.c, f.c === '?' ? '#dc2626' : '#1f2937')}
        ${T(60, 22, S[0], '#7c3aed', 16)}${T(46, 186, S[1], '#7c3aed', 16)}${T(272, 186, S[2], '#7c3aed', 16)}`;
      return `<svg viewBox="0 0 300 205" class="schema-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
    }
    if (f.type === 'rectangle') {
      s = `<rect x="50" y="30" width="200" height="120" fill="#ffedd5" stroke="#9a3412" stroke-width="3"/>${T(150, 172, f.longueur)}${T(28, 96, f.largeur)}`;
      return `<svg viewBox="0 0 300 185" class="schema-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
    }
    if (f.type === 'cercle') {
      s = `<circle cx="150" cy="95" r="75" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/><circle cx="150" cy="95" r="4" fill="#1e40af"/><path d="M150 95 H225" stroke="#dc2626" stroke-width="3"/>${T(188, 86, f.rayon, '#dc2626')}`;
      return `<svg viewBox="0 0 300 190" class="schema-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
    }
    return f.svg || '';
  }
  Z.figure = figure;

  /* ---------- Rédaction guidée (validée par l'adulte, sans IA) ---------- */
  MOTEURS.redaction = function (ctx, a) {
    const E = a.etapes || [];
    const store = ((Z.state.redac = Z.state.redac || {})[actKey(ctx.rid, a)] = (Z.state.redac[actKey(ctx.rid, a)] || {}));
    const ADULTE = PROFIL.appli.adulte || 'l’adulte';
    let i = 0;
    const show = () => {
      if (i >= E.length) return relire();
      const e = E[i];
      ctx.clear(i, E.length + 1);
      const ta = h('textarea', { rows: e.lignes || 5, placeholder: e.debut || 'Écris ici… (tu peux aussi utiliser le micro du clavier 🎤)', style: { width: '100%', fontSize: '1em', fontFamily: 'inherit', padding: '10px', borderRadius: '14px', border: '3px solid var(--line)', lineHeight: '1.7' } });
      ta.value = store[i] || '';
      ta.addEventListener('input', () => { store[i] = ta.value; Z.save(); });
      const aide = e.aide ? h('div', { class: 'card', style: { display: 'none' } }, '💡 ', e.aide, Z.ear(e.aide)) : null;
      ctx.shell.root.append(h('h2', null, `✏️ Étape ${i + 1} : ${e.titre}`), Z.guideSays(e.consigne, { speak: false }),
        e.mots ? h('div', { class: 'card' }, h('b', null, '🧰 Mots utiles : '), e.mots.join(' · ')) : null,
        aide ? h('button', { class: 'btn ghost wide', onclick: (ev) => { aide.style.display = ''; ev.currentTarget.remove(); say(e.aide); } }, '💡 Un coup de pouce') : null, aide,
        ta, h('button', { class: 'btn ghost wide', onclick: () => say(ta.value || 'Tu n\'as encore rien écrit.') }, '🔊 Écouter ce que j\'ai écrit'),
        ctx.next(i + 1 < E.length ? 'Étape suivante ➡️' : 'Relire mon texte ➡️', () => {
          if (!ta.value.trim()) { Z.pop('Écris au moins une phrase 🙂', 'soft'); say('Écris au moins une phrase.'); return; }
          i++; show();
        }),
        i > 0 ? h('button', { class: 'btn ghost wide', onclick: () => { i--; show(); } }, '⬅️ Étape précédente') : null);
      say(e.consigne);
    };
    const relire = () => {
      ctx.clear(E.length, E.length + 1);
      const texte = E.map((e, k) => store[k] || '').filter(Boolean).join('\n\n');
      const checks = (a.checklist || []).map(c => { const cb = h('input', { type: 'checkbox', style: { width: '28px', height: '28px' } }); return { c, cb, el: h('label', { class: 'row', style: { gap: '10px' } }, cb, h('span', null, c)) }; });
      ctx.shell.root.append(h('h2', null, '👀 Je relis mon texte'),
        h('div', { class: 'card', style: { whiteSpace: 'pre-wrap' } }, texte),
        h('button', { class: 'btn ghost wide', onclick: () => say(texte) }, '🔊 Écouter tout mon texte'),
        checks.length ? h('div', { class: 'card col' }, h('b', null, '✅ Ma check-list'), ...checks.map(x => x.el), Z.ear(checks.map(x => x.c).join('. '))) : null,
        h('button', {
          class: 'btn purple wide', onclick: () => {
            if (checks.some(x => !x.cb.checked)) { Z.pop('Coche toute ta check-list 🙂', 'soft'); say('Vérifie chaque point de ta check-list avant de faire valider.'); return; }
            const close = Z.modal(h('div', { class: 'col center' },
              h('h2', null, `Pour ${ADULTE}`), h('p', null, 'As-tu relu ce texte avec l\'élève ?'),
              h('button', { class: 'btn green wide', onclick: () => { close(); ctx.ok(true); ctx.finish(['📝 Texte validé par ' + ADULTE]); } }, '✅ Validé'),
              h('button', { class: 'btn ghost wide', onclick: () => { close(); i = 0; show(); } }, '✏️ À retravailler')));
          }
        }, `🙋 Faire valider par ${ADULTE}`),
        h('button', { class: 'btn ghost wide', onclick: () => { i = E.length - 1; show(); } }, '⬅️ Modifier'));
      say('Relis ton texte, ou écoute-le. Puis coche ta check-list.');
    };
    show();
  };

  /* ---------- Schéma à légender ----------
     fond : 'plante' | 'roseDesVents' | 'cellule' (dessins fournis)
            ou svg : '<svg viewBox="0 0 300 220">…</svg>' (le tien)
     points : [{ x, y, bonne: 'Racines' }]  (coordonnées dans le dessin)
     intrus : ['Pétale'] (étiquettes en plus, facultatif) */
  const FONDS = {
    plante: `<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="190" width="300" height="70" fill="#a16207" opacity=".35"/>
      <path d="M150 190 V60" stroke="#15803d" stroke-width="8"/><path d="M150 140 q-50 -10 -60 -45 q40 5 60 45 z M150 115 q50 -10 62 -42 q-42 4 -62 42 z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      ${[0, 72, 144, 216, 288].map(d => `<ellipse cx="${150 + Math.cos(d * Math.PI / 180) * 18}" cy="${48 + Math.sin(d * Math.PI / 180) * 18}" rx="14" ry="9" fill="#f472b6" transform="rotate(${d} ${150 + Math.cos(d * Math.PI / 180) * 18} ${48 + Math.sin(d * Math.PI / 180) * 18})"/>`).join('')}
      <circle cx="150" cy="48" r="10" fill="#facc15"/>
      <path d="M150 190 q-20 20 -40 50 M150 190 q5 25 0 55 M150 190 q25 15 45 45 M130 215 q-15 0 -25 10 M170 215 q15 2 22 14" stroke="#78350f" stroke-width="3" fill="none"/></svg>`,
    roseDesVents: `<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="130" r="90" fill="#f0f9ff" stroke="#0369a1" stroke-width="2"/>
      <path d="M150 30 L165 130 L150 230 L135 130 Z" fill="#0369a1"/><path d="M50 130 L150 115 L250 130 L150 145 Z" fill="#7dd3fc"/><circle cx="150" cy="130" r="8" fill="#facc15"/></svg>`,
    cellule: `<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg"><ellipse cx="150" cy="130" rx="125" ry="95" fill="#fef9c3" stroke="#a16207" stroke-width="4"/>
      <ellipse cx="160" cy="125" rx="38" ry="32" fill="#c4b5fd" stroke="#6d28d9" stroke-width="3"/><circle cx="168" cy="120" r="9" fill="#6d28d9"/>
      ${[[80, 90], [95, 175], [225, 170], [230, 95], [110, 130]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#fdba74"/>`).join('')}</svg>`
  };
  Z.FONDS = FONDS;
  MOTEURS.schema = function (ctx, a) {
    const pts = a.points || [];
    let k = 0, miss = 0;
    const draw = () => {
      const src = a.svg || FONDS[a.fond] || FONDS.plante;
      const marks = pts.map((p, n) => n < k
        ? `<rect x="${p.x - 4}" y="${p.y - 15}" width="${p.bonne.length * 9 + 12}" height="22" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="${p.x + 2}" y="${p.y + 1}" font-size="14" font-weight="700" font-family="Andika, Verdana" fill="#14532d">${p.bonne}</text>`
        : `<circle cx="${p.x}" cy="${p.y}" r="13" fill="${n === k ? '#facc15' : '#fff'}" stroke="#1f2937" stroke-width="2.5"/><text x="${p.x}" y="${p.y + 5}" font-size="14" font-weight="700" text-anchor="middle" font-family="Arial">${n + 1}</text>`).join('');
      return src.replace('</svg>', marks + '</svg>');
    };
    const ask = () => {
      ctx.clear(k, pts.length);
      if (k >= pts.length) {
        ctx.shell.root.append(Z.svg(draw(), 'card'));
        Z.sfx.win(); setTimeout(() => ctx.finish(), 900); return;
      }
      const labels = Z.shuffle(pts.slice(k).map(p => p.bonne).concat(a.intrus || []));
      const grid = h('div', { class: 'tiles' }, labels.map(l => {
        const b = h('button', {
          class: 'tile small', onclick: () => {
            if (l === pts[k].bonne) { Z.sfx.good(); ctx.ok(!miss); miss = 0; k++; say(l); ask(); }
            else { miss++; Z.sfx.bad(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); say(pts[k].aide && miss === 1 ? pts[k].aide : retrySay()); }
          }
        }, l);
        return b;
      }));
      ctx.shell.root.append(Z.svg(draw(), 'card'), h('div', { class: 'hint center' }, `Comment s'appelle la partie n° ${k + 1} (en jaune) ?`), grid);
    };
    ask();
  };
})();
