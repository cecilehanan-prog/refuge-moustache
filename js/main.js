/* =========================================================
   ÉCRANS : accueil, garage (boutique), album, coffre, parents
   ========================================================= */
const { h } = Z;
const app = document.getElementById('app');
const U = ZDATA.univers;
/* Titre d'un jeu : celui de profil.js, sinon celui proposé par l'univers */
Z.titre = (jeu) => (PROFIL.appli.jeux && PROFIL.appli.jeux[jeu]) || U.jeux[jeu] || jeu;
document.title = PROFIL.appli.nom;
/* Niveau, style et aides dys : appliqués à toute l'appli */
Z.appliquerAides = function () {
  const S = Z.state.settings, b = document.body, r = document.documentElement.style;
  b.classList.toggle('ado', Z.ADO);
  b.classList.toggle('lycee', Z.TON === 'lycee');
  Z.ADAPTATIONS.forEach(([x]) => b.classList.toggle('adapt-' + x, Z.adapte(x)));
  b.classList.toggle('main-droite', S.main === 'droite');
  b.classList.toggle('main-gauche', S.main === 'gauche');
  b.classList.toggle('lignes-couleur', !!S.lignes);
  b.classList.toggle('sans-guides', !Z.GUIDES);
  b.classList.toggle('sans-syllabes', S.syllabes === false);
  b.classList.toggle('serre', S.espacement === false);
  r.setProperty('--police', { lexend: "'Lexend', Verdana, sans-serif", arial: 'Arial, Verdana, sans-serif' }[S.police] || "'Andika', Verdana, Arial, sans-serif");
  r.setProperty('--taille', String(S.taille || 1));
};
Z.appliquerAides();
document.documentElement.style.setProperty('--blue', (PROFIL.couleurs && PROFIL.couleurs.principale) || '#2563eb');
if (PROFIL.couleurs && PROFIL.couleurs.fond) document.documentElement.style.setProperty('--bg', PROFIL.couleurs.fond);
(function () { const m = document.querySelector('meta[name="theme-color"]'); if (m && PROFIL.couleurs) m.content = PROFIL.couleurs.principale; const t = document.querySelector('meta[name="apple-mobile-web-app-title"]'); if (t) t.content = PROFIL.appli.nomCourt || PROFIL.appli.nom; })();


Z.go = function (name, ...args) {
  Z.stopSpeak();
  app.innerHTML = '';
  window.scrollTo(0, 0);
  Z.current = name;
  if (name === 'home' || name === 'rubrique') Z.actEnCours = null;
  Z.applySpeed();
  Z.narrator = (name === 'rubrique' || name === 'activite') ? args[0] : { mots: 'mots', tables: 'tables', problemes: 'problemes', route: 'parcours', devoirs: 'devoirs', devoir: 'devoirs', archives: 'devoirs' }[name] || 'accueil';
  Z.screens[name](...args);
};

/* En-tête commun des jeux */
Z.shell = function ({ title }) {
  const steps = h('div', { class: 'steps' });
  const root = h('div', { class: 'screen' });
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', 'aria-label': 'Accueil', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    steps,
    Z.adapte('dyscalculie') ? h('button', { class: 'home-btn outil', 'aria-label': 'Aide-mémoire', onclick: () => { Z.sfx.tap(); Z.aideMemoire(); } }, '📋') : null,
    Z.state.settings.calculatrice ? h('button', { class: 'home-btn outil', 'aria-label': 'Calculatrice', onclick: () => { Z.sfx.tap(); Z.calculatrice(); } }, '🧮') : null,
    h('span', { class: 'chip bolt' }, '⚡ ', h('span', { id: 'bolt' }, String(Z.state.eclairs))));
  app.append(top, root);
  return {
    root,
    title,
    setSteps(n, cur) {
      steps.innerHTML = '';
      for (let i = 0; i < n; i++) steps.appendChild(h('i', { class: i < cur ? 'on' : i === cur ? 'cur' : '' }));
    },
    clear() { root.innerHTML = ''; }
  };
};

/* La fête (profil.js → fete) : la personne aimée vient féliciter l'élève,
   soit en l'emmenant faire un tour de moto, soit avec un bisou et un cœur. */
