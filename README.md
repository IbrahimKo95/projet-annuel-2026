# 🎓 Plateforme LMS (Learning Management System) - Projet Annuel 2026

Bienvenue dans le dépôt du **Projet Annuel 2026**. Ce projet est une plateforme de gestion d'apprentissage (LMS) moderne et performante, conçue pour faciliter la création, la gestion et la vente de formations en ligne.

## 🚀 Vision du Projet
L'objectif est de fournir une expérience fluide tant pour les **instructeurs** (création de contenu, suivi des statistiques) que pour les **apprenants** (apprentissage interactif, quiz, communication directe).

---

## 🛠 Stack Technique

- **Frontend & Backend**: [Nuxt 4](https://nuxt.com/) (Vue.js 3 + Nitro)
- **Base de Données**: [PostgreSQL](https://www.postgresql.org/) avec [Prisma ORM](https://www.prisma.io/)
- **Authentification**: [Nuxt Auth (Sidebase)](https://auth.sidebase.io/) basé sur NextAuth.js
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Conteneurisation**: [Docker](https://www.docker.com/) & Docker Compose

---

## ✨ Fonctionnalités Principales

### 👤 Gestion des Utilisateurs
- Systèmes d'authentification complet (Inscription, Connexion).
- Rôles : Admin, Instructeur, Apprenant.
- Profils utilisateurs personnalisables.

### 📚 Gestion des Cours
- Création de cours avec chapitres (Modules) et leçons.
- Support multi-support : Vidéos, documents, texte riche.
- Système de progression en temps réel pour les élèves.

### 📝 Évaluations & Quiz
- Création de quiz interactifs au sein des modules.
- Notation automatique et suivi des résultats.

### 💬 Communication & Notifications
- Messagerie directe entre instructeurs et apprenants.
- Système de notifications en temps réel pour le suivi des activités.

---

## ⚙️ Installation & Configuration

### Prérequis
- **Node.js**: v20+ 
- **Docker** & **Docker Compose**
- **npm** (ou pnpm/yarn)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd projet-annuel-2026
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Variables d'environnement**
   Copiez le fichier `.env.example` (ou créez un fichier `.env`) :
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"
   AUTH_SECRET="votre_secret_tres_long_et_aleatoire"
   NUXT_AUTH_ORIGIN="http://localhost:3000"
   ```

4. **Lancer la base de données (Docker)**
   ```bash
   docker-compose up -d
   ```

5. **Initialiser la base de données**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

---

## 🏗 Structure du Projet

```text
├── app/          # Frontend (Pages, Composants, Composables)
├── server/       # backend (API Routes, Middlewares, Utils)
├── prisma/       # Schéma de base de données et migrations
├── public/       # Ressources statiques
└── docker/       # Configuration Docker
```

---

## 🤝 Collaboration & Contribution

Pour travailler efficacement en équipe, merci de respecter les règles suivantes :

1. **Branches**: Créez une branche par fonctionnalité (`feat/nom-feature`) ou correction de bug (`fix/nom-bug`).
2. **Commit Messages**: Utilisez les [Conventional Commits](https://www.conventionalcommits.org/) (ex: `feat: add course enrollment`, `fix: header responsive issue`).
3. **Pull Requests**:
   - Assurez-vous que le code passe le type-check (`npx nuxi typecheck`).
   - Décrivez brièvement vos changements dans la PR.
   - Attendez la revue d'au moins un autre membre avant de merger.

---

4. **Partant de la branche develop puis créons nos branches respectives**
   

## 📊 Outils Utiles

- **Prisma Studio**: Pour visualiser les données facilement.
  ```bash
  npx prisma studio
  ```
- **Type Checking**:
  ```bash
  npx nuxi typecheck
  ```

---
