/* =========================================================
   LES UNIVERS DE PASSION (interchangeables)
   ---------------------------------------------------------
   Un univers = l'objet à décorer dans la boutique + son dessin,
   le décor, les titres des jeux, les autocollants, des mots et
   des problèmes sur ce thème.
   Univers disponibles : trottinette · foot · karate · dinosaures · trail
   Dans les textes : @enfant = le pseudo, @il = il/elle,
   @guide = l'animal d'accueil, @animal / @animaux = son espèce.

   Chaque onglet de boutique a une liste d'objets :
   { id, name, price (éclairs), lvl (niveau minimum, facultatif),
     bonus (points de jauge en plus, facultatif), c (couleur) }
   Le PREMIER objet de chaque liste est offert au départ.
   ========================================================= */
window.UNIVERS = {};

/* ---------- L'enfant dessiné de face (foot, karaté) ----------
   Dessin simple et générique, aux couleurs de profil.js. */
function dessinEnfant(o) {
  const A = (PROFIL.enfant && PROFIL.enfant.apparence) || {};
  const skin = A.peau || '#e8b98f', hair = A.cheveux || '#3b2416', eyes = A.yeux || '#4a2c1a';
  const cx = o.cx || 80, t = o.top || 18, hy = t + 20;
  const gi = !!o.gi, shirt = o.shirt || A.tshirt || '#2563eb', shorts = o.shorts || '#1f2937';
  const coiffure = A.coiffure || 'courts';
  const hairBack = coiffure === 'longs' ? `<path d="M${cx - 19} ${hy - 4} Q${cx - 22} ${hy + 30} ${cx - 14} ${hy + 34} L${cx + 14} ${hy + 34} Q${cx + 22} ${hy + 30} ${cx + 19} ${hy - 4} Z" fill="${hair}"/>`
    : coiffure === 'queue' ? `<path d="M${cx + 14} ${hy - 8} q16 6 10 30 q-4 -12 -14 -18 z" fill="${hair}"/>` : '';
  const hairTop = coiffure === 'boucles'
    ? [[-14, -8], [-7, -15], [2, -17], [10, -14], [16, -7], [-17, 0], [17, 0]].map(([x, y]) => `<circle cx="${cx + x}" cy="${hy + y}" r="7.5" fill="${hair}"/>`).join('')
    : `<path d="M${cx - 18} ${hy + 2} Q${cx - 19} ${hy - 19} ${cx} ${hy - 19} Q${cx + 19} ${hy - 19} ${cx + 18} ${hy + 2} Q${cx + 12} ${hy - 9} ${cx} ${hy - 8} Q${cx - 12} ${hy - 9} ${cx - 18} ${hy + 2} Z" fill="${hair}"/>`;
  const legsY = t + 80, footY = t + 142;
  const sleeve = gi ? 12 : 9;
  const punch = o.pose === 'punch';
  const armL = punch ? `M${cx - 14} ${t + 46} Q${cx - 6} ${t + 64} ${cx + 6} ${t + 58}` : `M${cx - 15} ${t + 44} L${cx - 26} ${t + 80}`;
  const armR = punch ? `M${cx + 14} ${t + 46} L${cx + 52} ${t + 46}` : `M${cx + 15} ${t + 44} L${cx + 26} ${t + 80}`;
  const handL = punch ? [cx + 8, t + 58] : [cx - 27, t + 83];
  const handR = punch ? [cx + 56, t + 46] : [cx + 27, t + 83];
  const handCol = o.gants || skin;
  const handR2 = o.gants ? 7.5 : 5.5;
  let body;
  if (gi) {
    body = `<path d="M${cx - 15} ${legsY - 6} L${cx - 20} ${footY - 2} L${cx - 4} ${footY - 2} L${cx} ${legsY + 10} L${cx + 4} ${footY - 2} L${cx + 20} ${footY - 2} L${cx + 15} ${legsY - 6} Z" fill="${shirt}" stroke="#9ca3af" stroke-width="1.5"/>
      <ellipse cx="${cx - 12}" cy="${footY + 2}" rx="8" ry="4" fill="${skin}"/><ellipse cx="${cx + 12}" cy="${footY + 2}" rx="8" ry="4" fill="${skin}"/>
      <rect x="${cx - 17}" y="${t + 36}" width="34" height="${legsY - t - 30}" rx="10" fill="${shirt}" stroke="#9ca3af" stroke-width="1.5"/>
      <path d="M${cx - 8} ${t + 37} L${cx + 4} ${t + 64} M${cx + 8} ${t + 37} L${cx - 4} ${t + 64}" stroke="#9ca3af" stroke-width="2" fill="none"/>
      <rect x="${cx - 18}" y="${legsY - 12}" width="36" height="7" rx="2" fill="${o.belt || '#f3f4f6'}" stroke="#374151" stroke-width="1"/>
      <path d="M${cx + 2} ${legsY - 6} l-4 14 M${cx + 4} ${legsY - 6} l5 13" stroke="${o.belt || '#f3f4f6'}" stroke-width="4" stroke-linecap="round"/>`;
  } else {
    body = `<path d="M${cx - 9} ${legsY + 8} V${footY - 4} M${cx + 9} ${legsY + 8} V${footY - 4}" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${cx - 9} ${footY - 26} V${footY - 4} M${cx + 9} ${footY - 26} V${footY - 4}" stroke="${o.socks || shirt}" stroke-width="11" stroke-linecap="round"/>
      <ellipse cx="${cx - 12}" cy="${footY}" rx="10" ry="5" fill="${o.shoes || '#111827'}"/><ellipse cx="${cx + 12}" cy="${footY}" rx="10" ry="5" fill="${o.shoes || '#111827'}"/>
      <rect x="${cx - 17}" y="${legsY - 6}" width="34" height="20" rx="5" fill="${shorts}"/>
      <rect x="${cx - 17}" y="${t + 36}" width="34" height="${legsY - t - 38}" rx="11" fill="${shirt}"/>
      ${o.stripe ? `<rect x="${cx - 4}" y="${t + 37}" width="8" height="${legsY - t - 40}" fill="${o.stripe}"/>` : ''}
      ${o.num !== undefined ? `<text x="${cx}" y="${t + 66}" font-size="15" font-weight="700" text-anchor="middle" fill="${o.numColor || '#fff'}" font-family="Arial">${o.num}</text>` : ''}`;
  }
  const arms = (gi ? `<path d="${armL}" stroke="#9ca3af" stroke-width="${sleeve + 3}" stroke-linecap="round" fill="none"/><path d="${armR}" stroke="#9ca3af" stroke-width="${sleeve + 3}" stroke-linecap="round" fill="none"/>` : '') + `<path d="${armL}" stroke="${shirt}" stroke-width="${sleeve}" stroke-linecap="round" fill="none"/><path d="${armR}" stroke="${shirt}" stroke-width="${sleeve}" stroke-linecap="round" fill="none"/>
    <circle cx="${handL[0]}" cy="${handL[1]}" r="${handR2}" fill="${handCol}"/><circle cx="${handR[0]}" cy="${handR[1]}" r="${handR2}" fill="${handCol}"/>`;
  const face = `<rect x="${cx - 5}" y="${t + 30}" width="10" height="9" fill="${skin}"/>
    <circle cx="${cx}" cy="${hy}" r="17" fill="${skin}"/>
    <ellipse cx="${cx - 6}" cy="${hy + 1}" rx="2.6" ry="3.2" fill="${eyes}"/><ellipse cx="${cx + 6}" cy="${hy + 1}" rx="2.6" ry="3.2" fill="${eyes}"/>
    <circle cx="${cx - 5}" cy="${hy}" r="1" fill="#fff"/><circle cx="${cx + 7}" cy="${hy}" r="1" fill="#fff"/>
    <path d="M${cx - 6} ${hy + 8} q6 5 12 0" stroke="#9a3b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="${cx - 11}" cy="${hy + 6}" r="2.6" fill="#f4a7a0" opacity=".5"/><circle cx="${cx + 11}" cy="${hy + 6}" r="2.6" fill="#f4a7a0" opacity=".5"/>`;
  return `${o.cape ? `<path d="M${cx - 16} ${t + 40} L${cx - 30} ${t + 120} L${cx + 30} ${t + 120} L${cx + 16} ${t + 40} Z" fill="${o.cape}"/>` : ''}
    ${hairBack}${body}${arms}${face}${hairTop}${o.head || ''}`;
}
/* Accessoires de tête / corps pour l'enfant dessiné de face */
function accEnfant(id, cx, t) {
  const hy = t + 20;
  return {
    casquette: `<path d="M${cx - 18} ${hy - 4} a18 15 0 0 1 36 0 z" fill="#2563eb"/><path d="M${cx - 2} ${hy - 5} h26 q-2 5 -26 4 z" fill="#1e40af"/>`,
    bandeau: `<path d="M${cx - 18} ${hy - 9} Q${cx} ${hy - 15} ${cx + 18} ${hy - 9} L${cx + 18} ${hy - 3} Q${cx} ${hy - 9} ${cx - 18} ${hy - 3} Z" fill="#dc2626"/><path d="M${cx + 17} ${hy - 6} l12 -5 M${cx + 17} ${hy - 4} l13 3" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>`,
    bandeauEtoile: `<path d="M${cx - 18} ${hy - 9} Q${cx} ${hy - 15} ${cx + 18} ${hy - 9} L${cx + 18} ${hy - 3} Q${cx} ${hy - 9} ${cx - 18} ${hy - 3} Z" fill="#f8fafc" stroke="#cbd5e1"/><path d="M${cx} ${hy - 15} l2 4 l4 0 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 0z" fill="#dc2626"/>`,
    couronne: `<path d="M${cx - 14} ${hy - 14} L${cx - 10} ${hy - 28} L${cx - 4} ${hy - 19} L${cx} ${hy - 31} L${cx + 4} ${hy - 19} L${cx + 10} ${hy - 28} L${cx + 14} ${hy - 14} Z" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`,
    lunettes: `<rect x="${cx - 14}" y="${hy - 4}" width="12" height="8" rx="3" fill="#111827" stroke="#facc15" stroke-width="1.5"/><rect x="${cx + 2}" y="${hy - 4}" width="12" height="8" rx="3" fill="#111827" stroke="#facc15" stroke-width="1.5"/><path d="M${cx - 2} ${hy} h4" stroke="#facc15" stroke-width="2"/>`,
    brassard: `<rect x="${cx - 31}" y="${t + 54}" width="12" height="8" rx="2" fill="#facc15" stroke="#b45309" stroke-width="1" transform="rotate(16 ${cx - 25} ${t + 58})"/><text x="${cx - 25}" y="${t + 61}" font-size="7" font-weight="700" text-anchor="middle" fill="#7c2d12" font-family="Arial">C</text>`,
    medaille: `<path d="M${cx - 8} ${t + 37} L${cx - 2} ${t + 56} M${cx + 8} ${t + 37} L${cx + 2} ${t + 56}" stroke="#2563eb" stroke-width="3"/><circle cx="${cx}" cy="${t + 60}" r="6" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`
  }[id] || '';
}