Z.fete = function () {
  const F = PROFIL.fete, g = F && PROFIL.animaux.find(a => a.id === F.avec);
  if (!g) return null;
  const voix = { pitch: (g.voix && g.voix.hauteur) || 1, male: !!F.homme };
  const moto = F.moto && UNIVERS.moto && Math.random() < 0.5;
  let dessin, t;
  if (moto) {
    const it = (oid, id) => { const o = UNIVERS.moto.onglets.find(x => x.id === oid); return o.items.find(x => x.id === id) || o.items[0]; };
    dessin = h('div', { class: 'fete-moto' }, Z.svg(UNIVERS.moto.dessin({ model: it('model', F.moto.modele), color: it('color', F.moto.couleur), acc: it('acc', F.moto.casque), apparence: F.moto.pilote }), 'fete-svg'), h('span', { class: 'coeur-vole' }, '❤️'));
    t = Z.pick(F.phrasesMoto || ['On part faire un tour pour fêter ça !']);
  } else {
    const moi = Object.assign({}, PROFIL.enfant.apparence, { coupe: /longs|queue/.test((PROFIL.enfant.apparence || {}).coiffure || '') ? 'longs' : 'courts' });
    dessin = h('div', { class: 'fete-bisou' }, Z.svg(Z.art.animal({ espece: 'humain', couleurs: moi }), 'buste moi'),
      h('span', { class: 'coeur' }, '❤️'), Z.svg(Z.art.animal({ espece: 'humain', couleurs: g.couleurs }), 'buste elle'));
    t = Z.pick(F.phrasesBisou || ['Un bisou pour toi !']);
  }
  const txt = g.nom + ' : ' + t;
  setTimeout(() => Z.speak(t, voix), 3200);
  return h('div', { class: 'card fete col center' }, dessin, h('div', { class: 'bubble' }, h('span', null, txt), Z.ear(t, voix)));
};

/* Écran de fin de jeu, commun aux 3 jeux */
Z.endScreen = function (shell, { medal, title, eclairs, xp, lines = [], kind, again, detail, againLabel = '🔁 Encore !' }) {
  const leveled = Z.finishGame(kind, eclairs, xp, detail);
  shell.clear();
  shell.setSteps(0, 0);
  Z.sfx.win(); Z.confetti(160);
  const msg = `${title} Tu gagnes ${eclairs} éclairs !`;
  Z.speak(msg);
  shell.root.append(
    h('div', { class: 'medal' }, medal),
    h('h2', { class: 'center' }, title),
    h('div', { class: 'card center col' },
      h('div', { style: { fontSize: '2em', fontWeight: 700 } }, `+ ${eclairs} ⚡`),
      ...lines.map(l => h('div', null, l))),
    (() => {
      const cheer = Z.pick(ZDATA.cheers);
      if (PROFIL.fete && (medal === '🥇' || Math.random() < 0.4)) { const el = Z.fete(); if (el) return el; }
      if (ZDATA.family.length) {
        const f = Z.pick(ZDATA.family); const t = f.name.charAt(0).toUpperCase() + f.name.slice(1) + ' : ' + (f.cheers && f.cheers.length ? Z.pick(f.cheers) : cheer);
        setTimeout(() => Z.speak(t, Z.familyVoice(f)), 3200); return Z.familySays(f, t, { speak: false });
      }
      setTimeout(() => Z.speak(cheer), 3200); return Z.guideSays(cheer, { speak: false });
    })(),
    Z.svg(Z.hero(), 'end-rider'),
    h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); again(); } }, againLabel),
    h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠 Retour au monde'));
  if (leveled) setTimeout(() => {
    Z.sfx.win(); Z.confetti(200);
    const nouveau = Z.onglet('model').items.find(m => m.lvl === Z.levelInfo().lvl && m.lvl > 1);
    const t = `Niveau ${Z.levelInfo().lvl} ! Tu montes de niveau, bravo ! ${Z.jauge().phrase}${nouveau ? ` Nouveau dans la boutique : ${nouveau.name} !` : ''}`;
    Z.speak(t);
    Z.modal(h('div', { class: 'col center' }, h('div', { class: 'big-reward' }, '⭐'), h('h2', null, t),
      h('button', { class: 'btn gold wide', onclick: (e) => e.target.closest('.modal').remove() }, 'Trop bien !')));
  }, 1800);
};

