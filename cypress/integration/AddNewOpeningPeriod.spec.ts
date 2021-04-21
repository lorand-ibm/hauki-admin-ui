/// <reference types="cypress" />
/// <reference path="../index.d.ts" />
describe('User adds a new opening period', () => {
  beforeEach(() => {
    cy.visitResourcePageAsAuthenticatedUser(Cypress.env('resourceId'));
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

    // Start filling the form, first is opening period title in finnish
    cy.get('[data-test=opening-period-title-fi').type(
      `e2e-test Testijakson otsikko ${new Date().toJSON()}`
    );
    // ...then in swedish
    cy.get('[data-test=opening-period-title-sv').type(
      `e2e-test test periods rubrik ${new Date().toJSON()}`
    );
    // ...then in english
    cy.get('[data-test=opening-period-title-en').type(
      `e2e-test test period's title ${new Date().toJSON()}`
    );

    // Then select the begin and end date for the period. For the test we wish to select
    // current date and the first date of the next month
    cy.get('[data-test=openingPeriodBeginDate]').click();
    cy.get('button.dayToday').click();
    cy.get('[data-test=openingPeriodEndDate]').click();
    cy.get('[data-test=show-next-month-button]').click();
    cy.get('button.dayButton').contains('01').click();

    // Then enter time span data
    cy.get('[data-test=weekdays-monday-0-0]').click();
    cy.get('[data-test=weekdays-tuesday-0-0]').click();
    cy.get('[data-test=weekdays-wednesday-0-0]').click();
    cy.get('[data-test=weekdays-thursday-0-0]').click();
    cy.get('[data-test=weekdays-friday-0-0]').click();
    cy.get('[data-test=time-span-start-time-0-0]').type('08:00');
    cy.get('[data-test=time-span-end-time-0-0]').type('16:00');
    cy.selectHdsDropdown({ id: 'time-span-state-id-0-0', value: 'Auki' });

    // Try submit form
    cy.get('[data-test=publish-opening-period-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 10000,
    }).should('be.visible');
  });

  it('User successfully adds a new opening period which is open through the period', () => {
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
    cy.get('[data-test=opening-period-title-fi').type(
      `e2e-test Testijakson otsikko open constantly ${new Date().toJSON()}`
    );

    // Then select the resource state for the date-period
    cy.selectHdsDropdown({
      id: 'opening-period-resource-state',
      value: 'Auki',
    });

    // Try submit form
    cy.get('[data-test=publish-opening-period-button]').click();

    cy.get('[data-testid=opening-period-form-success]', {
      timeout: 10000,
    }).should('be.visible');
  });
});
