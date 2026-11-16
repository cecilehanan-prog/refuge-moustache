/* =========================================================
   JEU 4 — LE PERMIS DE LA ROUTE (code de la route)
   ---------------------------------------------------------
   L'enfant roule sur une piste d'éducation routière, comme celle de
   l'APER (Attestation de Première Éducation à la Route, au programme
   de l'école primaire). Des situations arrivent sur la route :
   la trottinette s'arrête et l'animal guide demande « Que fais-tu ? ».
   • Tout est lu à voix haute, les choix sont des images + 2-3 mots.
   • Pas de chrono, pas de punition : en cas d'erreur, le guide explique
     la règle, puis on réessaie. La balade se termine toujours.
   • 8 situations par balade, tirées en priorité parmi celles qui ne
     sont pas encore bien sues (petite répétition espacée).
   ========================================================= */
(function () {
  const h = Z.h;
  const PER_RIDE = 8;

  /* Panneaux et objets dessinés en HTML/CSS (pas d'image à charger) */
  const OBJ = {
    feuRouge: () => light('red'), feuVert: () => light('green'), feuOrange: () => light('orange'),
    stop: () => h('div', { class: 'sign stop' }, 'STOP'),
    sensInterdit: () => h('div', { class: 'sign no-entry' }, h('i')),
    cedez: () => h('div', { class: 'sign yield' }),
    piste: () => h('div', { class: 'sign bike' }, '🚲'),
    warn: (sym) => h('div', { class: 'tri' }, h('div', { class: 'tri-in' }), h('b', null, sym)),
    prio: () => h('div', { class: 'sign prio' }, h('i')),
    pieton: () => h('div', { class: 'obj-emoji' }, '🚶'),
    emoji: (e) => h('div', { class: 'obj-emoji' }, e)
  };
  function light(on) {
    return h('div', { class: 'tlight' }, ['red', 'orange', 'green'].map(c => h('i', { class: c + (c === on ? ' on' : '') })));
  }

  /* Banque de situations, avec le vocabulaire du vrai code de la route (céder le passage, intersection, chaussée…)
     q = la question, o = 3 choix (le 1er est le bon), r = la règle expliquée */
  const SITUATIONS = [
    { id: 'casque', obj: ['emoji', '⛑️'], start: true, q: 'Avant de partir sur la piste, comment t\'équipes-tu ?',
      o: [['⛑️', 'Je mets mon casque et j\'attache la sangle'], ['🧢', 'Je mets ma casquette'], ['🎒', 'Je range mon casque dans le sac']],
      r: 'Le casque protège ta tête seulement s\'il est bien attaché : la sangle serrée sous le menton. Avec des gants et des chaussures fermées, tu es bien équipé.' },
    { id: 'cedez', obj: ['cedez'], q: 'Tu arrives à une intersection. Il y a ce triangle, pointe en bas, bordé de rouge. Que fais-tu ?',
      o: [['🐢', 'Je ralentis et je cède le passage'], ['🏎️', 'J\'ai la priorité, je passe'], ['🛑', 'Je m\'arrête obligatoirement, même si personne ne vient']],
      r: 'C\'est le panneau Cédez le passage. Je ralentis et je cède le passage aux véhicules de l\'autre route. Je m\'arrête seulement si quelqu\'un arrive.' },
    { id: 'stop', obj: ['stop'], q: 'Panneau STOP à l\'intersection, et personne ne vient. Que fais-tu ?',
      o: [['🛑', 'Je marque l\'arrêt complet, puis je cède le passage'], ['🐌', 'Je ralentis et je passe, la voie est libre'], ['📢', 'Je klaxonne et je passe']],
      r: 'Au STOP, l\'arrêt est obligatoire, même si la route est vide : je m\'arrête complètement à la ligne blanche. Puis je cède le passage avant de repartir.' },
    { id: 'prioDroite', obj: ['warn', '✖'], q: 'Ce triangle rouge avec une croix noire annonce une intersection. Une voiture arrive par ta droite. Que fais-tu ?',
      o: [['➡️', 'Je cède le passage à la voiture de droite'], ['🏁', 'Je passe en premier'], ['💨', 'J\'accélère pour passer avant elle']],
      r: 'C\'est la priorité à droite : à cette intersection, celui qui arrive par la droite passe en premier. Je lui cède le passage.' },
    { id: 'routePrio', obj: ['prio'], q: 'Tu roules sur une route avec ce panneau en losange jaune. Que signifie-t-il ?',
      o: [['🟨', 'Je suis sur une route prioritaire'], ['🐢', 'Je dois céder le passage'], ['🚧', 'La route est fermée']],
      r: 'Le losange jaune signifie : route prioritaire. Aux intersections, les autres me cèdent le passage. Mais je reste prudent, au cas où quelqu\'un ne respecte pas la règle.' },
    { id: 'giratoire', obj: ['warn', '🔄'], q: 'Tu arrives à un rond-point, un carrefour à sens giratoire. Qui a la priorité ?',
      o: [['🔄', 'Ceux qui roulent déjà dans l\'anneau'], ['🙋', 'Moi, puisque j\'arrive'], ['🏎️', 'Le plus rapide']],
      r: 'Au rond-point, je cède le passage à ceux qui sont déjà dans l\'anneau : ils arrivent par ma gauche. Puis je tourne dans le sens inverse des aiguilles d\'une montre.' },
    { id: 'feuRouge', obj: ['feuRouge'], q: 'Le feu est rouge, mais aucune voiture ne passe. Que fais-tu ?',
      o: [['🛑', 'Je m\'arrête avant la ligne d\'arrêt'], ['💨', 'Je passe, la voie est libre'], ['🚶', 'Je contourne par le trottoir']],
      r: 'Le feu rouge impose l\'arrêt absolu, même quand la voie est libre. Je m\'arrête avant la ligne blanche et j\'attends le vert.' },
    { id: 'feuOrange', obj: ['feuOrange'], q: 'Le feu passe à l\'orange fixe. Tu es encore loin du carrefour. Que fais-tu ?',
      o: [['🛑', 'Je m\'arrête'], ['🚀', 'J\'accélère pour passer'], ['📢', 'Je klaxonne pour prévenir']],
      r: 'L\'orange fixe annonce le rouge : je dois m\'arrêter, sauf si je suis déjà trop près pour freiner sans danger.' },
    { id: 'feuVert', obj: ['feuVert'], q: 'Le feu est vert, mais un piéton finit de traverser devant toi. Que fais-tu ?',
      o: [['✋', 'Je le laisse finir de traverser'], ['🟢', 'Je passe, c\'est vert pour moi'], ['↪️', 'Je le contourne rapidement']],
      r: 'Le vert m\'autorise à passer, mais jamais à mettre quelqu\'un en danger. Le piéton déjà engagé termine sa traversée.' },
    { id: 'pieton', obj: ['pieton'], q: 'Un piéton attend au bord du passage piéton. Il veut traverser. Que fais-tu ?',
      o: [['✋', 'Je ralentis et je lui cède le passage'], ['💨', 'Je passe avant lui'], ['🔔', 'Je sonne pour qu\'il attende']],
      r: 'Le piéton qui s\'engage, ou qui montre qu\'il veut traverser, est prioritaire. Je ralentis et je m\'arrête pour lui céder le passage.' },
    { id: 'sens', obj: ['sensInterdit'], q: 'Ce panneau rond et rouge, avec une barre blanche, est à l\'entrée d\'une rue. Que fais-tu ?',
      o: [['🚫', 'Je n\'entre pas : c\'est un sens interdit'], ['🐌', 'J\'entre doucement'], ['🚶', 'J\'entre par le trottoir']],
      r: 'Sens interdit : aucun véhicule ne peut entrer dans cette rue par ce côté. Je cherche un autre itinéraire.' },
    { id: 'piste', obj: ['piste'], q: 'Un panneau rond et bleu, avec un vélo blanc. Que t\'indique-t-il ?',
      o: [['🚲', 'Une piste cyclable obligatoire'], ['🚫', 'Interdit aux vélos'], ['🅿️', 'Un parking à vélos']],
      r: 'Les panneaux ronds et bleus indiquent une obligation. Celui-ci signale une piste cyclable obligatoire : les vélos et les trottinettes doivent l\'emprunter.' },
    { id: 'trottoir', obj: ['emoji', '🚶‍♂️🚶‍♀️'], q: 'Le trottoir est plein de piétons et tu veux avancer. Que fais-tu ?',
      o: [['🚶', 'Je descends et je pousse ma trottinette'], ['🐢', 'Je roule doucement sur le trottoir'], ['🔔', 'Je sonne pour qu\'ils s\'écartent']],
      r: 'Rouler en trottinette électrique sur le trottoir est interdit. Sur le trottoir, je redeviens piéton : je descends et je marche à côté.' },
    { id: 'bras', obj: ['emoji', '↩️'], q: 'Tu veux tourner à gauche. Que fais-tu avant ?',
      o: [['🫲', 'Je regarde derrière moi et je tends le bras gauche'], ['🤐', 'Je tourne directement'], ['🫱', 'Je tends le bras droit']],
      r: 'Avant de changer de direction, je contrôle derrière moi, puis j\'indique ma direction en tendant le bras du côté où je vais tourner.' },
    { id: 'angleMort', obj: ['emoji', '🚚'], q: 'Un camion est arrêté à côté de toi au carrefour. Où te places-tu ?',
      o: [['👀', 'Loin de lui, là où le chauffeur me voit'], ['🛞', 'Juste à côté de sa roue'], ['⬆️', 'Tout près, devant sa cabine']],
      r: 'Autour d\'un camion ou d\'un bus, il y a des angles morts : des zones où le chauffeur ne me voit pas. Si je ne vois pas ses yeux dans le rétroviseur, il ne me voit pas.' },
    { id: 'portiere', obj: ['emoji', '🚗'], q: 'Tu longes des voitures en stationnement. Où roules-tu ?',
      o: [['↔️', 'À environ un mètre des portières'], ['🤏', 'Tout contre les voitures'], ['🛣️', 'Au milieu de la chaussée']],
      r: 'Une portière peut s\'ouvrir brusquement. Je garde environ un mètre entre moi et les voitures en stationnement.' },
    { id: 'sirene', obj: ['emoji', '🚑'], q: 'Une ambulance arrive derrière toi, sirène et gyrophare allumés. Que fais-tu ?',
      o: [['↘️', 'Je me range pour faciliter son passage'], ['🛴', 'Je continue sans m\'en occuper'], ['🚀', 'J\'accélère devant elle']],
      r: 'Les véhicules prioritaires, comme les ambulances, les pompiers ou la police, passent avant tout le monde quand leur sirène fonctionne. Je me range et je les laisse passer.' },
    { id: 'bus', obj: ['emoji', '🚌'], q: 'Un bus est arrêté à l\'arrêt, des enfants en descendent. Que fais-tu ?',
      o: [['🐢', 'Je ralentis : un piéton peut surgir'], ['💨', 'Je dépasse vite le bus'], ['📢', 'Je klaxonne en passant']],
      r: 'Des piétons peuvent traverser devant ou derrière le bus sans regarder. Je ralentis et je suis prêt à m\'arrêter.' },
    { id: 'nuit', obj: ['emoji', '🌙'], night: true, q: 'La nuit tombe. Quel équipement est obligatoire ?',
      o: [['💡', 'Mes feux allumés et un gilet rétroréfléchissant'], ['🕶️', 'Des lunettes de soleil'], ['🌑', 'Rien, je connais la route']],
      r: 'La nuit, je dois être vu : feux avant et arrière allumés, et un gilet ou un brassard rétroréfléchissant qui brille dans les phares.' },
    { id: 'ecouteurs', obj: ['emoji', '🎧'], q: 'As-tu le droit de rouler avec des écouteurs ?',
      o: [['👂', 'Non, c\'est interdit'], ['🔉', 'Oui, si le son est bas'], ['☝️', 'Oui, avec une seule oreillette']],
      r: 'Porter des écouteurs, même un seul, est interdit en roulant : je dois entendre les klaxons, les sirènes et les autres usagers.' },
    { id: 'copain', obj: ['emoji', '👦'], q: 'Ton copain veut monter sur ta trottinette avec toi. Que réponds-tu ?',
      o: [['☝️', 'Non, c\'est fait pour une seule personne'], ['🤝', 'Oui, s\'il se tient bien'], ['🐢', 'Oui, si on roule doucement']],
      r: 'Transporter un passager est interdit sur une trottinette électrique. À deux, on perd l\'équilibre et on freine mal.' },
    { id: 'telephone', obj: ['emoji', '📱'], q: 'Ton téléphone sonne pendant que tu roules. Que fais-tu ?',
      o: [['🅿️', 'Je m\'arrête en sécurité, puis je réponds'], ['📞', 'Je réponds en roulant d\'une main'], ['👀', 'Je regarde l\'écran en roulant']],
      r: 'Tenir son téléphone en roulant est interdit. Je m\'arrête sur le côté, hors de la chaussée, puis je réponds.' },
    { id: 'ecole', obj: ['warn', '🚸'], q: 'Ce triangle avec deux enfants est au bord de la route. Que fais-tu ?',
      o: [['🐌', 'Je ralentis et je redouble d\'attention'], ['🛴', 'Je garde ma vitesse'], ['💨', 'J\'accélère pour passer vite']],
      r: 'Ce panneau de danger signale un endroit fréquenté par des enfants, souvent une école. Ils peuvent surgir à tout moment : je ralentis.' },
    { id: 'ballon', obj: ['emoji', '⚽'], q: 'Un ballon traverse la chaussée devant toi ! Que fais-tu ?',
      o: [['🛑', 'Je freine : un enfant peut le suivre'], ['↪️', 'Je l\'évite et je continue'], ['🦵', 'Je shoote dedans']],
      r: 'Derrière un ballon, il y a souvent un enfant qui court sans regarder. Je freine et je m\'arrête.' },
    { id: 'descente', obj: ['warn', '⛰️'], q: 'Ce triangle annonce une descente dangereuse. Que fais-tu ?',
      o: [['🐢', 'Je ralentis et je freine progressivement'], ['🚀', 'Je me laisse filer'], ['💥', 'Je freine d\'un coup tout en bas']],
      r: 'Dans une descente, la vitesse augmente toute seule. Je freine doucement et régulièrement, avec les deux freins, pour garder le contrôle.' },
    { id: 'depasser', obj: ['emoji', '🚴'], q: 'Tu veux dépasser un cycliste plus lent. Comment fais-tu ?',
      o: [['⬅️', 'Je contrôle derrière et je le dépasse par la gauche'], ['➡️', 'Je le dépasse par la droite'], ['🤏', 'Je le frôle pour aller vite']],
      r: 'On dépasse par la gauche, après avoir contrôlé derrière soi, en laissant un bon espace sur le côté.' },
    { id: 'train', obj: ['emoji', '🚆'], q: 'Au passage à niveau, les feux rouges clignotent et la sonnerie retentit. Que fais-tu ?',
      o: [['🛑', 'Je m\'arrête et j\'attends'], ['💨', 'Je passe vite avant le train'], ['🚧', 'Je passe entre les barrières']],
      r: 'Feux rouges clignotants au passage à niveau : un train arrive. L\'arrêt est obligatoire, et je ne m\'engage jamais.' }
  ];
  Z.ROUTE_COUNT = SITUATIONS.length;
  ZDATA.routeKnown = () => SITUATIONS.filter(s => ((Z.state.route || {})[s.id] || 0) >= 2).length;

  Z.screens.route = function () { start(); };

  function pickRide() {
    const st = Z.state.route || (Z.state.route = {});
    const score = (s) => (st[s.id] || 0) + Math.random() * 0.8;   // les moins sues d'abord
    const first = SITUATIONS.find(s => s.start);
    const others = SITUATIONS.filter(s => !s.start).sort((a, b) => score(a) - score(b)).slice(0, PER_RIDE - 1);
    const list = [first].concat(Z.shuffle(others));
    // Arrêts "recharge" : révision d'un mot (guide des mots) et d'une table (guide des tables) DÉJÀ vus dans les autres jeux
    const word = Z.shuffle(Z.allWords().filter(w => Z.state.words[w.id]))[0];
    const fact = Z.shuffle(Object.keys(Z.state.facts).filter(k => k.split('x').some(n => +n >= 6)))[0]
      || Z.shuffle(Object.keys(Z.state.facts))[0];
    if (word) list.splice(3, 0, { bonus: 'word', w: word });
    list.splice(5, 0, { bonus: 'market' });            // arrêt au marché : rendu de monnaie
    if (fact) list.splice(word ? 8 : 6, 0, { bonus: 'fact', k: fact });
    return list;
  }

  /* --- Le marché : total des achats, puis monnaie rendue (calcul mental, compléments) --- */
  const FRUITS = [['🍎', 'des pommes'], ['🍌', 'des bananes'], ['🍊', 'des oranges'], ['🍓', 'des fraises'], ['🍐', 'des poires'],
    ['🥕', 'des carottes'], ['🍇', 'du raisin'], ['🥖', 'une baguette'], ['🧀', 'du fromage'], ['🍉', 'une pastèque']];
  function marketQuiz() {
    const f = Z.shuffle(FRUITS);
    const lvl = Z.rand(3);
    let items, bill;
    if (lvl === 0) { items = [[f[0], 2 + Z.rand(7)]]; bill = 10; }                        // 1 article, billet de 10
    else if (lvl === 1) { const a = 2 + Z.rand(7), b = 2 + Z.rand(Math.min(8, 18 - a)); items = [[f[0], a], [f[1], b]]; bill = 20; }  // 2 articles, billet de 20
    else { items = [[f[0], 11 + Z.rand(30)]]; bill = 50; }                                 // 1 article plus cher, billet de 50
    const total = items.reduce((n, it) => n + it[1], 0);
    const change = bill - total;
    const set = new Set([change]);
    [change + 1, change - 1, change + 10, total, change + 2].forEach(v => { if (set.size < 3 && v > 0 && v !== change) set.add(v); });
    const buy = items.map(([[e, n], p]) => `${n} à ${p} euros`).join(' et ');
    const explain = (items.length > 1 ? `D'abord le total : ${items.map(it => it[1]).join(' plus ')} égale ${total} euros. ` : '')
      + `${items.length > 1 ? 'Ensuite on' : 'On'} complète : de ${total} pour aller jusqu'à ${bill}, il manque ${change}. On te rend ${change} euros.`;
    return { items, bill, total, change, opts: Z.shuffle([...set]), buy, explain };
  }

  /* --- Révision d'un mot : retrouver le morceau qui manque (le "piège") --- */
  function wordQuiz(w) {
    const p = Z.parseWord(w.s);
    const units = p.syl.length >= 2 ? p.syl.map(s => ({ t: s.text, segs: s.segs })) : p.syl[0].segs.map(sg => ({ t: sg.t, segs: [sg] }));
    let idx = units.findIndex(u => u.segs.some(sg => sg.k === 'trick'));
    if (idx < 0) idx = units.findIndex(u => u.segs.some(sg => sg.k === 'mute'));
    if (idx < 0) idx = Z.rand(units.length);
    const u = units[idx];
    let wrong = null;
    for (const sg of u.segs) {
      if (sg.k === 'trick') { const a = (ZDATA.alts[sg.t.toLowerCase()] || [])[0]; if (a !== undefined) { wrong = u.segs.map(x => x === sg ? a : x.t).join(''); break; } }
      if (sg.k === 'mute') { wrong = u.segs.length > 1 ? u.segs.filter(x => x !== sg).map(x => x.t).join('') : (sg.t === 's' ? 't' : 's'); break; }
    }
    if (!wrong || wrong === u.t) wrong = Z.pick(['a', 'o', 'é', 'e', 'an', 'on'].filter(x => x !== u.t));
    return { p, units, idx, good: u.t, wrong, word: p.word };
  }

  function factQuiz(k) {
    let [a, b] = k.split('x').map(Number);
    if (Math.random() < .5) [a, b] = [b, a];
    const r = a * b, set = new Set([r]);
    [r + a, r - b, Number(String(r).split('').reverse().join('')), r + 1, r - 1].forEach(v => { if (set.size < 3 && v > 0 && v !== r && v % 1 === 0) set.add(v); });
    return { a, b, r, opts: Z.shuffle([...set]) };
  }

  function start() {
    const shell = Z.shell({ title: Z.titre('parcours') });
    const ride = pickRide();
    let i = 0, points = 0;

    // --- la scène : ciel, décor qui défile, route, l'enfant sur sa trottinette ---
    const scene = h('div', { class: 'ride' },
      h('div', { class: 'ride-deco' }, '🌳   🏠      🌳 🌳     🏢    🌳     🏠   🌳'),
      h('div', { class: 'ride-road' }),
      h('div', { class: 'ride-obj' }),
      Z.svg(Z.art.rider(), 'ride-me'));
    const objBox = scene.querySelector('.ride-obj');
    const panel = h('div', { class: 'col' });
    const score = h('div', { class: 'chip', style: { alignSelf: 'center' } }, '🪪 0 point');
    const setScore = () => { score.textContent = `🪪 ${points} point${points > 1 ? 's' : ''} de permis`; };

    const intro = () => {
      shell.clear(); shell.setSteps(ride.length, 0);
      const t = `Salut ${Z.state.name} ! Moi c'est ${Z.guide('parcours').nom}. Aujourd'hui, tu passes ton permis de la route, en trottinette sur la piste ! Sur la route, il y aura des panneaux et des surprises. À chaque fois, je te demande ce que tu fais. ${ZDATA.remplir('Prêt@e')} ? En selle !`;
      shell.root.append(h('h2', null, '🪪 ' + Z.titre('parcours')), Z.guideSays(t, { speak: false }), scene,
        h('button', { class: 'btn green wide', onclick: () => { Z.sfx.vroum(); shell.clear(); shell.root.append(scene, score, panel); setScore(); next(); } }, '🛴 En route !'));
      scene.classList.add('paused');
      Z.speak(t);
    };

    const next = () => {
      if (i >= ride.length) return finish();
      const s = ride[i];
      shell.setSteps(ride.length, i);
      panel.innerHTML = '';
      objBox.innerHTML = '';
      objBox.className = 'ride-obj';
      scene.classList.toggle('night', !!s.night);
      scene.classList.remove('paused');
      Z.sfx.vroum();
      // l'objet arrive de la droite, puis la trottinette s'arrête devant
      const [kind, arg] = s.bonus ? ['emoji', s.bonus === 'market' ? '🧺' : '🔋'] : s.obj;
      const el = OBJ[kind](arg);
      objBox.appendChild(el);
      if (s.id === 'pieton') objBox.appendChild(h('div', { class: 'zebra' }));
      void objBox.offsetWidth;
      objBox.classList.add('come');
      setTimeout(() => { scene.classList.add('paused'); Z.sfx.click(); s.bonus ? askBonus(s) : ask(s); }, 2300);
    };

    /* Arrêt recharge : le guide des mots ou des tables fait réviser, puis on repart */
    let bonusE = 0;
    const askBonus = (s) => {
      panel.innerHTML = '';
      const who = s.bonus === 'word' ? 'mots' : 'tables';
      const prev = Z.narrator; Z.narrator = who;
      const done = (first) => {
        const gain = first ? 3 : 1; bonusE += gain;
        Z.sfx.coin(); Z.pop(`🔋 +${gain} ⚡`, 'gold');
        setTimeout(() => { Z.narrator = prev; i++; next(); }, 1700);
      };
      let miss = 0;
      if (s.bonus === 'market') {
        const q = marketQuiz();
        const t = `Petit arrêt au marché avec ${Z.guide('tables').nom} ! Tu achètes ${q.buy}. Tu paies avec un billet de ${q.bill} euros. Combien d'euros la marchande te rend-elle ?`;
        const tags = h('div', { class: 'row', style: { justifyContent: 'center', flexWrap: 'wrap', gap: '12px' } },
          q.items.map(([[e], p]) => h('div', { class: 'price-tag' }, h('span', { style: { fontSize: '2.2em' } }, e), h('b', null, `${p} €`))),
          h('div', { style: { fontSize: '1.6em' } }, '➡️'),
          h('div', { class: 'bill b' + q.bill }, `${q.bill} €`));
        const help = h('div');
        const grid = h('div', { class: 'choices', style: { gridTemplateColumns: '1fr 1fr 1fr' } }, q.opts.map(v => {
          const b = h('button', {
            class: 'choice', onclick: () => {
              if (grid.dataset.done || b.classList.contains('bad')) return;
              if (v === q.change) {
                grid.dataset.done = '1'; b.classList.add('good'); Z.sfx.good();
                help.innerHTML = ''; help.appendChild(h('div', { class: 'card rule' }, '🪙 ', q.explain));
                Z.speak(`Bravo ! ${q.explain}`).then(() => done(!miss));
              } else {
                miss++; b.classList.add('bad'); Z.sfx.bad();
                help.innerHTML = ''; help.appendChild(h('div', { class: 'card rule' }, '💡 ', q.items.length > 1 ? `Calcule d'abord le total. Puis compte en avançant jusqu'à ${q.bill}.` : `Compte en avançant : de ${q.total} jusqu'à ${q.bill}, combien de pas ?`));
                Z.speak(q.items.length > 1 ? `Calcule d'abord le total. Puis compte en avançant jusqu'à ${q.bill}.` : `Compte en avançant : de ${q.total} jusqu'à ${q.bill}, combien de pas ?`);
              }
            }
          }, `${v} €`);
          return b;
        }));
        panel.append(Z.guideSays(t, { speak: false, who: 'tables' }), h('div', { class: 'card' }, tags), grid, help);
        Z.speak(t);
        return;
      }
      if (s.bonus === 'word') {
        const q = wordQuiz(s.w);
        const t = `Recharge ta batterie avec ${Z.guide('mots').nom} ! Écoute le mot : ${q.word}. Quel morceau manque ?`;
        const wordEl = h('div', { class: 'word big center' }, q.units.map((u, k) =>
          k === q.idx ? h('span', { class: 'slot next', style: { display: 'inline-grid', minWidth: '60px' } }, '?') : h('span', { class: 'syl s' + (k % 2) }, u.t)));
        const grid = h('div', { class: 'tiles' }, Z.shuffle([q.good, q.wrong]).map(txt => {
          const b = h('button', {
            class: 'tile', onclick: () => {
              if (grid.dataset.done || b.classList.contains('used')) return;
              if (txt === q.good) {
                grid.dataset.done = '1'; Z.sfx.good();
                wordEl.replaceWith(h('div', { class: 'center' }, Z.wordEl(q.p, { big: true })));
                Z.speak(q.word); done(!miss);
              } else { miss++; Z.sfx.bad(); b.classList.add('shake'); Z.speak('Presque ! Écoute bien le mot : ' + q.word); }
            }
          }, txt);
          return b;
        }));
        panel.append(Z.guideSays(t, { speak: false, who }),
          h('div', { class: 'card col center' }, h('div', { class: 'row', style: { justifyContent: 'center' } }, h('span', { style: { fontSize: '2.4em' } }, s.w.e), Z.ear(() => q.word, { rate: .75 })), wordEl), grid);
        Z.speak(t);
      } else {
        const q = factQuiz(s.k);
        const t = `Recharge ta batterie avec ${Z.guide('tables').nom} ! ${q.a} fois ${q.b} ?`;
        const grid = h('div', { class: 'choices', style: { gridTemplateColumns: '1fr 1fr 1fr' } }, q.opts.map(v => {
          const b = h('button', {
            class: 'choice', onclick: () => {
              if (grid.dataset.done || b.classList.contains('bad')) return;
              if (v === q.r) { grid.dataset.done = '1'; b.classList.add('good'); Z.sfx.good(); Z.speak(`${q.a} fois ${q.b} égale ${q.r} !`).then(() => done(!miss)); }
              else { miss++; b.classList.add('bad'); Z.sfx.bad(); Z.speak('Pas grave, cherche encore.'); }
            }
          }, String(v));
          return b;
        }));
        panel.append(Z.guideSays(t, { speak: false, who }),
          h('div', { class: 'card center' }, h('div', { class: 'question' }, `${q.a} × ${q.b}`)), grid);
        Z.speak(t);
      }
    };

    const ask = (s) => {
      let miss = 0;
      const opts = Z.shuffle(s.o.map((o, k) => ({ e: o[0], t: o[1], ok: k === 0 })));
      const list = h('div', { class: 'col' }, opts.map(o => {
        const b = h('button', {
          class: 'opt', onclick: () => {
            if (b.classList.contains('bad') || list.dataset.done) return;
            if (o.ok) {
              list.dataset.done = '1';
              b.classList.add('good'); Z.sfx.good();
              const st = Z.state.route;
              st[s.id] = miss ? 0 : (st[s.id] || 0) + 1;
              if (!miss) { points++; setScore(); Z.pop('+1 🪪', 'gold'); }
              Z.save();
              list.after(h('div', { class: 'card rule' }, h('b', null, '✅ La règle : '), s.r, ' ', Z.ear(s.r)));
              (async () => {
                await Z.speak((miss ? 'Voilà ! ' : Z.pick(['Bravo ! ', 'Parfait ! ', 'Super prudent ! '])) + s.r);
                i++;
                setTimeout(next, 400);
              })();
            } else {
              miss++; b.classList.add('bad'); Z.sfx.bad();
              Z.speak('Oh non, c\'est dangereux ! ' + s.r + ' Essaie encore.');
            }
          }
        }, h('span', { style: { fontSize: '1.6em' } }, o.e), h('span', null, o.t), Z.ear(o.t));
        return b;
      }));
      panel.innerHTML = '';
      panel.append(Z.guideSays(s.q, { speak: false }), list);
      Z.speak(s.q);
    };

    const finish = () => {
      scene.classList.remove('night');
      const nRules = ride.filter(s => !s.bonus).length;
      const medal = points >= nRules ? '🥇' : points >= nRules - 2 ? '🥈' : '🥉';
      const known = SITUATIONS.filter(s => (Z.state.route[s.id] || 0) >= 2).length;
      Z.endScreen(shell, {
        medal: '🪪' + medal, kind: 'route', eclairs: 8 + points * 2 + bonusE, xp: 15 + points * 3,
        title: points >= nRules ? 'Permis parfait, as de la route !' : 'Balade réussie !',
        lines: [`${points} point(s) de permis sur ${nRules}`, bonusE ? `🔋 Recharges de révision : +${bonusE} ⚡` : '', `Règles de la route bien sues : ${known} / ${SITUATIONS.length}`, 'Tu roules prudent comme un vrai pilote 🛴'].filter(Boolean),
        detail: ride.map(s => s.id).join(','),
        again: () => Z.go('route')
      });
    };

    intro();
  }
})();
