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

## Réalisations

- Les données des projets sont dans `lib/projects.ts`, affichées dans une seule section « Réalisations » (les 4 premières sur l'accueil).
- Les visuels sont dans `public/projects/` : `<slug>-desktop.webp` (page qui défile au survol), `<slug>-mobile.webp` et `<slug>-cover.webp` (bandeau animé).
- Les sites de démonstration sont dans `Documents/Realisations/<slug>` (un projet Next.js chacun, avec un mode `?capture=1` pour les captures).
- Pour refaire une capture : lancer le site (`npm run build` puis `npx next start -p <port>`), puis `node Documents/Realisations/_tools/capture.mjs <slug>=http://localhost:<port>/?capture=1`, et relire les PNG indiqués avant publication.
- Ne jamais publier de maquette réalisée pour un vrai prospect sans son accord écrit.

## Contenu à finaliser avant publication

- Ajouter un portrait : déposer la photo dans `public/` (par exemple `public/tobias.jpg`) puis renseigner `photo` dans `lib/site.ts`. Les initiales s'affichent en attendant.
- Vérifier que `RESEND_API_KEY` et `CONTACT_FROM_EMAIL` sont bien configurés sur Vercel, puis faire un envoi réel.
- Renseigner `NEXT_PUBLIC_SITE_URL` avec l'URL finale.
- Compléter les mentions légales (`app/mentions-legales/page.tsx`) avec le statut et le SIRET dès l'immatriculation.
- Remplacer l'adresse Gmail par une adresse professionnelle quand un nom de domaine sera disponible (`lib/site.ts`).
