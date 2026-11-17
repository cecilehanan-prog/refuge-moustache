/* =========================================================
   DONNÉES PÉDAGOGIQUES (communes à tous les élèves)
   ---------------------------------------------------------
   Rien de personnel ici : les noms viennent de profil.js.
   Dans les textes :
     @enfant = pseudo · @il / @Il = il ou elle · @e = « e » si fille
     @guide = animal d'accueil · @animal / @animaux = son espèce
     @proche / @Proche = une personne de l'entourage
   Les mots et problèmes marqués th: '…' ne sont gardés que si ce
   thème est dans les passions (ou l'espèce d'un animal guide).

   Format des mots (champ "s") :
     - les syllabes sont séparées par des tirets  :  ba-llon
     - [ ] = le "piège" (la partie qui ne s'écrit pas comme on l'entend)
     - ( ) = lettre muette (on l'écrit mais on ne l'entend pas)
   Exemple : "b[eau]-cou(p)"  →  beaucoup
   ========================================================= */

window.ZDATA = {};

(function () {
  const P = PROFIL;
  P.animaux = (P.animaux && P.animaux.length) ? P.animaux : [{ id: 'guide', nom: 'Filou', espece: 'chat', roles: ['accueil'] }];
  P.entourage = P.entourage || [];
  P.passions = P.passions || [];
  if (!UNIVERS[P.univers]) P.univers = 'trottinette';
  const fille = /^f/i.test((P.enfant && P.enfant.genre) || '');
  const accueil = P.animaux.find(a => (a.roles || []).includes('accueil')) || P.animaux[0];
  const NOMS = { chat: ['chat', 'chats'], chien: ['chien', 'chiens'], lapin: ['lapin', 'lapins'], cheval: ['cheval', 'chevaux'], tortue: ['tortue', 'tortues'], oiseau: ['oiseau', 'oiseaux'], humain: ['ami', 'amis'] };
  const esp = NOMS[accueil.espece] || NOMS.chat;
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  /* Remplace les @mots par les infos du profil */
  ZDATA.remplir = function (s, ctx = {}) {
    if (!s) return s;
    const proche = ctx.proche || (P.entourage[0] || {}).nom || 'un copain';
    const v = {
      enfant: P.enfant.pseudo, il: fille ? 'elle' : 'il', Il: fille ? 'Elle' : 'Il', e: fille ? 'e' : '',
      guide: accueil.nom, animal: esp[0], animaux: esp[1], proche, Proche: cap(proche)
    };
    return s.replace(/@([A-Za-z]+)/g, (m, k) => v[k] !== undefined ? v[k] : m);
  };
  /* Thèmes gardés : passions + univers + espèces des animaux */
  const themes = new Set([P.univers, ...P.passions, ...P.animaux.map(a => a.espece)]);
  if (P.entourage.length) themes.add('proche');
  ZDATA.garde = (x) => !x.th || themes.has(x.th);
})();

