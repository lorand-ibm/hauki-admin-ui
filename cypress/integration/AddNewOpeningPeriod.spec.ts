/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new opening period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('User successfully adds a new opening period', () => {
    // Begin from resource page
    cy.get('[data-test=resource-opening-periods-list] ', {
      timeout: 5000,
    }).should('be.visible');

    // Go to add new opening period page by pressing the header button
    cy.get('[data-cy=add-new-opening-period-button]').click();

    // Check that add new opening period form is visible in the new page
    cy.get('[data-cy=add-new-opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    // Start filling the form, first is opening period title
    cy.get('[data-cy=openingPeriodTitle]').type(
      `e2e-test Testijakson otsikko ${new Date().toJSON()}`
    );

    // Then select the begin and end date for the period. For the test we wish to select
    // current date and the first date of the next month
    cy.get('[data-cy=openingPeriodBeginDate]').click();
    cy.get('button.dayToday').click();
    cy.get('[data-cy=openingPeriodEndDate]').click();
    cy.get('[data-cy=show-next-month-button]').click();
    cy.get('button.dayButton').contains('01').click();
    cy.get('[data-cy=publish-new-opening-period-button]').click();

    // On successful creation a success notification should appear. Let's test that this is the case
    cy.get('[data-testid=opening-period-added-successfully-notification]', {
      timeout: 10000,
    }).should('be.visible');
  });
});
