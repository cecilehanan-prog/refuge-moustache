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
             posee · orthographe · redaction · schema · jeu
     titre   ce qui s'affiche ;  notion  (facultatif) la notion travaillée
     consigne (facultatif) lue au début ;  rappel (facultatif) la leçon à retenir
   puis les données propres au moteur (voir les exemples ci-dessous).
   DIFFICULTÉ QUI MONTE :
   • paliers : [ {facile}, {moyen}, {expert} ] : chaque palier reprend les
     champs de l'activité (questions, phrases, cartes, paires, series, points…).
     80 % du premier coup → palier suivant. Le « défi du jour » propose un palier au-dessus.
   • niveauMin : 3 → l'activité se débloque au niveau 3 (annoncée à la montée de niveau).

   Adeline : adulte, niveau lycée, dyspraxique.
   Rubriques : français, maths, histoire. Univers : la moto (le trail en bonus dans les calculs).
   ========================================================= */
window.ZCONTENU = {

  /* ===================== FRANÇAIS ===================== */
  francais: [
    { id: 'figures-de-style', type: 'qcm', titre: 'Les figures de style', notion: 'Analyse littéraire',
      paliers: [
        { rappel: 'Comparaison : rapproche deux choses AVEC un outil (comme, tel, pareil à). Métaphore : la même chose SANS outil. Personnification : on prête des actions humaines à un objet ou un animal. Hyperbole : on exagère.',
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
        { rappel: 'Litote : dire moins pour suggérer plus. Euphémisme : adoucir une réalité pénible. Antithèse : opposer deux idées contraires. Anaphore : répéter un mot en début de phrase ou de vers.',
          questions: [
          { q: '« Ce n\'est pas mauvais, cette tarte aux pommes ! » (alors qu\'on la trouve délicieuse) Quelle figure ?',
            choix: ['Une litote', 'Une hyperbole', 'Une anaphore'],
            aide: 'On dit moins que ce qu\'on pense.',
            explication: 'On dit « pas mauvais » pour faire entendre « très bon » : c\'est une litote.' },
          { q: '« Il nous a quittés » pour dire « il est mort ». Quelle figure ?',
            choix: ['Un euphémisme', 'Une litote', 'Une métaphore'],
            explication: 'On adoucit une réalité douloureuse : c\'est un euphémisme.' },
          { q: '« Je vis, je meurs ; je me brûle et me noie. » (Louise Labé) Quelle figure ?',
            choix: ['Une antithèse', 'Une comparaison', 'Une hyperbole'],
            explication: 'Vivre et mourir, brûler et se noyer : des idées contraires opposées, c\'est une antithèse.' },
          { q: '« Rome, l\'unique objet de mon ressentiment ! Rome, à qui vient ton bras d\'immoler mon amant ! » (Corneille) Quelle figure ?',
            choix: ['Une anaphore', 'Une litote', 'Un euphémisme'],
            aide: 'Regarde le premier mot de chaque vers.',
            explication: '« Rome » est répété en tête de vers : c\'est une anaphore.' },
          { q: '« Sylvain n\'est pas le pire des motards. » (alors qu\'il roule très bien) Quelle figure ?',
            choix: ['Une litote', 'Un euphémisme', 'Une antithèse'],
            explication: 'Dire « pas le pire » pour faire entendre « excellent » : une litote.' }
        ] },
        { rappel: 'Oxymore : deux mots contraires collés ensemble. Chiasme : structure en miroir (A B / B A). Gradation : une suite de termes de plus en plus forts. Métonymie : désigner une chose par une autre qui lui est liée (le contenant pour le contenu…). Allitération : répétition d\'un même son de consonne.',
          questions: [
          { q: '« Cette obscure clarté qui tombe des étoiles » (Corneille, Le Cid) Quelle figure ?',
            choix: ['Un oxymore', 'Une litote', 'Une gradation'],
            explication: '« Obscure » et « clarté » sont contraires et collés : c\'est un oxymore.' },
          { q: '« Il faut manger pour vivre et non pas vivre pour manger. » (Molière, L\'Avare) Quelle figure ?',
            choix: ['Un chiasme', 'Une anaphore', 'Une antithèse'],
            aide: 'Regarde l\'ordre des mots : manger, vivre… puis vivre, manger.',
            explication: 'Structure en miroir A B / B A : c\'est un chiasme.' },
          { q: '« Va, cours, vole, et nous venge. » (Corneille, Le Cid) Quelle figure ?',
            choix: ['Une gradation', 'Un oxymore', 'Une métonymie'],
            explication: 'Aller, courir, voler : de plus en plus vite. C\'est une gradation.' },
          { q: '« On a bu un verre au Hellfest. » Quelle figure ?',
            choix: ['Une métonymie', 'Une métaphore', 'Une litote'],
            aide: 'Boit-on vraiment le verre ?',
            explication: 'On boit le contenu, pas le verre : le contenant pour le contenu, c\'est une métonymie.' },
          { q: '« Pour qui sont ces serpents qui sifflent sur vos têtes ? » (Racine, Andromaque) Quelle figure ?',
            choix: ['Une allitération', 'Un chiasme', 'Un euphémisme'],
            aide: 'Lis-le à voix haute avec 🔊 : quel son revient ?',
            explication: 'Le son « s » revient sans cesse et imite le sifflement des serpents : c\'est une allitération.' }
        ] }
      ] },

    { id: 'champ-lexical', type: 'paires', titre: 'Les champs lexicaux', notion: 'Vocabulaire',
      consigne: 'Relie chaque mot au champ lexical auquel il appartient.',
      rappel: 'Un champ lexical, c\'est l\'ensemble des mots qui se rapportent à un même thème.',
      paliers: [
        { paires: [['Embrayage', 'La moto'], ['Dénivelé', 'Le trail'], ['Ronronner', 'Le chat'], ['Plumage', 'L\'oiseau'], ['Houblon', 'La brasserie'], ['Verger', 'La pomme']] },
        { paires: [['Cylindrée', 'La moto'], ['Ravitaillement', 'Le trail'], ['Moustaches', 'Le chat'], ['Nicher', 'L\'oiseau'], ['Malt', 'La brasserie'], ['Pépins', 'La pomme']] },
        { consigne: 'Plus difficile : des mots qui expriment une ambiance ou un sentiment. Relie chacun à son champ lexical.',
          paires: [['Frémir', 'La peur'], ['Allégresse', 'La joie'], ['Rancœur', 'La colère'], ['Mélancolie', 'La tristesse'], ['Crépuscule', 'Le soir'], ['Riff', 'La musique']] }
      ] },

    { id: 'homophones', type: 'trous', titre: 'Les homophones', notion: 'Orthographe',
      paliers: [
        { rappel: 'a / à : remplace par « avait ». Si ça marche, c\'est « a ». ou / où : « où » indique le lieu ou le moment. ces / ses : « ses » = les siens, « ces » = ceux-là.',
          phrases: [
          { t: 'Fouffy {a|à} dormi toute la journée {à|a} côté du radiateur.', aide: 'Essaie de remplacer par « avait ».' },
          { t: 'Tu préfères le trail {ou|où} la course sur route ?', aide: 'On peut dire « ou bien » : pas d\'accent.' },
          { t: 'Le refuge {où|ou} nous dormons est en haut de la montée.', aide: 'Ici, on parle d\'un lieu.' },
          { t: 'Adeline a laissé {ses|ces|c\'est} miettes de pomme partout !', aide: 'Les miettes à qui ? Les siennes.' },
          { t: '{Ces|Ses|C\'est} oiseaux chantent tous les matins.', aide: 'On les montre : ceux-là.' }
        ] },
        { rappel: 'et / est : remplace par « était ». on / ont : remplace par « avaient ». se / ce : « se » va devant un verbe (se laver). c\'est / s\'est : « c\'est » = cela est ; « s\'est » devant un participe (il s\'est garé).',
          phrases: [
          { t: 'Sylvain {s\'est|c\'est|ses} garé devant le garage.', aide: 'Il y a un verbe juste après : garé.' },
          { t: '{C\'est|S\'est|Ses} la plus belle balade de l\'été.', aide: 'Remplace par « cela est ».' },
          { t: 'Les motards {ont|on} pris la route tôt, et {on|ont} les a suivis.', aide: 'Remplace par « avaient » : si ça marche, c\'est « ont ».' },
          { t: 'Fouffy {se|ce} lèche les pattes sur {ce|se} coussin.', aide: '« Se » va devant un verbe ; « ce » devant un nom.' },
          { t: 'Le moteur {est|et} chaud {et|est} il fait du bruit.', aide: 'Remplace par « était ».' }
        ] },
        { rappel: 'quelle / qu\'elle : remplace par « qu\'il ». leur / leurs : devant un verbe, « leur » ne prend jamais de s. quand (le moment) / quant à (en ce qui concerne). Participe passé avec avoir : il s\'accorde avec le COD s\'il est placé AVANT.',
          phrases: [
          { t: '{Quelle|Qu\'elle|Quel} belle balade ! Je crois {qu\'elle|quelle|quel} s\'en souviendra.', aide: 'Essaie « qu\'il » : « je crois qu\'il s\'en souviendra » marche.' },
          { t: 'Les oiseaux attendent {leurs|leur} graines ; je {leur|leurs} en donne chaque matin.', aide: 'Devant un verbe (je leur donne), jamais de s.' },
          { t: '{Quand|Quant|Qu\'en} Sylvain arrive, Fouffy court à la porte. {Quant|Quand|Qu\'en} aux oiseaux, ils s\'envolent.', aide: '« Quant à » veut dire « en ce qui concerne ».' },
          { t: 'Il faut {changer|changé|changez} l\'huile : Sylvain l\'a {changée|changer|changé} hier.', aide: 'L\' = l\'huile (féminin), placé avant « a ».' },
          { t: 'Les photos {qu\'elle|quelle} a {prises|pris|prise} au Hellfest sont superbes.', aide: 'Qu\'est-ce qu\'elle a pris ? Les photos (féminin pluriel), placées avant.' }
        ] }
      ] },

    { id: 'connecteurs', type: 'cartes', titre: 'Les connecteurs logiques', notion: 'Argumenter',
      paliers: [
        { cartes: [
          { recto: 'Donc, ainsi, c\'est pourquoi… expriment…', choix: ['La conséquence', 'La cause', 'L\'opposition', 'Le but'], verso: 'La conséquence. « J\'ai bien mangé, donc j\'ai de l\'énergie. »' },
          { recto: 'Car, parce que, puisque… expriment…', choix: ['La cause', 'La conséquence', 'L\'opposition', 'Le temps'], verso: 'La cause. « Je ralentis car la pente est raide. »' },
          { recto: 'Mais, pourtant, cependant… expriment…', choix: ['L\'opposition', 'La cause', 'La conséquence', 'L\'addition'], verso: 'L\'opposition. « J\'étais fatiguée, pourtant j\'ai fini la course. »' },
          { recto: 'D\'abord, ensuite, enfin… servent à…', choix: ['Organiser les idées dans l\'ordre', 'Exprimer une cause', 'Exprimer une opposition', 'Donner un exemple'], verso: 'Organiser les idées dans l\'ordre.' }
        ] },
        { cartes: [
          { recto: 'Afin que, pour que, de sorte que (+ subjonctif)… expriment…', choix: ['Le but', 'La cause', 'La conséquence', 'Le temps'], verso: 'Le but. « Je fais le plein pour que nous puissions partir tôt. »' },
          { recto: 'De plus, en outre, par ailleurs… servent à…', choix: ['Ajouter un argument', 'Exprimer une opposition', 'Conclure', 'Exprimer une cause'], verso: 'Ajouter un argument.' },
          { recto: 'En effet… sert à…', choix: ['Justifier ce qu\'on vient de dire', 'Opposer deux idées', 'Conclure', 'Exprimer un but'], verso: 'Justifier, expliquer. « Le trail est exigeant. En effet, le dénivelé est énorme. »' },
          { recto: 'Par exemple, ainsi, notamment… servent à…', choix: ['Illustrer par un exemple', 'Exprimer une cause', 'Opposer', 'Ajouter un but'], verso: 'Illustrer une idée par un exemple.' },
          { recto: 'En conclusion, pour finir, en somme… servent à…', choix: ['Conclure', 'Commencer', 'Opposer', 'Justifier'], verso: 'Conclure un raisonnement.' }
        ] },
        { cartes: [
          { recto: 'Bien que, quoique (+ subjonctif)… expriment…', choix: ['La concession', 'La cause', 'Le but', 'La conséquence'], verso: 'La concession : on admet un fait, sans que cela change la conclusion. « Bien qu\'il pleuve, nous partons. »' },
          { recto: '« Certes…, mais… » sert à…', choix: ['Reconnaître un argument adverse, puis le dépasser', 'Ajouter deux arguments', 'Conclure', 'Donner un exemple'], verso: 'La concession puis l\'opposition : très utile dans une dissertation.' },
          { recto: '« Or » sert à…', choix: ['Introduire un fait nouveau qui fait avancer le raisonnement', 'Exprimer la cause', 'Conclure', 'Donner un exemple'], verso: '« Or » introduit un élément nouveau, souvent avant « donc » : « Les chats aiment la chaleur. Or Fouffy est un chat. Donc il aime le radiateur. »' },
          { recto: 'En revanche, au contraire… expriment…', choix: ['L\'opposition', 'La concession', 'La cause', 'L\'addition'], verso: 'L\'opposition entre deux faits. « Pirouette est bavarde ; Rouquine, en revanche, est discrète. »' },
          { recto: 'Dès lors, par conséquent… expriment…', choix: ['La conséquence', 'La cause', 'Le but', 'La concession'], verso: 'La conséquence, dans un registre plus soutenu que « donc ».' }
        ] }
      ] },

    /* Se débloque au niveau 3 */
    { id: 'registres', type: 'qcm', titre: 'Les registres littéraires', notion: 'Analyse littéraire', niveauMin: 3,
      rappel: 'Le registre, c\'est l\'effet qu\'un texte veut produire sur le lecteur : faire rire (comique), émouvoir (pathétique), exprimer ses sentiments (lyrique), grandir un héros (épique), montrer un destin qui écrase (tragique), se moquer en disant le contraire (ironique).',
      paliers: [
        { questions: [
          { q: 'Un texte plein de quiproquos et de situations absurdes, qui fait rire. Quel registre ?', choix: ['Comique', 'Tragique', 'Lyrique'], explication: 'Faire rire : c\'est le registre comique.' },
          { q: 'Un poème à la première personne où l\'auteur exprime son amour ou sa nostalgie. Quel registre ?', choix: ['Lyrique', 'Épique', 'Comique'], explication: 'L\'expression des sentiments personnels : le registre lyrique.' },
          { q: 'Le récit d\'un combat où le héros affronte seul une armée, avec beaucoup d\'exagérations. Quel registre ?', choix: ['Épique', 'Lyrique', 'Ironique'], explication: 'Un héros plus grand que nature, des exploits : le registre épique.' }
        ] },
        { questions: [
          { q: 'Un texte qui décrit la misère d\'un personnage pour susciter la pitié du lecteur. Quel registre ?', choix: ['Pathétique', 'Comique', 'Épique'], explication: 'Émouvoir, faire naître la pitié : le registre pathétique.' },
          { q: 'Un personnage écrasé par un destin auquel il ne peut pas échapper. Quel registre ?', choix: ['Tragique', 'Lyrique', 'Comique'], explication: 'La fatalité, le destin inévitable : le registre tragique.' },
          { q: 'Dire « Quel temps magnifique ! » sous une pluie battante. Quel registre ?', choix: ['Ironique', 'Lyrique', 'Pathétique'], explication: 'Dire le contraire de ce qu\'on pense pour se moquer : l\'ironie.' }
        ] },
        { questions: [
          { q: '« Demain, dès l\'aube… » : Victor Hugo marche vers la tombe de sa fille et lui parle. Quel registre domine ?', choix: ['Lyrique', 'Comique', 'Épique'], explication: 'Le poète exprime son deuil et son amour à la première personne : le registre lyrique.' },
          { q: 'Dans Candide, Voltaire fait répéter que tout va « pour le mieux » au milieu des guerres et des catastrophes. Quel registre ?', choix: ['Ironique', 'Tragique', 'Lyrique'], explication: 'Voltaire dit le contraire de ce qu\'il pense pour critiquer l\'optimisme : c\'est l\'ironie.' },
          { q: 'La Chanson de Roland : Roland combat à Roncevaux contre des milliers d\'ennemis. Quel registre ?', choix: ['Épique', 'Pathétique', 'Comique'], explication: 'Un héros aux exploits surhumains : le registre épique.' },
          { q: 'Phèdre, chez Racine, est condamnée par une passion qu\'elle n\'a pas choisie. Quel registre ?', choix: ['Tragique', 'Comique', 'Ironique'], explication: 'Une passion fatale, imposée par les dieux : le registre tragique.' }
        ] }
      ] }
  ],

  /* ===================== MATHS ===================== */
  maths: [
    { id: 'calculs-trail', type: 'calcul', titre: 'Les calculs du traileur', notion: 'Vitesse, pourcentages',
      paliers: [
        { rappel: 'Prends ton temps : écris les nombres, puis fais une opération à la fois.',
          questions: [
          { q: 'Le trail fait 12 km. Adeline a déjà couru 7 km. Combien de kilomètres reste-t-il ?', reponse: 5, unite: 'km', aide: '12 moins 7.', solution: '12 - 7 = 5 km.' },
          { q: 'Fouffy dort 16 heures par jour. Combien d\'heures est-il éveillé ?', reponse: 8, unite: 'h', aide: 'Une journée dure 24 heures.', solution: '24 - 16 = 8 h.' },
          { q: 'Adeline achète 4 sachets de graines à 3 € pour Pirouette et Rouquine. Combien paie-t-elle ?', reponse: 12, unite: '€', aide: '4 fois 3.', solution: '4 × 3 = 12 €.' },
          { q: 'Départ à 650 m d\'altitude, sommet à 1 420 m. Quel est le dénivelé positif ?', reponse: 770, unite: 'm', aide: 'Altitude d\'arrivée moins altitude de départ.', solution: '1 420 - 650 = 770 m.' },
          { q: 'Sylvain met 15 litres d\'essence à 2 € le litre. Combien paie-t-il ?', reponse: 30, unite: '€', aide: '15 fois 2.', solution: '15 × 2 = 30 €.' }
        ] },
        { rappel: 'Vitesse moyenne = distance ÷ temps. Pour prendre un pourcentage, on divise par 100 puis on multiplie.',
          questions: [
          { q: 'Un trail de 24 km parcouru en 3 heures. Quelle est la vitesse moyenne ?', reponse: 8, unite: 'km/h', aide: 'Distance ÷ temps : 24 ÷ 3.', solution: '24 ÷ 3 = 8 km/h.' },
          { q: 'À moto, Adeline roule 135 km en 1 h 30. Quelle est sa vitesse moyenne ?', reponse: 90, unite: 'km/h', aide: '1 h 30, c\'est 1,5 heure. Fais 135 ÷ 1,5.', solution: '135 ÷ 1,5 = 90 km/h.' },
          { q: 'Une bière de 33 cl titre 5 % d\'alcool. Combien de centilitres d\'alcool pur contient-elle ?', reponse: 1.65, tolerance: 0.01, unite: 'cl', aide: '1 % de 33, c\'est 0,33. Multiplie par 5.', solution: '33 × 5 ÷ 100 = 1,65 cl.' },
          { q: 'Une pomme fait 150 g. Adeline en mange 4 par jour pendant une semaine (et met des miettes partout). Combien de kilos de pommes ?', reponse: 4.2, tolerance: 0.01, unite: 'kg', aide: '150 × 4 × 7 grammes, puis divise par 1 000.', solution: '150 × 4 × 7 = 4 200 g = 4,2 kg.' },
          { q: 'L\'inscription au trail coûte 40 €. Il y a 15 % de réduction. Quel est le nouveau prix ?', reponse: 34, unite: '€', aide: '10 % de 40 = 4 et 5 % = 2.', solution: 'Réduction : 6 €. 40 - 6 = 34 €.' }
        ] },
        { rappel: 'Temps = distance ÷ vitesse. Pourcentage d\'évolution = (nouvelle valeur - ancienne) ÷ ancienne × 100. Une hausse puis une baisse du même pourcentage ne ramènent PAS au prix de départ.',
          questions: [
          { q: 'Adeline court 10 km en 1 h 15. Quelle est sa vitesse moyenne ?', reponse: 8, unite: 'km/h', aide: '1 h 15 = 1,25 h. Fais 10 ÷ 1,25.', solution: '10 ÷ 1,25 = 8 km/h.' },
          { q: 'À 90 km/h, combien de minutes faut-il pour parcourir 60 km ?', reponse: 40, unite: 'min', aide: 'En 1 heure (60 min) on fait 90 km. Combien de minutes pour 1 km ?', solution: '60 ÷ 90 = 2/3 d\'heure = 40 minutes.' },
          { q: 'La moto consomme 5 litres aux 100 km. Combien de litres pour un voyage de 340 km ?', reponse: 17, unite: 'L', aide: '340 km, c\'est 3,4 fois 100 km.', solution: '5 × 3,4 = 17 L.' },
          { q: 'Un casque à 200 € augmente de 10 %, puis baisse de 10 %. Quel est son prix final ?', reponse: 198, unite: '€', aide: 'D\'abord 200 + 10 %, puis enlève 10 % du NOUVEAU prix.', solution: '200 → 220 €, puis 220 - 22 = 198 €.' },
          { q: 'Une place de concert passe de 250 € à 300 €. Quel est le pourcentage d\'augmentation ?', reponse: 20, unite: '%', aide: 'Augmentation : 50 €. Que représente 50 sur 250 ?', solution: '50 ÷ 250 = 0,2, soit 20 %.' },
          { q: 'Sur un sentier, on monte de 120 m pour 1 km parcouru à l\'horizontale. Quelle est la pente, en pourcentage ?', reponse: 12, unite: '%', aide: 'Pente = dénivelé ÷ distance horizontale × 100 (dans la même unité).', solution: '120 m ÷ 1 000 m × 100 = 12 %.' }
        ] }
      ] },

    { id: 'conversions', type: 'cartes', titre: 'Les conversions utiles', notion: 'Durées, unités',
      paliers: [
        { cartes: [
          { recto: '1 h 30 min = combien de minutes ?', choix: ['90 minutes', '130 minutes', '80 minutes', '60 minutes'], verso: '90 minutes.' },
          { recto: '2,5 h = combien d\'heures et de minutes ?', choix: ['2 h 30 min', '2 h 50 min', '2 h 05 min', '2 h 25 min'], verso: '2 h 30 min. 0,5 h = une demi-heure.' },
          { recto: '1 L = combien de cl ?', choix: ['100 cl', '10 cl', '1 000 cl', '50 cl'], verso: '100 cl.' },
          { recto: '12 km/h, c\'est combien de km en 15 minutes ?', choix: ['3 km', '4 km', '12 km', '1,5 km'], verso: '3 km. 15 min = un quart d\'heure, et 12 ÷ 4 = 3.' },
          { recto: '1 kg = combien de grammes ?', choix: ['1 000 g', '100 g', '10 000 g', '10 g'], verso: '1 000 g.' }
        ] },
        { cartes: [
          { recto: '1,75 h = combien d\'heures et de minutes ?', choix: ['1 h 45 min', '1 h 75 min', '1 h 07 min', '1 h 57 min'], verso: '1 h 45 min. 0,75 h = trois quarts d\'heure = 45 min.' },
          { recto: '0,2 h = combien de minutes ?', choix: ['12 minutes', '20 minutes', '2 minutes', '10 minutes'], verso: '12 minutes. 0,2 × 60 = 12.' },
          { recto: '2 h 15 min = combien de minutes ?', choix: ['135 minutes', '215 minutes', '125 minutes', '150 minutes'], verso: '135 minutes. 2 × 60 + 15 = 135.' },
          { recto: '1 m³ = combien de litres ?', choix: ['1 000 L', '100 L', '10 L', '10 000 L'], verso: '1 000 L.' },
          { recto: '25 cl = combien de litres ?', choix: ['0,25 L', '2,5 L', '0,025 L', '25 L'], verso: '0,25 L, soit un quart de litre.' }
        ] },
        { cartes: [
          { recto: '36 km/h = combien de mètres par seconde ?', choix: ['10 m/s', '36 m/s', '3,6 m/s', '100 m/s'], verso: '10 m/s. On divise par 3,6 (36 000 m en 3 600 s).' },
          { recto: '90 km/h = combien de mètres par seconde ?', choix: ['25 m/s', '9 m/s', '30 m/s', '324 m/s'], verso: '25 m/s. 90 ÷ 3,6 = 25.' },
          { recto: '3,6 h = combien d\'heures et de minutes ?', choix: ['3 h 36 min', '3 h 60 min', '3 h 06 min', '3 h 40 min'], verso: '3 h 36 min. 0,6 × 60 = 36.' },
          { recto: '1 hectare = combien de m² ?', choix: ['10 000 m²', '1 000 m²', '100 m²', '100 000 m²'], verso: '10 000 m² : un carré de 100 m de côté.' },
          { recto: '1 h 20 min = combien d\'heures (en fraction) ?', choix: ['4/3 h', '1,2 h', '6/5 h', '1,02 h'], verso: '4/3 h. 20 min = 1/3 d\'heure, donc 1 + 1/3 = 4/3. Attention : ce n\'est PAS 1,2 h.' }
        ] }
      ] },

    /* Se débloque au niveau 5 */
    { id: 'equations', type: 'calcul', titre: 'Les équations', notion: 'Algèbre', niveauMin: 5,
      rappel: 'Une équation, c\'est une balance : ce qu\'on fait d\'un côté, on le fait de l\'autre. On regroupe les x d\'un côté, les nombres de l\'autre, puis on divise.',
      paliers: [
        { questions: [
          { q: 'Trouve x : x + 7 = 15', reponse: 8, aide: 'Enlève 7 des deux côtés.', solution: 'x = 15 - 7 = 8.' },
          { q: 'Trouve x : 3x = 21', reponse: 7, aide: 'Divise les deux côtés par 3.', solution: 'x = 21 ÷ 3 = 7.' },
          { q: 'Trouve x : x - 4 = 10', reponse: 14, aide: 'Ajoute 4 des deux côtés.', solution: 'x = 10 + 4 = 14.' },
          { q: 'Trouve x : x ÷ 2 = 9', reponse: 18, aide: 'Multiplie les deux côtés par 2.', solution: 'x = 9 × 2 = 18.' }
        ] },
        { questions: [
          { q: 'Trouve x : 2x + 5 = 17', reponse: 6, aide: 'D\'abord enlève 5, puis divise par 2.', solution: '2x = 12, donc x = 6.' },
          { q: 'Trouve x : 5x - 3 = 22', reponse: 5, aide: 'D\'abord ajoute 3, puis divise par 5.', solution: '5x = 25, donc x = 5.' },
          { q: 'Trouve x : 3(x + 2) = 24', reponse: 6, aide: 'Divise d\'abord par 3.', solution: 'x + 2 = 8, donc x = 6.' },
          { q: 'Trouve x : 4x + 1 = 2x + 9', reponse: 4, aide: 'Enlève 2x des deux côtés.', solution: '2x + 1 = 9, donc 2x = 8 et x = 4.' }
        ] },
        { questions: [
          { q: 'Trouve x : 7x - 4 = 3x + 12', reponse: 4, aide: 'Regroupe les x à gauche, les nombres à droite.', solution: '4x = 16, donc x = 4.' },
          { q: 'Trouve x : 2(x - 3) = x + 5', reponse: 11, aide: 'Développe : 2x - 6.', solution: '2x - 6 = x + 5, donc x = 11.' },
          { q: 'Trouve x : x ÷ 3 + 4 = 10', reponse: 18, aide: 'Enlève 4, puis multiplie par 3.', solution: 'x ÷ 3 = 6, donc x = 18.' },
          { q: 'Louer une moto coûte 30 € plus 0,20 € par kilomètre. Adeline paie 54 €. Combien de kilomètres a-t-elle faits ?', reponse: 120, unite: 'km', aide: 'Écris 30 + 0,2x = 54.', solution: '0,2x = 24, donc x = 24 ÷ 0,2 = 120 km.' },
          { q: 'Trouve x : -2x + 9 = 1', reponse: 4, aide: 'Enlève 9, puis divise par -2.', solution: '-2x = -8, donc x = 4.' }
        ] }
      ] },

    { id: 'enquetes', type: 'jeu', jeu: 'problemes', notion: 'Résoudre un problème' }
  ],

  /* ===================== HISTOIRE-GÉO ===================== */
  histoire: [
    { id: 'metal', type: 'qcm', titre: 'Un peu d\'histoire du métal', notion: 'Culture',
      paliers: [
        { questions: [
          { q: 'Dans quelle ville a lieu le Hellfest ?', choix: ['Clisson, en Loire-Atlantique', 'Lyon', 'Lille'], explication: 'Le Hellfest se tient à Clisson, près de Nantes.' },
          { q: 'Dans quelle ville le groupe Black Sabbath est-il né, en 1968 ?', choix: ['Birmingham, en Angleterre', 'Los Angeles, aux États-Unis', 'Oslo, en Norvège'], explication: 'Black Sabbath, pionnier du heavy metal, vient de Birmingham.' },
          { q: 'Dans quelle ville le groupe Metallica a-t-il été fondé, en 1981 ?', choix: ['Los Angeles', 'Londres', 'Berlin'], explication: 'Metallica a été fondé à Los Angeles en 1981.' }
        ] },
        { questions: [
          { q: 'En quelle année a eu lieu la première édition du Hellfest ?', choix: ['2006', '1996', '2016'], explication: 'Le premier Hellfest a eu lieu en 2006, à Clisson.' },
          { q: 'Quel groupe britannique a sorti l\'album « The Number of the Beast » en 1982 ?', choix: ['Iron Maiden', 'Black Sabbath', 'Motörhead'], explication: 'C\'est le troisième album d\'Iron Maiden, le premier avec Bruce Dickinson au chant.' },
          { q: 'De quel pays vient le groupe Rammstein ?', choix: ['L\'Allemagne', 'La Suède', 'L\'Autriche'], explication: 'Rammstein a été fondé à Berlin en 1994 et chante en allemand.' },
          { q: 'Quel groupe français de métal a joué à la cérémonie d\'ouverture des Jeux olympiques de Paris, en 2024 ?', choix: ['Gojira', 'Trust', 'Téléphone'], explication: 'Gojira a joué depuis les fenêtres de la Conciergerie, avec la chanteuse lyrique Marina Viotti.' }
        ] },
        { questions: [
          { q: 'Quel guitariste de Black Sabbath a perdu le bout de deux doigts dans un accident d\'usine, ce qui a façonné son son grave et lourd ?', choix: ['Tony Iommi', 'Ozzy Osbourne', 'Lemmy Kilmister'], explication: 'Tony Iommi s\'est fabriqué des protège-doigts et a détendu ses cordes : son jeu a marqué tout le heavy metal.' },
          { q: 'Quel groupe était mené par le bassiste et chanteur Lemmy Kilmister ?', choix: ['Motörhead', 'Metallica', 'Slayer'], explication: 'Lemmy a fondé Motörhead en 1975.' },
          { q: 'De quel pays vient la scène black metal du début des années 1990 (Mayhem, Darkthrone, Emperor) ?', choix: ['La Norvège', 'Le Canada', 'L\'Italie'], explication: 'Le black metal dit « de la deuxième vague » est né en Norvège.' },
          { q: 'Quel album de Metallica, sorti en 1986, est souvent cité comme un sommet du thrash metal ?', choix: ['Master of Puppets', 'The Number of the Beast', 'Paranoid'], explication: '« Master of Puppets » est le troisième album de Metallica. « Paranoid » est de Black Sabbath, « The Number of the Beast » d\'Iron Maiden.' }
        ] }
      ] },

    { id: 'frise', type: 'ordre', titre: 'Les grandes périodes', notion: 'Repères chronologiques',
      consigne: 'Range ces événements du plus ancien au plus récent.',
      paliers: [
        { series: [
          ['Construction des pyramides de Gizeh', 'Jules César conquiert la Gaule', 'Révolution française (1789)', 'Début de la Ve République (1958)']
        ] },
        { series: [
          ['Construction des pyramides de Gizeh', 'Jules César conquiert la Gaule', 'Couronnement de Charlemagne (800)', 'Révolution française (1789)', 'Début de la Ve République (1958)']
        ] },
        { consigne: 'Plus serré : tout se passe en un peu plus d\'un siècle. Range du plus ancien au plus récent.',
          series: [
          ['Prise de la Bastille', 'Sacre de Napoléon Ier', 'Abolition définitive de l\'esclavage', 'La Commune de Paris', 'Loi de séparation des Églises et de l\'État']
        ] }
      ] },

    { id: 'histoire-biere', type: 'qcm', titre: 'Une petite histoire de la bière', notion: 'Histoire des techniques',
      rappel: 'La bière est l\'une des plus anciennes boissons fabriquées par l\'homme. On en trouve des traces en Mésopotamie il y a plus de 5 000 ans.',
      paliers: [
        { questions: [
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
        { questions: [
          { q: 'Quelle plante donne son amertume à la bière et l\'aide à se conserver ?',
            choix: ['Le houblon', 'La vigne', 'Le lin'],
            explication: 'Les fleurs de houblon apportent l\'amertume et protègent la bière.' },
          { q: 'Quelle céréale, germée puis séchée (le malt), est la base de la plupart des bières ?',
            choix: ['L\'orge', 'Le maïs', 'Le riz'],
            explication: 'L\'orge maltée fournit les sucres que la fermentation transforme en alcool.' },
          { q: 'Quelle abbesse du XIIe siècle a écrit que le houblon aide les boissons à se conserver ?',
            choix: ['Hildegarde de Bingen', 'Jeanne d\'Arc', 'Aliénor d\'Aquitaine'],
            explication: 'Hildegarde de Bingen, religieuse et savante allemande, en parle dans ses écrits sur les plantes.' }
        ] },
        { questions: [
          { q: 'Comment s\'appelle la loi bavaroise de 1516 qui n\'autorisait que l\'eau, l\'orge et le houblon dans la bière ?',
            choix: ['Le décret de pureté (Reinheitsgebot)', 'La Grande Charte', 'Le code Napoléon'],
            explication: 'Le Reinheitsgebot, promulgué en Bavière en 1516. La levure n\'y figurait pas : on ne la connaissait pas encore.' },
          { q: 'Quel être vivant microscopique transforme le sucre en alcool ?',
            choix: ['La levure', 'Le houblon', 'Le virus'],
            explication: 'La levure est un champignon microscopique : c\'est elle qui fait la fermentation.' },
          { q: 'Laquelle de ces bières est une trappiste, brassée dans une abbaye belge ?',
            choix: ['Orval', 'Kronenbourg', 'Heineken'],
            explication: 'Orval est brassée à l\'abbaye d\'Orval, en Belgique, sous le contrôle de moines trappistes.' }
        ] }
      ] },

    { id: 'reperes', type: 'cartes', titre: 'Mes dates repères', notion: 'Repères',
      paliers: [
        { cartes: [
          { recto: 'Que se passe-t-il en 1789 ?', choix: ['La Révolution française', 'La Première Guerre mondiale', 'Le début de la Ve République', 'La découverte de l\'Amérique'], verso: 'La Révolution française.' },
          { recto: 'Que se passe-t-il de 1914 à 1918 ?', choix: ['La Première Guerre mondiale', 'La Seconde Guerre mondiale', 'La guerre de Cent Ans', 'La guerre d\'Algérie'], verso: 'La Première Guerre mondiale.' },
          { recto: 'Que se passe-t-il de 1939 à 1945 ?', choix: ['La Seconde Guerre mondiale', 'La Première Guerre mondiale', 'La Révolution française', 'La guerre froide'], verso: 'La Seconde Guerre mondiale.' },
          { recto: 'Que se passe-t-il en 1958 ?', choix: ['Début de la Ve République', 'Fin de la Seconde Guerre mondiale', 'La Révolution française', 'Le premier pas sur la Lune'], verso: 'Début de la Ve République, avec le général de Gaulle.' }
        ] },
        { cartes: [
          { recto: 'Que se passe-t-il en 1789 ?', choix: ['La Révolution française', 'Le couronnement de Napoléon', 'La fin de la monarchie de Juillet', 'La prise de Constantinople'], verso: 'La Révolution française.' },
          { recto: 'Que se passe-t-il en 1848 ?', choix: ['Abolition de l\'esclavage et suffrage universel masculin', 'La Révolution française', 'Le droit de vote des femmes', 'Le début de la Ve République'], verso: 'Abolition définitive de l\'esclavage et suffrage universel masculin.' },
          { recto: 'Que se passe-t-il en 1905 ?', choix: ['La loi de séparation des Églises et de l\'État', 'Le début de la Première Guerre mondiale', 'L\'abolition de l\'esclavage', 'Le droit de vote des femmes'], verso: 'La loi de séparation des Églises et de l\'État : la laïcité.' },
          { recto: 'Que se passe-t-il en 1944 ?', choix: ['Les femmes obtiennent le droit de vote', 'L\'abolition de l\'esclavage', 'La fin de la Première Guerre mondiale', 'Le début de la Ve République'], verso: 'Les femmes obtiennent le droit de vote en France.' },
          { recto: 'Que se passe-t-il en 1958 ?', choix: ['Début de la Ve République', 'Fin de la Seconde Guerre mondiale', 'Mai 68', 'Droit de vote des femmes'], verso: 'Début de la Ve République.' }
        ] },
        { cartes: [
          { recto: 'Que se passe-t-il en 1815 ?', choix: ['La défaite de Napoléon à Waterloo', 'Le sacre de Napoléon', 'La prise de la Bastille', 'La Commune de Paris'], verso: 'La défaite de Waterloo et la fin de l\'Empire de Napoléon Ier.' },
          { recto: 'Que se passe-t-il en 1936 ?', choix: ['Le Front populaire et les premiers congés payés', 'Le droit de vote des femmes', 'La fin de la Première Guerre mondiale', 'La crise de 1929'], verso: 'Le Front populaire : deux semaines de congés payés et la semaine de 40 heures.' },
          { recto: 'Que se passe-t-il en 1962 ?', choix: ['La fin de la guerre d\'Algérie', 'Le début de la Ve République', 'Mai 68', 'La chute du mur de Berlin'], verso: 'Les accords d\'Évian et l\'indépendance de l\'Algérie.' },
          { recto: 'Que se passe-t-il en 1981 ?', choix: ['L\'abolition de la peine de mort en France', 'La chute du mur de Berlin', 'Le traité de Maastricht', 'Le droit de vote des femmes'], verso: 'La peine de mort est abolie, loi portée par Robert Badinter.' },
          { recto: 'Que se passe-t-il en 1989 ?', choix: ['La chute du mur de Berlin', 'L\'abolition de la peine de mort', 'Le passage à l\'euro', 'La fin de la guerre d\'Algérie'], verso: 'La chute du mur de Berlin, le 9 novembre 1989.' }
        ] }
      ] },

    { id: 'points-cardinaux', type: 'schema', titre: 'S\'orienter en montagne', notion: 'Se repérer',
      fond: 'roseDesVents',
      paliers: [
        { points: [{ x: 150, y: 22, bonne: 'Nord' }, { x: 258, y: 130, bonne: 'Est' }, { x: 150, y: 245, bonne: 'Sud' }, { x: 30, y: 130, bonne: 'Ouest' }],
          intrus: ['Nord-Est'] },
        { points: [{ x: 150, y: 22, bonne: 'Nord' }, { x: 258, y: 130, bonne: 'Est' }, { x: 150, y: 245, bonne: 'Sud' }, { x: 30, y: 130, bonne: 'Ouest' }, { x: 222, y: 58, bonne: 'Nord-Est' }, { x: 78, y: 202, bonne: 'Sud-Ouest' }],
          intrus: ['Nord-Ouest'] },
        { points: [{ x: 222, y: 58, bonne: 'Nord-Est' }, { x: 222, y: 202, bonne: 'Sud-Est' }, { x: 78, y: 202, bonne: 'Sud-Ouest' }, { x: 78, y: 58, bonne: 'Nord-Ouest' }, { x: 150, y: 22, bonne: 'Nord' }, { x: 30, y: 130, bonne: 'Ouest' }],
          intrus: ['Est-Nord'] }
      ] }
  ]
};