ZDATA.words = [
  // --- Mots invariables et mots plus longs (fin CM1 / début CM2) ---
  { id: 'longtemps', s: 'lon(g)-t[em](ps)', e: '⌛', ph: "Il y a très longtemps, les dinosaures vivaient sur la Terre.",
    family: { w: 'longue', say: "Long… longue ! Dans longue, on entend le G. Donc on l'écrit aussi dans longtemps." },
    hint: "Longtemps, c'est long et temps collés : un G muet, puis E M, et P S muets à la fin." },
  { id: 'quelquefois', s: '[qu]el-[qu]e-foi(s)', e: '🔂', ph: "Quelquefois, @guide dort sur mon lit.",
    hint: "Quelquefois : deux fois Q U, puis le mot fois avec son S muet." },
  { id: 'parfois', s: 'par-foi(s)', e: '🎲', ph: "Parfois je gagne, parfois je perds, mais je m'entraîne.",
    hint: "Parfois, c'est par et fois. Fois finit par un S muet." },
  { id: 'pourtant', s: 'pour-t[an](t)', e: '🤨', ph: "Il pleuvait, et pourtant le match a continué.",
    hint: "Pourtant, c'est pour et tant : le son an s'écrit A N, avec un T muet." },
  { id: 'plusieurs', s: 'plu-sieur(s)', e: '🔢', ph: "J'ai lu plusieurs livres pendant les vacances.",
    hint: "Plusieurs veut dire beaucoup de choses : il finit toujours par un S muet." },
  { id: 'environ', s: '[en]-vi-ron', e: '≈', ph: "La piste mesure environ deux kilomètres.",
    hint: "Environ commence par E N, comme dans enfant." },
  { id: 'vraiment', s: 'vr[ai]-m[en](t)', e: '💯', ph: "Ce jeu est vraiment amusant.",
    hint: "Vraiment, c'est vrai plus ment : V R A I, puis M E N T." },
  { id: 'tellement', s: 'te-[ll]e-m[en](t)', e: '🤩', ph: "J'étais tellement content que j'ai sauté de joie.",
    hint: "Tellement a deux L, et finit par M E N T, avec un T muet." },
  { id: 'cependant', s: '[c]e-p[en]-d[an](t)', e: '⚖️', ph: "Le chemin est court, cependant il est dangereux.",
    hint: "Cependant : un C qui fait s, puis E N, puis A N, et un T muet." },
  { id: 'soudain', s: 'sou-d[ain]', e: '⚡', ph: "Soudain, un ballon a traversé la chaussée.",
    hint: "Soudain finit par A I N, comme dans la main." },
  { id: 'ensuite', s: '[en]-sui-te', e: '⏭️', ph: "D'abord je mets mon manteau, ensuite je sors.",
    hint: "Ensuite commence par E N, comme ensemble." },
  { id: 'attention', s: 'a-[tt]en-[t]ion', e: '👀', ph: "Attention, le feu passe à l'orange !",
    hint: "Attention : deux T au début, et à la fin T I O N se lit sion." },

  // --- Mots invariables du CM1 (très fréquents à l'école) ---
  { id: 'beaucoup', s: 'b[eau]-cou(p)', e: '🍬🍬🍬', ph: "J'ai beaucoup de bonbons.",
    hint: "Dans beaucoup, il y a de l'eau : E A U. Et un P muet tout au bout, chut !" },
  { id: 'toujours', s: 'tou-jour(s)', e: '♾️', ph: "@guide est toujours content de me voir.",
    hint: "Toujours finit toujours par un S muet." },
  { id: 'maintenant', s: 'm[ain]-te-n[an](t)', e: '⏰', ph: "Maintenant, on joue !",
    hint: "Maintenant commence par MAIN, comme la main. Je lève la main… maintenant !" },
  { id: 'pendant', s: 'p[en]-d[an](t)', e: '⏳', ph: "Pendant la récréation, je cours vite.",
    hint: "Deux fois le son an : d'abord avec E N, puis avec A N. Et un T muet." },
  { id: 'souvent', s: 'sou-v[en](t)', e: '🔁', ph: "Je joue souvent dehors.",
    hint: "Souvent : le son an s'écrit E N, et il y a un T muet à la fin." },
  { id: 'deja', s: 'dé-j[à]', e: '✅', ph: "J'ai déjà fini !",
    hint: "Déjà a deux accents qui regardent dans des sens différents : é, puis à." },
  { id: 'apres', s: 'a-pr[ès]', e: '➡️', ph: "Après l'école, je goûte.",
    hint: "Après finit par È S : un accent grave, comme une petite pente, et un S." },
  { id: 'bientot', s: 'bien-t[ô](t)', e: '🔜', ph: "Bientôt les vacances !",
    hint: "Bientôt, c'est bien et tôt. Le O a un petit chapeau, et il y a un T muet." },
  { id: 'ensemble', s: '[en]-s[em]-ble', e: '🤝', ph: "On joue ensemble.",
    hint: "Devant B, le N se transforme en M : s E M ble." },
  { id: 'dehors', s: 'de-(h)or(s)', e: '🌳', ph: "@guide veut aller dehors.",
    hint: "Dehors cache un H muet au milieu et un S muet à la fin." },
  { id: 'jamais', s: 'ja-m[ai](s)', e: '🚫', ph: "Je n'abandonne jamais !",
    hint: "Jamais, comme mais, avec A I, et un S muet." },
  { id: 'tres', s: 'tr[ès]', e: '💯', ph: "Ce gâteau est très bon.",
    hint: "Très, avec un accent grave et un S, comme après." },
  { id: 'combien', s: 'c[om]-bien', e: '❓', ph: "Combien de points as-tu marqués ?",
    hint: "Devant B, le N devient M : c O M bien." },
  { id: 'quand', s: '[qu]an(d)', e: '🕐', ph: "Quand est-ce qu'on mange ?",
    hint: "Quand commence par Q U et finit par un D muet." },
  { id: 'pourquoi', s: 'pour-[qu]oi', e: '🤔', ph: "Pourquoi le ciel est bleu ?",
    hint: "Pourquoi, c'est pour et quoi collés ensemble." },
  { id: 'autour', s: '[au]-tour', e: '🔄', ph: "Je fais le tour, je tourne autour.",
    hint: "Autour commence par A U, puis le mot tour." },
  { id: 'famille', s: 'fa-mi-[ll]e', e: '🏡', ph: "J'aime ma famille.",
    hint: "Famille finit par I L L E, qui fait le son ill." },
  { id: 'heureux', s: '(h)eu-r[eux]', e: '😄', ph: "On est heureux quand on réussit.",
    hint: "Heureux commence par un H muet et finit par E U X." },
  { id: 'sport', s: 'spor(t)', e: '🏆', ph: "Le sport, c'est bon pour la santé.",
    family: { w: 'sportif', say: "Sport… sportif ! Dans sportif, on entend le T. Donc on l'écrit dans sport." },
    hint: "Sport a un T muet." },
  { id: 'champion', s: 'ch[am]-pion', e: '🥇', ph: "@enfant est un vrai champion !",
    hint: "Devant P, le N devient M : ch A M pion." },

  // --- Trottinette / route ---
  { th: 'trottinette', id: 'trottinette', s: 'tro-[tt]i-ne[tt](e)', e: '🛴', ph: "Ma trottinette est la plus rapide !",
    hint: "Trottinette a deux fois deux T, comme deux roues et deux roues !" },
  { th: 'trottinette', id: 'casque', s: 'cas-[qu]e', e: '⛑️', ph: "Je mets toujours mon casque.", hint: "Dans casque, le son k s'écrit Q U." },
  { th: 'trottinette', id: 'vitesse', s: 'vi-te[ss]e', e: '💨', ph: "La trottinette prend de la vitesse.", hint: "Entre deux voyelles, pour faire le son s, on met deux S." },
  { th: 'trottinette', id: 'freiner', s: 'fr[ei]-n[er]', e: '🛑', ph: "Il faut freiner avant le virage.",
    hint: "Freiner : le son è s'écrit E I, et le son é final s'écrit E R, comme tous les verbes en er." },
  { th: 'trottinette', id: 'batterie', s: 'ba-[tt]e-ri(e)', e: '🔋', ph: "La batterie est pleine.", hint: "Batterie a deux T, et un E muet à la fin." },
  { th: 'trottinette', id: 'carrefour', s: 'ca-[rr]e-four', e: '✖️', ph: "Au carrefour, je regarde bien.", hint: "Carrefour a deux R au milieu, comme deux routes qui se croisent." },
  { th: 'trottinette', id: 'prudent', s: 'pru-d[en](t)', e: '🦺', ph: "Sur la route, je reste prudent.",
    family: { w: 'prudente', say: "Prudent… prudente ! Dans prudente, on entend le T. Donc on l'écrit aussi dans prudent." },
    hint: "Prudent : le son an s'écrit E N, avec un T muet." },

  // --- Foot ---
  { th: 'foot', id: 'ballon', s: 'ba-[ll]on', e: '⚽', ph: "Je frappe le ballon.", hint: "Ballon a deux L au milieu." },
  { th: 'foot', id: 'gardien', s: 'gar-di[en]', e: '🧤', ph: "Le gardien arrête le ballon.", hint: "Gardien finit par E N, comme chien." },
  { th: 'foot', id: 'equipe', s: 'é-[qu]i-pe', e: '👕', ph: "Mon équipe a gagné le match.", hint: "Dans équipe, le son k s'écrit Q U." },
  { th: 'foot', id: 'terrain', s: 'te-[rr][ain]', e: '🏟️', ph: "Les joueurs entrent sur le terrain.", hint: "Terrain a deux R, et finit par A I N, comme la main." },
  { th: 'foot', id: 'maillot', s: 'm[ai]-[ll]o(t)', e: '👕', ph: "Je mets mon maillot pour le match.", hint: "Maillot : A I, puis deux L, et un T muet à la fin." },
  { th: 'foot', id: 'gagnant', s: 'ga-[gn][an](t)', e: '🏆', ph: "L'équipe gagnante soulève la coupe.",
    family: { w: 'gagnante', say: "Gagnant… gagnante ! Dans gagnante, on entend le T. Donc on l'écrit aussi dans gagnant." },
    hint: "Gagnant : G N fait le son gn, comme dans montagne. Et un T muet à la fin." },

  // --- Karaté ---
  { th: 'karate', id: 'ceinture', s: '[c][ein]-tu-re', e: '🥋', ph: "Je noue ma ceinture de karaté.", hint: "Ceinture commence par un C qui fait s, puis E I N, comme peinture." },
  { th: 'karate', id: 'combat', s: 'c[om]-ba(t)', e: '🤼', ph: "Le combat commence par un salut.", hint: "Devant B, le N devient M. Et un T muet à la fin." },
  { th: 'karate', id: 'equilibre', s: 'é-[qu]i-li-bre', e: '🧘', ph: "Je garde mon équilibre sur une jambe.", hint: "Dans équilibre, le son k s'écrit Q U." },
  { th: 'karate', id: 'poing', s: 'p[oin](g)', e: '👊', ph: "Je serre bien le poing.", hint: "Poing : O I N, et un G muet tout au bout." },
  { th: 'karate', id: 'entrainement', s: '[en]-tr[aî]-ne-m[en](t)', e: '💪', ph: "Après l'entraînement, je suis fatigué mais content.",
    hint: "Entraînement : E N, puis A Î avec un chapeau, et M E N T à la fin." },
  { th: 'karate', id: 'respect', s: 'res-pe(ct)', e: '🙇', ph: "Au dojo, on salue avec respect.", hint: "Respect finit par C T muets : on ne les entend pas." },

  // --- Dinosaures ---
  { th: 'dinosaures', id: 'dinosaure', s: 'di-no-s[au]re', e: '🦖', ph: "Le dinosaure était énorme.", hint: "Dans dinosaure, le son o s'écrit A U." },
  { th: 'dinosaures', id: 'fossile', s: 'fo-[ss]i-le', e: '🦴', ph: "J'ai trouvé un fossile !", hint: "Fossile a deux S au milieu, pour bien faire le son s." },
  { th: 'dinosaures', id: 'grand', s: 'gran(d)', e: '🦕', ph: "Le diplodocus est très grand.",
    family: { w: 'grande', say: "Grand… grande ! Dans grande, on entend le D. Donc on l'écrit aussi dans grand." }, hint: "Grand a un D muet à la fin." },
  { th: 'dinosaures', id: 'squelette', s: 's[qu]e-le-[tt]e', e: '🦴', ph: "Au musée, j'ai vu le squelette d'un dinosaure.", hint: "Squelette : le son k s'écrit Q U, et il y a deux T à la fin." },
  { th: 'dinosaures', id: 'prehistoire', s: 'pré-(h)is-toi-re', e: '🦣', ph: "À la préhistoire, les hommes chassaient les mammouths.",
    hint: "Préhistoire, c'est pré et histoire : avant l'histoire. Le H d'histoire est muet." },
  { th: 'dinosaures', id: 'volcan', s: 'vol-c[an]', e: '🌋', ph: "Le volcan crache de la lave.", hint: "Volcan finit par A N." },

  // --- Danse, vélo, peinture, musique ---
  { th: 'danse', id: 'danse', s: 'd[an]-[s]e', e: '💃', ph: "J'adore la danse.", hint: "Danse : A N, puis S E." },
  { th: 'danse', id: 'chausson', s: '[ch][au]-[ss][on]', e: '🩰', ph: "J'enfile mes chaussons roses.", hint: "Chausson : A U fait o, deux S, puis O N." },
  { th: 'danse', id: 'pirouette', s: 'pi-rou-e-[tt]e', e: '🌀', ph: "Je fais une pirouette sur la pointe des pieds.", hint: "Pirouette : O U, puis deux T à la fin." },
  { th: 'danse', id: 'spectacle', s: 'spec-ta-cl(e)', e: '🎭', ph: "Le spectacle commence ce soir.", hint: "Spectacle : S P E C, puis T A, puis C L E." },
  { th: 'velo', id: 'velo', s: 'v[é]-lo', e: '🚲', ph: "Je monte sur mon vélo.", hint: "Vélo : un É avec un accent aigu." },
  { th: 'velo', id: 'pedale', s: 'p[é]-da-l(e)', e: '🦶', ph: "Je pousse fort sur la pédale.", hint: "Pédale : É, puis un E muet à la fin." },
  { th: 'velo', id: 'guidon', s: '[gu]i-d[on]', e: '🚴', ph: "Je tiens bien le guidon.", hint: "Guidon : G U I fait gui, puis O N." },
  { th: 'velo', id: 'freiner', s: 'fr[ei]-n[er]', e: '🛑', ph: "Je dois freiner avant le virage.", hint: "Freiner : E I fait è, et E R à la fin." },
  { th: 'peinture', id: 'peinture', s: 'p[ein]-tu-r(e)', e: '🎨', ph: "La peinture est encore fraîche.", hint: "Peinture : E I N fait in." },
  { th: 'peinture', id: 'pinceau', s: 'p[in]-[c][eau]', e: '🖌️', ph: "Je trempe mon pinceau dans le bleu.", hint: "Pinceau : I N, puis C E A U : le C fait s." },
  { th: 'peinture', id: 'couleur', s: 'cou-l[eu]r', e: '🌈', ph: "Ma couleur préférée, c'est le vert.", hint: "Couleur : O U, puis E U R." },
  { th: 'peinture', id: 'tableau', s: 'ta-bl[eau]', e: '🖼️', ph: "J'accroche mon tableau au mur.", hint: "Tableau finit par E A U." },
  { th: 'musique', id: 'musique', s: 'mu-[s]i-[qu]e', e: '🎵', ph: "J'écoute de la musique.", hint: "Musique : le S entre deux voyelles fait z, et Q U fait k." },
  { th: 'musique', id: 'guitare', s: '[gu]i-ta-r(e)', e: '🎸', ph: "Je joue de la guitare.", hint: "Guitare : G U I fait gui, et un E muet à la fin." },
  { th: 'musique', id: 'chanson', s: '[ch][an]-[s][on]', e: '🎤', ph: "Je chante ma chanson préférée.", hint: "Chanson : C H, A N, puis S O N." },
  { th: 'musique', id: 'rythme', s: 'r[y]-[th]m(e)', e: '🥁', ph: "Je tape le rythme avec les mains.", hint: "Rythme : un Y, puis T H. Un vrai mot piège !" },

  // --- Les animaux (gardés selon l'espèce des animaux guides) ---
  { th: 'chien', id: 'chien', s: 'chi[en]', e: '🐶', ph: "Mon chien remue la queue.", hint: "Chien finit par E N, comme bien." },
  { th: 'chien', id: 'aboyer', s: 'a-bo-[y][er]', e: '🐕', ph: "Le chien se met à aboyer.", hint: "Aboyer : un Y au milieu, et E R à la fin, comme les verbes." },
  { th: 'chien', id: 'patte', s: 'pa-[tt]e', e: '🐾', ph: "Le chien me donne la patte.", hint: "Patte a deux T." },
  { th: 'chat', id: 'chat', s: 'cha(t)', e: '🐱', ph: "Le chat dort au soleil.",
    family: { w: 'chaton', say: "Chat… chaton ! Dans chaton, on entend le T. Donc on l'écrit aussi dans chat." }, hint: "Chat finit par un T muet." },
  { th: 'chat', id: 'moustache', s: 'mous-ta-[ch]e', e: '😺', ph: "Le chat a de longues moustaches.", hint: "Moustache : C H fait le son ch." },
  { th: 'lapin', id: 'lapin', s: 'la-p[in]', e: '🐰', ph: "Le lapin mange une carotte.", hint: "Lapin finit par I N." },
  { th: 'lapin', id: 'carotte', s: 'ca-[rr]o-[tt]e', e: '🥕', ph: "J'épluche une carotte.", hint: "Carotte : deux R et deux T." },
  { th: 'cheval', id: 'cheval', s: 'che-val', e: '🐴', ph: "Le cheval galope dans le pré.", hint: "Cheval s'écrit comme on l'entend : che, val." },
  { th: 'cheval', id: 'galop', s: 'ga-lo(p)', e: '🏇', ph: "Le cheval part au galop.",
    family: { w: 'galoper', say: "Galop… galoper ! Dans galoper, on entend le P. Donc on l'écrit aussi dans galop." }, hint: "Galop finit par un P muet." },
  { th: 'tortue', id: 'tortue', s: 'tor-tu(e)', e: '🐢', ph: "La tortue avance doucement.", hint: "Tortue finit par un E muet." },
  { th: 'tortue', id: 'carapace', s: 'ca-ra-pa-[c]e', e: '🛡️', ph: "La tortue rentre dans sa carapace.", hint: "Carapace finit par C E : le C fait s." },
  { th: 'oiseau', id: 'oiseau', s: '[oi]-s[eau]', e: '🐦', ph: "Un oiseau chante sur la branche.", hint: "Oiseau : O I, puis le S entre deux voyelles fait z, et E A U à la fin." },
  { th: 'oiseau', id: 'plume', s: 'plu-m(e)', e: '🪶', ph: "Une plume tombe doucement.", hint: "Plume finit par un E muet." },
  { th: 'moto', id: 'moteur', s: 'mo-teur', e: '🏍️', ph: "Le moteur de la moto ronronne.", hint: "Moteur finit par E U R, sans E à la fin." },
  { th: 'moto', id: 'virage', s: 'vi-ra-g(e)', e: '↪️', ph: "Je ralentis avant le virage.", hint: "Virage finit par G E : le G fait j." },
  { th: 'moto', id: 'casque', s: 'cas-[qu]e', e: '⛑️', ph: "Je mets mon casque avant de démarrer.", hint: "Casque : le son k s'écrit Q U." },
  { th: 'moto', id: 'carburant', s: 'car-bu-r[an](t)', e: '⛽', ph: "Je fais le plein de carburant.", hint: "Carburant : A N, et un T muet." },
  { th: 'trail', id: 'sentier', s: '[s][en]-ti[er]', e: '🥾', ph: "Le sentier monte dans la forêt.", hint: "Sentier : E N, puis I E R à la fin, comme dans premier." },
  { th: 'trail', id: 'montee', s: 'm[on]-t[ée]', e: '⛰️', ph: "La montée est longue, mais j'avance.", hint: "Montée : O N, puis É E à la fin." },
  { th: 'trail', id: 'souffle', s: 'sou-[ff]l(e)', e: '💨', ph: "Je reprends mon souffle en haut de la côte.", hint: "Souffle a deux F." },
  { th: 'trail', id: 'ravitaillement', s: 'ra-vi-t[ai]-[ll]e-m[en](t)', e: '🍎', ph: "Au ravitaillement, je prends une pomme.", hint: "Ravitaillement : A I, deux L, puis M E N T avec un T muet." }
].filter(ZDATA.garde).concat(PROFIL.motsEnPlus || [])
  .map(w => Object.assign({}, w, { ph: ZDATA.remplir(w.ph), hint: ZDATA.remplir(w.hint) }));

