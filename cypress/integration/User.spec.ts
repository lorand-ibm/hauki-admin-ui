/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsUnauthenticatedUser(Cypress.env('resource-id'));
  });

  it('Is redirected to front page', () => {
    cy.location('pathname').should('equal', '/');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('should logout permanently', () => {
    cy.location()
      .its('href')
      .then((url) => {
        cy.get('header')
          .find('button')
          .contains('admin@hel.fi')
          .click({ force: true });
        cy.get('header').first().find('a').contains('Kirjaudu ulos').click();
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/');
        cy.visit(url);
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/');
      });
  });
});
