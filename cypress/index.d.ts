/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitResourcePageAsUnauthenticatedUser(id: string): void;
    visitResourcePageAsAuthenticatedUser(id: string): void;
    createDatePeriod: ({
      name,
      startDate,
      endDate,
      resourceId,
    }: {
      name: string;
      startDate: Date;
      endDate: Date;
      resourceId: string;
    }) => Chainable;
  }
}
