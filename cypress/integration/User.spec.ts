/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsUnauthenticatedUser(Cypress.env('resourceId'));
  });

  it('Is redirected to unauthenticated page', () => {
    cy.location('pathname').should('equal', '/unauthenticated');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
  });

  it('should logout permanently', () => {
    cy.location()
      .its('href')
      .then((resourcePageUrl) => {
        cy.get('header')
          .find('button')
          .contains(Cypress.env('haukiUser'))
          .click({ force: true });
        cy.get('header')
          .first()
          .find('a')
          .contains('Kirjaudu ulos')
          .click({ force: true });
        // have to wait here because cypress does not work optimal: https://github.com/cypress-io/cypress/issues/7306
        cy.wait(2000);
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/');

        // Try to visit the resource page again
        cy.visit(resourcePageUrl);
        cy.get('header').first().should('not.contain', 'Kirjaudu ulos');
        cy.location('pathname').should('equal', '/unauthenticated');
      });
  });
});
