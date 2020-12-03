/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User edits an opening period', () => {
  const datePeriodTitlePrefix = 'e2e-test muokkaus:aukiolojakso';

  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resource-id'));
  });

  it('User successfully edits an opening period', () => {
    const newTitle = `${datePeriodTitlePrefix} ${new Date().toJSON()}`;

    // Enter in edit page from resource page
    cy.get('[data-test=resource-opening-periods-list]', {
      timeout: 5000,
    })
      .get('[data-test=openingPeriodName]')
      .contains(datePeriodTitlePrefix)
      .parent()
      .find('[data-test="openingPeriodEditLink"]')
      .click();

    // Check that form exists
    cy.get('[data-test=opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    // Start editing by checking the old title
    cy.get('[data-test=openingPeriodTitle]')
      .invoke('val')
      .should('not.be', undefined);

    // Change the title
    cy.get('[data-test=openingPeriodTitle]').clear().type(newTitle);

    // Save
    cy.get('[data-test=opening-period-save-button]').click({ force: true });

    // Wait for success notification
    cy.get('[data-testid=opening-period-edited-successfully-notification]', {
      timeout: 10000,
    }).should('be.visible');

    cy.get('[data-test=openingPeriodTitle]').should('have.value', newTitle);
  });
});
