import { siteConfig } from "../../../src/config/site";


beforeEach(() => {
  cy.visit("/");
});

it("can reach the login page and access github API", () => {
  // cy.contains('button', 'Sign in').click()
  cy.get('[data-cy="user dropdown"]').click()

  // cy.url().should('include', 'github.com/login')
//   cy.on("url:changed", (newUrl) => {
//     expect(newUrl).to.contain("github.com/login")
//   })
});