/* ---------- ACCUEIL ---------- */
Z.screens.home = function () {
  const st = Z.state, lv = Z.levelInfo(), d = Z.daily(), streak = Z.streakAlive();
  const goal = 3;

  const dueWords = Z.allWords().filter(w => Z.isDue(st.words[w.id])).length;

  const top = h('div', { class: 'topbar' },
    h('span', { class: 'chip fire' }, '🔥 ', String(streak)),
    h('span', { class: 'chip bolt' }, '⚡ ', String(st.eclairs)),
    h('div', { class: 'spacer' }),
    h('button', {
      class: 'home-btn', 'aria-label': 'Espace parents', title: 'Espace parents (appui long)',
      onpointerdown: (e) => { e.currentTarget._t = setTimeout(() => { Z.sfx.click(); Z.go('parent'); }, 1200); },
      onpointerup: (e) => clearTimeout(e.currentTarget._t), onpointerleave: (e) => clearTimeout(e.currentTarget._t),
      onclick: () => Z.pop('Appui long = parents', 'soft')
    }, '⚙️'));

  const hello = h('div', { class: 'hello' },
    h('h1', null, `Salut ${st.name} ! `),
    h('div', { class: 'lvl' }, h('span', null, `Niveau ${lv.lvl}`), h('div', { class: 'bar' }, h('i', { style: { width: Math.round(lv.cur / lv.need * 100) + '%' } })), h('span', null, '⭐')),
    h('div', { class: 'speedo' }, Z.jauge().court, h('b', null, Z.jauge().val), Z.speedOf(lv.lvl) < 45 ? h('span', { class: 'hint' }, ` · niveau ${lv.lvl + 1} : ${Z.jauge(Z.speedOf(lv.lvl + 1) + (Z.modelOf().bonus || 0)).val}`) : h('span', { class: 'hint' }, ' · maximum ! 🔥')));

  const scene = h('div', { class: 'scene scene-' + U.scene, onclick: () => { Z.sfx.vroum(); Z.speak(`${Z.CRI[Z.guide('accueil').espece] || 'Hop !'} Allez ${st.name}, on y va !`); } },
    h('div', { class: 'sun' }), h('div', { class: 'cloud' }), h('div', { class: 'cloud c2' }),
    h('div', { class: 'ground' }),
    Z.svg(Z.hero(), 'rider'),
    Z.GUIDES ? Z.svg(Z.art.cat({ who: 'accueil' }), 'cat') : null);

  /* Collège : une citation rigolote ; lycée : une blague. Une par jour. */
  const motJour = (() => {
    const L = Z.TON === 'college' ? ZDATA.citations : Z.TON === 'lycee' ? ZDATA.blagues : null;
    if (!L || !L.length || (PROFIL.style && PROFIL.style.motDuJour === false)) return null;
    const t = L[Z.dayNum() % L.length];
    return h('div', { class: 'card mot-jour' }, h('b', null, Z.TON === 'lycee' ? '😏 La blague du jour' : '💬 La phrase du jour'), h('div', null, t), Z.ear(t));
  })();
  const ready = d.games >= goal && !d.chest;
  const mission = h('div', { class: 'mission' },
    h('div', { class: 'chest' + (ready ? ' ready' : '') }, d.chest ? '🎁' : '🧰'),
    h('div', { class: 'grow' },
      h('div', { style: { fontWeight: 700 } }, d.chest ? 'Coffre ouvert ! Reviens demain.' : ready ? 'Ton coffre est prêt !' : 'Mission du jour : 3 jeux'),
      h('div', { class: 'dots' }, Array.from({ length: goal }, (_, i) => h('i', { class: i < d.games ? 'on' : '' })))),
    ready ? h('button', { class: 'btn gold', onclick: openChest }, 'Ouvrir') : Z.ear(d.chest ? 'Bravo, tu as ouvert ton coffre aujourd\'hui. Reviens demain pour un nouveau coffre !' : `Mission du jour : joue à 3 jeux pour ouvrir le coffre au trésor. Tu en as fait ${d.games}.`));

  /* Une tuile par rubrique (matière), puis les devoirs */
  const world = (role, icone, couleur, title, sub, go, args, badge) => h('button', { class: 'world', style: { background: couleur }, onclick: () => { Z.sfx.vroum(); Z.go(go, ...args); } },
    h('span', { class: 'ico' }, Z.GUIDES ? Z.svg(Z.art.cat({ who: role }), 'ico-cat') : icone),
    h('span', null, (Z.GUIDES ? '' : '') + title, h('small', null, Z.GUIDES ? `Avec ${Z.presente(role)} · ${sub}` : sub)), badge ? h('span', { class: 'badge' }, badge) : null);
  const acts = st.acts || {};
  const worlds = h('div', { class: 'worlds' },
    Z.rubriques().map(r => {
      const n = r.activites.length, faites = r.activites.filter(a => acts[r.id + ':' + a.id]).length;
      return world(r.id, r.icone, r.couleur, (Z.GUIDES ? r.icone + ' ' : '') + r.titre, n ? `${n} activité${n > 1 ? 's' : ''}` : 'bientôt', 'rubrique', [r.id], n ? `${faites}/${n}` : null);
    }),
    (() => { const n = Z.devoirsLeft();
      return world('devoirs', '📚', '#a16207', Z.titre('devoirs'), 'les devoirs de l’agenda', 'devoirs', [], n ? `${n} à faire` : (window.ZDEVOIRS && window.ZDEVOIRS.items.length ? '✅' : null)); })());

  const nav = navBar('home');

  app.append(top, hello, scene, mission, motJour || "", worlds, nav);

  if (!st.welcomed) {
    st.welcomed = true; Z.save();
    setTimeout(() => welcome(), 400);
  }
};

