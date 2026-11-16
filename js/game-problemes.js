/* =========================================================
   JEU 3 — LES ENQUÊTES (résolution de problèmes)
   ---------------------------------------------------------
   Objectif : casser le réflexe "je vais trop vite".
   • Enseignement par schémas (Schema-Based Instruction, Jitendra) :
     reconnaître le TYPE de problème (parties-tout, comparaison, groupes
     égaux, partage). Méta-analyses : pratique fondée sur des preuves.
   • Modélisation en barres (méthode de Singapour), recommandée par les
     programmes de mathématiques 2025 du cycle 3.
   • Lecture à voix haute phrase par phrase : la difficulté de décodage
     ne doit pas empêcher de RAISONNER.
   • Étapes obligatoires et ludiques : écouter → trouver la question →
     trier les nombres (dont un piège) → dessiner → choisir l'opération
     → calculer → vérifier que la réponse a du sens.
   ========================================================= */
(function () {
  const h = Z.h;
  const STEPS = 7;

  Z.screens.problemes = function () { start(); };

  /* Découpe le texte : phrases + nombres {12} (utile) / {3!} (piège) */
  function parse(pb) {
    const txt = pb.text.replace(/\{(\d+)!\}/g, '{$1#}');   // le "!" du piège ne coupe pas la phrase
    const sentences = txt.match(/[^.?!]+[.?!]/g).map(s => s.trim());
    return sentences.map(s => {
      const parts = []; const re = /\{(\d+)(#?)\}/g; let m, last = 0;
      while ((m = re.exec(s))) {
        if (m.index > last) parts.push({ t: s.slice(last, m.index) });
        parts.push({ n: Number(m[1]), trap: m[2] === '#' });
        last = re.lastIndex;
      }
      if (last < s.length) parts.push({ t: s.slice(last) });
      return { parts, plain: s.replace(/\{(\d+)#?\}/g, '$1'), isQ: s.endsWith('?') };
    });
  }

  const SCHEMA_NAMES = {
    parties: 'Le tout et ses parties',
    comparaison: 'On compare deux choses',
    groupes: 'Des paquets tous pareils',
    partage: 'On partage en parts égales'
  };
  const SCHEMA_SAY = {
    parties: "Le tout et ses parties : on assemble ou on enlève un morceau.",
    comparaison: "On compare : l'un a plus, l'autre a moins. On cherche l'écart ou l'un des deux.",
    groupes: "Des paquets tous pareils : on répète plusieurs fois la même quantité.",
    partage: "On partage : on coupe un tout en parts égales."
  };

  /* Dessin en barres. vals = étiquettes (nombre ou "?") */
  function schemaSVG(type, pb) {
    const W = 320, H = 120, q = '?';
    const box = (x, y, w, hh, fill, label) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="8" fill="${fill}" stroke="#1f2937" stroke-width="2.5"/>` +
      (label !== undefined ? `<text x="${x + w / 2}" y="${y + hh / 2 + 7}" font-size="20" font-weight="700" text-anchor="middle" font-family="Andika, Verdana" fill="#1f2937">${label}</text>` : '');
    const brace = (x1, x2, y, label) => `<path d="M${x1} ${y} q0 -10 10 -10 H${x2 - 10} q10 0 10 10" stroke="#7c3aed" stroke-width="3" fill="none"/>` +
      (label !== undefined ? `<text x="${(x1 + x2) / 2}" y="${y - 16}" font-size="20" font-weight="700" text-anchor="middle" font-family="Andika, Verdana" fill="#7c3aed">${label}</text>` : '');
    let s = '';
    const L = pb ? labels(type, pb) : {};
    if (type === 'parties') {
      s += brace(10, 310, 40, L.tout);
      s += box(10, 50, 170, 50, '#bfdbfe', L.p1) + box(180, 50, 130, 50, '#fed7aa', L.p2);
    } else if (type === 'comparaison') {
      s += box(10, 14, 280, 40, '#bfdbfe', L.big);
      s += box(10, 66, 170, 40, '#fed7aa', L.small);
      s += `<rect x="180" y="66" width="110" height="40" rx="8" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6 5"/>`;
      if (L.ecart !== undefined) s += `<text x="235" y="93" font-size="20" font-weight="700" text-anchor="middle" font-family="Andika, Verdana" fill="#7c3aed">${L.ecart}</text>`;
    } else {
      const n = 5, w = 300 / n;
      s += brace(10, 310, 40, L.tout);
      for (let i = 0; i < n; i++) s += box(10 + i * w, 50, w, 50, i % 2 ? '#bbf7d0' : '#a7f3d0', i === 0 ? L.part : (i === n - 1 && L.count !== undefined ? '…' : undefined));
      if (L.count !== undefined) s += `<text x="160" y="118" font-size="16" font-weight="700" text-anchor="middle" font-family="Andika, Verdana" fill="#047857">${L.count}</text>`;
    }
    return `<svg viewBox="0 0 ${W} ${H + 8}" class="schema-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }
  function labels(type, pb) {
    const q = '?';
    if (type === 'parties') return pb.unknown === 'tout' ? { tout: q, p1: pb.a, p2: pb.b } : { tout: pb.a, p1: pb.b, p2: q };
    if (type === 'comparaison') return pb.unknown === 'ecart' ? { big: pb.a, small: pb.b, ecart: q } : { big: q, small: pb.a, ecart: pb.b };
    if (type === 'groupes') return { tout: q, part: pb.b, count: `${pb.a} paquets` };
    if (type === 'partage') return { tout: pb.a, part: q, count: `${pb.b} parts` };
    return {};
  }

  function pickProblem() {
    const done = Z.state.probs;
    const todo = ZDATA.problems.filter(p => !done[p.id]);
    if (todo.length) return todo[0];
    return Z.pick(ZDATA.problems.filter(p => p.id !== Z.state.lastProb) || ZDATA.problems);
  }

  function start() {
    const shell = Z.shell({ title: Z.titre('problemes') });
    const pb = pickProblem();
    Z.state.lastProb = pb.id;
    const sents = parse(pb);
    let clues = 0;        // indices trouvés (étapes réussies du premier coup)
    let slips = 0;

    const header = (title, step) => { shell.clear(); shell.setSteps(STEPS, step); shell.root.append(h('h2', null, title)); };

    /* Texte du problème, phrase par phrase */
    const textCard = (mode) => {
      const card = h('div', { class: 'card ptext' });
      sents.forEach((s, si) => {
        const line = h('span', { class: 'sent' + (s.isQ ? ' qsent' : ''), 'data-i': si });
        s.parts.forEach(p => {
          if (p.t !== undefined) line.appendChild(document.createTextNode(p.t));
          else line.appendChild(h('span', { class: 'num' + (mode === 'tap' ? ' tap' : ''), 'data-n': p.n, 'data-trap': p.trap ? 1 : 0 }, String(p.n)));
        });
        card.appendChild(line);
      });
      return card;
    };
    const readAloud = async (card) => {
      const me = Symbol(); readAloud.cur = me;
      for (let i = 0; i < sents.length; i++) {
        if (readAloud.cur !== me || !card.isConnected) return;
        card.querySelectorAll('.sent').forEach(e => e.classList.toggle('reading', Number(e.dataset.i) === i));
        await Z.speak(sents[i].plain, { rate: 0.95, natural: true });
      }
      card.querySelectorAll('.sent').forEach(e => e.classList.remove('reading'));
    };

    /* Étape 0 : écouter / lire */
    const s0 = () => {
      header(`${pb.e} Nouvelle enquête !`, 0);
      const card = textCard();
      const go = h('button', { class: 'btn purple wide', disabled: true, onclick: () => { Z.sfx.tap(); s1(); } }, '🕵️ J\'ai bien écouté');
      const who = null;
      shell.root.append(
        Z.guideSays('Un vrai détective ne court pas. Il écoute tout jusqu\'au bout.', { speak: false, mood: 'think' }),
        who,
        card,
        h('button', { class: 'btn ghost wide', onclick: async () => { Z.sfx.tap(); await readAloud(card); } }, '🔊 Réécouter'),
        go);
      (async () => {
        await Z.speak('Un vrai détective ne court pas. Il écoute tout jusqu\'au bout.');
        await readAloud(card);
        go.disabled = false;
      })();
      setTimeout(() => { go.disabled = false; }, 9000);
    };

    /* Étape 1 : que cherche-t-on ? */
    const s1 = () => {
      header('🎯 Qu\'est-ce qu\'on cherche ?', 1);
      let miss = 0;
      const opts = Z.shuffle(pb.q.map((t, i) => ({ t, ok: i === 0 })));
      const list = h('div', { class: 'col' }, opts.map(o => {
        const b = h('button', {
          class: 'opt', onclick: () => {
            if (b.classList.contains('bad')) return;
            if (o.ok) {
              b.classList.add('good'); Z.sfx.good();
              if (!miss) clues++;
              Z.speak('Oui ! C\'est ça qu\'on cherche.');
              setTimeout(s2, 1200);
            } else { miss++; slips++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Relis la dernière phrase, celle avec le point d\'interrogation.'); }
          }
        }, h('span', null, o.t), Z.ear(o.t));
        return b;
      }));
      const card = textCard();
      shell.root.append(card, Z.guideSays('La question se cache souvent dans la dernière phrase.', { speak: false }), list);
      Z.speak('Qu\'est-ce qu\'on cherche ? La question se cache souvent dans la dernière phrase.');
    };

    /* Étape 2 : trier les nombres */
    const s2 = () => {
      header('🔍 Trouve les nombres utiles', 2);
      const card = textCard('tap');
      const useful = sents.flatMap(s => s.parts.filter(p => p.n !== undefined && !p.trap)).length;
      let found = 0, miss = 0;
      const t = 'Touche seulement les nombres qui servent à répondre. Attention, il y a peut-être un nombre piège !';
      card.querySelectorAll('.num').forEach(el => el.addEventListener('click', () => {
        if (el.classList.contains('sel') || el.classList.contains('trap')) return;
        if (el.dataset.trap === '1') {
          miss++; slips++; el.classList.add('trap'); Z.sfx.bad();
          Z.speak('Ah ! Ce nombre est un piège : il ne sert pas pour la question. Bien vu de l\'avoir repéré !');
          return;
        }
        el.classList.add('sel'); Z.sfx.click(); found++;
        if (found === useful) {
          card.querySelectorAll('.num[data-trap="1"]:not(.trap)').forEach(x => x.classList.add('trap'));
          Z.sfx.good(); if (!miss) clues++;
          const hasTrap = sents.some(s => s.parts.some(p => p.trap));
          Z.speak(hasTrap ? 'Bravo ! Tu as trouvé les bons nombres et évité le piège.' : 'Bravo, tu as trouvé les nombres utiles !');
          setTimeout(s3, 1600);
        }
      }));
      shell.root.append(Z.guideSays(t, { speak: false }), card);
      Z.speak(t);
    };

    /* Étape 3 : dessiner (choisir le bon schéma) */
    const s3 = () => {
      header('📊 Dessine le problème', 3);
      const others = Object.keys(SCHEMA_NAMES).filter(k => k !== pb.schema && !(pb.schema === 'groupes' && k === 'partage') && !(pb.schema === 'partage' && k === 'groupes'));
      const options = Z.shuffle([pb.schema, ...Z.shuffle(others).slice(0, 2)]);
      let miss = 0;
      const t = 'Quel dessin ressemble à ton problème ?';
      const grid = h('div', { class: 'schemas' }, options.map(k => {
        const b = h('button', {
          class: 'schema-card', onclick: () => {
            if (b.classList.contains('bad')) return;
            if (k === pb.schema) {
              b.classList.add('good'); Z.sfx.good(); if (!miss) clues++;
              Z.speak(SCHEMA_SAY[k]);
              b.innerHTML = '';
              b.append(h('b', null, '✅ ' + SCHEMA_NAMES[k]), Z.svg(schemaSVG(k, pb)));
              grid.querySelectorAll('.schema-card').forEach(x => { if (x !== b) x.style.display = 'none'; });
              grid.appendChild(h('button', { class: 'btn purple wide', onclick: () => { Z.sfx.tap(); s4(); } }, 'Suivant ➡️'));
            } else { miss++; slips++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Hmm, regarde encore. ' + SCHEMA_SAY[k] + ' Est-ce que c\'est ton problème ?'); }
          }
        }, h('b', null, SCHEMA_NAMES[k]), Z.svg(schemaSVG(k)));
        return b;
      }));
      shell.root.append(textCard(), Z.guideSays(t, { speak: false }), grid);
      Z.speak(t);
    };

    /* Étape 4 : l'opération */
    const s4 = () => {
      header('➗ Quelle opération ?', 4);
      let miss = 0;
      const t = 'Regarde ton dessin. Quelle opération faut-il faire ?';
      const OPS = { '+': 'plus, on ajoute', '-': 'moins, on enlève ou on cherche l\'écart', '×': 'fois, on répète', '÷': 'divisé, on partage' };
      const grid = h('div', { class: 'opgrid' }, ['+', '-', '×', '÷'].map(op => {
        const b = h('button', {
          class: 'choice', onclick: () => {
            if (b.classList.contains('bad')) return;
            if (op === pb.op) { b.classList.add('good'); Z.sfx.good(); if (!miss) clues++; Z.speak('Oui ! ' + OPS[op] + '.'); setTimeout(s5, 1200); }
            else { miss++; slips++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Pas celle-là. Regarde où est le point d\'interrogation sur le dessin.'); }
          }
        }, op === '-' ? '−' : op);
        return b;
      }));
      shell.root.append(Z.svg(schemaSVG(pb.schema, pb), 'card'), Z.guideSays(t, { speak: false }), grid);
      Z.speak(t);
    };

    /* Étape 5 : calculer */
    const s5 = () => {
      header('🧮 Calcule', 5);
      const opS = pb.op === '-' ? '−' : pb.op;
      const opSay = { '+': 'plus', '-': 'moins', '×': 'fois', '÷': 'divisé par' }[pb.op];
      const r = pb.r;
      const wrong = { '+': pb.a - pb.b, '-': pb.a + pb.b, '×': pb.a + pb.b, '÷': pb.a - pb.b }[pb.op];
      const set = new Set([r]);
      [wrong, r + 10, r - 1, r + 1, r - 10].forEach(v => { if (set.size < 4 && v > 0) set.add(v); });
      let miss = 0;
      const t = `${pb.a} ${opSay} ${pb.b}, ça fait combien ?`;
      const grid = h('div', { class: 'choices' }, Z.shuffle([...set]).map(v => {
        const b = h('button', {
          class: 'choice', onclick: () => {
            if (b.classList.contains('bad')) return;
            if (v === r) { b.classList.add('good'); Z.sfx.good(); if (!miss) clues++; Z.speak(`${pb.a} ${opSay} ${pb.b} égale ${r} !`); setTimeout(s6, 1300); }
            else { miss++; slips++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Presque ! Vérifie ton calcul, sans te presser.'); }
          }
        }, String(v));
        return b;
      }));
      shell.root.append(h('div', { class: 'card center row', style: { justifyContent: 'center' } }, h('div', { class: 'question', style: { fontSize: '2.4em' } }, `${pb.a} ${opS} ${pb.b} = ?`), Z.ear(t)), grid);
      Z.speak(t);
    };

    /* Étape 6 : la réponse a-t-elle du sens ? */
    const s6 = () => {
      header('✅ Ta réponse a-t-elle du sens ?', 6);
      const t = 'Dernière étape : choisis la phrase réponse qui a du sens.';
      let miss = 0;
      const list = h('div', { class: 'col' }, Z.shuffle(pb.end.map((x, i) => ({ x, ok: i === 0 }))).map(o => {
        const b = h('button', {
          class: 'opt', onclick: () => {
            if (b.classList.contains('bad')) return;
            if (o.ok) { b.classList.add('good'); if (!miss) clues++; win(); }
            else { miss++; slips++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Ha ha, ça n\'a aucun sens ! Essaie l\'autre phrase.'); }
          }
        }, h('span', null, o.x), Z.ear(o.x));
        return b;
      }));
      shell.root.append(Z.guideSays(t, { speak: false }), list);
      Z.speak(t);
    };

    const win = () => {
      Z.state.probs[pb.id] = (Z.state.probs[pb.id] || 0) + 1;
      Z.save();
      const stars = clues >= 6 ? 3 : clues >= 4 ? 2 : 1;
      Z.endScreen(shell, {
        medal: stars === 3 ? '🕵️🥇' : stars === 2 ? '🕵️🥈' : '🕵️🥉',
        kind: 'problemes', eclairs: 10 + clues * 2, xp: 15 + clues * 4,
        title: 'Enquête résolue !',
        lines: [pb.end[0], `${'⭐'.repeat(stars)}  ${clues} indice(s) sur 6 du premier coup`, 'Tu as pris le temps de tout vérifier, comme un vrai détective 🔍'],
        detail: pb.id,
        again: () => Z.go('problemes')
      });
    };

    s0();
  }
})();
