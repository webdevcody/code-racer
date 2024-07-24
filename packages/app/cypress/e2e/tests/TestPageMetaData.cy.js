beforeEach(() => {
  // Navigate to homepage
  cy.visit("/");
});
    
it("test meta data", () => {
  // Test title
  cy.get('head title').should('include.text', 'CodeRacer')

  // Test description
  cy.get('head meta[name=description]')
    .should('have.attr', 'content')
    .should('include', 'Accelerating coding skills, competitive thrills!')
});
