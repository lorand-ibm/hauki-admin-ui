/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference path="../index.d.ts" />

describe('Open aukiolot app', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('Contains correct page title', () => {
    cy.contains('Aukiolot');
  });

  it('Has no detectable a11y violations on load', () => {
    cy.injectAxe();
    cy.get('[data-test=resource-info]', { timeout: 5000 }).should('be.visible');
    cy.checkA11y(
      {},
      {
        rules: {
          'duplicate-id-aria': { enabled: false }, // TODO: HAUKI-185
          'duplicate-id': { enabled: false },
        },
      }
    );
  });
});
