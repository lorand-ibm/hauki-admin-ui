/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsUnauthenticatedUser(Cypress.env('resource-id'));
  });

  it('Is redirected to front page', () => {
    cy.location('pathname').should('equal', '/');
    cy.get('header').first().should('contain', 'Kirjaudu');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('should logout', () => {
    cy.get('header')
      .find('button')
      .contains('admin@hel.fi')
      .click({ force: true });
    cy.get('header').first().find('a').contains('Kirjaudu ulos').click();
    cy.location().its('href').should('eq', '/');
  });
});
