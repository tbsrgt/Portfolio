# Portfolio de Tobias Ringot

Site Next.js présentant les offres de refonte, création de sites vitrines, landing pages et maintenance.

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`. Le script de développement utilise Webpack : Turbopack provoquait une erreur locale lors de l'audit de septembre 2026.

## Configurer le formulaire

Le formulaire envoie les demandes à `tobiasringot13@gmail.com` via l'API Resend. Il ne transmet rien tant que le service n'est pas configuré : un échec visible et un lien e-mail de secours sont affichés.

1. Créer une clé API Resend et vérifier un domaine d'envoi.
2. Copier `.env.example` vers `.env.local` et renseigner `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` et `NEXT_PUBLIC_SITE_URL`.
3. Ajouter les mêmes variables dans l'hébergement, puis tester un envoi réel vers l'adresse de réception.

Ne jamais commiter la clé API. La route `/api/contact` valide les champs, limite la taille du message et contient un champ piège anti-bot. Pour un trafic important, ajouter une protection anti-spam et une limitation de débit côté serveur.

## Contenu à finaliser avant publication

- Remplacer les deux témoignages explicitement étiquetés comme fictifs par de vrais avis autorisés, ou retirer la section.
- Remplacer la carte « Projet à venir » et son texte Lorem ipsum par un projet réel, ou la retirer.
- Compléter les études de cas avec ton rôle précis, des captures et des résultats seulement s'ils sont vérifiables.
- Renseigner le domaine final dans `NEXT_PUBLIC_SITE_URL` pour les URL canoniques, le sitemap et les aperçus de partage.
- Ajouter les informations légales et une politique de confidentialité adaptées à l'exploitation du formulaire avant publication.

Les visuels des cartes Parentez² et Mistral TP proviennent de leurs propres images de partage. Aucun résultat commercial chiffré ni avis client n'est revendiqué.
