/// <reference types="cypress" />
/// <reference types="node"/>
/// <reference path="../index.d.ts" />
import * as querystring from 'querystring';

// TODO: later on username will come from env variables.
const parseUserName = (queryParams: string): string | undefined => {
  const userNameParameters: string | string[] = querystring.parse(queryParams)
    ?.username;
  const userNameStr: string =
    typeof userNameParameters === 'string'
      ? userNameParameters
      : userNameParameters[0];

  return userNameStr ? decodeURIComponent(userNameStr) : undefined;
};

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
    cy.get('header').first().should('not.contain', 'Kirjaudu');
    cy.get('header')
      .first()
      .should('contain', parseUserName(Cypress.env('AUTH_QUERY_PARAMETERS')));
  });
});