/* Barre du bas : Monde · Boutique · Album */
function navBar(on) {
  const b = (id, ico, label, go) => h('button', { class: on === id ? 'on' : '', onclick: on === id ? null : () => { Z.sfx.tap(); Z.go(go); } }, h('span', null, ico), label);
  return h('div', { class: 'nav' }, b('home', '🏠', 'Monde', 'home'), b('garage', U.boutique.icone, U.boutique.titre.replace(/^(Le |La |L')/, ''), 'garage'), b('album', '📒', 'Album', 'album'));
}

function welcome() {
  const g = Z.guide('accueil');
  if (!Z.GUIDES) {
    const t = `Salut ${Z.state.name} ! Bienvenue dans ${PROFIL.appli.nom}. Choisis une matière pour t'entraîner. Chaque activité te rapporte des éclairs pour personnaliser ${U.objet}.`;
    const close = Z.modal(h('div', { class: 'col center' }, h('h2', null, `Bienvenue, ${Z.state.name} 👋`), h('p', null, t), Z.ear(t),
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); close(); } }, 'C\'est parti !')));
    Z.speak(t); return;
  }
  const ROLES = {}; Z.rubriques().forEach(r => { ROLES[r.id] = 'en ' + r.titre; }); ROLES.devoirs = 'pour tes devoirs';
  const amis = PROFIL.animaux.filter(a => a !== g);
  const aides = Object.keys(ROLES).map(r => [Z.guide(r), ROLES[r]]).filter(([a]) => a !== g)
    .reduce((m, [a, r]) => { (m[a.nom] = m[a.nom] || []).push(r); return m; }, {});
  const t = `Salut ${Z.state.name} ! Moi c'est ${g.nom}. Bienvenue dans ${PROFIL.appli.nom} !`
    + (amis.length ? ` Mes copains sont là aussi. ${Object.keys(aides).map(n => `${n} t'aide ${aides[n].join(' et ')}`).join('. ')}.` : '')
    + ` Ici, tu gagnes des éclairs pour décorer ${U.objet}. On y va ?`;
  const close = Z.modal(h('div', { class: 'col center' },
    Z.svg(Z.art.cat({ who: 'accueil' }), 'mini-cat-big'),
    h('h2', null, `Salut ! Moi c'est ${g.nom} 🐾`),
    h('p', null, `Bienvenue dans ${PROFIL.appli.nom} ! Gagne des ⚡ pour décorer ${U.objet}.`),
    h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(t)),
    h('button', { class: 'btn green wide', onclick: () => { Z.sfx.vroum(); close(); } }, 'C\'est parti !')));
  Z.speak(t);
}

/* ---------- COFFRE ---------- */
function openChest() {
  const d = Z.daily(); if (d.chest) return;
  d.chest = true;
  const roll = Math.random();
  const rar = roll < 0.07 ? 3 : roll < 0.35 ? 2 : 1;
  const pool = ZDATA.stickers.filter(s => s.r === rar);
  const stk = Z.pick(pool);
  const dup = !!Z.state.stickers[stk.id];
  Z.state.stickers[stk.id] = (Z.state.stickers[stk.id] || 0) + 1;
  const bonus = 15 + (dup ? 10 : 0);
  Z.state.eclairs += bonus;
  Z.save();

  const box = h('div', { class: 'col center' });
  const chest = h('div', { class: 'big-reward', style: { cursor: 'pointer' } }, '🧰');
  box.append(h('h2', null, 'Touche le coffre !'), chest);
  const close = Z.modal(box, { closable: false, onClose: () => Z.go('home') });
  Z.speak('Touche le coffre pour l\'ouvrir !');
  let taps = 0;
  chest.addEventListener('click', () => {
    taps++; Z.sfx.drum(); chest.classList.remove('shake'); void chest.offsetWidth; chest.classList.add('shake');
    if (taps < 3) return;
    Z.sfx.win(); Z.confetti(180);
    const rname = rar === 3 ? 'LÉGENDAIRE' : rar === 2 ? 'RARE' : '';
    const say = `${rname ? 'Waouh, un autocollant ' + rname.toLowerCase() + ' ! ' : ''}${stk.n} ! ${dup ? 'Tu l\'avais déjà, alors tu gagnes 10 éclairs en plus.' : 'Nouveau dans ton album !'} Plus ${bonus} éclairs.`;
    Z.speak(say);
    box.innerHTML = '';
    box.append(
      rname ? h('div', { style: { fontWeight: 700, color: rar === 3 ? '#b45309' : '#2563eb' } }, '✨ ' + rname + ' ✨') : null,
      h('div', { class: 'big-reward' }, stk.e), h('h2', null, stk.n),
      h('div', null, dup ? 'Déjà dans ton album : +10 ⚡ bonus' : 'Nouveau dans ton album !'),
      h('div', { style: { fontSize: '1.6em', fontWeight: 700 } }, `+ ${bonus} ⚡`),
      h('button', { class: 'btn green wide', onclick: close }, 'Génial !'));
  });
}

