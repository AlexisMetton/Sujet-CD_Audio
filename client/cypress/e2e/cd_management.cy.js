// cypress/e2e/cdManagement.cy.js

describe('Gestion des CD Audio', () => {
  // Avant chaque test, on visite la page d'accueil
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('devrait afficher la liste des CDs disponibles', () => {
    // Vérifie que le titre de la liste existe
    cy.contains('h2', 'Liste des CD 🎵').should('be.visible');
    
    // Vérifie que la liste existe (même si vide au départ)
    cy.get('ul').should('exist');
  });

  it('devrait permettre d’ajouter un nouveau CD', () => {
    // Données de test
    const cdData = {
      title: 'Test Album',
      artist: 'Test Artist',
      year: '2023'
    };

    // Interagir avec le formulaire
    cy.get('input[name="title"]').type(cdData.title);
    cy.get('input[name="artist"]').type(cdData.artist);
    cy.get('input[name="year"]').type(cdData.year);
    
    // Soumettre le formulaire
    cy.get('form').submit();

    // Vérifier que le CD apparaît dans la liste
    cy.contains(`${cdData.title} - ${cdData.artist} (${cdData.year})`)
      .should('be.visible');
  });

  it('devrait permettre de supprimer un CD', () => {
    // D'abord, ajouter un CD pour pouvoir le supprimer
    const cdData = {
      title: 'Album à Supprimer',
      artist: 'Artiste Test',
      year: '2024'
    };

    cy.get('input[name="title"]').type(cdData.title);
    cy.get('input[name="artist"]').type(cdData.artist);
    cy.get('input[name="year"]').type(cdData.year);
    cy.get('form').submit();

    // Vérifier que le CD est bien ajouté
    cy.contains(`${cdData.title} - ${cdData.artist} (${cdData.year})`)
      .should('be.visible');

    // Cliquer sur le bouton supprimer
    cy.contains(`${cdData.title} - ${cdData.artist} (${cdData.year})`)
      .parent()
      .find('.delete-btn')
      .click();

    // Vérifier que le CD n'apparaît plus
    cy.contains(`${cdData.title} - ${cdData.artist} (${cdData.year})`)
      .should('not.exist');
  });

  it('devrait gérer le cas où aucun CD n’est disponible', () => {
    // Intercepter la requête GET pour simuler une liste vide
    cy.intercept('GET', 'http://localhost:5005/api/cds', {
      statusCode: 200,
      body: []
    }).as('getCDs');

    // Recharger la page
    cy.reload();

    // Vérifier le message "Aucun CD disponible"
    cy.contains('Aucun CD disponible').should('be.visible');
  });
});