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
     posee       opération posée (+ − ×) : l'élève remplit les chiffres case par case
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

  const ICO = { posee: '🧮', qcm: '❓', trous: '🧩', paires: '🔗', ordre: '🔢', cartes: '🃏', calcul: '🧮', orthographe: '✍️', redaction: '📝', schema: '🏷️', jeu: '🎮' };
  const JEUX = { mots: 'mots', tables: 'tables', problemes: 'problemes', route: 'route', parcours: 'route' };
  const titreAct = (a) => a.titre || (a.type === 'jeu' ? Z.titre(a.jeu === 'route' ? 'parcours' : a.jeu) : 'Activité');

  /* ---------- Paliers de difficulté et activités à débloquer ----------
     • paliers : [ {données du palier 1}, {palier 2}, {palier 3} ] (facile, moyen, expert).
       Le palier suivant s'ouvre à 80 % de réussite du premier coup ;
       deux essais sous 50 % → on revient au palier d'avant, sans en faire un échec.
     • posee + generer: ['+', '-', '×'] : les opérations sont tirées au hasard,
       de plus en plus grandes à chaque palier.
     • niveauMin : l'activité se débloque à ce niveau. */
  const PAL = () => (Z.state.paliers = Z.state.paliers || {});
  const NOMS_P = ['facile', 'moyen', 'expert'];
  const nomPalier = (p, n) => n === 3 ? NOMS_P[p] : `palier ${p + 1}`;
  const nbPaliers = (a) => a.paliers ? a.paliers.length : (a.type === 'posee' && a.generer ? 3 : 1);
  Z.palierDe = (rid, a) => Math.min(nbPaliers(a) - 1, (PAL()[actKey(rid, a)] || {}).p || 0);
  const verrou = (a) => !!a.niveauMin && Z.levelInfo().lvl < a.niveauMin;
  function genererPosee(ops, p) {
    const r = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    return [0, 1, 2, 3].map(i => {
      const op = ops[i % ops.length];
      if (op === '+') return p === 0 ? { a: r(12, 49), b: r(11, 39), op } : p === 1 ? { a: r(128, 899), b: r(105, 799), op } : { a: r(1250, 9899), b: r(1050, 8999), op };
      if (op === '-' || op === '−') { const a = p === 0 ? r(35, 99) : p === 1 ? r(300, 999) : r(2000, 9999); return { a, b: r(Math.floor(a / 5), a - 1), op: '-' }; }
      return p === 0 ? { a: r(12, 49), b: r(2, 5), op: '×' } : p === 1 ? { a: r(102, 499), b: r(6, 9), op: '×' } : { a: r(120, 999), b: r(12, 48), op: '×' };
    });
  }
  function avecPalier(a, p) {
    const x = a.paliers ? Object.assign({}, a, a.paliers[p]) : Object.assign({}, a);
    if (a.type === 'posee' && a.generer && !a.paliers) x.operations = genererPosee(a.generer, p);
    x.palier = p;
    return x;
  }
  function palierApres(rid, a, ok, total) {
    const n = nbPaliers(a);
    if (n <= 1 || !total) return null;
    const k = actKey(rid, a), s = PAL()[k] = PAL()[k] || { p: 0, bas: 0 };
    const taux = ok / total, joue = a.palier !== undefined ? a.palier : s.p;
    if (a.defi) {
      Z.state.defiFait = Z.today();
      if (taux >= 0.8 && joue > s.p) { s.p = joue; s.bas = 0; return `🎯 Défi réussi : le palier ${joue + 1} (${nomPalier(joue, n)}) est débloqué !`; }
      return '🎯 Bel essai ! Ce défi reviendra.';
    }
    if (joue !== s.p) return null;
    if (taux >= 0.8 && s.p < n - 1) { s.p++; s.bas = 0; return `🔓 Palier ${s.p + 1} débloqué : ${nomPalier(s.p, n)} !`; }
    if (taux < 0.5) { s.bas++; if (s.bas >= 2 && s.p > 0) { s.p--; s.bas = 0; return 'On consolide le palier d’avant, puis on remonte.'; } }
    else s.bas = 0;
    return null;
  }
  /* Le défi du jour : une activité, un palier au-dessus, éclairs doublés */
  Z.defiDuJour = function () {
    if (Z.state.defiFait === Z.today()) return null;
    const L = [];
    Z.rubriques().forEach(r => r.activites.forEach(a => {
      const n = nbPaliers(a);
      if (n > 1 && !verrou(a) && Z.palierDe(r.id, a) < n - 1) L.push({ r, a, p: Z.palierDe(r.id, a) + 1, n });
    }));
    return L.length ? L[Z.dayNum() % L.length] : null;
  };
  /* Les activités qui se débloquent à un niveau donné */
  Z.activitesDuNiveau = (lvl) => Z.rubriques().flatMap(r => r.activites.filter(a => a.niveauMin === lvl).map(a => titreAct(a)));

  /* ---------- Écran d'une rubrique : la liste des activités ---------- */
  Z.screens.rubrique = function (rid) {
    const r = Z.rubrique(rid);
    const shell = Z.shell({ title: r.titre });
    shell.setSteps(0, 0);
    const t = r.activites.length ? `${r.titre}. Choisis une activité !` : `${r.titre}. Il n'y a pas encore d'activité ici.`;
    shell.root.append(h('h2', null, r.icone + ' ' + r.titre), Z.guideSays(t),
      ...r.activites.map(a => {
        const rr = rec(rid, a), n = nbPaliers(a), p = Z.palierDe(rid, a);
        if (verrou(a)) return h('button', { class: 'devoir verrou', onclick: () => { Z.sfx.tap(); Z.pop(`Se débloque au niveau ${a.niveauMin} 🔒`, 'soft'); } },
          h('span', { class: 'd-ico' }, '🔒'), h('span', { class: 'grow' }, titreAct(a), h('small', null, `Se débloque au niveau ${a.niveauMin}`)), h('span', { class: 'd-go' }, ''));
        const etoiles = n > 1 ? ' · ' + '★'.repeat(p + 1) + '☆'.repeat(n - p - 1) : '';
        return h('button', { class: 'devoir' + (rr ? ' fait' : ''), onclick: () => { Z.sfx.vroum(); Z.go('activite', rid, a.id); } },
          h('span', { class: 'd-ico' }, rr ? '✅' : (a.icone || ICO[a.type] || '⭐')),
          h('span', { class: 'grow' }, titreAct(a), h('small', null, (a.notion || '') + (rr ? `${a.notion ? ' · ' : ''}fait ${rr.n} fois` : '') + etoiles)),
          h('span', { class: 'd-go' }, '▶'));
      }));
  };

  /* ---------- Lancer une activité ---------- */
  Z.screens.activite = function (rid, aid, opts = {}) {
    const a0 = actOf(rid, aid);
    if (!a0) return Z.go('rubrique', rid);
    if (verrou(a0)) { Z.pop(`Se débloque au niveau ${a0.niveauMin} 🔒`, 'soft'); return Z.go('rubrique', rid); }
    const n = nbPaliers(a0), pMax = Z.palierDe(rid, a0);
    let a = avecPalier(a0, opts.defi ? Math.min(n - 1, pMax + 1) : pMax);
    if (opts.defi) a.defi = true;
    /* Jeux intégrés : la fin du jeu sera comptée pour cette activité */
    if (a.type === 'jeu') { Z.go(JEUX[a.jeu] || 'home'); Z.actEnCours = actKey(rid, a); return; }
    if (a.type === 'orthographe') { Z.go('mots', { rid, aid }); Z.actEnCours = actKey(rid, a); return; }
    const M = MOTEURS[a.type];
    if (!M) { Z.go('rubrique', rid); Z.pop('Type inconnu : ' + a.type, 'soft'); return; }
    const shell = Z.shell({ title: titreAct(a) });
    /* Intro : titre + consigne lue, (palier), puis on commence */
    shell.setSteps(0, 0);
    const t = a.consigne || DEF_CONSIGNE[a.type] || 'C\'est parti !';
    let choixP = null;
    if (n > 1 && !a.defi) {
      choixP = h('div', { class: 'paliers' }, h('b', null, 'Palier : '), ...Array.from({ length: n }, (_, k) => h('button', {
        class: 'chip-p' + (k === a.palier ? ' on' : '') + (k > pMax ? ' ferme' : ''),
        onclick: (e) => {
          if (k > pMax) { Z.pop('Réussis le palier d’avant pour l’ouvrir 🔒', 'soft'); return; }
          Z.sfx.tap(); a = avecPalier(a0, k); choixP.querySelectorAll('.chip-p').forEach((b, j) => b.classList.toggle('on', j === k));
        } }, (k > pMax ? '🔒 ' : '') + nomPalier(k, n))));
    }
    shell.root.append(h('h2', null, (a.icone || ICO[a.type]) + ' ' + titreAct(a)),
      a.defi ? h('div', { class: 'card defi' }, h('b', null, `🎯 Défi du jour : palier ${a.palier + 1} (${nomPalier(a.palier, n)}), éclairs doublés !`)) : null,
      Z.guideSays(t), ...Z.consigneBloc(Object.assign({}, a, { consigne: t })), choixP,
      a.rappel ? h('div', { class: 'card rule' }, h('b', null, '📌 À retenir : '), a.rappel, Z.ear(a.rappel)) : null,
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); M(makeCtx(shell, rid, a), a); } }, '▶️ C\'est parti !'));
  };
  /* Les devoirs utilisent les mêmes moteurs (qcm, trous, paires…) */
  Z.lancerMoteur = function (shell, a, fin) {
    const Mo = MOTEURS[a.moteur || a.type];
    if (!Mo) { Z.pop('Type inconnu : ' + (a.moteur || a.type), 'soft'); return; }
    Mo(makeCtx(shell, null, a, fin), a);
  };
  Z.consigneDe = (type) => DEF_CONSIGNE[type];
  /* Pour le jeu d'orthographe : les mots d'une activité */
  Z.motsActivite = (o) => { const a = actOf(o.rid, o.aid); return (a && a.mots) || []; };

  const DEF_CONSIGNE = {
    qcm: 'Lis bien la question, puis choisis la bonne réponse.',
    trous: 'Complète chaque trou avec le bon mot.',
    paires: 'Relie chaque élément de gauche à celui qui va avec, à droite.',
    ordre: 'Remets les éléments dans le bon ordre. Touche-les l\'un après l\'autre.',
    cartes: 'Lis la question et choisis une réponse parmi les 4. Ensuite, retourne la carte pour vérifier.',
    calcul: 'Calcule, puis tape ta réponse.',
    redaction: 'On écrit ensemble, étape par étape.',
    schema: 'Trouve le nom de chaque partie du dessin.',
    posee: 'Pose l’opération. Remplis les cases une par une, en commençant par la droite.'
  };

  /* Outils communs aux moteurs : étapes, score, fin */
  function makeCtx(shell, rid, a, fin) {
    let firstTry = 0, total = 0;
    return {
      shell, rid, a,
      ok(first) { total++; if (first) firstTry++; },
      clear(step, n) { shell.clear(); shell.setSteps(n, step); },
      next(btnLabel, fn) { return h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); fn(); } }, btnLabel || 'Suivant ➡️'); },
      finish(lines = []) {
        if (fin) return fin({ firstTry, total, lines });
        const r = (Z.state.acts = Z.state.acts || {});
        const k = actKey(rid, a);
        r[k] = r[k] || { n: 0, best: 0 };
        r[k].n++; r[k].best = Math.max(r[k].best, firstTry);
        const parfait = total && firstTry === total;
        const msgP = palierApres(rid, a, firstTry, total);
        Z.endScreen(shell, {
          medal: parfait ? '🥇' : firstTry >= total / 2 ? '🥈' : '🥉', kind: 'act', detail: k,
          eclairs: (6 + firstTry * 2) * (a.defi ? 2 : 1), xp: (10 + firstTry * 3) * (a.defi ? 2 : 1),
          title: parfait ? 'Parfait, tout du premier coup !' : 'Activité terminée !',
          lines: [total ? `${firstTry} réussite(s) du premier coup sur ${total}` : '', msgP, ...lines].filter(Boolean),
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
  /* Trouver l'option qui ressemble le plus à ce qui a été dit */
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  Z.optionDite = (textes, options) => {
    let best = null, score = 0;
    for (const t of [].concat(textes)) {
      const d = norm(t); if (!d) continue;
      options.forEach(o => {
        const n = norm(o.t); let s = 0;
        if (n === d) s = 1000; else if (n.includes(d) || d.includes(n)) s = 500 + Math.min(n.length, d.length);
        else { const mots = new Set(d.split(' ').filter(w => w.length > 2)); s = n.split(' ').filter(w => mots.has(w)).length * 10; }
        if (s > score) { score = s; best = o; }
      });
    }
    return best;
  };
  MOTEURS.qcm = function (ctx, a) {
    const items = a.questions || [];
    if (Z.adapte('hpi') && !Z.adapte('tdah') && items.length > 1) return qcmToutDunCoup(ctx, a, items);
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
      const mic = Z.adapte('moteur') ? Z.micBtn((t) => { const o = Z.optionDite(t, opts); if (o && o.b) o.b.click(); else Z.pop('Je n’ai pas reconnu la réponse. Réessaie, ou touche-la 🙂', 'soft'); }) : null;
      opts.forEach((o, k) => { o.b = list.children[k]; });
      ctx.shell.root.append(h('div', { class: 'card' }, h('div', { style: { fontWeight: 700, fontSize: '1.1em' } }, it.q), Z.ear(it.q)), list, mic, after);
      say(it.q);
    };
    show();
  };
  /* HPI : toutes les questions d'un coup, dans l'ordre qu'on veut */
  function qcmToutDunCoup(ctx, a, items) {
    ctx.clear(0, 0);
    let restent = items.length;
    const fin = h('div', { class: 'col' });
    const blocs = items.map((it, n) => {
      let miss = 0;
      const opts = Z.shuffle(it.choix.map((c, k) => ({ t: c, ok: k === 0 })));
      const after = h('div', { class: 'col' });
      const list = h('div', { class: 'col' }, opts.map(o => {
        const b = h('button', { class: 'opt', onclick: () => {
          if (list.dataset.done || b.classList.contains('bad')) return;
          if (o.ok) {
            list.dataset.done = 1; b.classList.add('good'); Z.sfx.good(); ctx.ok(!miss);
            if (it.explication) after.append(h('div', { class: 'card rule' }, '✅ ', it.explication, Z.ear(it.explication)));
            if (--restent === 0) { say(okSay()); fin.append(ctx.next('Voir mon résultat ➡️', () => ctx.finish())); }
          } else { miss++; b.classList.add('bad'); Z.sfx.bad(); if (it.aide && miss === 1) after.append(h('div', { class: 'card' }, '💡 ', it.aide)); }
        } }, h('span', null, o.t), Z.ear(o.t));
        return b;
      }));
      return h('div', { class: 'col bloc-q' }, h('div', { class: 'card' }, h('b', null, `${n + 1}. `), h('span', { style: { fontWeight: 700 } }, it.q), Z.ear(it.q)), list, after);
    });
    ctx.shell.root.append(h('div', { class: 'hint center' }, `${items.length} questions, dans l’ordre que tu veux.`), ...blocs, fin);
  }

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
      /* 4 réponses : celles de la carte (choix, la 1re est la bonne), sinon on prend
         les réponses des autres cartes du paquet comme pièges. */
      const court = (v) => String(v).split(/\.\s|\. ?$/)[0].trim();
      const bonne = c.choix ? c.choix[0] : court(c.verso);
      let pieges = c.choix ? c.choix.slice(1) : Z.shuffle(all.filter(x => x !== c && court(x.verso) !== bonne).map(x => court(x.verso))).slice(0, 3);
      const opts = Z.shuffle([{ t: bonne, ok: true }].concat(pieges.map(t => ({ t, ok: false }))));
      let choisi = null;
      const verso = h('div', { class: 'card rule', style: { display: 'none' } });
      const suite = h('div', { class: 'col' });
      const choixEl = h('div', { class: 'col' }, opts.map(o => {
        const b = h('button', { class: 'opt', onclick: () => {
          if (choixEl.dataset.done) return;
          choixEl.querySelectorAll('.opt').forEach(x => x.style.outline = '');
          b.style.outline = '4px solid var(--gold)'; choisi = { o, b }; Z.sfx.tap();
          flip.disabled = false; aide.textContent = 'Maintenant, retourne la carte pour vérifier.';
        } }, h('span', null, o.t), Z.ear(o.t));
        o.b = b; return b;
      }));
      const aide = h('div', { class: 'hint center' }, 'Choisis la réponse qui te semble juste.');
      const flip = h('button', { class: 'btn purple wide', disabled: true, onclick: () => {
        if (!choisi) return;
        choixEl.dataset.done = 1; flip.remove(); aide.remove();
        choisi.b.style.outline = '';
        const juste = choisi.o.ok;
        opts.find(o => o.ok).b.classList.add('good');
        if (!juste) { choisi.b.classList.add('bad'); Z.sfx.bad(); } else Z.sfx.good();
        Z.srsUpdate(st, c.key, juste); ctx.ok(juste); Z.save();
        const reste = String(c.verso).startsWith(bonne) ? String(c.verso).slice(bonne.length).replace(/^[.\s]+/, '') : String(c.verso);
        const plus = reste ? ' ' + reste : '';
        const t = juste ? '✅ ' + okSay() + ' ' + c.verso : `❌ Pas tout à fait. La bonne réponse : ${bonne}.${plus}`;
        verso.append(h('span', null, t), Z.ear(t)); verso.style.display = '';
        say(t.replace(/^[✅❌]\s/, ''));
        suite.append(ctx.next('Carte suivante ➡️', () => { i++; show(); }));
      } }, '🔄 Retourner la carte');
      ctx.shell.root.append(h('div', { class: 'card center', style: { minHeight: '100px', fontSize: '1.2em', fontWeight: 700, display: 'grid', placeItems: 'center' } }, c.recto), Z.ear(c.recto), choixEl, aide, flip, verso, suite);
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
      const pad = h('div', { class: 'pad', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } }, ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '⌫'].map(key));
      const mic = Z.adapte('moteur') ? Z.micBtn((t) => { const n = Z.nombreDit(t); if (n === null) { Z.pop('Je n’ai pas entendu de nombre. Réessaie 🙂', 'soft'); return; } val = String(n).replace('.', ','); upd(); say(val); }, '🎤 Dire le nombre') : null;
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
        it.figure ? Z.svg(figure(it.figure), 'card') : null, screen, pad, mic, valider, after);
      say(it.q);
    };
    show();
  };

  /* ---------- Opération posée, case par case ----------
     { type: 'posee', operations: [ { a: 347, b: 158, op: '+' }, { a: 503, b: 128, op: '-' },
       { a: 46, b: 7, op: '×' }, { a: 34, b: 12, op: '×' } ] }
     L'élève remplit le résultat de droite à gauche. Les retenues s'écrivent
     toutes seules, en rouge, comme sur le cahier. Une erreur → l'explication
     du calcul de la colonne ; 2 erreurs → le chiffre est écrit pour lui.
     Avec « dyscalculie », l'explication est affichée avant chaque case. */
  const dig = (n, i) => Math.floor(n / Math.pow(10, i)) % 10;
  const len = (n) => String(n).length;
  function planPosee(o) {
    const op = { '-': '−', '−': '−', x: '×', '*': '×', '×': '×' }[o.op] || '+';
    let A = Math.round(o.a), B = Math.round(o.b);
    if (op === '−' && B > A) [A, B] = [B, A];
    const lignes = [], marques = [];      // lignes à remplir ; marques = retenues {ligne, col, t, ou}
    const addition = (termes, total, ligne) => {
      const cases = []; let r = 0;
      for (let i = 0; i < len(total); i++) {
        const ds = termes.map(t => t.decal <= i ? dig(t.n, i - t.decal) : null).filter((d, k) => d !== null && (i - termes[k].decal) < len(termes[k].n));
        const s = ds.reduce((x, y) => x + y, 0) + r;
        const txt = ds.length ? ds.join(' + ') + (r ? ` + ${r} (la retenue)` : '') : `${r} (la retenue)`;
        const ecrit = s % 10, ret = Math.floor(s / 10);
        cases.push({ col: i, val: ecrit, aide: ds.length + (r ? 1 : 0) > 1 ? `${txt} = ${s}. ${s >= 10 && i < len(total) - 1 ? `J’écris ${ecrit} et je retiens ${ret}.` : `J’écris ${s}.`}` : `Je descends le ${s}.`,
          retenue: ret && i < len(total) - 1 ? { col: i + 1, t: String(ret) } : null });
        r = ret;
      }
      lignes.push({ n: total, cases, ligne });
    };
    if (op === '+') addition([{ n: A, decal: 0 }, { n: B, decal: 0 }], A + B, 'res');
    else if (op === '−') {
      const cases = []; let emprunt = 0; const R = A - B;
      for (let i = 0; i < len(A); i++) {
        const haut = dig(A, i), bas = (i < len(B) ? dig(B, i) : 0) + emprunt;
        if (i >= len(R) && haut - bas === 0 && i === len(A) - 1) break;
        let txt, ret = 0, v;
        if (haut >= bas) { v = haut - bas; txt = emprunt ? `${haut} − (${bas - emprunt} + 1 de retenue) = ${haut} − ${bas} = ${v}.` : `${haut} − ${bas} = ${v}.`; }
        else { v = haut + 10 - bas; ret = 1; txt = `${haut} − ${bas} : c’est impossible. Je mets une retenue : ${haut + 10} − ${bas} = ${v}. J’ajoute 1 en bas, dans la colonne de gauche.`; }
        cases.push({ col: i, val: v, aide: txt, retenue: ret ? { col: i, t: '1', ou: 'haut' } : null, retenue2: ret ? { col: i + 1, t: '+1', ou: 'bas' } : null });
        emprunt = ret;
      }
      while (cases.length > len(R) && cases[cases.length - 1].val === 0) cases.pop();
      lignes.push({ n: R, cases, ligne: 'res' });
    } else {
      const chiffres = String(B).split('').reverse().map(Number);
      const partiels = chiffres.map((m, k) => ({ m, n: A * m * Math.pow(10, k), decal: k }));
      partiels.forEach(p => {
        const cases = []; let r = 0;
        for (let j = 0; j < len(A); j++) {
          const pr = dig(A, j) * p.m + r, ecrit = j === len(A) - 1 ? pr : pr % 10, ret = Math.floor(pr / 10);
          const dernier = j === len(A) - 1;
          if (dernier && pr >= 10) {
            cases.push({ col: j + p.decal, val: pr % 10, aide: `${p.m} × ${dig(A, j)}${r ? ` + ${r} (la retenue)` : ''} = ${pr}. J’écris ${pr % 10}…`, retenue: null });
            cases.push({ col: j + 1 + p.decal, val: Math.floor(pr / 10), aide: `…et j’écris ${Math.floor(pr / 10)} devant : ${pr}.`, retenue: null });
          } else cases.push({ col: j + p.decal, val: dernier ? ecrit : pr % 10, aide: `${p.m} × ${dig(A, j)}${r ? ` + ${r} (la retenue)` : ''} = ${pr}.${!dernier && ret ? ` J’écris ${pr % 10} et je retiens ${ret}.` : ''}`, retenue: !dernier && ret ? { col: j + 1 + p.decal, t: String(ret) } : null });
          r = ret;
        }
        if (p.m === 0) cases.forEach(c => { c.val = 0; c.aide = `${p.m} × ${'n’importe quel chiffre'} = 0.`; c.retenue = null; });
        while (cases.length > 1 && cases[cases.length - 1].val === 0 && p.m === 0) cases.pop();
        lignes.push({ n: p.n, cases, ligne: 'p', zeros: p.decal, m: p.m });
      });
      if (partiels.length > 1) addition(partiels.map(p => ({ n: p.n / Math.pow(10, p.decal), decal: p.decal })), A * B, 'res');
    }
    const res = op === '+' ? A + B : op === '−' ? A - B : A * B;
    const W = Math.max(len(A), len(B), ...lignes.map(l => len(l.n)), ...lignes.map(l => (l.cases[l.cases.length - 1] || { col: 0 }).col + 1)) + 1;
    return { A, B, op, lignes, W, res };
  }
  MOTEURS.posee = function (ctx, a) {
    const items = a.operations || [];
    let i = 0;
    const guide = Z.adapte('dyscalculie') || a.guide;
    const show = () => {
      if (i >= items.length) return ctx.finish();
      const P = planPosee(items[i]);
      ctx.clear(i, items.length);
      const W = P.W;
      const grille = h('div', { class: 'posee', style: { gridTemplateColumns: `repeat(${W}, var(--case))` } });
      const cellule = (cls, txt = '') => h('div', { class: 'pz ' + cls }, txt);
      const ligneChiffres = (n, signe, cls = '') => {
        const s = String(n), out = [];
        for (let c = W - 1; c >= 0; c--) {
          const k = s.length - 1 - c;
          out.push(cellule('fixe ' + cls, c === W - 1 && signe ? signe : k >= 0 && c < s.length ? s[s.length - 1 - c] : ''));
        }
        return out;
      };
      /* rangée des retenues (au-dessus), puis A, puis B avec le signe */
      const hautRet = [...Array(W)].map(() => cellule('ret'));
      const ligA = ligneChiffres(P.A, ''), ligB = ligneChiffres(P.B, P.op);
      const basRet = [...Array(W)].map(() => cellule('ret bas'));
      grille.append(...hautRet, ...ligA, ...basRet, ...ligB);
      /* les lignes à remplir */
      const trait = () => [...Array(W)].map(() => cellule('trait'));
      const vides = [];
      P.lignes.forEach((l, li) => {
        if (li === 0 || l.ligne === 'res') grille.append(...trait());
        const row = [...Array(W)].map((_, k) => cellule('vide'));
        const parCol = {};
        l.cases.forEach(c => { parCol[c.col] = c; });
        for (let c = 0; c < (l.zeros || 0); c++) { row[W - 1 - c].className = 'pz zero'; row[W - 1 - c].textContent = '0'; }
        if (l.ligne === 'p' && P.lignes.length > 1 && l.zeros) row[0].textContent = '';
        l.cases.forEach(c => { row[W - 1 - c.col].className = 'pz case'; vides.push({ el: row[W - 1 - c.col], c, li }); });
        grille.append(...row);
      });
      let k = 0, miss = 0, total = 0;
      const aideEl = h('div', { class: 'card aide-posee' });
      const montrerAide = (force) => {
        const v = vides[k]; aideEl.innerHTML = '';
        if (!v) return;
        if (guide || force) { aideEl.append('💡 ', h('span', null, v.c.aide), Z.ear(v.c.aide)); aideEl.style.display = ''; }
        else aideEl.style.display = 'none';
      };
      const active = () => {
        vides.forEach((v, n) => v.el.classList.toggle('cur', n === k));
        /* les retenues de la multiplication changent à chaque ligne : on efface celles d'avant */
        if (k > 0 && vides[k] && vides[k - 1] && vides[k].li !== vides[k - 1].li) { hautRet.forEach(x => { x.textContent = ''; }); }
        montrerAide(false);
      };
      const poser = (d) => {
        const v = vides[k]; if (!v) return;
        if (d === v.c.val) {
          Z.sfx.good(); v.el.textContent = String(d); v.el.classList.remove('cur'); v.el.classList.add('ok');
          if (v.c.retenue) { const t = v.c.retenue; const cell = t.ou === 'haut' ? ligA[W - 1 - t.col] : hautRet[W - 1 - t.col]; if (t.ou === 'haut') cell.dataset.ret = t.t; else cell.textContent = t.t; }
          if (v.c.retenue2) basRet[W - 1 - v.c.retenue2.col].textContent = v.c.retenue2.t;
          k++; miss = 0;
          if (k >= vides.length) return fini();
          active();
        } else {
          Z.sfx.bad(); miss++; total++;
          v.el.classList.add('shake'); setTimeout(() => v.el.classList.remove('shake'), 500);
          montrerAide(true); say((miss >= 2 ? 'Regarde : ' : retrySay() + ' ') + v.c.aide);
          if (miss >= 2) setTimeout(() => poser(v.c.val), 900);
        }
      };
      const fini = () => {
        ctx.ok(total === 0); pad.remove(); if (mic) mic.remove(); aideEl.style.display = 'none';
        const t = `${okSay()} ${P.A} ${P.op} ${P.B} = ${P.res}.`;
        after.append(h('div', { class: 'card rule' }, '✅ ', t, Z.ear(t)), ctx.next(null, () => { i++; show(); }));
        say(t);
      };
      const pad = h('div', { class: 'pad', style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' } },
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => h('button', { class: 'tile small', style: { minWidth: '0' }, onclick: () => { Z.sfx.click(); poser(d); } }, String(d))));
      const mic = Z.adapte('moteur') ? Z.micBtn((t) => { const n = Z.nombreDit(t); if (n === null || n < 0 || n > 9) { Z.pop('Dis un seul chiffre, de 0 à 9 🙂', 'soft'); return; } poser(n); }, '🎤 Dire le chiffre') : null;
      const after = h('div', { class: 'col' });
      const q = `${P.A} ${P.op} ${P.B}`;
      ctx.shell.root.append(h('div', { class: 'card center' }, h('b', { style: { fontSize: '1.3em' } }, q), Z.ear(q.replace('−', 'moins').replace('×', 'fois').replace('+', 'plus'))),
        h('div', { class: 'card center posee-zone' }, grille), aideEl, pad, mic,
        guide ? null : h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); montrerAide(true); say(vides[k] ? vides[k].c.aide : ''); } }, '💡 Comment on fait ?'), after);
      active();
    };
    show();
  };
  Z.planPosee = planPosee;

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
        ta, Z.micBtn((t) => { const x = t[0].trim(); if (!x) return; const phrase = x.charAt(0).toUpperCase() + x.slice(1) + (/[.!?…]$/.test(x) ? '' : '.');
          ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + phrase; store[i] = ta.value; Z.save(); }, '🎤 Dicter une phrase'),
        h('button', { class: 'btn ghost wide', onclick: () => say(ta.value || 'Tu n\'as encore rien écrit.') }, '🔊 Écouter ce que j\'ai écrit'),
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