/* Graphies "voisines" : utilisées pour fabriquer UNE fausse syllabe piège
   (on ne montre jamais une liste de fautes, juste un choix ciblé). */
ZDATA.alts = {
  'eau': ['o', 'au'], 'au': ['o', 'eau'], 'o': ['au'], 'ô': ['o', 'au'],
  'ain': ['in', 'ein'], 'ein': ['ain', 'in'], 'in': ['ain'], 'oin': ['ouin', 'oun'],
  'an': ['en'], 'en': ['an'], 'am': ['an'], 'em': ['en'], 'om': ['on'],
  'ai': ['è', 'é'], 'aî': ['ai', 'è'], 'ei': ['ai', 'è'], 'ès': ['ai', 'et'], 'è': ['ai'],
  'er': ['é', 'ez'], 'ez': ['é', 'er'], 'é': ['er'], 'à': ['a'],
  'qu': ['k', 'c'], 'c': ['s'], 'ss': ['s'], 'tt': ['t'], 'll': ['l'], 'ch': ['sh', 'sch'], 'y': ['i', 'ill'],
  'eux': ['eu', 'eut'],
  'rr': ['r'], 'nn': ['n'], 'gn': ['ni', 'n'], 't': ['s', 'c']
};

/* =========================================================
   PROBLÈMES — méthode « détective »
   {n} = un nombre UTILE ; {n!} = un nombre INUTILE (piège)
   schema : parties | comparaison | groupes | partage
   ========================================================= */
