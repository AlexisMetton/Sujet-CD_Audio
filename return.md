# Rapport d'Implémentation des Tests pour l'Application de Gestion de CD Audio

Ce document décrit en détail l'ensemble des actions réalisées, ainsi que la méthodologie utilisée pour vérifier le bon fonctionnement de l'application. Des captures d'écran ont été intégrées dans le rapport afin de prouver visuellement que tous les tests ont fonctionné correctement.

## 1. Tests Unitaires

### Objectif
- **Vérifier le comportement de chaque composant** de l’application de manière isolée.
- **Assurer la robustesse** des fonctions critiques utilisées dans l'application.

### Réalisations
- **Choix des outils** : J'ai utilisé Jest pour écrire et exécuter les tests unitaires.


### Preuves
- **captures d'écran** : test_jest.png

## 2. Tests d’Intégration

### Objectif
- **Valider l'interaction** entre l'API, la base de données et le frontend.
- Assurer que les **composants interconnectés fonctionnent correctement ensemble**.

### Réalisations
- **Choix des outils** : J'ai utilisé Jest pour écrire et exécuter les tests d'intégration.
- **Environnement isolé** :
  - Utilisation de Testcontainers pour créer un environnement PostgreSQL isolé pendant les tests d’intégration.

### Preuves
- **Captures d'écran** : test_jest.png

## 3. Tests End-to-End (E2E)

### Objectif
- **Simuler l'expérience utilisateur** complète de l'application, depuis l'ajout d'un CD jusqu'à sa suppression.

### Réalisations
- **Outils utilisés** : Cypress
- **Scénarios de test** :
  - **Ajout d’un CD** : Vérification de la création d'un nouveau CD dans l'application.
  - **Affichage des CD disponibles** : Confirmation que les CDs ajoutés s'affichent correctement sur l'interface utilisateur.
  - **Suppression d’un CD** : Validation de la suppression d’un CD et mise à jour de la liste affichée.

### Preuves
- **Captures d'écran** test_end_to_end.png

## 4. Tests Complémentaires et Points Supplémentaires

### Réalisations Optionnelles
- **Tests de Composants** : Création de tests spécifiques pour vérifier le comportement des composants React.
- **Tests SonarQube** : Mise en place de l'analyse de code avec SonarQube pour identifier et corriger les problèmes de qualité du code.
- **Test DockerScout** : Exécution de tests avec DockerScout pour proposer des améliorations dans la gestion des conteneurs. Les tests ont montrés que les dépendances utilisées sur l'image docker était à jour et aucun mise à jour est nécessaire
- **Test Owasp Zap Basique** : Réalisation de tests de sécurité avec Owasp Zap pour détecter des vulnérabilités potentielles.

### Preuves
- **Captures d'écran** : test_component_CDItem.png, test_component_addCD.png, docker_scout_image_frontend_1.png, docker_scout_image_frontend_2.png, docker_scout_image_backend_1.png, docker_scout_image_backend_2.png, zap_scan_front.png, SonarCloud.png


## 5. Marche à Suivre pour Lancer les Tests Jest et Cypress
### Lancer les Tests Jest (Unitaires et d'Intégration)
1. **Installation des dépendances**  
   Assurez-vous d'avoir installé toutes les dépendances nécessaires en exécutant dans `/serveur` :
   ```bash
   npm install
   ```
2. **Build le docker dev à la racine du projet**  
   ```bash
   docker compose -f docker-compose.dev.yml up -d --build
   ```
3. **Lancement des tests**  
   ```bash
   npm run test
   ```

### Lancer les Tests Cypress (End to end et de composants)
1. **Installation des dépendances**  
   Assurez-vous d'avoir installé toutes les dépendances nécessaires en exécutant dans `/client` :
   ```bash
   npm install
   ```
2. **Build le docker dev à la racine du projet**  
   ```bash
   docker compose -f docker-compose.dev.yml up -d --build
   ```
3. **Lancer le serveur back dans le dossier `/serveur`**
   ```bash
   npm run dev
   ```
4. **Lancer le serveur front dans le dossier `/client`**
   ```bash
   npm run dev
   ```
5. **Lancer les tests End to end dans le dossier `client`**  
   ```bash
   npx cypress run
   ```
6. **Lancer les tests Components dans le dossier `client`**  
   ```bash
   npx cypress run --component
   ```