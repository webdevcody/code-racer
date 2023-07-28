import { siteConfig } from "../../src/config/site";

const gitHubUrl = "https://github.com";
const contributorsPageUrl =
  siteConfig.getHeaderLinks().find((e) => e.title.includes("Contributors"))
    ?.href ?? "/contributors";

Cypress.config("defaultCommandTimeout", 10000);

beforeEach(() => {
  cy.visit(contributorsPageUrl);
});

it("can hover on contributor card and display recent commits", () => {
  cy.get('[data-cy="contributor-card"]').first().focus();
  cy.get('[data-cy="github-commit-display"]').should("exist");
});

it("can click on contributor card and redirected to github profile page", () => {
  // Get first contributor card element
  cy.get('[data-cy="contributor-card"]').first().as("contributor-card");

  // Get selected contributor card's name (github login)
  cy.get("@contributor-card").within(() => {
    cy.get('[data-cy="contributor-name"]').as("contributor-name");
  });

  // Cypress does not support multi tab
  cy.get("@contributor-card")
    .should("have.attr", "target", "_blank")
    .invoke("removeAttr", "target"); // Remove target attribute to avoid triggering new tab

  // Click on contributor card
  cy.get("@contributor-card").click();

  // Expect to get redirected to Github profile page after clicking
  cy.on("url:changed", (newUrl) => {
    cy.get("@contributor-name").then((name) => {
      expect(newUrl).to.contain(`${gitHubUrl}/${name}`);
    });
  });
});

it("can click on contributor card and click on any commit message and redirected to github commit page", () => {
  // Get first contributor card element and its first commit link
  cy.get('[data-cy="contributor-card"]').first().as("contributor-card").focus();

  cy.get('[data-cy="github-commit-display"]').within(() => {
    cy.get('[data-cy="github-commit-link"]').first().as("commit-link");
  });

  // Cypress does not support multi tab
  cy.get("@commit-link")
    .should("have.attr", "target", "_blank")
    .invoke("removeAttr", "target"); // Remove target attribute to avoid triggering new tab

  // Click commit link
  cy.get("@commit-link").click();

  // Expect to get redirected to Github commit page after clicking
  cy.on("url:changed", (newUrl) => {
    cy.get("@commit-link")
      .its("href")
      .then((commitHref) => {
        expect(newUrl).to.contain(commitHref);
      });
  });
});