ZDATA.problems = [
  // --- Thème principal et passions ---
  { th: 'foot', id: 'f1', e: '⚽', schema: 'comparaison', unknown: 'ecart',
    text: "Cette saison, @enfant a marqué {14} buts. Son copain a marqué {9} buts. Un match dure {60!} minutes. Combien de buts @enfant a-t-@il marqués de plus que son copain ?",
    q: ["Combien de buts de plus que son copain ?", "Combien de temps dure un match ?", "Combien de buts en tout ?"],
    op: '-', a: 14, b: 9, r: 5, unit: 'buts',
    end: ["@enfant a marqué 5 buts de plus que son copain.", "@enfant a marqué 5 ballons de foot de plus."] },
  { th: 'foot', id: 'f2', e: '🏟️', schema: 'groupes', unknown: 'tout',
    text: "Une équipe de foot a {11} joueurs. Au tournoi, il y a {6} équipes. Le tournoi commence à {9!} heures. Combien de joueurs y a-t-il au tournoi ?",
    q: ["Combien de joueurs au tournoi ?", "À quelle heure commence le tournoi ?", "Quelle équipe gagne ?"],
    op: '×', a: 6, b: 11, r: 66, unit: 'joueurs',
    end: ["Il y a 66 joueurs au tournoi.", "Il y a 66 tournois."] },
  { th: 'foot', id: 'f3', e: '🔶', schema: 'partage', unknown: 'part',
    text: "L'entraîneur a {36} plots. Il fait {4} rangées pareilles. Combien de plots y a-t-il dans chaque rangée ?",
    q: ["Combien de plots dans chaque rangée ?", "Combien de rangées ?", "De quelle couleur sont les plots ?"],
    op: '÷', a: 36, b: 4, r: 9, unit: 'plots',
    end: ["Il y a 9 plots dans chaque rangée.", "Il y a 9 entraîneurs dans chaque rangée."] },
  { th: 'moto', id: 'mo1', e: '🏍️', schema: 'parties', unknown: 'partie',
    text: "La balade à moto fait {180} kilomètres. @enfant a déjà roulé {115} kilomètres. Sa moto est {rouge!}. Combien de kilomètres reste-t-il ?",
    q: ["Combien de kilomètres reste-t-il ?", "De quelle couleur est la moto ?", "Combien de kilomètres en tout ?"],
    op: '-', a: 180, b: 115, r: 65, unit: 'km',
    end: ["Il reste 65 kilomètres à rouler.", "Il reste 65 motos."] },
  { th: 'moto', id: 'mo2', e: '⛽', schema: 'groupes', unknown: 'tout',
    text: "Le réservoir de la moto contient {15} litres. @enfant fait le plein {4} fois ce mois-ci. La station ouvre à {8!} heures. Combien de litres a-t-@il mis en tout ?",
    q: ["Combien de litres en tout ?", "À quelle heure ouvre la station ?", "Combien de pleins ?"],
    op: '×', a: 4, b: 15, r: 60, unit: 'litres',
    end: ["@enfant a mis 60 litres en tout.", "@enfant a fait 60 pleins."] },
  { th: 'trail', id: 'tr1', e: '⛰️', schema: 'parties', unknown: 'partie',
    text: "Le trail fait {32} kilomètres. @enfant a déjà couru {19} kilomètres. Il fait {12!} degrés. Combien de kilomètres reste-t-il à courir ?",
    q: ["Combien de kilomètres reste-t-il ?", "Quelle température fait-il ?", "Combien de kilomètres en tout ?"],
    op: '-', a: 32, b: 19, r: 13, unit: 'km',
    end: ["Il reste 13 kilomètres à courir.", "Il reste 13 degrés."] },
  { th: 'trail', id: 'tr2', e: '🍎', schema: 'groupes', unknown: 'tout',
    text: "Il y a {4} ravitaillements sur la course. À chacun, @enfant mange {3} quartiers de pomme. La course part à {7!} heures. Combien de quartiers de pomme mange-t-@il en tout ?",
    q: ["Combien de quartiers de pomme en tout ?", "À quelle heure part la course ?", "Combien de ravitaillements ?"],
    op: '×', a: 4, b: 3, r: 12, unit: 'quartiers',
    end: ["@enfant mange 12 quartiers de pomme en tout.", "@enfant mange 12 ravitaillements."] },
  { th: 'trail', id: 'tr3', e: '⏱️', schema: 'partage', unknown: 'part',
    text: "Pour préparer son trail, @enfant court {45} kilomètres en {5} sorties de même longueur. Combien de kilomètres fait chaque sortie ?",
    q: ["Combien de kilomètres par sortie ?", "Combien de sorties ?", "Combien de kilomètres en tout ?"],
    op: '÷', a: 45, b: 5, r: 9, unit: 'km',
    end: ["Chaque sortie fait 9 kilomètres.", "Chaque sortie fait 9 sorties."] },
  { th: 'danse', id: 'da1', e: '💃', schema: 'groupes', unknown: 'tout',
    text: "Au spectacle de danse, il y a {5} rangées de {8} danseurs. Le rideau s'ouvre à {20!} heures. Combien de danseurs y a-t-il en tout ?",
    q: ["Combien de danseurs en tout ?", "À quelle heure s'ouvre le rideau ?", "Combien de rangées ?"],
    op: '×', a: 5, b: 8, r: 40, unit: 'danseurs',
    end: ["Il y a 40 danseurs en tout.", "Il y a 40 rideaux."] },
  { th: 'danse', id: 'da2', e: '⏱️', schema: 'parties', unknown: 'partie',
    text: "La chorégraphie dure {12} minutes. @enfant a déjà dansé {7} minutes. Les chaussons coûtent {25!} euros. Combien de minutes reste-t-il ?",
    q: ["Combien de minutes reste-t-il ?", "Combien coûtent les chaussons ?", "Combien dure la chorégraphie ?"],
    op: '-', a: 12, b: 7, r: 5, unit: 'minutes',
    end: ["Il reste 5 minutes de danse.", "Il reste 5 euros."] },
  { th: 'velo', id: 've1', e: '🚲', schema: 'parties', unknown: 'partie',
    text: "La balade à vélo fait {42} kilomètres. @enfant a déjà roulé {27} kilomètres. Son vélo a {2!} roues. Combien de kilomètres reste-t-il ?",
    q: ["Combien de kilomètres reste-t-il ?", "Combien de roues a le vélo ?", "Combien de kilomètres en tout ?"],
    op: '-', a: 42, b: 27, r: 15, unit: 'km',
    end: ["Il reste 15 kilomètres à rouler.", "Il reste 15 roues."] },
  { th: 'velo', id: 've2', e: '🚴', schema: 'partage', unknown: 'part',
    text: "{24} cyclistes partent en {4} groupes égaux. La course commence à {9!} heures. Combien de cyclistes y a-t-il dans chaque groupe ?",
    q: ["Combien de cyclistes par groupe ?", "À quelle heure commence la course ?", "Combien de groupes ?"],
    op: '÷', a: 24, b: 4, r: 6, unit: 'cyclistes',
    end: ["Il y a 6 cyclistes dans chaque groupe.", "Il y a 6 heures dans chaque groupe."] },
  { th: 'peinture', id: 'pe1', e: '🌻', schema: 'groupes', unknown: 'tout',
    text: "@enfant peint {3} tableaux. Sur chaque tableau, @il peint {7} fleurs. Son pinceau mesure {18!} centimètres. Combien de fleurs a-t-@il peintes en tout ?",
    q: ["Combien de fleurs en tout ?", "Combien mesure le pinceau ?", "Combien de tableaux ?"],
    op: '×', a: 3, b: 7, r: 21, unit: 'fleurs',
    end: ["@enfant a peint 21 fleurs en tout.", "@enfant a peint 21 pinceaux."] },
  { th: 'peinture', id: 'pe2', e: '🎨', schema: 'comparaison', unknown: 'ecart',
    text: "La boîte d'aquarelle a {24} couleurs. La boîte de feutres a {12} couleurs. Le cahier de dessin a {48!} pages. Combien de couleurs la boîte d'aquarelle a-t-elle de plus ?",
    q: ["Combien de couleurs de plus ?", "Combien de pages a le cahier ?", "Combien de couleurs en tout ?"],
    op: '-', a: 24, b: 12, r: 12, unit: 'couleurs',
    end: ["La boîte d'aquarelle a 12 couleurs de plus.", "La boîte d'aquarelle a 12 pages de plus."] },
  { th: 'musique', id: 'mu1', e: '🎵', schema: 'groupes', unknown: 'tout',
    text: "Une chanson a {4} couplets. Chaque couplet dure {30} secondes. Le concert commence à {18!} heures. Combien de secondes durent les couplets en tout ?",
    q: ["Combien de secondes en tout ?", "À quelle heure commence le concert ?", "Combien de couplets ?"],
    op: '×', a: 4, b: 30, r: 120, unit: 'secondes',
    end: ["Les couplets durent 120 secondes en tout, soit 2 minutes.", "Les couplets durent 120 concerts."] },
  { th: 'musique', id: 'mu2', e: '🎸', schema: 'parties', unknown: 'partie',
    text: "Le concert dure {90} minutes. Le groupe a déjà joué {55} minutes. Il y a {4!} musiciens. Combien de minutes reste-t-il ?",
    q: ["Combien de minutes reste-t-il ?", "Combien y a-t-il de musiciens ?", "Combien dure le concert ?"],
    op: '-', a: 90, b: 55, r: 35, unit: 'minutes',
    end: ["Il reste 35 minutes de concert.", "Il reste 35 musiciens."] },
  { th: 'karate', id: 'k1', e: '👊', schema: 'groupes', unknown: 'tout',
    text: "Au karaté, @enfant fait {6} séries de {8} coups de poing. La séance dure {45!} minutes. Combien de coups de poing @enfant fait-@il en tout ?",
    q: ["Combien de coups de poing en tout ?", "Combien de temps dure la séance ?", "Combien de séries ?"],
    op: '×', a: 6, b: 8, r: 48, unit: 'coups de poing',
    end: ["@enfant fait 48 coups de poing en tout.", "@enfant fait 48 minutes en tout."] },
  { th: 'karate', id: 'k2', e: '🥋', schema: 'partage', unknown: 'part',
    text: "Au club de karaté, {28} élèves se mettent en {4} rangs égaux pour saluer. Combien d'élèves y a-t-il dans chaque rang ?",
    q: ["Combien d'élèves dans chaque rang ?", "Combien de rangs ?", "Qui est le plus fort ?"],
    op: '÷', a: 28, b: 4, r: 7, unit: 'élèves',
    end: ["Il y a 7 élèves dans chaque rang.", "Il y a 7 karatés dans chaque rang."] },
  { th: 'karate', id: 'k3', e: '🏆', schema: 'parties', unknown: 'partie',
    text: "Le tournoi de karaté compte {52} combats. {37} combats sont déjà finis. Il y a {3!} tatamis. Combien de combats reste-t-il ?",
    q: ["Combien de combats reste-t-il ?", "Combien de tatamis ?", "Combien de combats en tout ?"],
    op: '-', a: 52, b: 37, r: 15, unit: 'combats',
    end: ["Il reste 15 combats.", "Il reste 15 tatamis de combat."] },
  { th: 'trottinette', id: 't1', e: '🛴', schema: 'parties', unknown: 'tout',
    text: "Samedi, @enfant roule {12} km avec sa trottinette. Dimanche, @il roule {15} km. Pendant ce temps, @guide dort {3!} heures. Combien de kilomètres @enfant a-t-@il roulés en tout ?",
    q: ["Combien de kilomètres en tout ?", "Combien d'heures @guide dort ?", "De quelle couleur est la trottinette ?"],
    op: '+', a: 12, b: 15, r: 27, unit: 'km',
    end: ["@enfant a roulé 27 km en tout.", "@enfant a roulé 27 @animaux en tout."] },
  { th: 'trottinette', id: 't2', e: '🏍️', schema: 'comparaison', unknown: 'grand',
    text: "La trottinette roule à {25} km par heure. La moto du voisin roule {55} km par heure plus vite. Le voisin a {2!} casques. À quelle vitesse roule la moto ?",
    q: ["À quelle vitesse roule la moto ?", "Combien de casques a le voisin ?", "À quelle vitesse roule la trottinette ?"],
    op: '+', a: 25, b: 55, r: 80, unit: 'km par heure',
    end: ["La moto roule à 80 km par heure.", "La moto roule à 80 casques par heure."] },
  { th: 'trottinette', id: 't3', e: '🔋', schema: 'parties', unknown: 'partie',
    text: "La batterie de la trottinette permet de rouler {40} km. @enfant a déjà roulé {26} km. Il fait {18!} degrés dehors. Combien de kilomètres peut-@il encore rouler ?",
    q: ["Combien de kilomètres @il peut encore rouler ?", "Quelle température fait-il ?", "Combien de batteries a la trottinette ?"],
    op: '-', a: 40, b: 26, r: 14, unit: 'km',
    end: ["@Il peut encore rouler 14 km.", "@Il peut encore rouler 14 degrés."] },
  { th: 'dinosaures', id: 'd1', e: '🦖', schema: 'groupes', unknown: 'tout',
    text: "Une pochette contient {6} cartes de dinosaures. @enfant achète {7} pochettes. Combien de cartes a-t-@il en tout ?",
    q: ["Combien de cartes en tout ?", "Combien coûte une pochette ?", "Combien de pochettes ?"],
    op: '×', a: 7, b: 6, r: 42, unit: 'cartes',
    end: ["@enfant a 42 cartes de dinosaures.", "@enfant a 42 pochettes de @animaux."] },
  { th: 'dinosaures', id: 'd2', e: '🦕', schema: 'comparaison', unknown: 'ecart',
    text: "Le brachiosaure mesure {23} mètres de long. Le tyrannosaure mesure {12} mètres de long. Combien de mètres le brachiosaure mesure-t-il de plus que le tyrannosaure ?",
    q: ["Combien de mètres de plus ?", "Combien mesurent-ils tous les deux ensemble ?", "Lequel est le plus méchant ?"],
    op: '-', a: 23, b: 12, r: 11, unit: 'mètres',
    end: ["Le brachiosaure mesure 11 mètres de plus.", "Le brachiosaure mesure 11 dents de plus."] },
  { th: 'dinosaures', id: 'd3', e: '🦴', schema: 'partage', unknown: 'part',
    text: "Le tyrannosaure mange {63} kilos de viande en {7} jours. Il mange la même quantité chaque jour. Combien de kilos mange-t-il par jour ?",
    q: ["Combien de kilos par jour ?", "Combien de jours en tout ?", "Combien de dents a le tyrannosaure ?"],
    op: '÷', a: 63, b: 7, r: 9, unit: 'kilos',
    end: ["Il mange 9 kilos de viande par jour.", "Il mange 9 jours par kilo."] },

  // --- Avec l'animal guide ---
  { id: 'a1', e: '🐾', schema: 'parties', unknown: 'partie',
    text: "@guide a {35} friandises dans sa boîte. @guide en mange {18}. Combien de friandises reste-t-il dans la boîte ?",
    q: ["Combien de friandises il reste ?", "Combien de boîtes a @guide ?", "Quel âge a @guide ?"],
    op: '-', a: 35, b: 18, r: 17, unit: 'friandises',
    end: ["Il reste 17 friandises.", "Il reste 17 dinosaures."] },
  { id: 'a2', e: '🐾', schema: 'groupes', unknown: 'tout',
    text: "Un @animal a {4} pattes. Dans le jardin, il y a {9} @animaux. @guide a {2!} ans. Combien de pattes y a-t-il en tout ?",
    q: ["Combien de pattes en tout ?", "Quel âge a @guide ?", "Combien de @animaux ?"],
    op: '×', a: 9, b: 4, r: 36, unit: 'pattes',
    end: ["Il y a 36 pattes en tout.", "Il y a 36 jardins en tout."] },

  // --- Avec l'entourage (seulement si profil.js en contient) ---
  { th: 'proche', id: 'p1', e: '🍬', proche: 0, schema: 'partage', unknown: 'part',
    text: "@Proche partage {48} bonbons entre {6} enfants. Chaque enfant reçoit le même nombre de bonbons. Combien de bonbons reçoit chaque enfant ?",
    q: ["Combien de bonbons pour chaque enfant ?", "Combien d'enfants en tout ?", "De quelle couleur sont les bonbons ?"],
    op: '÷', a: 48, b: 6, r: 8, unit: 'bonbons',
    end: ["Chaque enfant reçoit 8 bonbons.", "Chaque enfant reçoit 8 enfants."] },
  { th: 'proche', id: 'p2', e: '🃏', proche: 1, schema: 'parties', unknown: 'tout',
    text: "@enfant a {128} cartes dans son classeur. @Proche lui offre {45} cartes. Combien de cartes @enfant a-t-@il maintenant ?",
    q: ["Combien de cartes maintenant ?", "Combien de classeurs ?", "Combien de cartes @proche a gardées ?"],
    op: '+', a: 128, b: 45, r: 173, unit: 'cartes',
    end: ["@enfant a maintenant 173 cartes.", "@enfant a maintenant 173 classeurs."] },

  // --- Problèmes de tous les jours ---
  { id: 'g1', e: '🔵', schema: 'parties', unknown: 'tout',
    text: "@enfant a {24} billes. À la récréation, @il en gagne {13}. La récréation dure {15!} minutes. Combien de billes @enfant a-t-@il maintenant ?",
    q: ["Combien de billes maintenant ?", "Combien de temps dure la récréation ?", "Combien de billes @il a perdues ?"],
    op: '+', a: 24, b: 13, r: 37, unit: 'billes',
    end: ["@enfant a maintenant 37 billes.", "@enfant a maintenant 37 récréations."] },
  { id: 'g2', e: '🥞', schema: 'partage', unknown: 'part',
    text: "Pour le goûter, il y a {32} crêpes pour {4} enfants. Chacun en reçoit autant. Combien de crêpes reçoit chaque enfant ?",
    q: ["Combien de crêpes pour chaque enfant ?", "Combien d'enfants ?", "Qui a fait les crêpes ?"],
    op: '÷', a: 32, b: 4, r: 8, unit: 'crêpes',
    end: ["Chaque enfant reçoit 8 crêpes.", "Chaque enfant reçoit 8 goûters."] },
  { id: 'g3', e: '📚', schema: 'groupes', unknown: 'tout',
    text: "La bibliothèque de la classe a {5} étagères. Sur chaque étagère, il y a {9} livres. Combien de livres y a-t-il en tout ?",
    q: ["Combien de livres en tout ?", "Combien d'étagères ?", "Quel est le livre préféré ?"],
    op: '×', a: 5, b: 9, r: 45, unit: 'livres',
    end: ["Il y a 45 livres en tout.", "Il y a 45 étagères de livres."] },
  { id: 'g4', e: '🃏', schema: 'comparaison', unknown: 'ecart',
    text: "@enfant a {46} cartes. Son copain a {29} cartes. Combien de cartes @enfant a-t-@il de plus que son copain ?",
    q: ["Combien de cartes de plus ?", "Combien de cartes en tout ?", "Qui a les plus belles cartes ?"],
    op: '-', a: 46, b: 29, r: 17, unit: 'cartes',
    end: ["@enfant a 17 cartes de plus que son copain.", "@enfant a 17 copains de plus."] }
].filter(ZDATA.garde).map(pb => {
  const proche = pb.proche !== undefined ? (PROFIL.entourage[pb.proche % PROFIL.entourage.length] || {}).nom : undefined;
  const f = (s) => ZDATA.remplir(s, { proche });
  return Object.assign({}, pb, { text: f(pb.text), q: pb.q.map(f), end: pb.end.map(f) });
});
/* Les problèmes du thème principal passent en premier */
ZDATA.problems.sort((a, b) => (b.th === PROFIL.univers) - (a.th === PROFIL.univers));

