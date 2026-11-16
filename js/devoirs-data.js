/* =========================================================
   MES DEVOIRS : le contenu de la semaine
   ---------------------------------------------------------
   Ce fichier est le SEUL à changer pour les devoirs. Le plus simple :
   envoyer une photo de l'agenda à Claude en lui demandant
   « transforme ces devoirs en exercices pour devoirs-data.js ».

   Ci-dessous : un EXEMPLE (un exercice de chaque sorte), à remplacer.
   Pour ne mettre aucun devoir : items: []

   Types d'exercice :
   • verbes   : phrases à trous. « ¤ » = un trou. Pour chaque trou :
                [début du mot, bonne fin, [fins fausses], question pour trouver le sujet,
                 le sujet, le pronom qui le remplace]
   • sujet    : encadrer le verbe (V:) et souligner le sujet (S:).
                s?: / v?: = mot accepté en plus, mais pas obligatoire.
   • mathador : nombres à combiner pour s'approcher de la cible.
   • poesie   : texte tapé par l'adulte (bouton « Pour … » de l'exercice).

   NOUVELLE SEMAINE : on DÉPLACE l'objet ci-dessous dans js/devoirs-archives.js
   (il devient un « ancien devoir », toujours jouable pour réviser),
   puis on écrit ici les nouveaux devoirs avec un nouvel id (la date du lundi).
   ========================================================= */
window.ZDEVOIRS = {
  id: 'exemple', titre: 'Exemple de devoirs',
  items: [
    {
      id: 'poesie', type: 'poesie', pour: 'Lundi',
      titre: 'Ma poésie', auteur: 'à recopier',
      consigne: 'Poésie à apprendre.'
    },
    {
      id: 'verbes', type: 'verbes', pour: 'Mardi', titre: 'Les terminaisons des verbes',
      consigne: 'Accorde les verbes en mettant la bonne terminaison.',
      phrases: [
        { t: 'Les joueurs ¤ sur le terrain.', b: [['entr', 'ent', ['e', 'es'], 'Qui entre ?', 'les joueurs', 'ils']] },
        { t: 'Tu ¤ ton chien tous les soirs.', b: [['promèn', 'es', ['e', 'ent'], 'Qui promène ?', 'tu', 'tu']] },
        { t: 'Mon frère et moi ¤ au parc.', b: [['jou', 'ons', ['ez', 'ent'], 'Qui joue ?', 'mon frère et moi', 'nous']] },
        { t: 'La maîtresse ¤ une histoire.', b: [['racont', 'e', ['es', 'ent'], 'Qui raconte ?', 'la maîtresse', 'elle']] }
      ]
    },
    {
      id: 'mathador', type: 'mathador', pour: 'Jeudi', titre: 'Le Mathador',
      consigne: 'Avec ces nombres, approche-toi le plus possible du grand nombre.',
      nombres: [3, 5, 8, 10, 20], cible: 250
    },
    {
      id: 'sujet', type: 'sujet', pour: 'Vendredi', titre: 'Le verbe et le sujet',
      consigne: 'Encadre en rouge le verbe conjugué et souligne en bleu le sujet.',
      phrases: [
        'S:Le S:chien V:court dans le jardin.',
        'Le matin, S:les S:enfants V:arrivent à l’école.',
        'S:Mon S:équipe V:a v?:gagné le match.'
      ]
    }
  ]
};
