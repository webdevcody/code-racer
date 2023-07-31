import { siteConfig } from "../../../src/config/site";
import { ContributorsPage } from "../page-objects/pages/ContributorsPage";

const gitHubUrl = "https://github.com";
const contributorsPageUrl =
  siteConfig.getHeaderLinks().find((e) => e.title.includes("Contributors"))
    ?.href ?? "/contributors";
const contributorsPage = new ContributorsPage();

Cypress.config("defaultCommandTimeout", 10000);

beforeEach(() => {
  cy.visit(contributorsPageUrl);
});

it("can hover on contributor card and display recent commits", () => {
  contributorsPage.contributorCard().first().focus();
  contributorsPage.commitDisplay().should('be.visible');
});

it("can click on contributor card and redirected to github profile page", () => {
  // Save first contributor card as alias for later use
  contributorsPage.contributorCard().first().as("contributor-card");

  contributorsPage.contributorCardText(cy.get("@contributor-card")).then((contributorName) => {
    // Check if contributor card's href contains contributor name
    cy.get("@contributor-card")
      .should('have.attr', 'href')
      .and('include', contributorName);

    // Cypress does not support multi tab
    cy.get("@contributor-card")
      .should("have.attr", "target", "_blank")
      .invoke("removeAttr", "target");  // Remove target attribute to avoid triggering new tab

    cy.get("@contributor-card").click();

    cy.on("url:changed", (newUrl) => {
      expect(newUrl).to.contain(`${gitHubUrl}/${contributorName}`);
    });
  });
});

it("can click on contributor card and click on any commit message and redirected to github commit page", () => {
  // Get first contributor card element and its first commit link
  contributorsPage.contributorCard().first().as("contributor-card").focus();

  contributorsPage.commitDisplay().within(() => {
    contributorsPage.commitLink().first().as("commit-link");
  });

  // Cypress does not support multi tab
  cy.get("@commit-link")
    .should("have.attr", "target", "_blank")
    .invoke("removeAttr", "target"); // Remove target attribute to avoid triggering new tab

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
