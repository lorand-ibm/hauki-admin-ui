/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitTargetPageAsUnauthenticatedUser(Cypress.env('target-id'));
  });

  it('Does not have username in the header', () => {
    cy.get('header').first().should('contain', 'Kirjaudu');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitTargetPageAsAuthenticatedUser(Cypress.env('target-id'));
  });

  it('Has username in header', () => {
    cy.get('[data-test=target-info]', { timeout: 5000 }).should('be.visible');
    cy.get('header').first().should('not.contain', 'Kirjaudu');
    cy.get('header').first().should('contain', 'admin@hel.fi');
  });
});
