import { siteConfig } from "../../../../src/config/site";
const headerLinks = siteConfig.getHeaderLinks(false);
export class NavbarComponent {

  race(): Cypress.Chainable{ return cy.get(`[data-cy="${
    headerLinks.find((e) => e.title.includes("Race"))?.title ?? "Race"
    }-main-nav-link"]`,
  )}

  leaderboard(): Cypress.Chainable{ return cy.get(`[data-cy="${
    headerLinks.find((e) => e.title.includes("Leaderboard"))?.title ?? "Leaderboard"
    }-main-nav-link"]`,
  )}
}