/* =========================================================
   LES ANIMAUX GUIDES : dessinés en code (SVG), sans photo
   ---------------------------------------------------------
   Z.art.animal({ espece, couleurs, acc, mood })
   espece : 'chat' | 'chien' | 'lapin' | 'cheval' | 'tortue' | 'oiseau' | 'humain'
   couleurs (toutes facultatives) :
     pelage   = couleur principale        clair  = ventre, museau
     oreilles = intérieur ou oreilles     taches = rayures / taches
     yeux     = couleur des yeux          collier = couleur du collier
     (tortue : carapace, bord · oiseau : ailes, bec ·
     humain : peau, cheveux, coupe 'courts'|'longs', yeux, tshirt, motif, barbe, bouc, lunettes)
   La tête est toujours centrée en (60, 52) : les accessoires
   (casquette, lunettes, nœud…) vont donc sur tous les animaux.
   ========================================================= */
(function () {
  const DEF = {
    chat:   { pelage: '#f59e0b', clair: '#fff7ed', oreilles: '#f2b3b3', taches: '#b45309', yeux: '#65a30d', nez: '#e79a9a' },
    chien:  { pelage: '#c98b4e', clair: '#f5e6cc', oreilles: '#7a4a24', yeux: '#4a2c1a', nez: '#1f1f1f' },
    lapin:  { pelage: '#e5e7eb', clair: '#ffffff', oreilles: '#f2b3b3', yeux: '#1f2937', nez: '#f472b6' },
    cheval: { pelage: '#8b5a2b', clair: '#f5f5f4', oreilles: '#5b3a1a', criniere: '#2b1a10', yeux: '#1f1f1f', nez: '#3f2a1a' },
    tortue: { pelage: '#d6c393', carapace: '#2a2219', bord: '#e6c463', yeux: '#2b1d10' },
    humain: { peau: '#f1c7a5', cheveux: '#4a2c17', yeux: '#3b2416', tshirt: '#111827', motif: '#9ca3af', barbe: '' },
    oiseau: { pelage: '#38bdf8', clair: '#e0f2fe', ailes: '#0284c7', bec: '#f59e0b', yeux: '#1f2937' }
  };

  /* Accessoires communs (tête centrée en 60,52, cou vers y = 82) */
  function accessoire(a, col) {
    if (a === 'bandana') return `<path d="M38 80 L82 80 L60 98 Z" fill="#ef4444"/><circle cx="60" cy="86" r="3" fill="#fff"/>`;
    if (a === 'lunettes') return `<rect x="36" y="46" width="20" height="13" rx="5" fill="#111827" stroke="#facc15" stroke-width="2.5"/><rect x="64" y="46" width="20" height="13" rx="5" fill="#111827" stroke="#facc15" stroke-width="2.5"/><path d="M56 52 H64" stroke="#facc15" stroke-width="3"/>`;
    if (a === 'couronne') return `<path d="M40 22 L46 8 L53 18 L60 4 L67 18 L74 8 L80 22 Z" fill="#facc15" stroke="#b45309" stroke-width="2"/>`;
    if (a === 'noeud') return `<path d="M47 84 l13 6 l-13 6 z M73 84 l-13 6 l13 6 z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.2"/><circle cx="60" cy="90" r="3.5" fill="#991b1b"/>`;
    if (a === 'casquette') return `<path d="M36 30 a24 19 0 0 1 48 0 z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2"/><path d="M34 30 h54 q-4 7 -28 6 q-22 0 -26 -6z" fill="#1e40af"/><circle cx="60" cy="13" r="2.5" fill="#1e3a8a"/>`;
    if (a === 'chapeau') return `<path d="M44 22 L48 -2 L72 -2 L76 22 Z" fill="#111827"/><rect x="34" y="20" width="52" height="6" rx="3" fill="#111827"/><rect x="46" y="14" width="28" height="5" fill="#7c3aed"/><path d="M64 4 l2 4 l4 0 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 0z" fill="#facc15"/>`;
    if (a === 'casque') return `<path d="M34 30 a26 22 0 0 1 52 0 z" fill="${col || '#f97316'}" stroke="#374151" stroke-width="2"/>`;
    if (a === 'bandeau') return `<path d="M30 32 Q60 22 90 32 L90 39 Q60 29 30 39 Z" fill="#dc2626"/><path d="M90 34 l12 -4 M90 37 l13 3" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>`;
    if (a === 'medaille') return `<path d="M48 78 L56 94 M72 78 L64 94" stroke="#2563eb" stroke-width="4"/><circle cx="60" cy="98" r="7" fill="#facc15" stroke="#b45309" stroke-width="2"/>`;
    return '';
  }

  const yeux = (k, mood, y = 53) => mood === 'think'
    ? `<path d="M42 ${y + 1} q6 -4 12 0 M66 ${y + 1} q6 -4 12 0" stroke="${k.yeux}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : [48, 72].map(x => `<ellipse cx="${x}" cy="${y}" rx="6" ry="7" fill="${k.yeux}"/><circle cx="${x + 2}" cy="${y - 3}" r="2" fill="#fff"/>`).join('');

  const collier = (c) => c ? `<path d="M38 80 Q60 90 82 80" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="88" r="4.5" fill="#facc15" stroke="#b45309" stroke-width="1.2"/>` : '';
  const ombre = (rx = 38) => `<ellipse cx="60" cy="124" rx="${rx}" ry="5" fill="rgba(0,0,0,.18)"/>`;

  const DESSINS = {
    chat(k, mood) {
      const st = k.taches;
      const rayures = st ? `<path d="M32 88 q8 4 6 14 M88 88 q-8 4 -6 14" stroke="${st}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M50 30 l4 10 l6 -8 l6 8 l4 -10" stroke="${st}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M96 108 l6 -5 M104 100 l7 -2 M108 90 l7 1" stroke="${st}" stroke-width="4" stroke-linecap="round"/>` : '';
      return `${ombre()}
        <path class="tail" d="M88 112 q30 -6 22 -36" stroke="${k.pelage}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="60" cy="96" rx="32" ry="28" fill="${k.pelage}"/>
        <ellipse cx="60" cy="104" rx="20" ry="21" fill="${k.clair}"/>
        <path d="M30 34 L36 8 L52 26 Z" fill="${k.pelage}"/><path d="M90 34 L84 8 L68 26 Z" fill="${k.pelage}"/>
        <path d="M35 30 L38 15 L47 26 Z" fill="${k.oreilles}"/><path d="M85 30 L82 15 L73 26 Z" fill="${k.oreilles}"/>
        <ellipse cx="60" cy="52" rx="32" ry="28" fill="${k.pelage}"/>
        <ellipse cx="60" cy="68" rx="15" ry="10" fill="${k.clair}"/>
        ${rayures}
        ${mood === 'think' ? yeux(k, mood) : [48, 72].map(x => `<ellipse cx="${x}" cy="53" rx="6.5" ry="7.5" fill="${k.yeux}"/><ellipse cx="${x}" cy="53" rx="2.4" ry="6" fill="#111"/><circle cx="${x + 2}" cy="50" r="1.8" fill="#fff"/>`).join('')}
        <path d="M56 63 h8 l-4 5 z" fill="${k.nez}"/>
        <path d="M60 68 q-5 6 -10 2 M60 68 q5 6 10 2" stroke="#6b6b6b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M20 62 h20 M20 69 l20 -3 M100 62 h-20 M100 69 l-20 -3" stroke="#9ca3af" stroke-width="1.4"/>
        <ellipse cx="44" cy="122" rx="10" ry="6" fill="${k.clair}"/><ellipse cx="76" cy="122" rx="10" ry="6" fill="${k.clair}"/>`;
    },
    chien(k, mood) {
      const tache = k.taches ? `<ellipse cx="74" cy="44" rx="11" ry="10" fill="${k.taches}"/><ellipse cx="44" cy="100" rx="8" ry="7" fill="${k.taches}"/>` : '';
      return `${ombre()}
        <path class="tail" d="M88 110 q26 -4 24 -30" stroke="${k.pelage}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <ellipse cx="60" cy="96" rx="31" ry="28" fill="${k.pelage}"/>
        <ellipse cx="60" cy="104" rx="18" ry="20" fill="${k.clair}"/>
        <ellipse cx="60" cy="52" rx="30" ry="28" fill="${k.pelage}"/>
        ${tache}
        <path d="M32 34 Q16 40 22 70 Q30 74 36 60 Z" fill="${k.oreilles}"/><path d="M88 34 Q104 40 98 70 Q90 74 84 60 Z" fill="${k.oreilles}"/>
        <ellipse cx="60" cy="68" rx="17" ry="13" fill="${k.clair}"/>
        ${yeux(k, mood, 50)}
        <ellipse cx="60" cy="62" rx="7" ry="5" fill="${k.nez}"/>
        <path d="M60 67 v4 M60 71 q-6 5 -11 1 M60 71 q6 5 11 1" stroke="#3f3f3f" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${mood === 'think' ? '' : `<path d="M55 74 q5 10 10 0 z" fill="#f472b6"/>`}
        <ellipse cx="44" cy="122" rx="10" ry="6" fill="${k.clair}"/><ellipse cx="76" cy="122" rx="10" ry="6" fill="${k.clair}"/>`;
    },
    lapin(k, mood) {
      return `${ombre()}
        <circle cx="90" cy="112" r="9" fill="${k.clair}"/>
        <ellipse cx="60" cy="98" rx="30" ry="27" fill="${k.pelage}"/>
        <ellipse cx="60" cy="104" rx="18" ry="19" fill="${k.clair}"/>
        <ellipse cx="46" cy="10" rx="9" ry="26" fill="${k.pelage}" transform="rotate(-10 46 30)"/><ellipse cx="74" cy="10" rx="9" ry="26" fill="${k.pelage}" transform="rotate(10 74 30)"/>
        <ellipse cx="46" cy="12" rx="4.5" ry="19" fill="${k.oreilles}" transform="rotate(-10 46 30)"/><ellipse cx="74" cy="12" rx="4.5" ry="19" fill="${k.oreilles}" transform="rotate(10 74 30)"/>
        <ellipse cx="60" cy="54" rx="29" ry="26" fill="${k.pelage}"/>
        <ellipse cx="60" cy="68" rx="14" ry="10" fill="${k.clair}"/>
        ${yeux(k, mood)}
        <path d="M56 63 h8 l-4 4 z" fill="${k.nez}"/>
        <path d="M60 67 q-5 5 -9 1 M60 67 q5 5 9 1" stroke="#6b6b6b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="56" y="70" width="8" height="7" rx="1.5" fill="#fff" stroke="#d1d5db"/>
        <path d="M22 62 h18 M22 68 l18 -3 M98 62 h-18 M98 68 l-18 -3" stroke="#9ca3af" stroke-width="1.4"/>
        <ellipse cx="44" cy="122" rx="11" ry="6" fill="${k.clair}"/><ellipse cx="76" cy="122" rx="11" ry="6" fill="${k.clair}"/>`;
    },
    cheval(k, mood) {
      return `${ombre(34)}
        <path d="M30 124 Q28 92 42 82 L78 82 Q92 92 90 124 Z" fill="${k.pelage}"/>
        <path d="M34 20 Q60 6 86 20 L88 36 Q60 26 32 36 Z" fill="${k.criniere}"/>
        <path d="M38 22 L34 4 L48 16 Z M82 22 L86 4 L72 16 Z" fill="${k.pelage}"/>
        <path d="M39 18 L37 9 L44 15 Z M81 18 L83 9 L76 15 Z" fill="${k.oreilles}"/>
        <path d="M34 40 Q34 22 60 22 Q86 22 86 40 L80 72 Q76 92 60 92 Q44 92 40 72 Z" fill="${k.pelage}"/>
        <path d="M56 24 L60 50 L64 24 Z" fill="${k.clair}"/>
        <path d="M40 22 Q44 34 38 46 M80 22 Q76 34 82 46" stroke="${k.criniere}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="60" cy="78" rx="18" ry="13" fill="${k.clair}"/>
        ${mood === 'think' ? yeux(k, mood, 48) : [46, 74].map(x => `<ellipse cx="${x}" cy="48" rx="5.5" ry="6.5" fill="${k.yeux}"/><circle cx="${x + 2}" cy="45" r="1.8" fill="#fff"/>`).join('')}
        <ellipse cx="53" cy="78" rx="3" ry="4" fill="${k.nez}"/><ellipse cx="67" cy="78" rx="3" ry="4" fill="${k.nez}"/>
        <path d="M54 86 q6 4 12 0" stroke="${k.nez}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M56 92 Q60 108 64 92" stroke="${k.criniere}" stroke-width="5" fill="none"/>`;
    },
    humain(k, mood) {
      /* Une personne en buste (tête centrée en 60, 52) : cheveux, peau, t-shirt */
      const long = k.coupe === 'longs';
      const yeuxH = mood === 'think'
        ? `<path d="M45 54 q5 -4 10 0 M65 54 q5 -4 10 0" stroke="${k.yeux}" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : [50, 70].map(x => `<ellipse cx="${x}" cy="54" rx="3.4" ry="4.2" fill="${k.yeux}"/><circle cx="${x + 1}" cy="52.5" r="1.2" fill="#fff"/>`).join('');
      /* Petit bouc (barbichette au menton + fine moustache) */
      const bouc = k.bouc ? `<path d="M53 73 Q60 71 67 73 Q66 82 60 85 Q54 82 53 73 Z" fill="${k.bouc}"/>
        <path d="M51 64.5 Q60 61 69 64.5 Q60 63.5 51 64.5 Z" fill="${k.bouc}" stroke="${k.bouc}" stroke-width="1.6" stroke-linejoin="round"/>` : '';
      const barbe = k.barbe ? `<path d="M38 60 Q40 84 60 86 Q80 84 82 60 Q76 74 60 74 Q44 74 38 60 Z" fill="${k.barbe}"/>` : '';
      return `${ombre(36)}
        ${long ? `<path d="M32 44 Q30 96 40 104 L80 104 Q90 96 88 44 Z" fill="${k.cheveux}"/>` : ''}
        <path d="M18 128 Q18 92 44 86 L76 86 Q102 92 102 128 Z" fill="${k.tshirt}"/>
        <path d="M50 86 Q60 96 70 86" stroke="#374151" stroke-width="3" fill="none"/>
        <path d="M48 106 L60 98 L72 106 L66 118 L54 118 Z" fill="none" stroke="${k.motif}" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="53" y="74" width="14" height="14" fill="${k.peau}"/>
        <ellipse cx="60" cy="52" rx="22" ry="26" fill="${k.peau}"/>
        <ellipse cx="37" cy="54" rx="4" ry="6" fill="${k.peau}"/><ellipse cx="83" cy="54" rx="4" ry="6" fill="${k.peau}"/>
        <path d="M36 50 Q34 22 60 22 Q86 22 84 50 Q80 34 66 32 Q56 38 40 38 Q37 42 36 50 Z" fill="${k.cheveux}"/>
        <path d="M46 46 h9 M65 46 h9" stroke="${k.cheveux}" stroke-width="3" stroke-linecap="round"/>
        ${yeuxH}
        <path d="M60 56 q-3 7 1 8" stroke="#c08a6a" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${barbe}${bouc}
        ${k.lunettes ? `<circle cx="50" cy="54" r="8" fill="rgba(255,255,255,.25)" stroke="${k.lunettes}" stroke-width="2.5"/><circle cx="70" cy="54" r="8" fill="rgba(255,255,255,.25)" stroke="${k.lunettes}" stroke-width="2.5"/><path d="M58 54 h4 M42 53 l-5 -1 M78 53 l5 -1" stroke="${k.lunettes}" stroke-width="2.5"/>` : ''}
        <path d="M52 68 q8 6 16 0" stroke="#9a3b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    },
    oiseau(k, mood) {
      /* Oiseau rond : tête centrée en (60, 52) comme les autres */
      return `${ombre(30)}
        <path class="tail" d="M78 104 L106 116 L100 100 L110 92 Z" fill="${k.ailes}"/>
        <ellipse cx="60" cy="92" rx="30" ry="30" fill="${k.pelage}"/>
        <ellipse cx="60" cy="102" rx="19" ry="20" fill="${k.clair}"/>
        <path d="M32 84 Q18 104 34 118 Q44 104 42 88 Z" fill="${k.ailes}"/><path d="M88 84 Q102 104 86 118 Q76 104 78 88 Z" fill="${k.ailes}"/>
        <circle cx="60" cy="52" r="27" fill="${k.pelage}"/>
        <path d="M54 26 Q56 12 64 14 Q60 20 66 26 Z" fill="${k.ailes}"/>
        ${yeux(k, mood, 50)}
        <path d="M52 60 L68 60 L60 72 Z" fill="${k.bec}" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="42" cy="62" r="4" fill="#f9a8d4" opacity=".55"/><circle cx="78" cy="62" r="4" fill="#f9a8d4" opacity=".55"/>
        <path d="M50 120 v5 M46 125 h8 M70 120 v5 M66 125 h8" stroke="${k.bec}" stroke-width="3" stroke-linecap="round"/>`;
    },
    tortue(k, mood) {
      const Y = k.bord, K = k.carapace, S = k.pelage, SD = '#a8956a';
      const scute = (d, cx, cy) => `<path d="${d}" fill="${K}" stroke="${Y}" stroke-width="3.5" stroke-linejoin="round" opacity=".92"/><ellipse cx="${cx}" cy="${cy}" rx="5" ry="4" fill="${Y}" opacity=".85"/>`;
      const eye = (x) => mood === 'think'
        ? `<path d="M${x - 6} 83 q6 -4 12 0" stroke="#3b2f1e" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : `<circle cx="${x}" cy="82" r="7" fill="#fff" stroke="#3b2f1e" stroke-width="1.5"/><circle cx="${x + 1}" cy="83" r="4" fill="${k.yeux}"/><circle cx="${x + 2.5}" cy="81" r="1.5" fill="#fff"/>`;
      return `<ellipse cx="60" cy="124" rx="48" ry="5" fill="rgba(0,0,0,.18)"/>
        <ellipse cx="22" cy="113" rx="13" ry="10" fill="${S}"/><ellipse cx="98" cy="113" rx="13" ry="10" fill="${S}"/>
        <path d="M6 100 Q6 18 60 16 Q114 18 114 100 Z" fill="${K}"/>
        ${scute('M46 24 L74 24 L80 40 L60 50 L40 40 Z', 60, 35)}
        ${scute('M14 66 Q16 44 36 36 L50 54 L44 80 L12 82 Z', 30, 62)}
        ${scute('M106 66 Q104 44 84 36 L70 54 L76 80 L108 82 Z', 90, 62)}
        ${scute('M44 58 L60 52 L76 58 L74 72 L46 72 Z', 60, 63)}
        <path d="M7 92 Q60 106 113 92 L113 101 Q60 114 7 101 Z" fill="${Y}"/>
        <rect x="47" y="84" width="26" height="22" rx="8" fill="${S}"/>
        <ellipse cx="60" cy="84" rx="24" ry="19" fill="${S}"/>
        <path d="M40 76 Q60 58 80 76 Q70 70 60 70 Q50 70 40 76 Z" fill="${SD}"/>
        ${eye(51)}${eye(69)}
        <ellipse cx="44" cy="92" rx="4" ry="2.5" fill="#f2a7a0" opacity=".6"/><ellipse cx="76" cy="92" rx="4" ry="2.5" fill="#f2a7a0" opacity=".6"/>
        <path d="M51 94 q9 7 18 0" stroke="#5b4a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    }
  };
  Z.ESPECES = Object.keys(DESSINS);
  Z.NOM_ESPECE = { chat: ['chat', 'chats'], chien: ['chien', 'chiens'], lapin: ['lapin', 'lapins'], cheval: ['cheval', 'chevaux'], tortue: ['tortue', 'tortues'], oiseau: ['oiseau', 'oiseaux'], humain: ['ami', 'amis'] };
  Z.CRI = { chat: 'Miaou !', chien: 'Ouaf !', lapin: 'Coucou !', cheval: 'Hiii !', tortue: 'Coucou !', oiseau: 'Cui-cui !', humain: 'Salut !' };

  Z.art.animal = function ({ espece = 'chat', couleurs = {}, acc = 'aucun', mood = 'happy', accColor } = {}) {
    const esp = DESSINS[espece] ? espece : 'chat';
    const k = Object.assign({}, DEF[esp], couleurs);
    /* La tortue a sa tête plus bas : on descend les accessoires */
    const dy = esp === 'tortue' ? 34 : 0;
    const acces = accessoire(acc, accColor);
    return `<svg viewBox="0 -4 120 134" class="cat-svg" xmlns="http://www.w3.org/2000/svg">
      ${DESSINS[esp](k, mood)}
      ${esp !== 'tortue' && esp !== 'cheval' && esp !== 'oiseau' && esp !== 'humain' ? collier(k.collier) : ''}
      ${acces ? `<g transform="translate(0 ${dy})">${acces}</g>` : ''}
    </svg>`;
  };
})();
