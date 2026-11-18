/* =========================================================
   CONTENU : LES ACTIVITÉS DE L'ÉLÈVE, RUBRIQUE PAR RUBRIQUE
   ---------------------------------------------------------
   C'est ici qu'on met ce que l'élève doit travailler, selon SES
   difficultés. Le plus simple : décrire les difficultés à Claude,
   par exemple « 4e, ne sait pas définir un champ lexical,
   bloque sur Pythagore, aime le foot », et lui demander d'écrire ce fichier.

   Chaque rubrique (francais, maths, geometrie, histoire, svt, ou une
   rubrique en plus déclarée dans profil.js) est une liste d'activités.
   Chaque activité a :
     id      un nom court, unique dans la rubrique (sans espace)
     type    le moteur : qcm · trous · paires · ordre · cartes · calcul ·
             orthographe · redaction · schema · jeu
     titre   ce qui s'affiche ;  notion  (facultatif) la notion travaillée
     consigne (facultatif) lue au début ;  rappel (facultatif) la leçon à retenir
   puis les données propres au moteur (voir les exemples ci-dessous).

   Adeline : adulte, niveau lycée, dyspraxique.
   Rubriques : français, maths, histoire. Univers : la moto (le trail en bonus dans les calculs).
   ========================================================= */
window.ZCONTENU = {

  /* ===================== FRANÇAIS ===================== */
  francais: [
    { id: 'figures-de-style', type: 'qcm', titre: 'Les figures de style', notion: 'Analyse littéraire',
      rappel: 'Comparaison : rapproche deux choses AVEC un outil (comme, tel, pareil à). Métaphore : la même chose SANS outil. Personnification : on prête des actions humaines à un objet ou un animal. Hyperbole : on exagère.',
      questions: [
        { q: '« Le sentier serpente comme un ruban dans la forêt. » Quelle figure de style ?',
          choix: ['Une comparaison', 'Une métaphore', 'Une hyperbole'],
          aide: 'Cherche un petit mot outil : comme, tel, pareil à…',
          explication: 'Il y a l\'outil « comme » : c\'est une comparaison.' },
        { q: '« Mon vieux chat est un roi sur son coussin. » Quelle figure de style ?',
          choix: ['Une métaphore', 'Une comparaison', 'Une personnification'],
          explication: 'On rapproche le chat et un roi SANS mot outil : c\'est une métaphore.' },
        { q: '« La montagne me défie du regard. » Quelle figure de style ?',
          choix: ['Une personnification', 'Une hyperbole', 'Une comparaison'],
          explication: 'Une montagne ne regarde pas : on lui prête une action humaine.' },
        { q: '« J\'ai couru un million de kilomètres ce matin ! » Quelle figure de style ?',
          choix: ['Une hyperbole', 'Une métaphore', 'Une personnification'],
          explication: 'On exagère pour insister : c\'est une hyperbole.' },
        { q: '« Les oiseaux bavardent dans les arbres. » Quelle figure de style ?',
          choix: ['Une personnification', 'Une comparaison', 'Une hyperbole'],
          explication: 'Bavarder, c\'est une action humaine prêtée aux oiseaux.' }
      ] },
    { id: 'champ-lexical', type: 'paires', titre: 'Les champs lexicaux', notion: 'Vocabulaire',
      consigne: 'Relie chaque mot au champ lexical auquel il appartient.',
      paires: [['Embrayage', 'La moto'], ['Dénivelé', 'Le trail'], ['Ronronner', 'Le chat'], ['Plumage', 'L\'oiseau'], ['Houblon', 'La brasserie'], ['Verger', 'La pomme']] },
    { id: 'homophones', type: 'trous', titre: 'Les homophones', notion: 'Orthographe',
      rappel: 'a / à : remplace par « avait ». Si ça marche, c\'est « a ». ou / où : « où » indique le lieu ou le moment. ces / ses : « ses » = les siens, « ces » = ceux-là.',
      phrases: [
        { t: 'Fouffy {a|à} dormi toute la journée {à|a} côté du radiateur.', aide: 'Essaie de remplacer par « avait ».' },
        { t: 'Tu préfères le trail {ou|où} la course sur route ?', aide: 'On peut dire « ou bien » : pas d\'accent.' },
        { t: 'Le refuge {où|ou} nous dormons est en haut de la montée.', aide: 'Ici, on parle d\'un lieu.' },
        { t: 'Adeline a laissé {ses|ces|c\'est} miettes de pomme partout !', aide: 'Les miettes à qui ? Les siennes.' },
        { t: '{Ces|Ses|C\'est} oiseaux chantent tous les matins.', aide: 'On les montre : ceux-là.' }
      ] },
    { id: 'connecteurs', type: 'cartes', titre: 'Les connecteurs logiques', notion: 'Argumenter',
      cartes: [
        { recto: 'Donc, ainsi, c\'est pourquoi… expriment…', choix: ['La conséquence', 'La cause', 'L\'opposition', 'Le but'], verso: 'La conséquence. « J\'ai bien mangé, donc j\'ai de l\'énergie. »' },
        { recto: 'Car, parce que, puisque… expriment…', choix: ['La cause', 'La conséquence', 'L\'opposition', 'Le temps'], verso: 'La cause. « Je ralentis car la pente est raide. »' },
        { recto: 'Mais, pourtant, cependant… expriment…', choix: ['L\'opposition', 'La cause', 'La conséquence', 'L\'addition'], verso: 'L\'opposition. « J\'étais fatiguée, pourtant j\'ai fini la course. »' },
        { recto: 'D\'abord, ensuite, enfin… servent à…', choix: ['Organiser les idées dans l\'ordre', 'Exprimer une cause', 'Exprimer une opposition', 'Donner un exemple'], verso: 'Organiser les idées dans l\'ordre.' }
      ] }
  ],

  /* ===================== MATHS ===================== */
  maths: [
    { id: 'calculs-trail', type: 'calcul', titre: 'Les calculs du traileur', notion: 'Vitesse, pourcentages',
      rappel: 'Vitesse moyenne = distance ÷ temps. Pour prendre un pourcentage, on divise par 100 puis on multiplie.',
      questions: [
        { q: 'Un trail de 24 km parcouru en 3 heures. Quelle est la vitesse moyenne ?', reponse: 8, unite: 'km/h', aide: 'Distance ÷ temps : 24 ÷ 3.', solution: '24 ÷ 3 = 8 km/h.' },
        { q: 'À moto, Adeline roule 135 km en 1 h 30. Quelle est sa vitesse moyenne ?', reponse: 90, unite: 'km/h', aide: '1 h 30, c\'est 1,5 heure. Fais 135 ÷ 1,5.', solution: '135 ÷ 1,5 = 90 km/h.' },
        { q: 'Départ à 650 m d\'altitude, sommet à 1 420 m. Quel est le dénivelé positif ?', reponse: 770, unite: 'm', aide: 'Altitude d\'arrivée moins altitude de départ.', solution: '1 420 - 650 = 770 m.' },
        { q: 'Une bière de 33 cl titre 5 % d\'alcool. Combien de centilitres d\'alcool pur contient-elle ?', reponse: 1.65, tolerance: 0.01, unite: 'cl', aide: '1 % de 33, c\'est 0,33. Multiplie par 5.', solution: '33 × 5 ÷ 100 = 1,65 cl.' },
        { q: 'Une pomme fait 150 g. Adeline en mange 4 par jour pendant une semaine (et met des miettes partout). Combien de kilos de pommes ?', reponse: 4.2, tolerance: 0.01, unite: 'kg', aide: '150 × 4 × 7 grammes, puis divise par 1 000.', solution: '150 × 4 × 7 = 4 200 g = 4,2 kg.' },
        { q: 'L\'inscription au trail coûte 40 €. Il y a 15 % de réduction. Quel est le nouveau prix ?', reponse: 34, unite: '€', aide: '10 % de 40 = 4 et 5 % = 2.', solution: 'Réduction : 6 €. 40 - 6 = 34 €.' }
      ] },
    { id: 'conversions', type: 'cartes', titre: 'Les conversions utiles', notion: 'Durées, unités',
      cartes: [
        { recto: '1 h 30 min = combien de minutes ?', choix: ['90 minutes', '130 minutes', '80 minutes', '60 minutes'], verso: '90 minutes.' },
        { recto: '2,5 h = combien d\'heures et de minutes ?', choix: ['2 h 30 min', '2 h 50 min', '2 h 05 min', '2 h 25 min'], verso: '2 h 30 min. 0,5 h = une demi-heure.' },
        { recto: '1 L = combien de cl ?', choix: ['100 cl', '10 cl', '1 000 cl', '50 cl'], verso: '100 cl.' },
        { recto: '12 km/h, c\'est combien de km en 15 minutes ?', choix: ['3 km', '4 km', '12 km', '1,5 km'], verso: '3 km. 15 min = un quart d\'heure, et 12 ÷ 4 = 3.' },
        { recto: '1 kg = combien de grammes ?', choix: ['1 000 g', '100 g', '10 000 g', '10 g'], verso: '1 000 g.' }
      ] },
    { id: 'enquetes', type: 'jeu', jeu: 'problemes', notion: 'Résoudre un problème' }
  ],

  /* ===================== HISTOIRE-GÉO ===================== */
  histoire: [
    { id: 'metal', type: 'qcm', titre: 'Un peu d\'histoire du métal', notion: 'Culture',
      questions: [
        { q: 'Dans quelle ville a lieu le Hellfest ?', choix: ['Clisson, en Loire-Atlantique', 'Lyon', 'Lille'], explication: 'Le Hellfest se tient à Clisson, près de Nantes.' },
        { q: 'Dans quelle ville le groupe Black Sabbath est-il né, en 1968 ?', choix: ['Birmingham, en Angleterre', 'Los Angeles, aux États-Unis', 'Oslo, en Norvège'], explication: 'Black Sabbath, pionnier du heavy metal, vient de Birmingham.' },
        { q: 'Dans quelle ville le groupe Metallica a-t-il été fondé, en 1981 ?', choix: ['Los Angeles', 'Londres', 'Berlin'], explication: 'Metallica a été fondé à Los Angeles en 1981.' }
      ] },
    { id: 'frise', type: 'ordre', titre: 'Les grandes périodes', notion: 'Repères chronologiques',
      consigne: 'Range ces événements du plus ancien au plus récent.',
      series: [
        ['Construction des pyramides de Gizeh', 'Jules César conquiert la Gaule', 'Couronnement de Charlemagne (800)', 'Révolution française (1789)', 'Début de la Ve République (1958)']
      ] },
    { id: 'histoire-biere', type: 'qcm', titre: 'Une petite histoire de la bière', notion: 'Histoire des techniques',
      rappel: 'La bière est l\'une des plus anciennes boissons fabriquées par l\'homme. On en trouve des traces en Mésopotamie il y a plus de 5 000 ans.',
      questions: [
        { q: 'Dans quelle région trouve-t-on les plus anciennes traces de bière ?',
          choix: ['La Mésopotamie', 'L\'Amérique du Nord', 'La Scandinavie'],
          explication: 'Des tablettes de Mésopotamie (l\'Irak actuel) parlent déjà de bière.' },
        { q: 'Au Moyen Âge, qui brassait souvent la bière ?',
          choix: ['Les moines dans les abbayes', 'Les chevaliers', 'Les rois'],
          explication: 'Les abbayes brassaient de la bière : on parle encore de bières d\'abbaye.' },
        { q: 'Quel savant français a étudié la fermentation de la bière au XIXe siècle ?',
          choix: ['Louis Pasteur', 'Victor Hugo', 'Napoléon'],
          explication: 'Pasteur publie ses « Études sur la bière » en 1876.' }
      ] },
    { id: 'reperes', type: 'cartes', titre: 'Mes dates repères', notion: 'Repères',
      cartes: [
        { recto: 'Que se passe-t-il en 1789 ?', choix: ['La Révolution française', 'Le couronnement de Napoléon', 'La fin de la monarchie de Juillet', 'La prise de Constantinople'], verso: 'La Révolution française.' },
        { recto: 'Que se passe-t-il en 1848 ?', choix: ['Abolition de l\'esclavage et suffrage universel masculin', 'La Révolution française', 'Le droit de vote des femmes', 'Le début de la Ve République'], verso: 'Abolition définitive de l\'esclavage et suffrage universel masculin.' },
        { recto: 'Que se passe-t-il de 1914 à 1918 ?', choix: ['La Première Guerre mondiale', 'La Seconde Guerre mondiale', 'La guerre de Cent Ans', 'La guerre d\'Algérie'], verso: 'La Première Guerre mondiale.' },
        { recto: 'Que se passe-t-il en 1944 ?', choix: ['Les femmes obtiennent le droit de vote', 'L\'abolition de l\'esclavage', 'La fin de la Première Guerre mondiale', 'Le début de la Ve République'], verso: 'Les femmes obtiennent le droit de vote en France.' },
        { recto: 'Que se passe-t-il en 1958 ?', choix: ['Début de la Ve République', 'Fin de la Seconde Guerre mondiale', 'Mai 68', 'Droit de vote des femmes'], verso: 'Début de la Ve République.' }
      ] },
    { id: 'points-cardinaux', type: 'schema', titre: 'S\'orienter en montagne', notion: 'Se repérer',
      fond: 'roseDesVents',
      points: [{ x: 150, y: 22, bonne: 'Nord' }, { x: 258, y: 130, bonne: 'Est' }, { x: 150, y: 245, bonne: 'Sud' }, { x: 30, y: 130, bonne: 'Ouest' }],
      intrus: ['Nord-Est'] }
  ]
};
