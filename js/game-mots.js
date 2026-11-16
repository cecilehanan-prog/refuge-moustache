/* =========================================================
   JEU 1 — LE GARAGE DES MOTS (orthographe)
   ---------------------------------------------------------
   Ce que la recherche dit, et comment c'est appliqué ici :
   • Cartographie orthographique (Ehri) : on relie les SONS aux LETTRES,
     syllabe par syllabe → syllabes colorées + "partie piège" surlignée.
   • Multisensoriel : écouter + voir + taper le tambour (rythme syllabique).
   • Morphologie : les lettres muettes s'expliquent par la famille du mot
     (grand → grande). Efficace surtout chez les élèves les plus en difficulté.
   • Récupération active + répétition espacée : on reconstruit le mot de
     mémoire, puis on le revoit à J+1, J+3, J+7, J+16.
   • On évite de montrer des listes de fautes : un seul piège ciblé à la fois.
   ========================================================= */
(function () {
  const h = Z.h;
  let scr = 0;                       // identifiant d'écran (coupe les voix en cours)
  const say = async (...texts) => { const me = ++scr; for (const t of texts) { if (me !== scr) return; await Z.speak(t); } };
  const sayRate = async (t, rate) => { ++scr; await Z.speak(t, { rate }); };

  /* Cache le mot dans la phrase exemple (mot entier seulement : "lent" mais pas "lente") */
  const blank = (ph, word) => {
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return ph.replace(new RegExp('(^|[^a-zà-ÿ])' + esc + '(?![a-zà-ÿ])', 'i'), '$1…');
  };

  /* Le mot a-t-il une partie piège (jaune) ? une lettre muette (grise) ? */
  const kinds = (p) => ({
    trick: p.syl.some(x => x.segs.some(sg => sg.k === 'trick')),
    mute: p.syl.some(x => x.segs.some(sg => sg.k === 'mute')),
    muteCount: p.syl.reduce((n, x) => n + x.segs.filter(sg => sg.k === 'mute').length, 0)
  });
  const lookAt = (p) => {
    const k = kinds(p);
    if (k.trick && k.mute) return 'surtout la partie jaune et la lettre grise qui ne se prononce pas';
    if (k.trick) return 'surtout la partie jaune';
    if (k.mute) return k.muteCount > 1 ? 'surtout les lettres grises, celles qu\'on n\'entend pas' : 'surtout la lettre grise, celle qu\'on n\'entend pas';
    return 'syllabe par syllabe';
  };

  /* src = { rid, aid } quand le jeu sert une activité « orthographe » de contenu.js */
  Z.screens.mots = function (src) { start(src); };

  function buildSession(src) {
    const st = Z.state, all = src ? Z.motsActivite(src) : Z.allWords();
    const rec = (w) => st.words[w.id];
    const due = all.filter(w => rec(w) && Z.isDue(rec(w))).sort((a, b) => rec(a).box - rec(b).box);
    const fresh = all.filter(w => !rec(w)).sort((a, b) => (b.prio ? 1 : 0) - (a.prio ? 1 : 0));
    let list = due.slice(0, 3);
    list = list.concat(fresh.slice(0, 5 - list.length));
    if (list.length < 5) list = list.concat(due.slice(3, 3 + 5 - list.length));
    if (list.length < 3) {
      const rest = all.filter(w => !list.includes(w)).sort((a, b) => ((rec(a) || {}).box || 0) - ((rec(b) || {}).box || 0));
      list = list.concat(rest.slice(0, 5 - list.length));
    }
    return list;
  }

  function start(src) {
    const shell = Z.shell({ title: Z.titre('mots') });
    const list = buildSession(src);
    const results = [];
    let i = 0;

    const intro = () => {
      shell.clear(); shell.setSteps(list.length, 0);
      const t = `Coucou, moi c'est ${Z.guide('mots').nom} ! Bienvenue dans ${Z.titre('mots').replace(/^Le /, 'le ').replace(/^La /, 'la ').replace(/^Les /, 'les ')}. Aujourd'hui, on répare ${list.length} mots ensemble. Chaque mot réparé te fait gagner des éclairs.`;
      shell.root.append(
        h('h2', null, '🔤 ' + Z.titre('mots')),
        Z.guideSays(t, { speak: false }),
        h('div', { class: 'card center' }, h('div', { class: 'emoji-big' }, list.map(w => Array.from(w.e)[0]).join(' '))),
        h('button', { class: 'btn green wide', onclick: () => { Z.sfx.vroum(); nextWord(); } }, '🔧 On commence !'));
      say(t);
    };

    const nextWord = () => {
      if (i >= list.length) return finish();
      const w = list[i], p = Z.parseWord(w.s), rec = Z.state.words[w.id];
      shell.setSteps(list.length, i);
      const done = (ok) => {
        Z.srsUpdate(Z.state.words, w.id, ok); Z.save();
        results.push(ok);
        const gain = ok ? 4 : 2;
        Z.state.eclairs += gain; Z.save();
        Z.sfx.coin(); Z.pop(`+${gain} ⚡`, 'gold');
        const bolt = document.getElementById('bolt'); if (bolt) bolt.textContent = Z.state.eclairs;
        i++; setTimeout(nextWord, 700);
      };
      if (!rec) {
        // Nouveau mot : découverte complète
        const chain = [discover, drum];
        if (w.family) chain.push(family);
        chain.push(photo);
        runChain(chain, w, p, shell, () => rebuild(w, p, shell, { model: false }, done));
      } else if (rec.box >= 3) {
        letters(w, p, shell, done);
      } else {
        rebuild(w, p, shell, { model: false }, (ok) => {
          if (ok) return done(true);
          photo(w, p, shell, () => done(false));
        });
      }
    };

    const finish = () => {
      const perfect = results.filter(Boolean).length;
      const medal = perfect === results.length ? '🥇' : perfect >= results.length / 2 ? '🥈' : '🥉';
      Z.endScreen(shell, {
        medal, kind: 'mots', eclairs: 10, xp: 15 + perfect * 5,
        title: perfect === results.length ? 'Sans aucune faute !' : 'Mots réparés !',
        lines: [`${perfect} mot(s) du premier coup sur ${results.length}`, 'Les mots reviendront plus tard pour bien les ranger dans ta tête 🧠'],
        detail: list.map(w => w.id).join(','),
        again: () => src ? Z.go('activite', src.rid, src.aid) : Z.go('mots')
      });
    };

    intro();
  }

  function runChain(chain, w, p, shell, end) {
    let k = 0;
    const step = () => { if (k >= chain.length) return end(); chain[k++](w, p, shell, step); };
    step();
  }

  /* --- 1. Découverte : voir, entendre, comprendre le piège --- */
  function discover(w, p, shell, next) {
    shell.clear();
    const word = p.word;
    shell.root.append(
      h('h2', null, '👀 Nouveau mot !'),
      h('div', { class: 'card center col' },
        h('div', { class: 'emoji-big' }, w.e),
        h('div', null, Z.wordEl(p, { big: true })),
        h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(() => word, { rate: 0.7 })),
        h('div', { class: 'row' }, h('span', { class: 'grow' }, w.ph), Z.ear(w.ph))),
      w.hint ? Z.guideSays(w.hint, { speak: false }) : null,
      h('div', { class: 'hint center' }, ['Bleu, rouge : les syllabes.', kinds(p).trick ? 'Jaune : le piège.' : '', kinds(p).mute ? 'Gris : la lettre muette.' : ''].filter(Boolean).join(' ')),
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); next(); } }, 'J\'ai compris ➡️'));
    (async () => { await sayRate(word, 0.7); await Z.wait(250); say(w.ph, w.hint || ''); })();
  }

  /* --- 2. Tambour : une frappe = une syllabe (conscience phonologique + rythme) --- */
  function drum(w, p, shell, next) {
    shell.clear();
    let n = 0;
    const total = p.syl.length;
    const slots = p.syl.map((s, idx) => h('span', { class: 'slot', style: { opacity: .5 } }, '?'));
    const goBtn = h('button', { class: 'btn green wide', disabled: true, onclick: () => { Z.sfx.tap(); next(); } }, 'Suivant ➡️');
    const info = h('div', { class: 'center', style: { fontWeight: 700, minHeight: '1.6em' } }, '');
    const t = 'Tape sur le tambour pour chaque syllabe du mot.';
    shell.root.append(
      h('h2', null, '🥁 Le tambour des syllabes'),
      Z.guideSays(t, { speak: false }),
      h('div', { class: 'slots' }, slots),
      h('button', {
        class: 'drum', 'aria-label': 'Tambour', onclick: () => {
          if (n >= total) { Z.sfx.drum(); return; }
          Z.sfx.drum();
          const s = p.syl[n];
          slots[n].textContent = s.text; slots[n].className = 'slot filled s' + (n % 2); slots[n].style.opacity = 1;
          n++;
          if (n === total) {
            info.textContent = `${total} syllabe${total > 1 ? 's' : ''} ! Bravo !`;
            goBtn.disabled = false;
            setTimeout(() => { Z.sfx.good(); say(p.word, `${total} syllabe${total > 1 ? 's' : ''} !`); }, 250);
          }
        }
      }, '🥁'),
      info, goBtn);
    say(t, p.word);
  }

  /* --- 3. Famille de mots : la lettre muette s'entend ailleurs --- */
  function family(w, p, shell, next) {
    shell.clear();
    const fw = w.family.w;
    const base = p.word;
    // met en évidence la lettre qui "réapparaît"
    const extra = fw.slice(base.length - 1);
    shell.root.append(
      h('h2', null, '🔎 Le détecteur de lettre muette'),
      h('div', { class: 'card center col' },
        h('div', null, Z.wordEl(p, { big: true })),
        h('div', { style: { fontSize: '2.4em' } }, '⬇️'),
        h('div', { class: 'word big' }, h('span', { class: 'syl s0' }, fw.slice(0, base.length - 1)), h('span', { class: 'seg-trick syl s1' }, extra))),
      Z.guideSays(w.family.say, { speak: false, mood: 'think' }),
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); next(); } }, 'Trop malin ! ➡️'));
    say(w.family.say);
  }

  /* --- 4. Photo mentale : on fixe l'image du mot, puis il disparaît --- */
  function photo(w, p, shell, next) {
    shell.clear();
    const wEl = Z.wordEl(p, { big: true });
    const goBtn = h('button', { class: 'btn green wide', style: { display: 'none' }, onclick: () => { Z.sfx.tap(); next(); } }, 'Je l\'ai dans ma tête ➡️');
    const again = h('button', { class: 'btn ghost wide', style: { display: 'none' }, onclick: () => { Z.sfx.tap(); wEl.classList.remove('hidden'); camBtn.style.display = ''; goBtn.style.display = 'none'; again.style.display = 'none'; } }, '👀 Revoir le mot');
    const t = `Regarde bien le mot, ${lookAt(p)}. Puis prends-le en photo dans ta tête !`;
    const camBtn = h('button', {
      class: 'btn purple wide', onclick: () => {
        Z.sfx.camera();
        document.body.appendChild(Object.assign(document.createElement('div'), { className: 'flash' }));
        setTimeout(() => document.querySelector('.flash') && document.querySelector('.flash').remove(), 600);
        wEl.classList.add('hidden');
        camBtn.style.display = 'none'; goBtn.style.display = ''; again.style.display = '';
        say('Clic ! Ferme les yeux. Tu vois le mot dans ta tête ? Épelle-le doucement.');
      }
    }, '📸 Prendre la photo');
    shell.root.append(
      h('h2', null, '📸 Photo dans ta tête'),
      Z.guideSays(t, { speak: false }),
      h('div', { class: 'card center col' }, h('div', { class: 'emoji-big' }, w.e), h('div', null, wEl)),
      camBtn, goBtn, again);
    say(t);
  }

  /* Morceaux à assembler : syllabes, ou petits morceaux si le mot n'a qu'une syllabe */
  function unitsOf(p) {
    if (p.syl.length >= 2) return p.syl.map(s => ({ text: s.text, segs: s.segs }));
    return p.syl[0].segs.map(sg => ({ text: sg.t, segs: [sg] }));
  }
  const MUTES = ['s', 't', 'd', 'p', 'x', 'e'];
  function distractorOf(units) {
    const texts = units.map(u => u.text);
    // 1) graphie voisine du "piège"
    for (const u of units) for (const sg of u.segs) if (sg.k === 'trick') {
      const alts = ZDATA.alts[sg.t.toLowerCase()] || [];
      for (const a of Z.shuffle(alts)) {
        const v = u.segs.length === 1 ? a : u.segs.map(x => x === sg ? a : x.t).join('');
        if (v && !texts.includes(v)) return v;
      }
    }
    // 2) lettre muette oubliée ou changée
    for (const u of units) for (const sg of u.segs) if (sg.k === 'mute') {
      if (u.segs.length === 1) { const m = Z.shuffle(MUTES).find(x => x !== sg.t && !texts.includes(x)); if (m) return m; }
      const v = u.segs.filter(x => x !== sg).map(x => x.t).join('');
      if (v && !texts.includes(v)) return v;
    }
    // 3) une syllabe d'un autre mot
    const others = Z.allWords().flatMap(w => Z.parseWord(w.s).syl.map(s => s.text)).filter(t => !texts.includes(t));
    return Z.pick(others);
  }

  /* --- 5. Reconstruction de mémoire (récupération active) --- */
  function rebuild(w, p, shell, { model }, done) {
    shell.clear();
    const units = unitsOf(p);
    const pieces = Z.shuffle(units.map(u => u.text).concat([distractorOf(units)]));
    let pos = 0, errors = 0, errHere = 0;
    const sylIndexOfUnit = (k) => p.syl.length >= 2 ? k : 0;
    const slots = units.map(() => h('span', { class: 'slot' }, ''));
    slots[0].classList.add('next');
    const tileEls = [];
    const t = 'Reconstruis le mot avec les bons morceaux. Attention, un morceau est un piège !';
    const tiles = h('div', { class: 'tiles' }, pieces.map(txt => {
      const b = h('button', {
        class: 'tile', onclick: () => {
          if (pos >= units.length) return;
          if (txt === units[pos].text) {
            Z.sfx.click();
            slots[pos].textContent = txt;
            slots[pos].className = 'slot filled s' + (sylIndexOfUnit(pos) % 2);
            b.classList.add('used');
            pos++; errHere = 0;
            if (pos < units.length) slots[pos].classList.add('next');
            else complete();
          } else {
            errors++; errHere++;
            Z.sfx.bad();
            b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
            if (errHere === 1) say(Z.pick(ZDATA.retry));
            if (errHere >= 2) {
              const good = tileEls.find(x => x.t === units[pos].text && !x.b.classList.contains('used'));
              if (good) { good.b.classList.remove('glow'); void good.b.offsetWidth; good.b.classList.add('glow'); }
              say(w.hint || 'Écoute bien le mot.');
            }
          }
        }
      }, txt);
      tileEls.push({ t: txt, b });
      return b;
    }));
    const result = h('div', { class: 'center' });
    shell.root.append(
      h('h2', null, '🔧 Répare le mot !'),
      h('div', { class: 'card col' },
        h('div', { class: 'row' }, h('div', { class: 'emoji-big grow' }, w.e), Z.ear(() => p.word, { rate: 0.75 })),
        h('div', { class: 'row' }, h('span', { class: 'grow hint' }, blank(w.ph, p.word)), Z.ear(w.ph))),
      h('div', { class: 'slots' }, slots),
      tiles, result);
    say(t, p.word);

    function complete() {
      Z.sfx.good();
      tiles.style.display = 'none';
      result.append(h('div', { class: 'card col center' },
        h('div', null, Z.wordEl(p, { big: true })),
        h('div', { style: { fontWeight: 700, color: 'var(--green)' } }, errors === 0 ? '⭐ Du premier coup ! ⭐' : '✅ Réparé !')));
      if (errors === 0) Z.confetti(60);
      say(errors === 0 ? Z.pick(ZDATA.praise) : 'Bien joué, tu as trouvé !', p.word);
      setTimeout(() => result.append(h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); done(errors === 0); } }, 'Mot suivant ➡️')), 600);
    }
  }

  /* --- 6. Défi expert : écrire le mot lettre par lettre (mots déjà bien connus) --- */
  const CONFUS = { b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'm', é: 'è', è: 'é', s: 'z', z: 's', u: 'n', f: 't', a: 'o', o: 'a', e: 'é', i: 'l', l: 'i', t: 'f', c: 's', r: 'n', g: 'j', j: 'g', h: 'n', v: 'f', ô: 'o', à: 'a' };
  function letters(w, p, shell, done) {
    shell.clear();
    const chars = [];
    p.syl.forEach((s, si) => [...s.text].forEach(ch => chars.push({ ch, si })));
    const typed = chars.filter(c => c.ch !== "'" && c.ch !== ' ');
    const extra = [];
    for (const c of Z.shuffle(typed)) { const x = CONFUS[c.ch.toLowerCase()]; if (x && !extra.includes(x)) extra.push(x); if (extra.length >= 2) break; }
    const pool = Z.shuffle(typed.map(c => c.ch).concat(extra));
    let pos = 0, errors = 0, errHere = 0;
    const slotEls = chars.map(c => (c.ch === "'" || c.ch === ' ') ? h('span', { class: 'slot small filled' }, c.ch === ' ' ? '·' : "'") : h('span', { class: 'slot small' }, ''));
    const idxTyped = chars.map((c, k) => k).filter(k => chars[k].ch !== "'" && chars[k].ch !== ' ');
    slotEls[idxTyped[0]].classList.add('next');
    const tileEls = [];
    const t = 'Défi expert ! Écris le mot lettre par lettre.';
    const result = h('div', { class: 'center' });
    const tiles = h('div', { class: 'tiles' }, pool.map(ch => {
      const b = h('button', {
        class: 'tile small', onclick: () => {
          if (pos >= idxTyped.length) return;
          const k = idxTyped[pos];
          if (ch === chars[k].ch) {
            Z.sfx.click();
            slotEls[k].textContent = ch; slotEls[k].className = 'slot small filled s' + (chars[k].si % 2);
            b.classList.add('used'); pos++; errHere = 0;
            if (pos < idxTyped.length) slotEls[idxTyped[pos]].classList.add('next'); else complete();
          } else {
            errors++; errHere++; Z.sfx.bad();
            b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
            if (errHere >= 2) {
              const g = tileEls.find(x => x.ch === chars[k].ch && !x.b.classList.contains('used'));
              if (g) { g.b.classList.remove('glow'); void g.b.offsetWidth; g.b.classList.add('glow'); }
            }
          }
        }
      }, ch);
      tileEls.push({ ch, b });
      return b;
    }));
    shell.root.append(
      h('h2', null, '🏆 Défi expert'),
      h('div', { class: 'card col' },
        h('div', { class: 'row' }, h('div', { class: 'emoji-big grow' }, w.e), Z.ear(() => p.word, { rate: 0.75 })),
        h('div', { class: 'row' }, h('span', { class: 'grow hint' }, blank(w.ph, p.word)), Z.ear(w.ph))),
      h('div', { class: 'slots' }, slotEls),
      tiles, result);
    say(t, p.word);
    function complete() {
      Z.sfx.good(); tiles.style.display = 'none';
      if (errors === 0) Z.confetti(80);
      result.append(h('div', { class: 'card col center' }, h('div', null, Z.wordEl(p, { big: true })),
        h('div', { style: { fontWeight: 700, color: 'var(--green)' } }, errors === 0 ? '🏆 Expert ! Parfait !' : '✅ Bien écrit !')));
      say(errors === 0 ? 'Parfait, tu es un expert !' : 'Bravo, tu l\'as écrit !', p.word);
      setTimeout(() => result.append(h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); done(errors <= 1); } }, 'Mot suivant ➡️')), 600);
    }
  }
})();
