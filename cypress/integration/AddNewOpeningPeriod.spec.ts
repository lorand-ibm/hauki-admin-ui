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
    cy.get('[data-test=add-new-opening-period-button]').click();

    // Check that add new opening period form is visible in the new page
    cy.get('[data-test=add-new-opening-period-form]', {
      timeout: 5000,
    }).should('be.visible');

    // Start filling the form, first is opening period title
    cy.get('[data-test=openingPeriodTitle]').type(
      `e2e-test Testijakson otsikko ${new Date().toJSON()}`
    );

    // Then select the begin and end date for the period. For the test we wish to select
    // current date and the first date of the next month
    cy.get('[data-test=openingPeriodBeginDate]').click();
    cy.get('button.dayToday').click();
    cy.get('[data-test=openingPeriodEndDate]').click();
    cy.get('[data-test=show-next-month-button]').click();
    cy.get('button.dayButton').contains('01').click();

    // Then enter time span data
    cy.get('[data-test=weekdays-monday-0]').click();
    cy.get('[data-test=weekdays-tuesday-0]').click();
    cy.get('[data-test=weekdays-wednesday-0]').click();
    cy.get('[data-test=weekdays-thursday-0]').click();
    cy.get('[data-test=weekdays-friday-0]').click();
    cy.get('[data-test=time-span-start-time-0]').type('08:00');
    cy.get('[data-test=time-span-end-time-0]').type('16:00');
    cy.selectHdsDropdown({ id: 'time-span-state-id-0', value: 'Auki' });

    // Enter rules data
    cy.get('button[data-test="add-new-rule-button"]').click();
    cy.selectHdsDropdown({ id: 'rule-0-context', value: 'Kuukausi' });
    cy.selectHdsDropdown({ id: 'rule-0-frequency', value: 'Parillinen' });
    cy.selectHdsDropdown({ id: 'rule-0-subject', value: 'Viikko' });
    cy.selectHdsDropdown({ id: 'rule-0-start', value: '1.' });

    // Try submit form
    cy.get('[data-test=publish-opening-period-button]').click();

    // On successful creation user is redirected to resource page and a success notification should appear. Let's test that this is the case

    cy.location().should((location) => {
      expect(location.pathname).to.not.contain('new');
    });

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 10000,
    }).should('be.visible');
  });
});