/* =========================================================
   1. LA TROTTINETTE (générique, sans marque)
   ========================================================= */
UNIVERS.trottinette = {
  nom: 'la trottinette',
  objet: 'ta trottinette',
  boutique: { titre: 'Le Garage', icone: '🛠️' },
  jeux: { mots: 'Le Garage des mots', tables: 'Grand Prix des tables', problemes: 'Les Enquêtes', parcours: 'Le Permis de la route' },
  emojiCourse: '🛴💨🏁',
  depart: '🚦 3, 2, 1… Partez !',
  scene: 'route',
  decor: '🌳   🏠      🌳 🌳     🏢    🌳     🏠   🌳',
  jauge: (v, m) => ({ court: `🛴 Ta ${m.name} roule à `, val: `${v} km/h`, phrase: `Ta ${m.name} roule maintenant à ${v} kilomètres heure !` }),
  onglets: [
    { id: 'model', label: '🛴 Modèle', items: [
      { id: 'classique', name: 'Trottinette classique', label: 'CLASSIC', price: 0, lvl: 1, bonus: 0 },
      { id: 'sport', name: 'Trottinette sport', label: 'SPORT', price: 120, lvl: 3, bonus: 3 },
      { id: 'tt', name: 'Trottinette tout-terrain', label: 'TOUT-TERRAIN', price: 250, lvl: 5, bonus: 5 },
      { id: 'turbo', name: 'Trottinette turbo', label: 'TURBO', price: 400, lvl: 7, bonus: 8 },
      { id: 'fusee', name: 'Trottinette fusée', label: 'FUSÉE', price: 600, lvl: 9, bonus: 10 }] },
    { id: 'color', label: '🎨 Couleur', items: [
      { id: 'orange', name: 'Orange vif', c: '#f26a10', price: 0 },
      { id: 'bleu', name: 'Bleu turbo', c: '#2563eb', price: 30 },
      { id: 'rougenoir', name: 'Rouge et noir', c: '#dc2626', two: true, price: 100 },
      { id: 'vert', name: 'Vert pomme', c: '#16a34a', price: 30 },
      { id: 'violet', name: 'Violet galaxie', c: '#7c3aed', price: 50 },
      { id: 'noir', name: 'Noir carbone', c: '#1f2937', price: 60 },
      { id: 'or', name: 'Or champion', c: '#d4a017', price: 120 }] },
    { id: 'acc', label: '⛑️ Casque', items: [
      { id: 'aucun', name: 'Casque classique', c: '#f3f4f6', price: 0 },
      { id: 'oreilles', name: 'Casque à oreilles', c: '#1c1c1f', price: 40 },
      { id: 'flamme', name: 'Casque flammes', c: '#f97316', price: 50 },
      { id: 'dino', name: 'Casque dino', c: '#22c55e', price: 50 },
      { id: 'requin', name: 'Casque requin', c: '#64748b', price: 60 },
      { id: 'eclair', name: 'Casque éclair', c: '#1f2937', price: 60 },
      { id: 'viking', name: 'Casque viking', c: '#9ca3af', price: 70 },
      { id: 'crete', name: 'Casque crête punk', c: '#111827', price: 80 },
      { id: 'antennes', name: 'Casque extraterrestre', c: '#84cc16', price: 90 },
      { id: 'integral', name: 'Casque intégral', c: '#dc2626', price: 100 },
      { id: 'pilote', name: 'Casque pilote', c: '#ef4444', price: 120 }] }
  ],
  dessin: (o) => Z.art.rider(o),
  autocollants: [
    { id: 't1', e: '🛴', n: 'Trottinette', r: 1 }, { id: 't2', e: '⛑️', n: 'Casque', r: 1 }, { id: 't3', e: '🏁', n: 'Drapeau', r: 1 },
    { id: 't4', e: '🔋', n: 'Batterie', r: 1 }, { id: 't5', e: '🏍️', n: 'Moto', r: 2 }, { id: 't6', e: '🏎️', n: 'Bolide', r: 2 },
    { id: 't7', e: '🚀', n: 'Trottinette fusée', r: 3 }
  ]
};

