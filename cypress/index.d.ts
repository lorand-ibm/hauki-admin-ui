/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitTargetPage(id: string, isAuthenticated?: boolean): void;
  }
}
