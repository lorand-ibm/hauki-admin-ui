/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsUnauthenticatedUser(Cypress.env('resource-id'));
  });

  it('Is redirected to front page', () => {
    cy.location('pathname').should('not.include', Cypress.env('resource-id'));
    cy.get('header').first().should('contain', 'Kirjaudu');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('Has username in header', () => {
    cy.get('[data-test=resource-info]', { timeout: 5000 }).should('be.visible');
    cy.get('header').first().should('not.contain', 'Kirjaudu');
    cy.get('header').first().should('contain', 'admin@hel.fi');
  });
});