/* ---------- BOUTIQUE (onglets de l'univers + accessoires des animaux) ---------- */
Z.screens.garage = function (tab) {
  const st = Z.state;
  tab = tab || U.onglets[0].id;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, U.boutique.icone + ' ' + U.boutique.titre),
    h('span', { class: 'chip bolt' }, '⚡ ', String(st.eclairs)));
  const who = Z.garageCat || Z.guide('accueil').id;
  const preview = h('div', { class: 'scene scene-' + U.scene, style: { height: '190px' } },
    h('div', { class: 'ground' }), Z.svg(Z.hero(), 'rider'), Z.GUIDES ? Z.svg(Z.art.cat({ who: tab === 'animaux' ? who : 'accueil' }), 'cat') : null);
  const tabs = h('div', { class: 'tabs' },
    U.onglets.map(o => [o.id, o.label]).concat(Z.GUIDES ? [['animaux', '🐾 Amis']] : []).map(([k, l]) =>
      h('button', { class: tab === k ? 'on' : '', onclick: () => { Z.sfx.tap(); Z.go('garage', k); } }, l)));
  const lvl = Z.levelInfo().lvl;
  const key = tab === 'animaux' ? Z.catKey(who) : tab;
  const list = tab === 'animaux' ? ZDATA.catItems : Z.onglet(tab).items;
  if (!st.owned[key]) st.owned[key] = [list[0].id];
  if (!st.equip[key]) st.equip[key] = list[0].id;
  const catPick = tab === 'animaux' && PROFIL.animaux.length > 1 ? h('div', { class: 'tabs cat-pick' }, PROFIL.animaux.map(a =>
    h('button', { class: who === a.id ? 'on' : '', onclick: () => { Z.sfx.tap(); Z.garageCat = a.id; Z.go('garage', 'animaux'); } }, Z.svg(Z.art.cat({ who: a.id }), 'pick-cat'), a.nom))) : null;
  const grid = h('div', { class: 'shop-grid' }, list.map(it => {
    const owned = st.owned[key].includes(it.id), on = st.equip[key] === it.id;
    let vis;
    if (tab === 'animaux') vis = Z.svg(Z.art.cat({ acc: it.id, who }), 'shop-cat');
    else if (tab === 'color' && !U.couleurEnDessin) vis = h('div', { class: 'sw', style: { background: it.two ? `linear-gradient(135deg, ${it.c} 50%, ${it.two === true ? '#111827' : it.two} 50%)` : it.c } });
    else if (tab === 'acc' && PROFIL.univers === 'trottinette') vis = Z.svg(Z.hero({ acc: it.id }).replace('viewBox="0 0 220 180"', 'viewBox="86 0 52 60"'), 'shop-helmet');
    else vis = Z.svg(Z.hero({ [tab]: it.id, rider: tab !== 'model' || PROFIL.univers !== 'trottinette' ? undefined : false }), 'shop-scoot');
    const label = tab === 'animaux' && it.id === 'aucun' ? `${Z.guide(who).nom} tout simple` : it.name;
    return h('button', {
      class: 'item' + (on ? ' on' : '') + (owned ? '' : ' locked'),
      onclick: () => {
        if (owned) { st.equip[key] = it.id; Z.save(); Z.sfx.good(); Z.go('garage', tab); return; }
        if (it.lvl && lvl < it.lvl) { Z.sfx.bad(); Z.speak(`${it.name} : ça se débloque au niveau ${it.lvl}. Tu es au niveau ${lvl}. Continue !`); Z.pop(`🔒 Niveau ${it.lvl}`, 'soft'); return; }
        if (st.eclairs < it.price) { Z.sfx.bad(); const m = `Il te faut ${it.price} éclairs. Tu en as ${st.eclairs}. Joue encore un peu !`; Z.speak(m); Z.pop(`Il manque ${it.price - st.eclairs} ⚡`, 'soft'); return; }
        st.eclairs -= it.price; st.owned[key].push(it.id); st.equip[key] = it.id; Z.save();
        Z.sfx.coin(); Z.sfx.win(); Z.confetti(); Z.speak(`Super ! ${it.name} !`);
        Z.go('garage', tab);
      }
    }, vis, h('div', null, label), tab === 'model' && it.bonus ? h('div', { class: 'small-note' }, `+${it.bonus}`) : null, owned ? h('div', { class: 'price' }, on ? '✅ Choisi' : 'À toi') : h('div', { class: 'price' }, it.lvl && lvl < it.lvl ? `🔒 Niveau ${it.lvl}` : `${it.price} ⚡`));
  }));
  app.append(top, h('div', { class: 'screen' }, preview, tabs, catPick, grid), navBar('garage'));
};

