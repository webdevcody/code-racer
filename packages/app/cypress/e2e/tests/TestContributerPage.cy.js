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
  contributorsPage.commitDisplay().should("be.visible");
});

it("can click on contributor card and redirected to github profile page", () => {
  // Save first contributor card as alias for later use
  contributorsPage.contributorCard().first().as("contributor-card");

  contributorsPage.contributorCardText(cy.get("@contributor-card")).then((contributorName) => {
    // Check if contributor card's href contains contributor name
    cy.get("@contributor-card")
      .should("have.attr", "href")
      .and("include", contributorName);

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
it.only("can ensure that the contributors page loads with contributor data", () => {
  // Verify the contributors page loads and displays contributor cards
  contributorsPage.contributorCard().should("have.length.greaterThan", 0);
  
  // Verify each contributor card has required elements
  contributorsPage.contributorCard().first().within(() => {
    contributorsPage.contributorName().should("be.visible"); // Contributor name text
  });
  
  // Verify the page renders contributor statistics
  cy.contains("Contributors and counting!").should("be.visible");
  cy.get("[data-cy='contributor-card']").each(($card) => {
    cy.wrap($card).find("[data-cy='contributor-name']").should("exist");
  });
});
