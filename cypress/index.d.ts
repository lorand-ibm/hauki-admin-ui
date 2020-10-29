/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitTargetPageAsUnauthenticatedUser(id: string): void;
    visitTargetPageAsAuthenticatedUser(id: string): void;
  }
}
