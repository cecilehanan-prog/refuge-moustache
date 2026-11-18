/* =========================================================
   PROFIL DE L'ÉLÈVE : QUI EST L'ÉLÈVE, ET COMMENT L'APPLI LUI PARLE
   ---------------------------------------------------------
   Deux fichiers à remplir pour chaque élève :
   • profil.js  (ce fichier) : pseudo, niveau, aides dys, rubriques,
                passions, animaux guides, couleurs ;
   • contenu.js : les activités de chaque rubrique (ce qu'on travaille).
   Le reste du code ne contient AUCUN nom : il lit ces deux fichiers.

   Règles de confidentialité (le site est PUBLIC) :
   • un PSEUDO, jamais le vrai prénom + nom de famille ;
   • pas de photo, pas d'adresse, pas de nom d'école ;
   • pour l'entourage : « Mamie », « Tonton », « le grand frère »…

   Ce qu'on peut choisir :
   • univers  : 'foot' | 'karate' | 'trottinette' | 'dinosaures'
                (l'objet à décorer dans la boutique et le décor)
   • passions : une liste d'univers (les problèmes, les mots et les
                autocollants mélangent ces thèmes)
   • especes des animaux : 'chat' | 'chien' | 'lapin' | 'cheval' | 'tortue'
   • roles des animaux : 'accueil' (celui qui t'accueille), une rubrique
     ('francais', 'maths', 'geometrie', 'histoire', 'svt'…), ou un jeu
     intégré ('mots', 'tables', 'problemes', 'parcours'), ou 'devoirs'.
     Un même animal peut avoir plusieurs rôles. S'il manque un rôle,
     c'est l'animal d'accueil qui s'en occupe.
   • couleurs : codes couleur, par ex. '#8b5a2b' (marron).
     Aide : https://htmlcolorcodes.com/fr/
   ========================================================= */
var PROFIL = {

  /* Identifiant court, sans espace ni accent : sépare la sauvegarde
     de cette appli de celle des autres élèves (même adresse GitHub). */
  id: 'adeline',

  /* --- L'élève --- */
  enfant: {
    pseudo: 'Adeline',         // le nom affiché et dit à voix haute (prénom seul)
    genre: 'fille',            // 'garçon' ou 'fille' (pour accorder : « prêt / prête »…)
    numero: 42,
    apparence: {
      peau: '#f1c7a5',
      cheveux: '#6b4423',
      coiffure: 'queue',       // 'courts' | 'longs' | 'boucles' | 'queue'
      yeux: '#4a2c1a',
      tshirt: '#0d9488'
    }
  },

  /* --- Le niveau : lycée = appli sobre, ton adulte --- */
  niveau: 'lycee',
  classe: 'adulte',

  /* --- Les aides : dyspraxie ---
     Tout se fait au toucher, avec de gros boutons (pas de glisser-déposer).
     Texte un peu plus gros et aéré pour se repérer facilement dans la page. */
  aides: {
    lectureAuto: false,        // elle touche 🔊 quand elle veut entendre la consigne
    police: 'lexend',
    taille: 1.15,
    espacement: true,
    syllabes: false,
    voixDessinAnime: false
  },

  style: { guides: true },     // elle adore les animaux : on garde les guides

  rubriques: {
    actives: ['francais', 'maths', 'histoire'],
    enPlus: []
  },

  appli: {
    nom: 'Le Refuge de Fouffy',
    nomCourt: 'Refuge Fouffy',
    jeux: { mots: '', tables: '', problemes: 'Les Enquêtes du trail', parcours: '', devoirs: 'Mes devoirs' },
    adulte: 'l\'adulte',
    ecole: 'le professeur'
  },

  /* --- Les passions --- */
  univers: 'moto',             // le garage : motos à acheter
  passions: ['moto', 'trail'], // le trail reste dans les problèmes et les calculs

  /* --- Les animaux guides ---
     Fouffy = son chat : un grand et vieux chat noir et blanc.
     Sylvain = son chéri (grand, cheveux bruns, petit bouc, t-shirt noir sobre) : il présente les devoirs.
     */
  animaux: [
    { id: 'moustache', nom: 'Fouffy', espece: 'chat', roles: ['accueil', 'francais', 'mots'],
      couleurs: { pelage: '#1c1c1f', clair: '#f8fafc', taches: '#1c1c1f', oreilles: '#f2b3b3', yeux: '#a3c43b', nez: '#e79a9a', collier: '#0d9488' },
      voix: { hauteur: 1.0, vitesse: 0.88 } },
    { id: 'pirouette', nom: 'Pirouette', espece: 'oiseau', roles: ['maths', 'problemes', 'tables'],
      couleurs: { pelage: '#38bdf8', clair: '#fef08a', ailes: '#0369a1', bec: '#374151', yeux: '#111827' },
      voix: { hauteur: 1.5, vitesse: 1.05 } },
    { id: 'sylvain', nom: 'Sylvain', espece: 'humain', roles: ['devoirs'],
      appelle: 'ma chérie', presente: 'mon chéri Sylvain',
      couleurs: { peau: '#f1c7a5', cheveux: '#4a2c17', yeux: '#3b2416', tshirt: '#111827', motif: '#9ca3af', bouc: '#4a2c17' },
      voix: { hauteur: 0.82, vitesse: 0.95 } },
    { id: 'rouquine', nom: 'Rouquine', espece: 'oiseau', roles: ['histoire'],
      couleurs: { pelage: '#a16207', clair: '#f97316', ailes: '#78350f', bec: '#1f2937', yeux: '#111827' },
      voix: { hauteur: 1.35, vitesse: 0.98 } }
  ],

  entourage: [
    { nom: 'Sylvain', emoji: '🤘', homme: true,
      encouragements: ['Bravo ma chérie !', 'Trop forte, ma chérie ! 🤘', 'Je suis fier de toi, ma chérie !',
        'Ça, c\'est du métal, ma chérie ! 🤘', 'Allez ma chérie, encore un et on se fait une petite mousse !'] }
  ],
  encouragements: [
    'Bravo @enfant, plein gaz !', 'Quelle endurance, @enfant !', 'Encore un sommet de passé !',
    'Pense à ramasser les miettes de pomme, et on continue !', 'Tu mérites une petite mousse, @enfant !'
  ],

  /* --- La fête : Sylvain vient la féliciter (balade à moto, ou bisou avec un cœur) --- */
  fete: {
    avec: 'sylvain', homme: true,
    moto: { modele: 'courseduc', couleur: 'metal', casque: 'chat' },
    phrasesMoto: ['Allez ma chérie, en selle : on file au Hellfest ! 🤘', 'Bravo ma chérie ! On part en balade à moto pour fêter ça ! 🏍️', 'Je monte derrière toi, ma chérie : direction Clisson ! 🤘'],
    phrasesBisou: ['Un bisou pour ma chérie ! 😘', 'Je suis fier de toi, ma chérie ! ❤️', 'Ma chérie, tu es la plus forte ! 😘']
  },

  motsEnPlus: [],

  couleurs: { principale: '#0d9488', fond: '#f0fdfa' }
};