/* ---------- ALBUM ---------- */
Z.screens.album = function () {
  const st = Z.state;
  const have = ZDATA.stickers.filter(s => st.stickers[s.id]).length;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, '📒 Mon album'),
    h('span', { class: 'chip' }, `${have} / ${ZDATA.stickers.length}`));
  const album = h('div', { class: 'album' }, ZDATA.stickers.map(s => h('button', {
    class: `stk r${s.r}` + (st.stickers[s.id] ? '' : ' no'),
    onclick: () => { Z.sfx.tap(); Z.speak(st.stickers[s.id] ? s.n : 'Pas encore trouvé. Ouvre des coffres !'); }
  }, s.e, st.stickers[s.id] > 1 ? h('small', null, '×' + st.stickers[s.id]) : null)));

  // Carte des tables : chaque case se colore quand le fait est appris
  const facts = h('div', { class: 'facts' });
  facts.appendChild(h('i', { class: 'h' }, '×'));
  for (let b = 1; b <= 9; b++) facts.appendChild(h('i', { class: 'h' }, String(b + 1)));
  for (let a = 2; a <= 10; a++) {
    facts.appendChild(h('i', { class: 'h' }, String(a)));
    for (let b = 2; b <= 10; b++) {
      const k = Z.factKey(a, b), f = st.facts[k];
      facts.appendChild(h('i', { class: f ? 'b' + f.box : '' }, f && f.box >= 4 ? String(a * b) : ''));
    }
  }
  const words = Z.allWords();
  const mastered = words.filter(w => st.words[w.id] && st.words[w.id].box >= 4).length;
  const probs = Object.keys(st.probs).length;

  const nav = navBar('album');

  app.append(top, h('div', { class: 'screen' },
    h('div', { class: 'card' }, h('h2', null, '🏆 Mes trophées'),
      h('div', null, `🔤 Mots bien rangés dans ta tête : ${mastered} / ${words.length}`),
      h('div', null, `🔍 Enquêtes résolues : ${probs} / ${ZDATA.problems.length}`),
      h('div', null, `🚦 Règles de la route bien sues : ${ZDATA.routeKnown ? ZDATA.routeKnown() : 0} / ${Z.ROUTE_COUNT || 0}`),
      h('div', null, `🔥 Série actuelle : ${Z.streakAlive()} jour(s)`)),
    h('div', { class: 'card' }, h('h2', null, '✨ Autocollants'), h('p', { class: 'hint' }, 'Ouvre le coffre du jour pour en gagner.'), album),
    h('div', { class: 'card' }, h('h2', null, '🗺️ Carte des tables'), h('p', { class: 'hint' }, 'Les cases deviennent vertes quand tu connais le résultat par cœur.'), facts)), nav);
};

