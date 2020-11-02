/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitResourcePageAsUnauthenticatedUser(id: string): void;
    visitResourcePageAsAuthenticatedUser(id: string): void;
  }
}
