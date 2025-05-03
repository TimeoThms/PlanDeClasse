<details style="margin-bottom:20px;">
  <summary style="font-size: 20px;"><strong>📚 Sommaire</strong></summary>

- [📖 I. Préambule](#-i-préambule)
- [🏠 II. Menu principal](#-ii-menu-principal)
- [🏗️ III. Mode Agencement](#️-iii-mode-agencement)
  - [A. Menus](#a-menus)
    - [Taille](#taille)
    - [Grille](#grille)
    - [Murs](#murs)
    - [Éléments](#éléments)
  - [B. Éditions des éléments insérés](#b-éditions-des-éléments-insérés)
- [🎯 IV. Mode placement](#-iv-mode-placement)
  - [A. Ajout d'élèves](#a-ajout-délèves)
    - [Méthode 1 : Via une liste EcoleDirecte](#méthode-1--via-une-liste-ecoledirecte)
    - [Méthode 2 : Ajout manuellement](#méthode-2--ajout-manuellement)
    - [Méthode 3 : Via une liste exportée](#méthode-3--via-une-liste-exportée)
  - [B. Liste d'élèves](#b-liste-délèves)
    - [Ajout d'un élève sur le plan](#ajout-dun-élève-sur-le-plan)
    - [Modification et suppression d'un élève](#modification-et-suppression-dun-élève)
    - [Affichage de la classe sur le plan](#affichage-de-la-classe-sur-le-plan)
    - [Sauvegarde et vidage de la liste](#sauvegarde-et-vidage-de-la-liste)
- [⌨️ V. Contrôles utiles](#️-v-contrôles-utiles)
  - [Déplacement sur le plan](#déplacement-sur-le-plan)
  - [Sélection d'éléments](#sélection-déléments)
  - [Redimensionner en gardant les proportions](#redimensionner-en-gardant-les-proportions)
  - [Copie et collage](#copie-et-collage)
  - [Supprimer une sélection](#supprimer-une-sélection)
  - [Annuler une modification](#annuler-une-modification)
  - [Superposition d'éléments](#superposition-déléments)
  - [Saut de ligne dans les Textes](#saut-de-ligne-dans-les-textes)
- [⚙️ VI - Spécifications techniques du projet](#️-vi---spécifications-techniques-du-projet)
  - [A. Langages utilisés](#a-langages-utilisés)
  - [B. Librairies utilisées](#b-librairies-utilisées)
    - [KonvaJS](#konvajs)
    - [XLSX](#xlsx)
  - [C. Sécurité](#c-sécurité)
  - [D. Limitations](#d-limitations)

</details>

# 📖 I. Préambule

  <a href="https://timeothms.github.io/PlanDeClasse/">
    <img src="https://img.shields.io/badge/Visiter%20le%20site-415A77?style=for-the-badge" alt="Visiter le site" />
  </a>

Ce projet web a pour objectif de fournir un outil permettant l'édition de **salles de classes**, au travers de l'ajout de divers éléments (tables, murs, tableau...). Ce projet permet également aux professeurs d'importer une liste d'élèves à partir d'EcoleDirecte (ou via ajout manuel) permettant d'assigner des places aux différents élèves. <br>
Un exemple de salle de classe peut être téléchargé <a href="https://raw.githubusercontent.com/TimeoThms/PlanDeClasse/refs/heads/main/ressources/Exemple_DATA.json" download="fichier.txt" target="_blank">ICI</a>

<details>
    <summary><strong>🖼️ Image du fichier d'exemple</strong></summary>
    <img src="https://i.postimg.cc/6p2fgyZJ/Exemple-IMG-1.png" alt="Image du fichier d'exemple" width="600px" />
</details>
<br>

# 🏠 II. Menu principal

Le menu principal vous permet de :

-   **Changer le nom du projet**.
-   **Importer ou exporter** un projet (`Nom_DATA.json`).
-   **Télécharger une image** du plan actuel.
-   **Réinitialiser** pour repartir de zéro.
-   **Changer de mode** (voir plus bas pour le détail).

<details>
    <summary><strong>🖼️ Menu principal</strong></summary>
    <img src="https://i.postimg.cc/W3ycdRS9/image.png" alt="Menu principal" width="300px" />
</details>

<br>

# 🏗️ III. Mode Agencement

Le mode agencement permet de modifier la salle de classe : déplacement des éléments, modification de la taille, ajout de murs...

## A. Menus

### Taille

Choix des dimensions de la salle de classe au format Largeur x Longueur, en mètres.

<details>
    <summary><strong>🖼️ Onglet Taille</strong></summary>
    <img src="https://i.postimg.cc/zvswcwYk/image.png" alt="Onglet taille" width="300"/> <br>
</details>

---

### Grille

Permet d'afficher ou de cacher la grille ainsi que de changer sa résolution. La grille possède 4 résolutions différentes : 5 cm, 10cm, 20cm et 40cm (équivalents à un carreau de la grille). La grille permet aux éléments et aux murs de s'aligner sur les points de la grille. Cacher la grille permet d'empêcher cet effet.

<details>
    <summary><strong>🖼️ Onglet Grille</strong></summary>
    <img src="https://i.postimg.cc/bNFMTW5x/image.png" alt="Onglet grille" width="300"/> <br>
</details>

---

### Murs

Permet l'édition des murs de la salle de classe. Pour créer les murs, appuyer un première fois sur le bouton `Créer`. Une fois en mode édition, cliquer sur un point du plan de classe pour ajouter un point au mur. Une fois terminé, cliquer de nouveau sur le premier point pour fermer le mur.
Le bouton `Supprimer` permet de supprimer les murs créés.

<details>
    <summary><strong>🖼️ Onglet Murs</strong></summary>
    <img src="https://i.postimg.cc/FH6VwQbZ/image.png" alt="Onglet murs" width="300"/> <br>
</details>

---

### Éléments

Ce menu est probablement le plus important. Il permet l'ajout d'éléments dans la salle auxquels vous pouvez modifier différents attributs. La modification des attributs dans ce menu modifieront les attributs pour tous les éléments de ce type ajoutés avec le bouton `Ajouter`. Une fois les éléments ajoutés, vous pourrez toujours modifier leurs attributs individuellement (voir plus bas).<br>
Il y a 9 éléments différents :

-   Table
-   Table double
-   Porte
-   Bureau professeur
-   Texte
-   Stockage
-   Tableau
-   Rectangle
-   Cercle

<details>
    <summary><strong>🖼️ Onglet Éléments (table)</strong></summary>
    <img src="https://i.postimg.cc/3JNTZgtv/image.png" alt="Onglet éléments (table)" width="300"/> <br>
</details>

## B. Éditions des éléments insérés

Vous pouvez modifier un élément inséré grâce à l'**Éditeur**. En sélectionnant un seul élément, un menu va s'ouvrir en haut à droite de l'écran, permettant de modifier les attributs de l'élément sélectionné. Pour les éléments redimensionnables, la taille est également affichée.

<details>
  <summary><strong>🖼️ Éditeur d'élément. Exemple pour l'élément "Rectangle"</strong></summary>
    <img src="https://i.postimg.cc/Xvh6L0KF/image.png" alt="Éditeur d'élément" width="300"/> <br>
</details>

<br>

# 🎯 IV. Mode placement

Le mode placement permet à partir d'une liste d'élèves, de les placer sur les différentes tables présentes dans le plan.

> [!WARNING]
> Pour sauvegarder les changements sur le placement des élèves, il faut sauvegarder de la même manière qu'en mode Agencement, en exportant le fichier projet avec le bouton `Exporter`.

## A. Ajout d'élèves

### Méthode 1 : Via une liste EcoleDirecte

> Sur EcoleDirecte, vous pouvez télécharger une liste de la classe au format Excel (.xlsx). Vous pouvez ensuite importer ce document via le bouton `Importer` pour ajouter automatiquement les élèves à la liste. La liste devrait comporter l'entête "**Nom**" dans la case A7 et l'entête "**Classe** dans une des colonnes de la ligne 7.

### Méthode 2 : Ajout manuellement

> Vous pouvez ajouter un élève manuellement en entrant son **nom** son **prénom** et sa **classe** puis en cliquant sur `Ajouter`

### Méthode 3 : Via une liste exportée

> Dans le menu `Liste des élèves` vous avez la possibilité d'exporter la liste potentiellement modifiée, ou avec des ajouts manuels d'élèves au format CSV, que vous pourrez ensuite importer via le bouton `Importer`.

<details>
    <summary><strong>🖼️ Onglet Ajouter des élèves</strong></summary>
    <img src="https://i.postimg.cc/mrDgqtNc/image.png" alt="Onglet ajouter des élèves" width="300"/> <br>
</details>

<br>

## B. Liste d'élèves

Dans ce menu, vous avez accès à la liste des élèves ajoutés.

### Ajout d'un élève sur le plan

Pour ajouter un élève au plan de classe, sélectionnez le en cliquant dessus. Cliquez ensuite sur une table pour y placer son nom.
Un `Clic Droit` sur une table permet de supprimer le nom présent à cette place.

---

### Modification et suppression d'un élève

-   En cliquant sur l'icône "Crayon", un menu s'ouvrira permettant de modifier les informations de l'élève. <br>
-   En cliquant sur l'icône "Poubelle", l'élève correspondant sera supprimé.

---

### Affichage de la classe sur le plan

Vous pouvez choisir d'afficher ou non la classe d'un élève sur la table où il se trouve. Pour cela, cocher simplement le bouton `Afficher la classe sur le plan`

> [!WARNING]
> Cocher ou décocher le bouton ne modifiera rien pour les élèves déjà placé sur le plan, les changements seront effectifs uniquement pour les élèves ajoutés après le changement.

### Sauvegarde et vidage de la liste

Les boutons `Sauvegarder` et `Vider` permettent respectivement d'exporter la liste au format CSV et de vider la liste actuelle.

<details>
    <summary><strong>🖼️ Onglet Liste d'élèves</strong></summary>
    <img src="https://i.postimg.cc/qB6n7M6V/image.png" alt="Onglet liste d'élèves" width="300"/> <br>
</details>

<br>

# ⌨️ V. Contrôles utiles

## Déplacement sur le plan

Pour zoomer ou dézoomer dans le plan, utilisez la molette. <br>
Pour vous déplacer dans le plan, maintenez la touche `CTRL` et faites glisser le plan. Vous pouvez également vous déplacer avec les flèches directionnelles en maintenant la touche `CTRL`, ou encore utiliser les flèches présentes en bas à droite de l'écran.

## Sélection d'éléments

Pour sélectionner plusieurs éléments à la fois, maintenez la touche `CTRL` enfoncée en cliquant sur les éléments à sélectionner, ou alors utilisez la sélection en glissant la souris.
Pour désélectionner un élément d'une sélection de groupe, il suffit de cliquer dessus en maintenant la touche `CTRL`.

## Redimensionner en gardant les proportions

Pour redimensionner un élément en conservant ses proportions, il suffit de maintenir la touche `SHIFT` (`⇧`) enfoncée tout en redimensionnant dans un coin de la forme.

## Copie et collage

Pour dupliquer une sélection d'éléments, copier cette sélection avec le raccourci clavier `CTRL+C` et collez la avec le raccourci clavier `CTRL+V`. Il est également possible de copier coller en utilisant le menu accessible avec un `Clic Droit` sur l'élément.

## Supprimer une sélection

Pour supprimer une sélection, il suffit d'appuyer sur la touche `Suppr` ou la touche `⌫`. Vous pouvez aussi supprimer la sélection en faisant un `Clic Droit` puis en cliquant sur `Supprimer`

## Annuler une modification

Pour annuler une modification, utilisez le raccourci clavier `CTRL+Z`. Pour rétablir une modification annulée, utilisez `CTRL+Y`.

## Superposition d'éléments

Si plusieurs éléments sont superposés, par défaut, lorsqu'un élément est sélectionné, il se place au dessus de tous les autres éléments. Si vous souhaitez sélectionner un élément sans qu'il passe par dessus les autres éléments, maintenez la touche `Q` pendant la sélection.

## Saut de ligne dans les Textes

Pour sauter des lignes dans les textes présents sur les différents éléments, vous pouvez utiliser le caractère `%`. Ainsi, le texte `Plan%De%Classe` sera affiché comme ceci :

> &nbsp;&nbsp;Plan  
> &nbsp;&nbsp;&nbsp;De  
> &nbsp;Classe

<br><br>

# ⚙️ VI - Spécifications techniques du projet

## A. Langages utilisés

Ce projet est un projet 100% frontend, tournant entièrement dans le navigateur du client.
Les langages utilisés sont donc **HTML**, **CSS**, et **JavaScript**

## B. Librairies utilisées

### KonvaJS

-   Pour l'affichage, l'édition, la transformation des éléments, la bibliothèque JavaScript Konva a été utilisée

### XLSX

-   Pour les fichier Excel XLSX et les fichier CSV, la librairie XLSX a été utilisée afin de faciliter le développement.

## C. Sécurité

Toutes les données restent localement dans le navigateur du client. Aucune donnée n'est transmise à un serveur externe.

## D. Limitations

-   Le projet étant 100% côté client, les très grands plans de classe peuvent légèrement ralentir l'affichage selon les performances du navigateur.
-   Aucune sauvegarde serveur : toutes les données sont locales (à exporter manuellement).
