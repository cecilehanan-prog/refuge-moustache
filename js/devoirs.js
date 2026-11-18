/* =========================================================
   MES DEVOIRS — les devoirs de l'agenda, transformés en jeu
   ---------------------------------------------------------
   • Une consigne à la fois, grosse police, tout est lu à voix haute.
   • Pas d'écriture : gros boutons à choisir (une dictée ne marcherait pas
     pour les terminaisons : « savais » et « savait » se prononcent pareil).
   • Erreur → « Essaie encore » + la question pour trouver le sujet ;
     2e erreur → la bonne réponse clignote.
   • Poésie : l'appli la lit une fois, puis écoute la récitation au micro.
     1er tour : elle souffle les mots quand il bloque. 2e tour : sans aide.
   • À la fin : une page propre à imprimer pour l'école.
   ========================================================= */
(function () {
  const h = Z.h;
  const ADULTE = PROFIL.appli.adulte || 'l’adulte';
  /* La semaine affichée : celle en cours (ZDEVOIRS) ou une semaine archivée (ZARCHIVES) */
  let week = null;
  const D = () => week || window.ZDEVOIRS;
  const archives = () => (window.ZARCHIVES || []).slice().sort((a, b) => b.id.localeCompare(a.id));
  const isOld = () => D() !== window.ZDEVOIRS;
  const findWeek = (wid) => (wid && archives().find(w => w.id === wid)) || window.ZDEVOIRS;
  /* une seule récitation à la fois : on coupe le micro en changeant d'écran */
  let stopRecite = null;
  const killRecite = () => { if (stopRecite) { const f = stopRecite; stopRecite = null; f(); } };

  /* Progression rangée PAR SEMAINE : rien n'est effacé quand les devoirs changent */
  function storeOf(wid) {
    const st = Z.state;
    st.devoirsAll = st.devoirsAll || {};
    if (st.devoirs && st.devoirs.id) { st.devoirsAll[st.devoirs.id] = st.devoirsAll[st.devoirs.id] || { done: st.devoirs.done, res: st.devoirs.res }; delete st.devoirs; }
    return st.devoirsAll[wid] = st.devoirsAll[wid] || { done: {}, res: {} };
  }
  const store = () => storeOf(D().id);
  /* Poésies rangées par titre (une nouvelle poésie n'efface pas l'ancienne) */
  function poemOf(titre) {
    const st = Z.state;
    st.poemes = st.poemes || {};
    if (st.poeme && st.poeme.titre) { st.poemes[st.poeme.titre] = st.poemes[st.poeme.titre] || st.poeme; delete st.poeme; }
    return st.poemes[titre] || null;
  }
  Z.devoirsLeft = () => { const s = storeOf(window.ZDEVOIRS.id); return window.ZDEVOIRS.items.filter(i => !s.done[i.id]).length; };
  const say = (t) => Z.speak(t, { natural: true });
  const back = () => { Z.sfx.tap(); Z.go('devoirs', isOld() ? D().id : undefined); };

  function reward(shell, it, eclairs, lines) {
    const s = store(); s.done[it.id] = true; Z.save();
    /* révision d'un ancien devoir : moitié moins d'éclairs (la semaine en cours reste la priorité) */
    if (isOld()) { eclairs = Math.max(5, Math.round(eclairs / 2)); lines = ['📦 Révision', ...lines]; }
    Z.endScreen(shell, { medal: '📚', title: isOld() ? 'Révision terminée !' : 'Exercice terminé !', eclairs, xp: eclairs, lines, kind: 'devoirs', detail: D().id + ':' + it.id, again: back, againLabel: '📚 Mes devoirs' });
    if (Z.adapte('hpi') && it.defi) {
      const t = '🧠 Défi bonus : ' + it.defi;
      const rep = it.defiReponse ? h('div', { class: 'card rule', style: { display: 'none' } }, it.defiReponse, Z.ear(it.defiReponse)) : null;
      shell.root.append(h('div', { class: 'card' }, h('span', null, t), Z.ear(t)), rep,
        rep ? h('button', { class: 'btn ghost wide', onclick: (e) => { Z.sfx.tap(); rep.style.display = ''; e.currentTarget.remove(); } }, '👀 Voir une réponse possible') : null);
    }
    if (Z.adapte('tdah') && Z.devoirsLeft() > 0 && !isOld()) shell.root.append(pauseBtn());
  }
  /* TDAH : une vraie pause, courte et minutée, avant l'exercice suivant */
  function pauseBtn() {
    const b = h('button', { class: 'btn gold wide', onclick: () => {
      Z.sfx.tap(); let n = 120;
      const show = () => { b.textContent = `☕ Pause : ${Math.floor(n / 60)} min ${String(n % 60).padStart(2, '0')} s`; };
      show(); b.disabled = true; say('Petite pause de deux minutes. Lève-toi, bois un verre d’eau, étire-toi. Je te préviens quand c’est fini.');
      const iv = setInterval(() => { n--; if (!document.body.contains(b)) return clearInterval(iv); show();
        if (n <= 0) { clearInterval(iv); Z.sfx.good(); b.textContent = '✅ Pause finie ! On continue ?'; b.disabled = false; b.onclick = back; say('La pause est finie. On continue ?'); } }, 1000);
    } }, '☕ Faire une pause de 2 minutes');
    return b;
  }

  const ICO = { verbes: '✏️', sujet: '🟥', mathador: '🔢', poesie: '📜', activite: '📝' };
  const itemBtn = (it, s, wid) => h('button', { class: 'devoir' + (s.done[it.id] ? ' fait' : ''), onclick: () => { Z.sfx.vroum(); Z.go('devoir', it.id, wid); } },
    h('span', { class: 'd-ico' }, s.done[it.id] ? '✅' : ICO[it.type]),
    h('span', { class: 'grow' }, it.titre, h('small', null, it.pour)),
    h('span', { class: 'd-go' }, '▶'));

  /* ---------- LISTE ---------- */
  Z.screens.devoirs = function (wid) {
    killRecite();
    week = findWeek(wid);
    const s = store();
    const shell = Z.shell({ title: 'Mes devoirs' });
    shell.setSteps(0, 0);
    const items = D().items;
    if (isOld()) {
      const t = `${D().titre}. Tu peux refaire ces devoirs pour réviser !`;
      shell.root.append(h('h2', null, '📦 ' + D().titre), Z.guideSays(t),
        ...items.map(it => itemBtn(it, s, D().id)),
        h('button', { class: 'btn ghost wide', onclick: printSheet }, '🖨️ Réimprimer la feuille'),
        h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('archives'); } }, '⬅️ Les autres semaines'));
      return;
    }
    const left = items.filter(i => !s.done[i.id]).length;
    const hello = Z.state.guideDevoirsMet ? '' : `Moi c’est ${Z.guide('devoirs').nom}. Je t’aide pour tes devoirs : doucement, mais sûrement ! `;
    if (!Z.state.guideDevoirsMet) { Z.state.guideDevoirsMet = true; Z.save(); }
    const t = left ? `Salut ${Z.nomPour('devoirs')} ! ${hello}Voici tes devoirs. Il en reste ${left}. ${Z.adapte('tsa') ? 'On les fait dans l’ordre, en commençant par le premier.' : 'Choisis par où tu commences !'}` : `${hello}Bravo ${Z.nomPour('devoirs')}, tous tes devoirs sont faits ! Tu peux imprimer la feuille pour ${PROFIL.appli.ecole || 'l’école'}.`;
    const faits = items.length - left, prochain = items.find(i => !s.done[i.id]);
    const barre = (Z.adapte('tdah') || Z.adapte('tsa')) && items.length ? h('div', { class: 'card' },
      h('b', null, `${faits} sur ${items.length} fait${faits > 1 ? 's' : ''}`),
      h('div', { class: 'bar devoirs-bar' }, h('i', { style: { width: Math.round(faits / items.length * 100) + '%' } }))) : null;
    const ordre = Z.adapte('tsa') && prochain ? Z.guideSays(`On fait les devoirs dans l’ordre. Maintenant : ${prochain.titre}.`) : null;
    shell.root.append(
      h('h2', null, '📚 Mes devoirs'),
      Z.guideSays(t), barre, ordre,
      ...items.map(it => { const b = itemBtn(it, s); if ((Z.adapte('tdah') || Z.adapte('tsa')) && it === prochain) b.classList.add('prochain'); return b; }),
      h('button', { class: 'btn ghost wide', onclick: printSheet }, '🖨️ Imprimer pour ' + (PROFIL.appli.ecole || 'l’école')),
      archives().length ? h('button', { class: 'btn purple wide', onclick: () => { Z.sfx.tap(); Z.go('archives'); } }, `📦 Mes anciens devoirs (${archives().length})`) : null);
  };

  /* ---------- ANCIENS DEVOIRS ---------- */
  Z.screens.archives = function () {
    killRecite();
    const shell = Z.shell({ title: 'Anciens devoirs' });
    shell.setSteps(0, 0);
    const t = 'Voici tes anciens devoirs. Tu peux les refaire pour réviser, par exemple avant une évaluation !';
    shell.root.append(h('h2', null, '📦 Mes anciens devoirs'), Z.guideSays(t),
      ...archives().map(w => {
        const s = storeOf(w.id), done = w.items.filter(i => s.done[i.id]).length;
        return h('button', { class: 'devoir', onclick: () => { Z.sfx.vroum(); Z.go('devoirs', w.id); } },
          h('span', { class: 'd-ico' }, '📦'),
          h('span', { class: 'grow' }, w.titre, h('small', null, w.items.map(i => ICO[i.type]).join(' ') + ` · ${done}/${w.items.length} faits`)),
          h('span', { class: 'd-go' }, '▶'));
      }),
      h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('devoirs'); } }, '📚 Les devoirs de la semaine'));
  };

  Z.screens.devoir = function (id, wid) {
    killRecite();
    week = findWeek(wid);
    const it = D().items.find(i => i.id === id);
    const shell = Z.shell({ title: it.titre });
    ({ verbes, sujet, mathador, poesie, activite })[it.type](shell, it);
    /* TSA : le plan de l'exercice, toujours le même, affiché avant de commencer */
    if (Z.adapte('tsa')) {
      const n = it.phrases ? it.phrases.length : it.questions ? it.questions.length : it.items ? it.items.length : null;
      const plan = ['Je lis (ou j’écoute) la consigne.', n ? `Je réponds aux ${n} questions, une par une.` : 'Je fais l’exercice, étape par étape.', 'Je vois mon résultat. Ensuite, c’est fini.'];
      const t = 'Ce que je vais faire : ' + plan.map((x, i) => (i + 1) + '. ' + x).join(' ');
      const h2 = shell.root.querySelector('h2');
      const card = h('div', { class: 'card plan-tsa' }, h('b', null, '🗺️ Ce que je vais faire'), h('ol', null, plan.map(x => h('li', null, x))), Z.ear(t));
      if (h2) h2.after(card); else shell.root.prepend(card);
    }
    /* Pictos, étapes numérotées, consigne d'origine, traduction */
    const extras = Z.consigneBloc(it);
    if (extras.length) { const h2 = shell.root.querySelector('h2'); let ref = h2 && h2.nextElementSibling; ref = shell.root.querySelector('.guide-says') || ref; if (ref) ref.after(...extras); else shell.root.append(...extras); }
    /* HPI : pourquoi on fait cet exercice */
    if (Z.adapte('hpi') && it.pourquoi) {
      const h2 = shell.root.querySelector('h2');
      const card = h('div', { class: 'card rule' }, h('b', null, '💡 Pourquoi on fait ça ? '), it.pourquoi, Z.ear(it.pourquoi));
      if (h2) h2.after(card); else shell.root.prepend(card);
    }
  };

  /* ---------- EXERCICE LIBRE : un des moteurs (qcm, trous, paires, ordre, cartes, calcul, schema) ---------- */
  function activite(shell, it) {
    shell.setSteps(0, 0);
    const t = it.consigne || Z.consigneDe(it.moteur) || 'C’est parti !';
    shell.root.append(h('h2', null, '📝 ' + it.titre), Z.guideSays(t),
      it.rappel ? h('div', { class: 'card rule' }, h('b', null, '📌 À retenir : '), it.rappel, Z.ear(it.rappel)) : null,
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); Z.lancerMoteur(shell, it, ({ firstTry, total, lines }) => {
        const s = store(); s.res[it.id] = { firstTry, total };
        reward(shell, it, 10 + firstTry * 2, [total ? `${firstTry} réussite(s) du premier coup sur ${total}` : '', ...lines].filter(Boolean));
      }); } }, '▶️ C’est parti !'));
  }

  /* ---------- VERBES À ACCORDER ---------- */
  const RULE = 'Je cherche le sujet : qui fait l’action ? Avec il, elle, on : la fin est t. Avec ils, elles : la fin est ent. Avec je, tu : la fin est s.';
  function verbes(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    const steps = [];
    it.phrases.forEach((p, pi) => p.b.forEach((b, bi) => steps.push({ pi, bi })));
    let n = 0, errors = 0;

    const intro = () => {
      shell.clear(); shell.setSteps(steps.length, 0);
      const t = `${it.consigne} ${RULE}`;
      shell.root.append(h('h2', null, '✏️ ' + it.titre), Z.guideSays(it.consigne + ' Choisis la bonne fin du verbe.'),
        h('div', { class: 'card rule' },
          h('div', null, '🔎 Je cherche ', h('b', null, 'qui'), ' fait l’action.'),
          h('div', null, h('b', null, 'il, elle, on'), ' → ', h('span', { class: 'fin' }, 't')),
          h('div', null, h('b', null, 'ils, elles'), ' → ', h('span', { class: 'fin' }, 'ent')),
          h('div', null, h('b', null, 'je, tu'), ' → ', h('span', { class: 'fin' }, 's')), Z.ear(t)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'C’est parti ! ➡️'));
    };

    /* La phrase, avec les trous déjà remplis et le trou en cours */
    const sentence = (p, pi, cur) => {
      const parts = p.t.split('¤'), out = [];
      parts.forEach((txt, i) => {
        out.push(txt);
        if (i < p.b.length) {
          const b = p.b[i], key = pi + '-' + i;
          if (res[key]) out.push(h('span', { class: 'mot-fait' }, b[0], h('span', { class: 'fin' }, b[1])));
          else out.push(h('span', { class: 'mot-trou' + (i === cur ? ' cur' : '') }, b[0], h('span', { class: 'trou' }, '…')));
        }
      });
      return h('div', { class: 'phrase' }, out);
    };
    const full = (p) => { let k = 0; return p.t.replace(/¤/g, () => { const b = p.b[k++]; return b[0] + b[1]; }); };

    const ask = () => {
      if (n >= steps.length) return reward(shell, it, 20, [`${steps.length} verbes accordés`, errors ? `${errors} petites erreurs, corrigées` : 'Zéro erreur ! 🔥']);
      const { pi, bi } = steps[n], p = it.phrases[pi], b = p.b[bi];
      shell.clear(); shell.setSteps(steps.length, n);
      let tries = 0;
      const hint = h('div', { class: 'tip', style: { display: 'none' } });
      const grid = h('div', { class: 'choices' });
      Z.shuffle([b[1], ...b[2]]).forEach(fin => {
        const btn = h('button', { class: 'choice mot', onclick: () => {
          if (btn.classList.contains('bad') || grid.dataset.done) return;
          tries++;
          if (fin === b[1]) {
            grid.dataset.done = '1'; btn.classList.add('good'); Z.sfx.good();
            res[pi + '-' + bi] = tries; Z.save();
            n++;
            say(p.b.every((_, i) => res[pi + '-' + i]) ? full(p) : b[0] + b[1]).then(() => setTimeout(ask, 400));
          } else {
            errors++; btn.classList.add('bad'); Z.sfx.bad();
            const sujetTxt = b[4] === b[5] ? `C’est « ${b[4]} ».` : `C’est « ${b[4]} » : comme « ${b[5]} ».`;
            hint.style.display = ''; hint.textContent = `💡 ${b[3]} ${sujetTxt}`;
            if (tries >= 2) {
              [...grid.children].find(x => x.dataset.fin === b[1]).classList.add('hint-good');
              Z.speak(`${b[3]} ${sujetTxt} Il faut écrire ${b[0]}${b[1]}, avec ${b[1].split('').join(' ')} à la fin.`);
            } else Z.speak(`Pas grave, essaie encore. ${b[3]} ${sujetTxt}`);
          }
        } }, b[0], h('span', { class: 'fin' }, fin));
        btn.dataset.fin = fin;
        grid.appendChild(btn);
      });
      shell.root.append(h('h2', null, `Phrase ${pi + 1} sur ${it.phrases.length}`),
        h('div', { class: 'card row' }, sentence(p, pi, bi), Z.ear(() => full(p), { natural: true })),
        h('div', { class: 'hint center' }, 'Choisis la bonne fin :'), grid, hint);
      say(full(p));
    };
    intro();
  }

  /* ---------- VERBE ET SUJET ---------- */
  function parseSujet(line) {
    return line.split(' ').map(w => {
      const m = w.match(/^(S|V|s\?|v\?):(.*)$/);
      return m ? { w: m[2], need: m[1] === 'S' ? 'S' : m[1] === 'V' ? 'V' : null, opt: m[1] === 's?' ? 'S' : m[1] === 'v?' ? 'V' : null } : { w, need: null, opt: null };
    });
  }
  function sujet(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    let n = 0, errors = 0;
    const intro = () => {
      shell.clear(); shell.setSteps(it.phrases.length, 0);
      const t = `${it.consigne} Touche un mot une fois : il devient le verbe, encadré en rouge. Touche-le deux fois : il devient le sujet, souligné en bleu. Pour trouver le verbe, je change le temps : hier, demain. Pour trouver le sujet, je demande : qui est-ce qui ?`;
      shell.root.append(h('h2', null, '🟥 ' + it.titre), Z.guideSays(it.consigne),
        h('div', { class: 'card rule' },
          h('div', null, '👆 1 fois → ', h('span', { class: 'is-v' }, 'verbe')),
          h('div', null, '👆👆 2 fois → ', h('span', { class: 'is-s' }, 'sujet')),
          h('div', null, '👆👆👆 3 fois → on efface'), Z.ear(t)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'C’est parti ! ➡️'));
      Z.speak(t);
    };
    const ask = () => {
      if (n >= it.phrases.length) return reward(shell, it, 15, [`${it.phrases.length} phrases`, errors ? `${errors} essais en plus` : 'Zéro erreur ! 🔥']);
      shell.clear(); shell.setSteps(it.phrases.length, n);
      const words = parseSujet(it.phrases[n]);
      const mark = words.map(() => null);
      let tries = 0;
      const hint = h('div', { class: 'tip', style: { display: 'none' } });
      const line = h('div', { class: 'phrase mots' }, words.map((w, i) => {
        const el = h('button', { class: 'tap-mot', onclick: () => {
          Z.sfx.tap();
          mark[i] = mark[i] === null ? 'V' : mark[i] === 'V' ? 'S' : null;
          el.className = 'tap-mot' + (mark[i] === 'V' ? ' is-v' : mark[i] === 'S' ? ' is-s' : '');
        } }, w.w);
        return el;
      }));
      const plain = words.map(w => w.w).join(' ');
      const check = () => {
        const bad = words.some((w, i) => w.need ? mark[i] !== w.need : (mark[i] && mark[i] !== w.opt));
        if (!bad) {
          Z.sfx.good(); res[n] = mark.slice(); Z.save();
          const v = words.filter((w, i) => mark[i] === 'V').map(w => w.w).join(' ');
          const sj = words.filter((w, i) => mark[i] === 'S').map(w => w.w).join(' ').replace(/[,.]$/, '');
          n++;
          Z.speak(`Bravo ! Le verbe, c’est ${v.replace(/[,.]$/, '')}. Le sujet, c’est ${sj}.`).then(() => setTimeout(ask, 500));
          return;
        }
        tries++; errors++; Z.sfx.bad();
        const vWords = words.filter(w => w.need === 'V').map(w => w.w.replace(/[,.]$/, '')).join(' ');
        const sWords = words.filter(w => w.need === 'S').map(w => w.w).join(' ');
        const vOk = words.every((w, i) => (w.need === 'V') === (mark[i] === 'V') || (w.opt === 'V'));
        let t;
        if (tries >= 2) {
          t = `Regarde bien : le verbe, c’est « ${vWords} ». Qui est-ce qui ${vWords} ? « ${sWords} » : c’est le sujet.`;
          words.forEach((w, i) => { mark[i] = w.need; line.children[i].className = 'tap-mot' + (w.need === 'V' ? ' is-v' : w.need === 'S' ? ' is-s' : ''); });
        } else if (!vOk) t = 'Pas grave, essaie encore. Le verbe change quand on dit hier ou demain. Lequel ?';
        else t = `Le verbe est bon ! Maintenant, qui est-ce qui ${vWords} ? Ça, c’est le sujet, tous les mots du groupe.`;
        hint.style.display = ''; hint.textContent = '💡 ' + t;
        Z.speak(t);
      };
      shell.root.append(h('h2', null, `Phrase ${String.fromCharCode(97 + n)}.`),
        h('div', { class: 'card col' }, line, h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(plain, { natural: true }))),
        hint, h('button', { class: 'btn green wide', onclick: check }, '✅ Vérifier'));
      say(plain);
    };
    intro();
  }

  /* ---------- MATHADOR ---------- */
  function mathador(shell, it) {
    const s = store();
    let tiles, log, history, sel, op;
    const reset = () => { tiles = it.nombres.map((v, i) => ({ v, id: i })); log = []; history = []; sel = null; op = null; };
    reset();
    const OPS = [['+', (a, b) => a + b], ['−', (a, b) => a - b], ['×', (a, b) => a * b], ['÷', (a, b) => b && a % b === 0 ? a / b : null]];
    const best = () => tiles.reduce((m, t) => Math.abs(t.v - it.cible) < Math.abs(m - it.cible) ? t.v : m, tiles[0].v);
    const fmt = (v) => v.toLocaleString('fr-FR');
    let uid = 100;

    const draw = () => {
      shell.clear(); shell.setSteps(0, 0);
      const b = best(), gap = Math.abs(b - it.cible);
      shell.root.append(
        h('h2', null, '🔢 ' + it.titre),
        h('div', { class: 'card center col' },
          h('div', { class: 'hint' }, '🎯 Le nombre à atteindre'),
          h('div', { class: 'question' }, fmt(it.cible)),
          h('div', { class: 'ecart' + (gap === 0 ? ' pile' : '') }, gap === 0 ? '🎯 PILE DESSUS !' : `Ton meilleur : ${fmt(b)} · il manque ${fmt(gap)}`)),
        h('div', { class: 'hint center' }, sel === null ? '👆 Touche un nombre' : op === null ? 'Choisis une opération' : 'Touche le 2e nombre'),
        h('div', { class: 'tuiles-nb' }, tiles.map(t => h('button', {
          class: 'nb' + (sel === t.id ? ' sel' : ''), onclick: () => pickTile(t)
        }, fmt(t.v)))),
        h('div', { class: 'ops' }, OPS.map(([o]) => h('button', { class: 'op' + (op === o ? ' sel' : ''), disabled: sel === null, onclick: () => { Z.sfx.tap(); op = o; draw(); } }, o))),
        log.length ? h('div', { class: 'card calc' }, log.map(l => h('div', null, l))) : null,
        h('div', { class: 'row' },
          h('button', { class: 'btn ghost grow', disabled: !history.length, onclick: () => { Z.sfx.tap(); const p = history.pop(); tiles = p.tiles; log = p.log; sel = op = null; draw(); } }, '↩️ Annuler'),
          h('button', { class: 'btn ghost grow', onclick: () => { Z.sfx.tap(); reset(); draw(); } }, '🔄 Recommencer')),
        h('button', { class: 'btn green wide', disabled: !log.length, onclick: finish }, '✅ J’ai fini'));
    };
    const pickTile = (t) => {
      Z.sfx.tap();
      if (sel === null || op === null) { sel = sel === t.id ? null : t.id; draw(); return; }
      if (t.id === sel) return;
      const a = tiles.find(x => x.id === sel), f = OPS.find(o => o[0] === op)[1];
      const r = f(a.v, t.v);
      if (r === null || r < 0) {
        const msg = r === null ? 'Cette division ne tombe pas juste. Essaie autre chose !' : 'Ça donnerait un nombre négatif. Mets le plus grand en premier !';
        Z.pop(msg, 'soft'); Z.speak(msg); return;
      }
      history.push({ tiles: tiles.slice(), log: log.slice() });
      const line = `${fmt(a.v)} ${op} ${fmt(t.v)} = ${fmt(r)}`;
      log.push(line);
      tiles = tiles.filter(x => x.id !== a.id && x.id !== t.id).concat([{ v: r, id: uid++ }]);
      sel = op = null;
      Z.speak(line.replace('−', 'moins').replace('×', 'fois').replace('÷', 'divisé par').replace('+', 'plus').replace('=', 'égale').replace(/ | /g, ''));
      if (r === it.cible) { Z.sfx.win(); Z.confetti(120); }
      draw();
    };
    const finish = () => {
      const b = best();
      s.res[it.id] = { log: log.slice(), best: b }; Z.save();
      const gap = Math.abs(b - it.cible);
      reward(shell, it, gap === 0 ? 25 : 15, [gap === 0 ? `🎯 Pile ${fmt(it.cible)} !` : `Tu arrives à ${fmt(b)}, à ${fmt(gap)} de la cible`, `${log.length} calculs`]);
    };
    const t = `${it.consigne} Le nombre à atteindre, c’est ${it.cible}. Touche un nombre, puis une opération, puis un autre nombre. Le résultat devient un nouveau nombre. Chaque nombre ne sert qu’une fois.`;
    shell.clear();
    shell.root.append(h('h2', null, '🔢 ' + it.titre), Z.guideSays(t, { speak: false }),
      h('div', { class: 'card center' }, h('div', { class: 'emoji-big' }, '🧮🎯')),
      h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); draw(); } }, 'C’est parti ! ➡️'));
    Z.speak(t);
  }

  /* ---------- POÉSIE ---------- */
  const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const tokens = (t) => t.replace(/[’']/g, ' ').replace(/-/g, ' ').split(/\s+/).map(norm).filter(Boolean);
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const same = (a, b) => a === b || (b.length >= 4 && lev(a, b) <= 1) || (b.length >= 7 && lev(a, b) <= 2);

  function poemLines(it) {
    const p = poemOf(it.titre) || {};
    if (!p.texte) return null;
    let lines = p.texte.split('\n').map(l => l.trim());
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    if (p.part === '23') {
      const real = lines.map((l, i) => l ? i : -1).filter(i => i >= 0);
      const keep = real[Math.ceil(real.length * 2 / 3) - 1];
      lines = lines.slice(0, keep + 1);
    }
    return lines;
  }

  function poesie(shell, it) {
    const lines = poemLines(it);
    if (!lines) return poemSetup(shell, it);
    let round = 0;
    /* disp = les mots affichés (« d’aimer »), words = les sons reconnus (« d », « aimer ») */
    const disp = [], words = [];
    lines.forEach((l, li) => l.split(/\s+/).filter(Boolean).forEach(w => {
      const ts = tokens(w);
      if (!ts.length) { if (disp.length) disp[disp.length - 1].t += ' ' + w; return; }
      const di = disp.length; disp.push({ t: w, line: li, toks: [] });
      ts.forEach(n => { disp[di].toks.push(words.length); words.push({ n, d: di }); });
    }));

    const menu = () => {
      shell.clear(); shell.setSteps(3, round);
      const t = round === 0 ? `Voici ta poésie : ${it.titre}, de ${it.auteur}. D’abord, écoute-la bien.` : round === 1 ? 'À toi ! Récite ta poésie. Si tu bloques, je te souffle les mots.' : 'Dernier tour : tu récites tout seul, sans aide. Tu es prêt ?';
      shell.root.append(h('h2', null, '📜 ' + it.titre), Z.guideSays(t),
        h('div', { class: 'card col' },
          h('div', { class: round === 0 ? 'etape cur' : 'etape ok' }, round > 0 ? '✅' : '1️⃣', ' J’écoute la poésie'),
          h('div', { class: round === 1 ? 'etape cur' : round > 1 ? 'etape ok' : 'etape' }, round > 1 ? '✅' : '2️⃣', ' Je récite, avec de l’aide'),
          h('div', { class: round === 2 ? 'etape cur' : 'etape' }, '3️⃣', ' Je récite tout seul')),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); round === 0 ? listen() : recite(round === 1); } }, round === 0 ? '🎧 Écouter' : '🎤 Je récite'),
        round > 0 ? h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); round = 0; menu(); } }, '🎧 Réécouter la poésie') : null,
        h('button', { class: 'btn ghost wide small-btn', onclick: () => { Z.sfx.tap(); poemSetup(shell, it); } }, '⚙️ Pour ' + ADULTE + ' : changer le texte'));
    };

    const listen = async () => {
      shell.clear(); shell.setSteps(3, 0);
      const els = lines.map(l => l ? h('div', { class: 'vers' }, l) : h('div', { class: 'strophe' }));
      const skip = h('button', { class: 'btn green wide', onclick: () => { Z.stopSpeak(); stop = true; round = Math.max(round, 1); menu(); } }, 'J’ai bien écouté ➡️');
      shell.root.append(h('h2', null, '🎧 ' + it.titre), h('div', { class: 'hint center' }, it.auteur), h('div', { class: 'card poeme' }, els), skip);
      let stop = false;
      const my = Symbol(); listen.cur = my;
      await Z.wait(300);
      await say(`${it.titre}, de ${it.auteur}.`);
      for (let i = 0; i < lines.length; i++) {
        if (stop || listen.cur !== my || Z.current !== 'devoir') return;
        if (!lines[i]) { await Z.wait(500); continue; }
        els.forEach(e => e.classList.remove('lu')); els[i].classList.add('lu');
        els[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
        await say(lines[i]);
        await Z.wait(250);
      }
      els.forEach(e => e.classList.remove('lu'));
    };

    const recite = (aide) => {
      killRecite();
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return reciteSansMicro(aide);
      shell.clear(); shell.setSteps(3, aide ? 1 : 2);
      const state = words.map(() => '');   // '' | 'ok' | 'aide' | 'saute'
      const spans = disp.map(w => h('span', { class: 'mot-cache' }, w.t));
      const lineEls = lines.map((l, li) => l ? h('div', { class: 'vers' }, spans.filter((_, i) => disp[i].line === li).flatMap(s => [s, ' '])) : h('div', { class: 'strophe' }));
      const status = h('div', { class: 'micro' }, '🎤 J’écoute…');
      const paint = (p) => spans.forEach((s, di) => {
        const st = disp[di].toks.map(i => state[i]);
        const c = st.every(Boolean) ? (st.includes('aide') ? 'aide' : st.includes('saute') ? 'saute' : 'ok') : st.includes('aide') ? 'aide' : disp[di].toks.includes(p) ? 'next' : '';
        s.className = 'mot-cache' + (c ? ' ' + c : '');
      });
      let finals = [], session = '', p = 0, last = Date.now(), active = true, paused = false, rec = null, helping = false;

      const align = () => {
        const heard = tokens(finals.join(' ') + ' ' + session);
        let q = 0;
        const st = words.map((_, i) => state[i] === 'aide' ? 'aide' : '');
        for (const tok of heard) {
          for (let k = 0; k <= 2 && q + k < words.length; k++) {
            if (same(tok, words[q + k].n)) {
              for (let j = q; j < q + k; j++) if (!st[j]) st[j] = 'saute';
              if (st[q + k] !== 'aide') st[q + k] = 'ok';
              q = q + k + 1; break;
            }
          }
        }
        for (let i = 0; i < words.length; i++) state[i] = st[i];
        if (q > p) { p = q; last = Date.now(); }
        paint(p);
        const cur = spans[words[Math.min(p, words.length - 1)].d];
        if (cur) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (p >= words.length) end();
      };
      const startRec = () => {
        if (!active || paused) return;
        const r = rec = new SR(); r.lang = 'fr-FR'; r.continuous = true; r.interimResults = true;
        r.onresult = (e) => { if (r !== rec) return; let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' '; session = t; align(); };
        r.onend = () => { if (r !== rec) return; if (session) finals.push(session); session = ''; rec = null; if (active && !paused) setTimeout(startRec, 150); };
        rec.onerror = (e) => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { active = false; status.textContent = '🚫 Le micro est bloqué. Autorise le micro, ou récite à ' + ADULTE + '.'; } };
        try { rec.start(); status.textContent = '🎤 J’écoute…'; } catch (e) { }
      };
      const help = async () => {
        if (helping || p >= words.length) return;
        helping = true; paused = true;
        const old = rec; rec = null; if (session) finals.push(session); session = '';
        try { old && old.abort(); } catch (e) { }
        status.textContent = '🤫 Je te souffle…';
        /* on souffle les 3 mots suivants du même vers */
        const d0 = words[p].d, li = disp[d0].line, ds = [];
        for (let d = d0; d < disp.length && ds.length < 3 && disp[d].line === li; d++) ds.push(d);
        ds.forEach(d => disp[d].toks.forEach(i => { if (i >= p) state[i] = 'aide'; })); paint(p);
        await say(ds.map(d => disp[d].t).join(' '));
        /* il répète les mots soufflés, puis continue */
        last = Date.now(); paused = false; helping = false; status.textContent = '🎤 J’écoute…'; startRec();
      };
      const watch = setInterval(() => {
        if (!active) return clearInterval(watch);
        if (Z.current !== 'devoir' || !shell.root.isConnected) { stopAll(); return; }
        if (aide && !paused && Date.now() - last > 6000) help();
      }, 500);
      const stopAll = () => { active = false; clearInterval(watch); const r = rec; rec = null; try { r && r.abort(); } catch (e) { } };
      stopRecite = stopAll;
      const end = () => {
        if (!active) return; stopAll();
        const ok = state.filter(x => x === 'ok').length, aid = state.filter(x => x === 'aide').length;
        words.forEach((_, i) => { if (!state[i]) state[i] = 'saute'; }); paint(-1);
        spans.forEach(s => s.classList.add('vu'));
        const pct = Math.round(ok / words.length * 100);
        const t = aide
          ? `Bravo ! Tu as dit ${ok} mots tout seul${aid ? `, et je t’ai aidé pour ${aid} mots` : ''}. Maintenant, essaie sans aide !`
          : pct >= 90 ? `Waouh ! Tu connais ta poésie par cœur ! ${pct} pour cent des mots !` : `Bien joué ! Tu as trouvé ${pct} pour cent des mots. Les mots en rouge sont à revoir.`;
        Z.speak(t);
        status.textContent = aide ? `✅ ${ok} mots tout seul · 🤫 ${aid} soufflés` : `⭐ ${pct} % des mots`;
        btns.innerHTML = '';
        if (aide) btns.append(h('button', { class: 'btn orange wide', onclick: () => { round = 2; menu(); } }, '➡️ Tour 3 : tout seul'),
          h('button', { class: 'btn ghost wide', onclick: () => recite(true) }, '🔁 Encore avec de l’aide'));
        else {
          store().res[it.id] = { pct }; Z.save();
          btns.append(h('button', { class: 'btn green wide', onclick: () => reward(shell, it, pct >= 90 ? 30 : 20, [`${pct} % des mots récités tout seul`]) }, '🏁 Terminer'),
            h('button', { class: 'btn ghost wide', onclick: () => recite(false) }, '🔁 Recommencer'));
        }
      };
      const btns = h('div', { class: 'col' },
        aide ? h('button', { class: 'btn gold wide', onclick: () => help() }, '🆘 Aide-moi') : null,
        h('button', { class: 'btn green wide', onclick: () => end() }, '✅ J’ai fini'));
      shell.root.append(h('h2', null, aide ? '🎤 Je récite (avec aide)' : '🎤 Je récite tout seul'), status,
        h('div', { class: 'card poeme recit' }, lineEls), btns);
      paint(0);
      Z.speak(aide ? 'Vas-y, je t’écoute ! Commence par le titre si tu veux.' : 'Vas-y, tout seul ! Je t’écoute.').then(() => { last = Date.now(); startRec(); });
    };

    /* Sans micro (iPhone, ou micro refusé) : l'adulte écoute et valide chaque vers */
    const reciteSansMicro = (aide) => {
      shell.clear(); shell.setSteps(3, aide ? 1 : 2);
      let ok = 0;
      const real = lines.filter(Boolean);
      const t = 'Le micro ne marche pas ici. Récite à ' + ADULTE + ' : il ou elle appuie sur le pouce à chaque vers bien dit.';
      shell.root.append(h('h2', null, '🎤 Récite à ' + ADULTE), Z.guideSays(t),
        h('div', { class: 'card col' }, real.map((l, i) => {
          const txt = h('span', { class: 'grow mot-cache' }, l);
          return h('div', { class: 'row vers-m' }, txt,
            aide ? h('button', { class: 'ear', onclick: () => { txt.classList.add('aide'); say(l); } }, '🆘') : null,
            h('button', { class: 'ear', onclick: (e) => { if (!e.target.dataset.v) { ok++; e.target.dataset.v = 1; } txt.classList.add('ok'); Z.sfx.good(); } }, '👍'));
        })),
        h('button', { class: 'btn green wide', onclick: () => {
          if (aide) { round = 2; menu(); return; }
          const pct = Math.round(ok / real.length * 100); store().res[it.id] = { pct }; Z.save();
          reward(shell, it, pct >= 90 ? 30 : 20, [`${ok} vers sur ${real.length}`]);
        } }, aide ? '➡️ Tour 3 : tout seul' : '🏁 Terminer'));
    };
    menu();
  }

  /* L'adulte colle le texte de la poésie (une seule fois) */
  function poemSetup(shell, it) {
    shell.clear();
    const p = poemOf(it.titre) || {};
    const ta = h('textarea', { rows: 12, placeholder: 'Un vers par ligne.\nUne ligne vide entre deux strophes.' });
    ta.value = p.texte || '';
    const part = h('select', null, h('option', { value: 'tout' }, 'En entier'), h('option', { value: '23' }, 'Les 2 premiers tiers'));
    part.value = p.part || 'tout';
    shell.root.append(h('div', { class: 'parent col' },
      h('h2', null, '⚙️ Pour ' + ADULTE + ' : la poésie'),
      h('p', null, `Tape ou colle le texte de « ${it.titre} » (${it.auteur}), tel qu’il est dans le cahier. Il reste seulement sur ce téléphone.`),
      h('label', null, 'Texte de la poésie'), ta,
      h('label', null, 'À apprendre'), part,
      h('button', { class: 'btn green wide', onclick: () => {
        if (ta.value.trim().split('\n').filter(l => l.trim()).length < 2) { alert('Il faut au moins 2 vers.'); return; }
        poemOf(it.titre); Z.state.poemes[it.titre] = { titre: it.titre, texte: ta.value, part: part.value }; Z.save(); Z.go('devoir', it.id, isOld() ? D().id : undefined);
      } }, '💾 Enregistrer'),
      h('button', { class: 'btn ghost wide', onclick: back }, 'Annuler')));
  }

  /* ---------- PAGE À IMPRIMER POUR LA MAÎTRESSE ---------- */
  function printSheet() {
    Z.sfx.tap();
    const s = store(), d = D();
    const old = document.getElementById('print'); if (old) old.remove();
    const blocks = [];
    for (const it of d.items) {
      const res = s.res[it.id];
      if (it.type === 'verbes') {
        blocks.push(h('section', null, h('h3', null, it.consigne),
          h('p', null, it.phrases.map((p, pi) => {
            const parts = p.t.split('¤'), out = [];
            parts.forEach((txt, i) => {
              out.push(txt);
              if (i < p.b.length) out.push(res && res[pi + '-' + i] ? h('span', null, p.b[i][0], h('u', null, h('b', null, p.b[i][1]))) : h('span', null, p.b[i][0] + '……'));
            });
            return h('span', null, ...out, ' ');
          }))));
      } else if (it.type === 'sujet') {
        blocks.push(h('section', null, h('h3', null, 'n°4 : ' + it.consigne),
          it.phrases.map((line, n) => {
            const words = parseSujet(line), m = res && res[n];
            return h('p', null, String.fromCharCode(97 + n) + '. ', words.flatMap((w, i) => [h('span', { class: m && m[i] === 'V' ? 'pv' : m && m[i] === 'S' ? 'ps' : '' }, w.w), ' ']));
          })));
      } else if (it.type === 'activite') {
        blocks.push(h('section', null, h('h3', null, it.titre + (it.consigne ? ' : ' + it.consigne : '')),
          h('p', null, res ? `Fait sur l’appli : ${res.firstTry} réussite(s) du premier coup sur ${res.total}.` : '(pas encore fait)')));
      } else if (it.type === 'mathador') {
        blocks.push(h('section', null, h('h3', null, `Mathador : ${it.nombres.join(' / ')} → ${it.cible}`),
          res ? res.log.map(l => h('p', null, l)) : h('p', null, '(pas encore fait)'),
          res ? h('p', null, h('b', null, `Résultat : ${res.best.toLocaleString('fr-FR')}`)) : null));
      }
    }
    const sheet = h('div', { id: 'print' },
      h('h1', null, `Devoirs de ${Z.state.name}`),
      h('p', { class: 'p-date' }, new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })),
      ...blocks);
    document.body.appendChild(sheet);
    setTimeout(() => window.print(), 100);
  }
})();
