# Assistant « Telo » — chatbot et voicebot de Telo Cargo Services

Assistant conversationnel du site, en **français, anglais et malgache** : il renseigne sur les services
(fret maritime et aérien, dédouanement, MAD, agences, horaires, documents) et transmet par e-mail à
l'équipe les demandes de devis, de suivi ou d'assistance, après confirmation du client.

## Fichiers

| Fichier | Rôle |
|---|---|
| `widget.js` | Bulle de discussion chargée sur toutes les pages (texte, micro, lecture vocale, FR/EN/MG) |
| `chat.php` | Relais serveur vers l'API Claude d'Anthropic (la clé API reste sur le serveur) |
| `knowledge.md` | Base de connaissances : texte des pages françaises du site |
| `tcs-assistant-config.example.php` | Modèle du fichier de configuration (clé API, modèle, limites) |

## Mise en service (une seule fois)

1. Créez une clé API sur <https://console.anthropic.com> (rubrique *API Keys*) et ajoutez un moyen de paiement.
   Fixez une limite de dépense mensuelle dans *Limits*.
2. Copiez `tcs-assistant-config.example.php` sous le nom **`tcs-assistant-config.php`**, collez-y la clé.
3. Déposez ce fichier par FTP à la **racine de l'hébergement** (`/home/telocargqv/`), à côté du dossier `www`,
   **jamais dans `www` ni sur GitHub**.
4. Rechargez le site : la bulle « Discuter avec l'assistant » apparaît. Tant que la clé n'est pas en place,
   la bulle reste masquée.

## Mettre à jour les connaissances

Quand le contenu du site change, régénérez `knowledge.md` à partir des pages françaises (ou modifiez-le à la main),
puis envoyez-le sur GitHub : le site est mis à jour automatiquement.

## Sécurité et coûts

- Limite par visiteur : 40 messages / 15 min et 300 / jour (modifiable dans le fichier de configuration).
- Seules les requêtes venant de telocargoservices.com sont acceptées.
- Coût indicatif avec `claude-sonnet-4-5` : environ 1 centime d'euro par message (base de connaissances mise en cache).
  `claude-haiku-4-5` divise ce coût par 3 environ.

## Voix

- Dictée vocale : français et anglais (Chrome, Edge, Safari). Les navigateurs ne reconnaissent pas encore le malgache
  à l'oral : l'assistant invite alors à écrire.
- Lecture des réponses : bouton haut-parleur ; en malgache seulement si l'appareil dispose d'une voix malgache.