/* ---------- ESPACE PARENTS ---------- */
Z.screens.parent = function () {
  const st = Z.state;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => Z.go('home') }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, 'Espace parents'));
  const words = Z.allWords();
  const rows = words.map(w => {
    const it = st.words[w.id];
    return h('tr', null, h('td', null, Z.parseWord(w.s).word), h('td', null, it ? `boîte ${it.box}/5` : '—'), h('td', null, it ? `${it.ok}/${it.seen}` : ''));
  });
  const days = {};
  st.log.forEach(l => { days[l.d] = (days[l.d] || 0) + 1; });
  const lastDays = Object.keys(days).sort().slice(-7).map(d => `${d.slice(8)}/${d.slice(5, 7)} : ${days[d]} jeu(x)`).join(' · ') || 'Aucune partie pour l\'instant.';

  // Ajout de mots (ex. la dictée de la semaine)
  const fSpec = h('input', { placeholder: 'ex. pa-pi-[ll]on  ou  gran(d)' });
  const fEmoji = h('input', { placeholder: 'emoji ex. 🦋', maxlength: '8' });
  const fPh = h('input', { placeholder: 'phrase ex. Le papillon vole.' });
  const fHint = h('input', { placeholder: 'astuce (facultatif)' });
  const preview = h('div', { class: 'card center', style: { minHeight: '60px' } });
  const upd = () => { preview.innerHTML = ''; if (fSpec.value.trim()) preview.appendChild(Z.wordEl(Z.parseWord(fSpec.value.trim()))); };
  fSpec.addEventListener('input', upd);
  const addBtn = h('button', {
    class: 'btn green wide', onclick: () => {
      const s = fSpec.value.trim(); if (!s) return;
      const word = Z.parseWord(s).word;
      st.customWords.push({ id: 'c_' + Date.now(), s, e: fEmoji.value.trim() || '📝', ph: fPh.value.trim() || word, hint: fHint.value.trim() || '', custom: true, prio: true });
      Z.save(); Z.go('parent');
    }
  }, '➕ Ajouter ce mot');
  const custom = st.customWords.map(w => h('div', { class: 'row' }, h('span', { class: 'grow' }, w.e + ' ', Z.wordEl(Z.parseWord(w.s))),
    h('button', { class: 'btn ghost', style: { minHeight: '44px' }, onclick: () => { st.customWords = st.customWords.filter(x => x.id !== w.id); delete st.words[w.id]; Z.save(); Z.go('parent'); } }, '🗑️')));

  const rate = h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(st.settings.rate) });
  rate.addEventListener('change', () => { st.settings.rate = Number(rate.value); Z.save(); Z.speak('Voici la vitesse de la voix.'); });
  const name = h('input', { value: st.name });
  name.addEventListener('change', () => { st.name = name.value.trim() || PROFIL.enfant.pseudo; Z.save(); });
  const snd = h('select', null, h('option', { value: '1', selected: st.settings.sound }, 'Sons activés'), h('option', { value: '0', selected: !st.settings.sound }, 'Sons coupés'));
  snd.addEventListener('change', () => { st.settings.sound = snd.value === '1'; Z.save(); });
  const cartoon = h('select', null, h('option', { value: '1', selected: st.settings.cartoon !== false }, 'Voix des animaux : dessin animé'), h('option', { value: '0', selected: st.settings.cartoon === false }, 'Voix des animaux : normale'));
  cartoon.addEventListener('change', () => { st.settings.cartoon = cartoon.value === '1'; Z.save(); Z.speak(`${Z.CRI[Z.guide('accueil').espece] || 'Coucou !'} Coucou, c'est moi, ${Z.guide('accueil').nom} !`); });

  app.append(top, h('div', { class: 'screen parent' },
    h('div', { class: 'card' },
      h('h3', null, '📈 Activité (7 derniers jours)'), h('p', null, lastDays),
      h('p', null, `Niveau ${Z.levelInfo().lvl} · ${st.eclairs} ⚡ · série ${Z.streakAlive()} j · ${Object.keys(st.probs).length} problèmes réussis`),
      h('h3', null, '🔤 Mots (répétition espacée)'),
      h('p', { class: 'small-note' }, 'Boîte 1 = revu le jour même, 2 = le lendemain, 3 = 3 jours, 4 = 1 semaine, 5 = 16 jours (mémorisé). Une erreur renvoie en boîte 1 : c\'est normal et voulu.'),
      h('table', null, h('tr', null, h('th', null, 'Mot'), h('th', null, 'Niveau'), h('th', null, 'Réussites')), rows)),
    h('div', { class: 'card' },
      h('h3', null, '➕ Ajouter des mots (dictée de la semaine)'),
      h('p', { class: 'small-note' }, 'Coupez en syllabes avec des tirets. Entre [crochets] : la partie difficile (surlignée en jaune). Entre (parenthèses) : les lettres muettes (en gris). Les mots ajoutés passent en priorité.'),
      h('label', null, 'Mot'), fSpec, preview,
      h('label', null, 'Image'), fEmoji, h('label', null, 'Phrase exemple'), fPh, h('label', null, 'Astuce lue à voix haute'), fHint,
      h('div', { style: { marginTop: '10px' } }, addBtn),
      custom.length ? h('h3', null, 'Mots ajoutés') : null, ...custom),
    transferCard(),
    h('div', { class: 'card' },
      h('h3', null, '⚙️ Réglages'),
      h('label', null, 'Pseudo affiché'), name,
      h('label', null, 'Vitesse de la voix'), rate, snd, Z.GUIDES ? cartoon : null,
      h('h3', null, '🧩 Façons de faire'),
      h('p', { class: 'small-note' }, 'Cochez ce qui correspond à l’élève (plusieurs possibles). Cela change l’affichage, les devoirs et les exercices.'),
      ...Z.ADAPTATIONS.map(([id, label]) => {
        const cb = h('input', { type: 'checkbox', checked: Z.adapte(id), style: { width: '26px', height: '26px' } });
        cb.addEventListener('change', () => {
          const L = new Set(Z.adaptActives()); cb.checked ? L.add(id) : L.delete(id);
          st.settings.adapt = [...L]; if (id === 'malvoyance' && cb.checked && (st.settings.taille || 1) < 1.6) st.settings.taille = 1.6;
          Z.save(); Z.appliquerAides(); Z.go('parent');
        });
        return h('label', { class: 'row', style: { gap: '10px' } }, cb, h('span', null, label));
      }),
      reglage('Main valide', 'main', [[null, 'Les deux mains'], ['droite', 'Main droite : boutons à droite'], ['gauche', 'Main gauche : boutons à gauche']]),
      reglage('Calculatrice', 'calculatrice', [[false, 'Pas de calculatrice'], [true, 'Calculatrice autorisée (PAP)']]),
      h('h3', null, '👓 Aides à la lecture'),
      reglage('Lecture à voix haute', 'autoRead', [[true, 'Les consignes sont lues toutes seules'], [false, 'Seulement quand on touche 🔊']]),
      reglage('Police', 'police', [['andika', 'Andika (lecture facile)'], ['lexend', 'Lexend'], ['arial', 'Arial']]),
      reglage('Taille du texte', 'taille', [[0.9, 'Petite'], [1, 'Normale'], [1.15, 'Grande'], [1.3, 'Très grande'], [1.6, 'Énorme (malvoyance)'], [2, 'Géante']]),
      reglage('Lignes', 'lignes', [[false, 'Lignes normales'], [true, 'Une ligne sur deux surlignée']]),
      reglage('Espacement', 'espacement', [[true, 'Lettres et lignes espacées'], [false, 'Espacement normal']]),
      reglage('Syllabes', 'syllabes', [[true, 'Syllabes en couleur'], [false, 'Mots d\'une seule couleur']]),
      h('div', { style: { marginTop: '14px' } }, h('button', {
        class: 'btn ghost wide', onclick: () => { if (confirm('Effacer toute la progression ? (irréversible)')) { Z.reset(); Z.go('home'); } }
      }, '♻️ Remettre à zéro')))));
};

