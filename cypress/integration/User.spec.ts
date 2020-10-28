/// <reference types="cypress" />
/// <reference types="node"/>
import querystring from 'querystring';

const authObject = {
  username: 'admin@hel.fi',
  organization: 'dc7d39db-b35a-4612-a921-1b7b24b0baa3',
  resource: 'tprek:0010',
  created_at: '2020-10-14',
  valid_until: '2020-10-14',
  signature: '50A2A31D50F776D23A87F06708934C43CC58B3E44F851018675266393A457828',
};

describe('Unauthenticated user', () => {
  beforeEach(() => {
    cy.visitTargetPage(Cypress.env('target-id'), false);
  });

  it('Does not have username in the header', () => {
    cy.get('header').first().should('contain', 'Kirjaudu');
  });
});

describe('Authenticated user', () => {
  beforeEach(() => {
    cy.visitTargetPage(Cypress.env('target-id'));
  });

  it('Has username in header', () => {
    cy.get('header').first().should('not.contain', 'Kirjaudu');
    cy.get('header').first().should('contain', authObject.username);
  });
});
