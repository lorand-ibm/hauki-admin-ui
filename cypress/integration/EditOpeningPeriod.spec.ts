/// <reference types="cypress" />
/// <reference path="../index.d.ts" />

describe('User edits an opening period', () => {
  let dataPeriodId: string | undefined;
  const resourceId = Cypress.env('resource-id');
  const datePeriodTitlePrefix = 'e2e-test muokkaus:aukiolojakso';
  const newTitle = `${datePeriodTitlePrefix} ${new Date().toJSON()}`;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(new Date().getDate() + 1);

  before(() => {
    cy.createDatePeriod({
      name: newTitle,
      startDate,
      endDate,
      resourceId,
    }).then((id: string) => {
      if (id) {
        dataPeriodId = id;
      }
    });
  });

  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(resourceId);
  });

  it('User successfully edits an opening period', () => {
    // Enter in edit page from resource page
    cy.get('[data-test=resource-opening-periods-list]', {
      timeout: 5000,
    })
      .find(`[data-test="openingPeriodEditLink-${dataPeriodId}"]`)
      .click({ log: true });

    // Check that form exists
    cy.get('[data-test=opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    // Start editing by checking the old title
    cy.get('[data-test=openingPeriodTitle]')
      .invoke('val')
      .should('not.be', undefined);

    // Change the title
    cy.get('[data-test=openingPeriodTitle]')
      .clear()
      .type(newTitle, { log: true });

    // Save
    cy.get('[data-test=opening-period-save-button]').click({
      force: true,
      log: true,
    });

    // Wait for success notification
    cy.get('[data-testid=opening-period-edited-successfully-notification]', {
      timeout: 10000,
    }).should('be.visible');

    cy.get('[data-test=openingPeriodTitle]').should('have.value', newTitle);
  });
});
