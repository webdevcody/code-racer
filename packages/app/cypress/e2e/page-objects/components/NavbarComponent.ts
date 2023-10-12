export class NavbarComponent {
  race(): Cypress.Chainable {
    return cy.get("[data-cy='Race-main-nav-link']");
  }

  leaderboard(): Cypress.Chainable {
    return cy.get("[data-cy='Leaderboard-main-nav-link']");
  }
}