/* =========================================================
   RÉCOMPENSES : les objets de la boutique viennent de l'univers
   ========================================================= */
ZDATA.univers = UNIVERS[PROFIL.univers];

/* Accessoires des animaux guides (achetés avec les éclairs) */
ZDATA.catItems = [
  { id: 'aucun',    name: 'Tout simple',          price: 0 },
  { id: 'bandana',  name: 'Bandana',              price: 30 },
  { id: 'noeud',    name: 'Nœud papillon',        price: 40 },
  { id: 'lunettes', name: 'Lunettes de star',     price: 50 },
  { id: 'casque',   name: 'Mini-casque',          price: 60 },
  { id: 'casquette', name: 'Casquette',           price: 60 },
  { id: 'bandeau',  name: 'Bandeau de champion',  price: 60 },
  { id: 'chapeau',  name: 'Chapeau de magicien',  price: 70 },
  { id: 'medaille', name: 'Médaille',             price: 70 },
  { id: 'couronne', name: 'Couronne de roi',      price: 80 }
];

/* Autocollants : communs + ceux des passions + les animaux */
ZDATA.stickers = [
  { id: 's1', e: '⭐', n: 'Étoile', r: 1 }, { id: 's2', e: '🍕', n: 'Pizza', r: 1 }, { id: 's3', e: '🌈', n: 'Arc-en-ciel', r: 1 },
  { id: 's4', e: '🎈', n: 'Ballon de fête', r: 1 }, { id: 's5', e: '🌋', n: 'Volcan', r: 1 }, { id: 's6', e: '🧩', n: 'Puzzle', r: 1 },
  { id: 'r1', e: '🐉', n: 'Dragon', r: 2 }, { id: 'r2', e: '💎', n: 'Diamant', r: 2 }, { id: 'r3', e: '⚡', n: 'Éclair', r: 2 },
  { id: 'r4', e: '🛡️', n: 'Bouclier', r: 2 },
  { id: 'l1', e: '👑', n: 'Roi ' + (PROFIL.animaux.find(a => (a.roles || []).includes('accueil')) || PROFIL.animaux[0]).nom, r: 3 },
  { id: 'l2', e: '🌟', n: 'Super étoile', r: 3 }, { id: 'l3', e: '🦄', n: 'Licorne turbo', r: 3 }
].concat(
  ...[...new Set([PROFIL.univers, ...PROFIL.passions])].map(u => (UNIVERS[u] && UNIVERS[u].autocollants) || []),
  [...new Set(PROFIL.animaux.map(a => a.espece))].map(e => ({ id: 'a_' + e, e: { chat: '🐱', chien: '🐶', lapin: '🐰', cheval: '🐴', tortue: '🐢', oiseau: '🐦', humain: '🙂' }[e] || '🐾', n: { chat: 'Chat', chien: 'Chien', lapin: 'Lapin', cheval: 'Cheval', tortue: 'Tortue', oiseau: 'Oiseau', humain: 'Ami' }[e] || 'Animal', r: 1 })));