/* =========================================================
   2. LE FOOT
   ========================================================= */
const BALLONS = {
  classique: { fond: '#ffffff', motif: '#111827' },
  etoiles: { fond: '#1e3a8a', motif: '#facc15', etoile: 1 },
  flammes: { fond: '#f97316', motif: '#7c2d12', flamme: 1 },
  or: { fond: '#facc15', motif: '#b45309' },
  galaxie: { fond: '#4c1d95', motif: '#f0abfc', etoile: 1 }
};
UNIVERS.foot = {
  nom: 'le foot',
  objet: 'ta tenue de foot',
  boutique: { titre: 'Le Vestiaire', icone: '👕' },
  jeux: { mots: 'Le Vestiaire des mots', tables: 'Le Tournoi des tables', problemes: 'Les Enquêtes', parcours: 'Le Permis de la route' },
  emojiCourse: '⚽💨🥅',
  depart: '📣 Coup d\'envoi !',
  scene: 'terrain',
  decor: '🚩      🥅            🚩      📣         🚩',
  jauge: (v, m) => ({ court: `⚽ Ton tir part à `, val: `${v} km/h`, phrase: `Avec ton ${m.name.toLowerCase()}, ton tir part maintenant à ${v} kilomètres heure !` }),
  onglets: [
    { id: 'model', label: '⚽ Ballon', items: [
      { id: 'classique', name: 'Ballon classique', price: 0, lvl: 1, bonus: 0 },
      { id: 'etoiles', name: 'Ballon étoilé', price: 120, lvl: 3, bonus: 3 },
      { id: 'flammes', name: 'Ballon de feu', price: 250, lvl: 5, bonus: 5 },
      { id: 'or', name: 'Ballon d\'or', price: 400, lvl: 7, bonus: 8 },
      { id: 'galaxie', name: 'Ballon galaxie', price: 600, lvl: 9, bonus: 10 }] },
    { id: 'color', label: '🎨 Maillot', items: [
      { id: 'vert', name: 'Maillot vert', c: '#16a34a', price: 0 },
      { id: 'bleu', name: 'Maillot bleu', c: '#2563eb', price: 30 },
      { id: 'rouge', name: 'Maillot rouge', c: '#dc2626', price: 30 },
      { id: 'raye', name: 'Maillot rayé', c: '#2563eb', two: '#ffffff', price: 80 },
      { id: 'jaune', name: 'Maillot jaune', c: '#facc15', price: 50 },
      { id: 'noir', name: 'Maillot noir', c: '#1f2937', price: 60 },
      { id: 'or', name: 'Maillot or', c: '#d4a017', price: 120 }] },
    { id: 'acc', label: '🧢 Style', items: [
      { id: 'aucun', name: 'Tout simple', price: 0 },
      { id: 'bandeau', name: 'Bandeau', price: 30 },
      { id: 'casquette', name: 'Casquette', price: 40 },
      { id: 'brassard', name: 'Brassard de capitaine', price: 60 },
      { id: 'gants', name: 'Gants de gardien', price: 60 },
      { id: 'lunettes', name: 'Lunettes de star', price: 70 },
      { id: 'cape', name: 'Cape de héros', price: 90 },
      { id: 'medaille', name: 'Médaille d\'or', price: 100 },
      { id: 'couronne', name: 'Couronne du roi du foot', price: 120 }] }
  ],
  dessin(o) {
    const shirt = o.color.c, cx = 80, t = 14;
    const B = BALLONS[o.model.id] || BALLONS.classique;
    const bx = 168, by = 150, r = 20;
    const motif = B.etoile
      ? [[-8, -6], [7, -9], [0, 6], [10, 8], [-10, 9]].map(([x, y]) => `<circle cx="${bx + x}" cy="${by + y}" r="2.4" fill="${B.motif}"/>`).join('')
      : B.flamme ? `<path d="M${bx - 14} ${by + 6} q6 -18 12 -8 q2 -12 10 -10 q-2 8 6 10 q2 8 -6 12 z" fill="${B.motif}" opacity=".85"/>`
        : `<path d="M${bx} ${by - 7} l7 5 l-3 8 h-8 l-3 -8 z" fill="${B.motif}"/><path d="M${bx} ${by - 7} V${by - 20} M${bx + 7} ${by - 2} L${bx + 19} ${by - 6} M${bx + 4} ${by + 6} L${bx + 11} ${by + 17} M${bx - 4} ${by + 6} L${bx - 11} ${by + 17} M${bx - 7} ${by - 2} L${bx - 19} ${by - 6}" stroke="${B.motif}" stroke-width="2"/>`;
    const a = o.acc.id;
    return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="172" rx="90" ry="6" fill="rgba(0,0,0,.18)"/>
      ${dessinEnfant({ cx, top: t, shirt, stripe: o.color.two, num: (PROFIL.enfant.numero ?? ''), numColor: o.color.id === 'jaune' ? '#1f2937' : '#fff',
        socks: shirt, shorts: '#f8fafc', gants: a === 'gants' ? '#22c55e' : null, cape: a === 'cape' ? '#dc2626' : null,
        head: accEnfant(a, cx, t) })}
      <g class="ball" style="transform-origin:${bx}px ${by}px"><circle cx="${bx}" cy="${by}" r="${r}" fill="${B.fond}" stroke="#111827" stroke-width="2"/>${motif}</g>
    </svg>`;
  },
  autocollants: [
    { id: 'f1', e: '⚽', n: 'Ballon', r: 1 }, { id: 'f2', e: '🥅', n: 'But', r: 1 }, { id: 'f3', e: '👕', n: 'Maillot', r: 1 },
    { id: 'f4', e: '👟', n: 'Crampons', r: 1 }, { id: 'f5', e: '🧤', n: 'Gardien', r: 2 }, { id: 'f6', e: '📣', n: 'Supporter', r: 2 },
    { id: 'f7', e: '🏆', n: 'Coupe du monde', r: 3 }
  ]
};

/* =========================================================
   3. LE KARATÉ (arts martiaux)
   La « jauge » est la ceinture : elle se débloque avec le niveau.
   ========================================================= */
UNIVERS.karate = {
  nom: 'le karaté',
  objet: 'ton kimono',
  boutique: { titre: 'Le Dojo', icone: '🥋' },
  jeux: { mots: 'Le Dojo des mots', tables: 'Le Défi des tables', problemes: 'Les Enquêtes', parcours: 'Le Permis de la route' },
  emojiCourse: '🥋💨🏆',
  depart: '🙇 Salut… Hajime !',
  scene: 'dojo',
  decor: '🏮        🎋          🏮         🎋        🏮',
  jauge: (v, m) => ({ court: `🥋 ${m.name} · force `, val: `${v}`, phrase: `Avec ta ${m.name.toLowerCase()}, ta force monte à ${v} !` }),
  onglets: [
    { id: 'model', label: '🥋 Ceinture', items: [
      { id: 'blanche', name: 'Ceinture blanche', c: '#f8fafc', price: 0, lvl: 1, bonus: 0 },
      { id: 'jaune', name: 'Ceinture jaune', c: '#facc15', price: 40, lvl: 2, bonus: 1 },
      { id: 'orange', name: 'Ceinture orange', c: '#f97316', price: 80, lvl: 3, bonus: 2 },
      { id: 'verte', name: 'Ceinture verte', c: '#16a34a', price: 150, lvl: 5, bonus: 4 },
      { id: 'bleue', name: 'Ceinture bleue', c: '#2563eb', price: 250, lvl: 7, bonus: 6 },
      { id: 'marron', name: 'Ceinture marron', c: '#7c4a1e', price: 400, lvl: 9, bonus: 8 },
      { id: 'noire', name: 'Ceinture noire', c: '#111827', price: 600, lvl: 11, bonus: 10 }] },
    { id: 'color', label: '🎨 Kimono', items: [
      { id: 'blanc', name: 'Kimono blanc', c: '#ffffff', price: 0 },
      { id: 'bleu', name: 'Kimono bleu', c: '#3b82f6', price: 40 },
      { id: 'noir', name: 'Kimono noir', c: '#1f2937', price: 80 },
      { id: 'rouge', name: 'Kimono rouge', c: '#dc2626', price: 60 },
      { id: 'or', name: 'Kimono or', c: '#d4a017', price: 120 }] },
    { id: 'acc', label: '🎽 Style', items: [
      { id: 'aucun', name: 'Tout simple', price: 0 },
      { id: 'bandeau', name: 'Bandeau rouge', price: 30 },
      { id: 'bandeauEtoile', name: 'Bandeau étoile', price: 40 },
      { id: 'gantsRouges', name: 'Gants rouges', price: 50 },
      { id: 'gantsBleus', name: 'Gants bleus', price: 50 },
      { id: 'lunettes', name: 'Lunettes de star', price: 70 },
      { id: 'cape', name: 'Cape de maître', price: 90 },
      { id: 'medaille', name: 'Médaille d\'or', price: 100 },
      { id: 'couronne', name: 'Couronne de champion', price: 120 }] }
  ],
  dessin(o) {
    const cx = 92, t = 14, a = o.acc.id;
    return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="172" rx="80" ry="6" fill="rgba(0,0,0,.18)"/>
      <rect x="20" y="150" width="180" height="20" rx="4" fill="#fde68a" opacity=".55"/>
      ${dessinEnfant({ cx, top: t, gi: true, shirt: o.color.c, belt: o.model.c, pose: 'punch',
        gants: a === 'gantsRouges' ? '#dc2626' : a === 'gantsBleus' ? '#2563eb' : null, cape: a === 'cape' ? '#7c3aed' : null,
        head: accEnfant(a, cx, t) })}
    </svg>`;
  },
  autocollants: [
    { id: 'k1', e: '🥋', n: 'Kimono', r: 1 }, { id: 'k2', e: '👊', n: 'Poing', r: 1 }, { id: 'k3', e: '🙇', n: 'Salut', r: 1 },
    { id: 'k4', e: '🦶', n: 'Coup de pied', r: 1 }, { id: 'k5', e: '🐯', n: 'Tigre', r: 2 }, { id: 'k6', e: '🐉', n: 'Dragon', r: 2 },
    { id: 'k7', e: '🥇', n: 'Médaille d\'or', r: 3 }
  ]
};

