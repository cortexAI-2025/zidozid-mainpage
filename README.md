# zidozid-mainpage

Site web **zidozid.fr** : la page d'accueil de Zidozid, la vente à emporter sans commission.
L'application (iOS, Android, web) est dans un autre dépôt : `cortexAI-2025/zidozid`.

Le site est en HTML et CSS seulement : pas de JavaScript, pas de cookie, aucune ressource externe (polices système).

| Fichier | Contenu |
|---|---|
| `index.html` | Page d'accueil |
| `mentions-legales/index.html` | Mentions légales |
| `confidentialite/index.html` | Politique de confidentialité |
| `404.html` | Page introuvable |
| `style.css` | Mise en forme (couleurs de la marque, fond blanc permanent) |
| `img/`, `favicon.png`, `apple-touch-icon.png` | Logo et icônes |
| `og-image.png` | Image affichée quand on partage le lien (WhatsApp, Facebook…) |
| `CNAME` | Domaine personnalisé pour GitHub Pages |

Les boutons ouvrent un e-mail prérempli vers `contact@zidozid.fr`.

## Modifier le site

- Modifiez les fichiers puis poussez sur `main` : le site est republié automatiquement en une minute environ.
- Pour l'essayer en local : `npx serve .`
- **Avant la mise en ligne**, remplacez les éléments entre crochets dans les pages légales (raison sociale, SIREN, adresse, directeur de la publication).

## Mise en ligne (une seule fois)

1. **GitHub** → Settings → Pages :
   - Source : « GitHub Actions » ;
   - lancez le workflow « Publier zidozid.fr » (onglet Actions → Run workflow) ;
   - Custom domain : `zidozid.fr` ;
   - une fois le certificat émis (quelques minutes à 24 h), cochez « Enforce HTTPS ».
2. **Recommandé** : vérifiez le domaine dans les paramètres de votre compte GitHub (Settings → Pages → Add a domain). GitHub demande d'ajouter un enregistrement TXT chez IONOS. Cela empêche un autre compte GitHub d'utiliser zidozid.fr.
3. **IONOS** → Domaines & SSL → zidozid.fr → DNS. Supprimez les enregistrements A, AAAA et CNAME existants pour `@` et `www` (page de parking IONOS), puis ajoutez ceux-ci :

| Type | Nom d'hôte | Valeur |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | cortexai-2025.github.io |

Ne touchez pas aux enregistrements MX, qui servent à l'e-mail.

4. **IONOS** : créez la boîte mail (ou une redirection) `contact@zidozid.fr`.

**Vérifier** : `dig +short zidozid.fr` renvoie les 4 adresses GitHub, https://zidozid.fr affiche la page, et https://www.zidozid.fr y redirige.
