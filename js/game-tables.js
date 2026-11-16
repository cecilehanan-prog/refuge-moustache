/* =========================================================
   JEU 2 — GRAND PRIX DES TABLES (de 1 à 11, priorité ×6 ×7 ×8 ×9)
   ---------------------------------------------------------
   • La question est dite dans les deux sens (« 6 fois 2, 2 fois 6 ? ») et,
     quand c'est juste, la voix confirme dans un sens : « 6 fois 2 égale 12 ! »
   • Chaque NOUVEAU résultat est d'abord montré et dit
     avant d'être demandé : on apprend sans échec.
   • Choix pédagogique : JUSTE les tables. Seules les astuces très simples
     restent (×10, ×9, ×5 finit par 0 ou 5, ×2 double, ×3 somme des chiffres) ; les autres viendront plus tard.
   • Récupération active + répétition espacée par résultat.
   • Pas de chrono qui punit : la course se gagne TOUJOURS (10 bonnes
     réponses). Les erreurs reviennent 2 et 5 questions plus tard.
   • Mélange avec des résultats faciles (×2 ×5 ×10) pour garder ~80 % de
     réussite : c'est ce qui maintient la motivation.
   ========================================================= */
(function () {
  const h = Z.h;
  Z.factKey = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);

  /* Toutes les tables de 1 à 11 (choix pédagogique). Ordre : d'abord ×6 à ×9
     (là où il bloque), puis ×3 ×4 ×11, puis les faciles ×2 ×5 ×10 ×1. */
  const TARGET = [];
  for (const a of [6, 7, 8, 9, 3, 4, 11, 2, 5, 10, 1]) for (let b = 1; b <= 10; b++) {
    const k = Z.factKey(a, b);
    if (!TARGET.includes(k)) TARGET.push(k);
  }
  const EASY = ['2x3', '2x4', '5x4', '5x3', '2x10', '5x10', '3x10', '4x10', '2x5', '5x5', '3x3', '4x2'];
  const GOAL = 10;

  Z.screens.tables = function () { start(); };

  function buildQueue() {
    const st = Z.state.facts;
    const learning = TARGET.filter(k => st[k] && Z.isDue(st[k])).sort((a, b) => st[a].box - st[b].box).slice(0, 6);
    const fresh = TARGET.filter(k => !st[k]).slice(0, Math.max(2, 4 - Math.floor(learning.length / 2)));
    let old = learning.slice();
    if (old.length + fresh.length < 6) {
      const rest = TARGET.filter(k => !old.includes(k) && !fresh.includes(k) && st[k]).sort((a, b) => st[a].box - st[b].box);
      old = old.concat(rest.slice(0, 6 - old.length - fresh.length));
    }
    const easy = Z.shuffle(EASY).map(k => { const [a, b] = k.split('x').map(Number); return Z.factKey(a, b); });
    // 1 facile pour démarrer, puis anciens et nouveaux mélangés,
    // et chaque nouveau résultat est redemandé plus tard (récupération espacée)
    let q = [{ k: easy[0] }];
    const mid = Z.shuffle(old.map(k => ({ k })).concat(fresh.map(k => ({ k, isNew: true }))));
    q = q.concat(mid);
    q.splice(Math.min(4, q.length), 0, { k: easy[1] });
    Z.shuffle(fresh).forEach(k => q.push({ k }));
    old.slice(0, 2).forEach(k => q.push({ k }));
    q.push({ k: easy[2] });
    return q;
  }

  /* Astuces gardées : seulement les plus simples pour un CM1 */
  function simpleTip(a, b) {
    const r = a * b, other = (n) => a === n ? b : a;
    if (a === 1 || b === 1) { const n = other(1); return `Fois 1, le nombre ne change pas : ${n}.`; }
    if ((a === 11 && b < 10) || (b === 11 && a < 10)) { const n = other(11); return `Fois 11 : on écrit le chiffre deux fois. ${n} devient ${r}.`; }
    if (a === 10 || b === 10) { const n = other(10); return `Fois 10 : on ajoute un zéro. ${n} devient ${r}.`; }
    if (a === 9 || b === 9) { const n = other(9); return `Astuce du 9 : ${n} fois 10 égale ${n * 10}, on enlève ${n}, ça fait ${r}.`; }
    if (a === 5 || b === 5) return `Dans la table du 5, les résultats finissent toujours par 0 ou par 5. ${r} finit par ${r % 10}.`;
    if (a === 2 || b === 2) { const n = other(2); return `Fois 2, c'est le double : ${n} plus ${n} égale ${r}.`; }
    if (a === 3 || b === 3) {
      if (r < 10) return `Dans la table du 3, les résultats sont 3, 6, 9, 12, 15… ${r} en fait partie.`;
      const d = String(r).split('').map(Number), sum = d[0] + d[1];
      return `Dans la table du 3, on additionne les chiffres du résultat : ${d[0]} plus ${d[1]} égale ${sum}, et ${sum} est dans la table du 3.`;
    }
    return null;
  }

  /* Choix pédagogique : la QUESTION dans les deux sens (« 6 fois 2, 2 fois 6 ? »),
     ça l'aide. La RÉPONSE dans un seul sens : « 6 fois 2 égale 12 ! » */
  const dit = (a, b) => `${a} fois ${b}`;
  const dit2 = (a, b) => a === b ? `${a} fois ${b}` : `${a} fois ${b}, ${b} fois ${a}`;
  const vu = (a, b, res) => h('div', { class: 'question' }, `${a} × ${b}${res !== undefined ? ' = ' + res : ''}`);
  const vu2 = (a, b) => h('div', { class: 'col center', style: { gap: '2px' } },
    h('div', { class: 'question' }, `${a} × ${b}`),
    a === b ? null : h('div', { class: 'question q2' }, `${b} × ${a}`));

  function choicesFor(a, b) {
    const r = a * b, set = new Set();
    const cands = Z.shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, r + 10, r - 10, r + 1, r - 1, r + 2]);
    const swap = Number(String(r).split('').reverse().join(''));
    if (r >= 10 && r % 10 !== 0 && swap !== r) cands.unshift(swap);          // inversion de chiffres (56/65), fréquente chez les dys
    for (const c of cands) { if (c > 0 && c !== r) set.add(c); if (set.size >= 3) break; }
    return Z.shuffle([r, ...set]);
  }

  function start() {
    const shell = Z.shell({ title: Z.titre('tables') });
    let queue = buildQueue();
    let correct = 0, errors = 0, streak = 0, bonus = 0;
    const firstTry = {};

    const track = h('div', { class: 'track' }, h('div', { class: 'finish' }));
    const me = Z.svg(Z.hero(), 'me');
    track.appendChild(me);
    const moveMe = () => { me.style.left = `calc((100% - 126px) * ${correct / GOAL})`; me.classList.toggle('turbo', streak >= 3); };

    const intro = () => {
      shell.clear(); shell.setSteps(GOAL, 0);
      const t = `Salut ${Z.state.name}, moi c'est ${Z.guide('tables').nom}, ton coach des maths ! Bienvenue au ${Z.titre('tables').replace(/^Le /, '')}. Dix bonnes réponses et tu passes la ligne d'arrivée. Prends ton temps, il n'y a pas de chrono.`;
      shell.root.append(h('h2', null, '🏁 ' + Z.titre('tables')), Z.guideSays(t, { speak: false }),
        h('div', { class: 'card center' }, h('div', { class: 'emoji-big' }, ZDATA.univers.emojiCourse)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, ZDATA.univers.depart));
      Z.speak(t);
    };

    const ask = () => {
      if (correct >= GOAL) return finish();
      if (!queue.length) queue = buildQueue().map(x => ({ k: x.k }));
      const item = queue.shift();
      let [a, b] = item.k.split('x').map(Number);
      if (Math.random() < .5) [a, b] = [b, a];
      if (item.isNew && !Z.state.facts[item.k]) return teach(a, b, item, () => question(a, b, item));
      question(a, b, item);
    };

    const teach = (a, b, item, next) => {
      shell.clear(); shell.setSteps(GOAL, correct);
      const tip = simpleTip(a, b);
      const t = `Nouveau résultat ! ${dit(a, b)} égale ${a * b}.` + (tip ? ' ' + tip : '');
      shell.root.append(track,
        h('h2', null, '✨ Nouveau résultat à apprendre'),
        h('div', { class: 'card center col' },
          h('div', { class: 'row', style: { justifyContent: 'center' } },
            vu(a, b, a * b), Z.ear(`${dit(a, b)} égale ${a * b}`)),
          tip ? h('div', { class: 'tip' }, '💡 ', tip) : null),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.tap(); item.isNew = false; next(); } }, 'Je l\'ai retenu ! ➡️'));
      moveMe();
      Z.speak(t);
    };

    const question = (a, b, item) => {
      shell.clear(); shell.setSteps(GOAL, correct);
      const r = a * b, t0 = Date.now();
      let tries = 0;
      const turbo = h('div', { class: 'streak-turbo' }, streak >= 3 ? `🔥 TURBO × ${streak} !` : '');
      const qText = `${dit2(a, b)} ?`;
      const grid = h('div', { class: 'choices' });
      choicesFor(a, b).forEach(v => {
        const btn = h('button', {
          class: 'choice', onclick: () => {
            if (btn.classList.contains('bad') || grid.dataset.done) return;
            tries++;
            if (v === r) {
              grid.dataset.done = '1';
              btn.classList.add('good'); Z.sfx.good();
              const fast = Date.now() - t0 < 5000;
              if (tries === 1) { streak++; if (!(item.k in firstTry)) firstTry[item.k] = true; }
              else { streak = 0; }
              correct++;
              if (streak >= 3 && fast) { bonus++; Z.pop('🔥 Turbo +1 ⚡', 'gold'); } else Z.pop('✓', '');
              moveMe(); Z.sfx.vroum();
              // on entend la table entière dans les deux sens (« Bravo ! 6 fois 4, 4 fois 6, 24 ! ») avant la suivante
              Z.speak(`${dit(a, b)} égale ${r} !`).then(() => setTimeout(ask, 500));
            } else {
              errors++; streak = 0;
              if (!(item.k in firstTry)) firstTry[item.k] = false;
              btn.classList.add('bad'); Z.sfx.bad();
              // la même question reviendra un peu plus tard
              queue.splice(Math.min(2, queue.length), 0, { k: item.k });
              queue.splice(Math.min(5, queue.length), 0, { k: item.k });
              help(a, b, r, grid, tries);
            }
          }
        }, String(v));
        grid.appendChild(btn);
      });
      shell.root.append(track, turbo,
        h('div', { class: 'card center' }, h('div', { class: 'row', style: { justifyContent: 'center' } }, vu2(a, b), Z.ear(qText))),
        grid, h('div', { id: 'help' }));
      moveMe();
      Z.speak(qText);
    };

    const help = (a, b, r, grid, tries) => {
      const box = document.getElementById('help');
      box.innerHTML = '';
      if (tries < 2) {
        const tip = simpleTip(a, b);
        if (tip) box.appendChild(h('div', { class: 'card tip' }, '💡 ', tip, ' ', Z.ear(tip)));
        Z.speak(`Pas grave, essaie encore. ${tip || ''} ${dit2(a, b)} ?`); return;
      }
      // 2e erreur : on montre simplement la table, sans explication
      [...grid.children].forEach(btn => { if (Number(btn.textContent) === r) btn.classList.add('hint-good'); });
      box.appendChild(h('div', { class: 'card center' }, h('div', { class: 'row', style: { justifyContent: 'center' } },
        vu(a, b, r), Z.ear(`${dit(a, b)} égale ${r}`))));
      Z.speak(`${dit(a, b)} égale ${r}. Appuie sur ${r}.`);
    };

    const finish = () => {
      for (const k in firstTry) Z.srsUpdate(Z.state.facts, k, firstTry[k]);
      Z.save();
      const medal = errors <= 1 ? '🥇' : errors <= 3 ? '🥈' : '🥉';
      const known = TARGET.filter(k => Z.state.facts[k] && Z.state.facts[k].box >= 4).length;
      Z.endScreen(shell, {
        medal, kind: 'tables', eclairs: 12 + bonus, xp: 20 + Math.max(0, 10 - errors * 2),
        title: errors <= 1 ? 'Victoire au Grand Prix !' : 'Ligne d\'arrivée franchie !',
        lines: [`${errors} erreur(s) · ${bonus} turbo(s)`, `Tables 6-9 connues par cœur : ${known} / ${TARGET.length}`],
        detail: Object.keys(firstTry).join(','),
        again: () => Z.go('tables')
      });
    };

    intro();
  }
})();