/* =========================================================
   4. LES DINOSAURES (on élève son dino)
   ========================================================= */
UNIVERS.dinosaures = {
  nom: 'les dinosaures',
  objet: 'ton dino',
  boutique: { titre: 'Le Nid du dino', icone: '🥚' },
  jeux: { mots: 'Les Fouilles des mots', tables: 'La Course des dinos', problemes: 'Les Enquêtes', parcours: 'Le Permis de la route' },
  emojiCourse: '🦖💨🌋',
  depart: '🌋 Rooaaar, c\'est parti !',
  scene: 'jungle',
  decor: '🌴     🌋        🌿   🌴         🪨      🌴   🌿',
  jauge: (v, m) => ({ court: `🦖 Ton ${m.name.toLowerCase()} court à `, val: `${v} km/h`, phrase: `Ton ${m.name.toLowerCase()} court maintenant à ${v} kilomètres heure !` }),
  onglets: [
    { id: 'model', label: '🦕 Dino', items: [
      { id: 'bebe', name: 'Bébé dino', price: 0, lvl: 1, bonus: 0 },
      { id: 'piques', name: 'Dino à piques', price: 120, lvl: 3, bonus: 3 },
      { id: 'cornes', name: 'Dino à cornes', price: 250, lvl: 5, bonus: 5 },
      { id: 'longcou', name: 'Dino long-cou', price: 400, lvl: 7, bonus: 8 },
      { id: 'ailes', name: 'Dino volant', price: 600, lvl: 9, bonus: 10 }] },
    { id: 'color', label: '🎨 Couleur', items: [
      { id: 'vert', name: 'Vert jungle', c: '#22c55e', price: 0 },
      { id: 'bleu', name: 'Bleu lagon', c: '#0ea5e9', price: 30 },
      { id: 'orange', name: 'Orange volcan', c: '#f97316', price: 30 },
      { id: 'violet', name: 'Violet mystère', c: '#8b5cf6', price: 50 },
      { id: 'rose', name: 'Rose bonbon', c: '#f472b6', price: 50 },
      { id: 'or', name: 'Dino en or', c: '#d4a017', price: 120 }] },
    { id: 'acc', label: '🎩 Style', items: [
      { id: 'aucun', name: 'Tout simple', price: 0 },
      { id: 'noeud', name: 'Nœud papillon', price: 30 },
      { id: 'casquette', name: 'Casquette', price: 40 },
      { id: 'lunettes', name: 'Lunettes de star', price: 50 },
      { id: 'explorateur', name: 'Chapeau d\'explorateur', price: 70 },
      { id: 'couronne', name: 'Couronne du roi des dinos', price: 120 }] }
  ],
  dessin(o) {
    const c = o.color.c, m = o.model.id, a = o.acc.id;
    const s = m === 'bebe' ? 0.78 : 1;
    const neckUp = m === 'longcou';
    const hx = neckUp ? 176 : 170, hy = neckUp ? 34 : 78;   // tête
    const plates = m === 'piques' ? [60, 82, 104, 126].map((x, i) => `<path d="M${x - 10} ${92 - (i === 1 || i === 2 ? 4 : 0)} l10 -24 l10 24 z" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/>`).join('') : '';
    const horns = m === 'cornes' ? `<path d="M${hx - 26} ${hy - 6} q-8 -18 6 -26 q16 2 20 14 z" fill="#fde68a" stroke="#92400e" stroke-width="2"/><path d="M${hx - 4} ${hy - 14} l10 -16 l2 16 z M${hx + 10} ${hy - 6} l16 -6 l-8 12 z" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/>` : '';
    const wings = m === 'ailes' ? `<path d="M80 90 L50 30 L74 44 L86 24 L100 46 L118 34 L112 88 Z" fill="${c}" stroke="#14532d" stroke-width="2" opacity=".9"/><path d="M58 40 L96 86 M86 30 L104 84" stroke="#14532d" stroke-width="1.5"/>` : '';
    const neck = neckUp ? `<path d="M140 96 Q160 70 ${hx - 6} ${hy + 10}" stroke="${c}" stroke-width="26" fill="none" stroke-linecap="round"/>`
      : `<path d="M140 100 Q156 92 ${hx - 10} ${hy + 4}" stroke="${c}" stroke-width="28" fill="none" stroke-linecap="round"/>`;
    const head = `<ellipse cx="${hx}" cy="${hy}" rx="24" ry="17" fill="${c}" stroke="#14532d" stroke-width="2"/>
      <circle cx="${hx + 2}" cy="${hy - 6}" r="5.5" fill="#fff"/><circle cx="${hx + 3.5}" cy="${hy - 6}" r="3" fill="#111827"/><circle cx="${hx + 4.5}" cy="${hy - 7}" r="1" fill="#fff"/>
      <path d="M${hx + 4} ${hy + 7} q10 4 18 -3" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="${hx + 18}" cy="${hy - 2}" r="1.6" fill="#14532d"/>`;
    const accs = {
      noeud: `<path d="M${hx - 20} ${hy + 14} l10 5 l-10 5 z M${hx} ${hy + 14} l-10 5 l10 5 z" fill="#dc2626"/><circle cx="${hx - 10}" cy="${hy + 19}" r="3" fill="#991b1b"/>`,
      casquette: `<path d="M${hx - 18} ${hy - 12} a18 13 0 0 1 36 0 z" fill="#2563eb"/><path d="M${hx} ${hy - 13} h26 q-2 5 -26 4 z" fill="#1e40af"/>`,
      lunettes: `<rect x="${hx - 6}" y="${hy - 12}" width="14" height="10" rx="3" fill="#111827" stroke="#facc15" stroke-width="2"/><rect x="${hx + 10}" y="${hy - 12}" width="12" height="10" rx="3" fill="#111827" stroke="#facc15" stroke-width="2"/>`,
      explorateur: `<ellipse cx="${hx}" cy="${hy - 13}" rx="26" ry="5" fill="#a16207"/><path d="M${hx - 14} ${hy - 14} q2 -16 14 -16 q12 0 14 16 z" fill="#ca8a04"/><path d="M${hx - 14} ${hy - 17} h28" stroke="#78350f" stroke-width="3"/>`,
      couronne: `<path d="M${hx - 14} ${hy - 14} L${hx - 10} ${hy - 30} L${hx - 4} ${hy - 20} L${hx} ${hy - 33} L${hx + 4} ${hy - 20} L${hx + 10} ${hy - 30} L${hx + 14} ${hy - 14} Z" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`
    };
    return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="172" rx="${90 * s}" ry="6" fill="rgba(0,0,0,.18)"/>
      <g transform="translate(${110 - 110 * s} ${172 - 172 * s}) scale(${s})">
        ${wings}
        <path d="M66 110 Q30 112 6 140 Q40 132 70 128 Z" fill="${c}" stroke="#14532d" stroke-width="2"/>
        ${plates}
        <ellipse cx="104" cy="112" rx="50" ry="34" fill="${c}" stroke="#14532d" stroke-width="2"/>
        <ellipse cx="108" cy="124" rx="34" ry="16" fill="#fef3c7" opacity=".7"/>
        <rect x="72" y="132" width="16" height="34" rx="7" fill="${c}" stroke="#14532d" stroke-width="2"/>
        <rect x="118" y="132" width="16" height="34" rx="7" fill="${c}" stroke="#14532d" stroke-width="2"/>
        ${neck}${horns}${head}${accs[a] || ''}
      </g>
    </svg>`;
  },
  autocollants: [
    { id: 'd1', e: '🦖', n: 'T-rex', r: 1 }, { id: 'd2', e: '🦕', n: 'Long-cou', r: 1 }, { id: 'd3', e: '🦴', n: 'Fossile', r: 1 },
    { id: 'd4', e: '🥚', n: 'Œuf de dino', r: 1 }, { id: 'd5', e: '🌋', n: 'Volcan', r: 2 }, { id: 'd6', e: '☄️', n: 'Météorite', r: 2 },
    { id: 'd7', e: '🦣', n: 'Mammouth', r: 3 }
  ]
};

/* =========================================================
   5. LE TRAIL (course nature)
   Le « modèle » = les chaussures ; la jauge = la vitesse en montée.
   ========================================================= */
UNIVERS.trail = {
  nom: 'le trail',
  objet: 'ta tenue de trail',
  boutique: { titre: 'Le Refuge', icone: '🏔️' },
  jeux: { mots: 'Le Sentier des mots', tables: 'La Côte des tables', problemes: 'Les Enquêtes', parcours: 'Le Permis de la route' },
  emojiCourse: '🏃💨⛰️',
  depart: '📣 3, 2, 1… Top départ !',
  scene: 'trail',
  decor: '🌲     ⛰️        🌲   🌲         🏔️      🌲   🌲',
  jauge: (v, m) => ({ court: `🏃 Avec tes ${m.name.toLowerCase()}, tu montes à `, val: `${v} km/h`, phrase: `Avec tes ${m.name.toLowerCase()}, tu montes maintenant à ${v} kilomètres heure !` }),
  onglets: [
    { id: 'model', label: '👟 Chaussures', items: [
      { id: 'route', name: 'Baskets de route', c: '#6b7280', price: 0, lvl: 1, bonus: 0 },
      { id: 'trail', name: 'Chaussures de trail', c: '#f97316', price: 120, lvl: 3, bonus: 3 },
      { id: 'crampons', name: 'Chaussures à crampons', c: '#16a34a', price: 250, lvl: 5, bonus: 5 },
      { id: 'ultra', name: 'Chaussures d\'ultra-trail', c: '#7c3aed', price: 400, lvl: 7, bonus: 8 },
      { id: 'or', name: 'Chaussures en or', c: '#d4a017', price: 600, lvl: 9, bonus: 10 }] },
    { id: 'color', label: '🎨 Maillot', items: [
      { id: 'turquoise', name: 'Maillot turquoise', c: '#0d9488', price: 0 },
      { id: 'rouge', name: 'Maillot rouge', c: '#dc2626', price: 30 },
      { id: 'violet', name: 'Maillot violet', c: '#7c3aed', price: 30 },
      { id: 'jaune', name: 'Maillot fluo', c: '#facc15', price: 50 },
      { id: 'raye', name: 'Maillot rayé', c: '#0ea5e9', two: '#ffffff', price: 80 },
      { id: 'noir', name: 'Maillot noir', c: '#1f2937', price: 60 },
      { id: 'finisher', name: 'Maillot de finisher', c: '#d4a017', price: 120 }] },
    { id: 'acc', label: '🧢 Équipement', items: [
      { id: 'aucun', name: 'Tout simple', price: 0 },
      { id: 'casquette', name: 'Casquette', price: 30 },
      { id: 'bandeau', name: 'Bandeau', price: 30 },
      { id: 'lunettes', name: 'Lunettes de soleil', price: 50 },
      { id: 'frontale', name: 'Lampe frontale', price: 60 },
      { id: 'batons', name: 'Bâtons de trail', price: 80 },
      { id: 'medaille', name: 'Médaille de finisher', price: 100 },
      { id: 'couronne', name: 'Couronne de reine du trail', price: 120 }] }
  ],
  dessin(o) {
    const shirt = o.color.c, cx = 80, t = 14, a = o.acc.id;
    const shoe = o.model.c || '#6b7280';
    const frontale = a === 'frontale' ? `<path d="M${cx - 18} ${t + 12} Q${cx} ${t + 6} ${cx + 18} ${t + 12}" stroke="#111827" stroke-width="4" fill="none"/><rect x="${cx - 6}" y="${t + 4}" width="12" height="8" rx="2" fill="#facc15" stroke="#111827" stroke-width="1.5"/><path d="M${cx} ${t + 4} L${cx + 40} ${t - 8} L${cx + 40} ${t + 16} Z" fill="#fef08a" opacity=".55"/>` : '';
    const batons = a === 'batons' ? `<path d="M${cx - 27} ${t + 83} L${cx - 44} ${t + 158} M${cx + 27} ${t + 83} L${cx + 44} ${t + 158}" stroke="#374151" stroke-width="3" stroke-linecap="round"/>` : '';
    const dossard = `<rect x="${cx - 10}" y="${t + 54}" width="20" height="14" rx="2" fill="#fff" stroke="#9ca3af"/><text x="${cx}" y="${t + 65}" font-size="9" font-weight="700" text-anchor="middle" fill="#1f2937" font-family="Arial">${PROFIL.enfant.numero ?? ''}</text>`;
    const head = (a === 'frontale' || a === 'batons') ? '' : accEnfant(a, cx, t);
    return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="172" rx="90" ry="6" fill="rgba(0,0,0,.18)"/>
      <path d="M120 170 L160 96 L178 120 L196 84 L220 170 Z" fill="#94a3b8" opacity=".5"/><path d="M190 96 L196 84 L202 96 Z" fill="#fff"/>
      ${batons}
      ${dessinEnfant({ cx, top: t, shirt, stripe: o.color.two, socks: '#f8fafc', shorts: '#1f2937', shoes: shoe, head: head + frontale })}
      ${dossard}
    </svg>`;
  },
  autocollants: [
    { id: 'tr1', e: '🏃', n: 'Coureur', r: 1 }, { id: 'tr2', e: '⛰️', n: 'Montagne', r: 1 }, { id: 'tr3', e: '🌲', n: 'Forêt', r: 1 },
    { id: 'tr4', e: '👟', n: 'Chaussure', r: 1 }, { id: 'tr5', e: '🔦', n: 'Frontale', r: 2 }, { id: 'tr6', e: '🏔️', n: 'Sommet', r: 2 },
    { id: 'tr7', e: '🏅', n: 'Finisher', r: 3 }
  ]
};
