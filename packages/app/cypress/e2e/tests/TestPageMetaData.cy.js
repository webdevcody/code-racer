beforeEach(() => {
  // Navigate to homepage
  cy.visit("/");
});
    
it("test1", () => {
  // cy.contains('button', 'Sign in').click()
  cy.get('[data-cy="sign in"]').click()
   
  // cy.url().should('include', 'github.com/login')
  cy.on("url:changed", (newUrl) => {
    expect(newUrl).to.contain("github.com/login")
  })
});