/* Phrases d'encouragement : on félicite l'EFFORT et la MÉTHODE, pas le "don". */
ZDATA.praise = [
  "Bravo, tu as pris ton temps !", "Super, ton cerveau s'entraîne !", "Excellent travail !",
  "Tu progresses à toute vitesse !", (/^f/i.test(PROFIL.enfant.genre || '') ? "Trop forte, " : "Trop fort, ") + PROFIL.enfant.pseudo + " !", "Génial, continue !",
  "Tu as bien réfléchi !", "Waouh, quelle concentration !"
];
/* Le ton change avec l'âge : plus sobre au lycée, plus « stylé » au collège */
ZDATA.TON = /lycee/.test(PROFIL.niveau || '') ? 'lycee' : /cycle4/.test(PROFIL.niveau || '') ? 'college' : 'enfant';
if (ZDATA.TON === 'college') ZDATA.praise = ["Bien vu !", "Tu gères !", "Stylé !", "Ça, c'est propre !", "Rien à redire !", "Ton cerveau est en mode turbo !", "Bien joué, " + PROFIL.enfant.pseudo + " !", "Tu as pris le temps, et ça paie !"];
if (ZDATA.TON === 'lycee') ZDATA.praise = ["Bien joué.", "Solide.", "C'est juste, et bien raisonné.", "Propre, rien à redire.", "Belle méthode.", "Tu maîtrises.", "Exactement.", "Bonne réponse, sans hésiter."];
ZDATA.citations = [
  "Le seul endroit où le succès arrive avant le travail, c'est le dictionnaire.",
  "Une erreur, c'est juste une bonne réponse qui a pris un détour.",
  "Ton cerveau fait une mise à jour. Merci de ne pas éteindre l'appareil.",
  "Un escargot finit toujours la course. Lentement, mais il la finit.",
  "Les fractions ne mordent pas. Enfin, presque jamais.",
  "Réviser dix minutes par jour, c'est comme mettre une pièce dans la tirelire.",
  "Procrastiner, c'est remettre à demain ce qu'on aurait fini en cinq minutes.",
  "Personne n'est nul en maths. Certains n'ont juste pas encore trouvé le bon chemin.",
  "Le stylo est plus fort que l'épée. Surtout quand l'épée n'a pas révisé.",
  "Même les champions ont commencé par perdre. Beaucoup."
];
ZDATA.blagues = [
  "Pourquoi le livre de maths est-il triste ? Parce qu'il a trop de problèmes.",
  "Que dit un zéro à un huit ? « Sympa, ta ceinture. »",
  "Un neutron entre dans un bar et demande l'addition. Le barman : « Pour toi, c'est gratuit : aucune charge. »",
  "Deux atomes se croisent. « J'ai perdu un électron. — Tu es sûr ? — Oui, je suis positif. »",
  "Pourquoi les plongeurs plongent-ils en arrière ? Parce que sinon, ils tombent dans le bateau.",
  "Le subjonctif imparfait : « Il eût fallu que tu le susses. » Courage.",
  "La philo, c'est répondre à une question par trois autres questions. Et c'est noté sur 20.",
  "Pourquoi les poissons détestent-ils l'ordinateur ? Parce qu'ils ont peur du Net.",
  "Il y a 10 sortes de personnes : celles qui comprennent le binaire, et les autres.",
  "Un historien entre dans un café. Il commande… ce qu'on commandait en 1789."
];
ZDATA.retry = [
  "Presque ! Essaie encore.", "Pas grave, ton cerveau apprend en se trompant.",
  "On réessaie ensemble ?", "Tu y es presque !", "Une erreur, c'est un entraînement !"
];
if (ZDATA.TON === 'lycee') ZDATA.retry = ["Pas tout à fait. Reprends calmement.", "Presque. Relis la question.", "Une erreur, c'est une information. On recommence.", "Pas encore : regarde le détail."];

/* L'entourage qui encourage à la fin des jeux (facultatif) */
ZDATA.family = PROFIL.entourage.map((p, i) => ({ id: 'p' + i, name: p.nom, emoji: p.emoji || '🙂', homme: !!p.homme, cheers: (p.encouragements || []).map(s => ZDATA.remplir(s)) }));
ZDATA.cheers = (PROFIL.encouragements && PROFIL.encouragements.length ? PROFIL.encouragements : ['Bravo @enfant !', 'Trop fort, @enfant !', 'Continue comme ça !']).map(s => ZDATA.remplir(s));