/* Un menu de réglage d'aide (enregistré et appliqué tout de suite) */
function reglage(label, key, options) {
  const st = Z.state;
  const sel = h('select', null, options.map(([v, t]) => h('option', { value: JSON.stringify(v), selected: st.settings[key] === v }, t)));
  sel.addEventListener('change', () => { st.settings[key] = JSON.parse(sel.value); Z.save(); Z.appliquerAides(); });
  return h('div', null, h('label', null, label), sel);
}

/* Transfert de progression : d'une adresse à une autre, ou d'un téléphone à l'autre.
   La progression est encodée dans un code texte à copier, puis à coller dans la nouvelle appli. */
Z.exportCode = () => 'APPLI1:' + btoa(unescape(encodeURIComponent(JSON.stringify(Z.state))));
Z.importCode = function (code) {
  const c = String(code || '').replace(/\s+/g, '');
  if (!c.startsWith('APPLI1:')) throw new Error('code');
  const s = JSON.parse(decodeURIComponent(escape(atob(c.slice(7)))));
  if (!s || typeof s !== 'object' || !s.words) throw new Error('code');
  localStorage.setItem(Z.KEY, JSON.stringify(s));
  Z.state = Z.load();
};
function transferCard() {
  const h = Z.h;
  const out = h('textarea', { rows: 3, readonly: true, style: { width: '100%', fontSize: '12px', display: 'none' } });
  const inp = h('textarea', { rows: 3, placeholder: 'Collez ici le code APPLI1:…', style: { width: '100%', fontSize: '12px' } });
  const msg = h('p', { class: 'small-note' });
  const copy = h('button', {
    class: 'btn purple wide', onclick: async () => {
      const code = Z.exportCode();
      out.value = code; out.style.display = 'block';
      try { await navigator.clipboard.writeText(code); msg.textContent = '✅ Code copié ! Ouvrez la nouvelle adresse, puis collez-le dans « Récupérer ».'; }
      catch (e) { out.select(); msg.textContent = 'Sélectionnez tout le code ci-dessus, puis copiez-le.'; }
    }
  }, '📤 Copier la progression');
  const load = h('button', {
    class: 'btn green wide', onclick: () => {
      try {
        Z.importCode(inp.value);
        Z.sfx.win(); Z.save(); alert(`✅ Progression récupérée : niveau ${Z.levelInfo().lvl}, ${Z.state.eclairs} éclairs.`); Z.go('home');
      } catch (e) { msg.textContent = '❌ Ce code ne marche pas. Recopiez-le en entier, depuis APPLI1: jusqu\'au bout.'; }
    }
  }, '📥 Récupérer la progression');
  return h('div', { class: 'card' },
    h('h3', null, '📲 Transférer la progression'),
    h('p', { class: 'small-note' }, 'Pour changer d\'adresse ou de téléphone sans rien perdre : sur l\'ancienne appli, « Copier ». Sur la nouvelle, coller le code puis « Récupérer ». Attention : la récupération remplace la progression de la nouvelle appli.'),
    copy, out, h('div', { style: { height: '10px' } }), inp, load, msg);
}

/* Démarrage */
Z.go('home');
