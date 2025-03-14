import CDItem from '../../src/components/CDItem';
import { mount } from 'cypress/react';

describe('CDItem Component', () => {
  const cd = { id: 1, title: 'Test Album', artist: 'Test Artist', year: '2023' };

  it('devrait afficher les détails du CD', () => {
    mount(<CDItem cd={cd} onDelete={() => {}} />);
    
    cy.contains(`${cd.title} - ${cd.artist} (${cd.year})`).should('be.visible');
    cy.get('.delete-btn').should('contain', '🗑 Supprimer');
  });

  it('devrait appeler onDelete au clic sur le bouton supprimer', () => {
    const onDelete = cy.stub().as('onDeleteStub');
    mount(<CDItem cd={cd} onDelete={onDelete} />);
    
    cy.get('.delete-btn').click();
    cy.get('@onDeleteStub').should('have.been.calledWith', cd.id);
  });
});