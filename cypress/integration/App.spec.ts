describe('Open aukiolot app', () => {
  it('Contains correct page title', () => {
    cy.visit('/');
    cy.contains('Aukiolot');
  });
});
