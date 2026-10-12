# Zidozid Maroc — zidozid.fr

Site vitrine statique destiné au Maroc, reconstruit à partir des parcours de l’application `cortexAI-2025/zidozid`. Le domaine reste `zidozid.fr`, enregistré chez IONOS et hébergé sur GitHub Pages.

## Contenu

- Accueil responsive : identité Zidozid rouge `#E1140A`, orange `#F07800`, jaune `#FFC400`, fond blanc et logo existant.
- Trois profils : client, restaurant, livreur indépendant.
- À emporter, livraison, commandes, menu et fidélité (9 menus éligibles achetés chez un restaurant, le 10e offert).
- `/demo/` : simulation locale d’une commande à emporter ou livrée, avec passage entre les trois espaces. Les montants et établissements sont fictifs, en MAD/DH. `/demo.html` conserve l’ancien lien et renvoie vers la démo.
- `/diagnostic.html` : calcul des commissions en DH ; aucune économie nette promise.
- Contact : préparation d’un e-mail vers `contact@aiworkpay.fr`. Aucun envoi, compte ou abonnement automatique.
- Mentions légales, confidentialité, 404, sitemap, robots, données structurées et `llms.txt`.

## État de l’offre Maroc

L’application source comprend encore des références françaises (EUR, SIRET, intégration de paiement). Elles ne prouvent pas que la localisation Maroc est déployée. Le site ne reprend pas ces tarifs, ne les convertit pas et n’annonce aucun moyen de paiement local comme opérationnel. Les tarifs Maroc, conditions d’essai, documents professionnels et moyens de paiement doivent être définis avant le lancement commercial.

Le site ne prend aucune commande réelle. Aucun lien vers une application en production ou un store n’a été inventé. Le dépôt de l’application et les dépôts ZEROO ne sont pas modifiés.

## Architecture

HTML, CSS et JavaScript natifs. Aucun build, aucune dépendance en production. Images locales ; aucune police externe, aucun cookie, aucun stockage local, aucun analytics. La photographie culinaire reprend l’image Unsplash déjà utilisée par le site précédent, téléchargée localement : `photo-1568901346375-23c9450c58cd`. Les visuels sont illustratifs.

Les pages utilisent `style.css` et `app.js` avec une version dans l’URL pour invalider le cache. Pour une future modification, incrémenter cette version sur toutes les pages. Les textes de la FAQ et les données structurées doivent rester cohérents.

## Publication

Le workflow `.github/workflows/deploy.yml` publie le contenu sur GitHub Pages à chaque push sur `main`. Il exclut les fichiers cachés et ce README. Le fichier `CNAME` contient `zidozid.fr`. La source GitHub Pages doit rester **GitHub Actions**.

La configuration DNS IONOS existante est à préserver : A vers les IP de GitHub Pages, `www` vers `cortexai-2025.github.io`. Aucun changement DNS n’est nécessaire pour cette refonte si le domaine pointe déjà vers ce dépôt.

## Vérification

- Syntaxe : `node --check app.js` et `git diff --check`.
- Vérifier les liens et fragments locaux, les données JSON-LD et l’absence d’anciennes références ZEROO dans les pages.
- Parcours démo : panier, retrait, confirmation du livreur, préparation restaurant, collecte, livraison, réinitialisation et changement de profils.
- Formulaires : le site ouvre seulement la messagerie de l’utilisateur. Les données du formulaire ne sont pas envoyées par le site.

Référence de l’audit fonctionnel : application `zidozid`, branche `main`, commit `be2977900a9f8ea9bc28d68778adcb9abac81066` (12 octobre 2026). Fonctions et identité vérifiées dans le README, les traductions et le thème de l’application.

Vérification de cette refonte : scénarios DOM exécutés avec Linkedom (panier, retrait, livraison, remise, réinitialisation, profils, calculs, formulaire), contrôle des liens/ancres des 7 pages, JSON-LD, sitemap et syntaxe JavaScript. Vérification visuelle dans un navigateur non disponible dans l’environnement de publication.
