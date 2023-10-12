export class RacePage {
  practiceCardLanguageDropdown(): Cypress.Chainable {
    return cy.get(
      "[data-cy='practice-card'] [data-cy='language-dropdown'] [data-cy='search-language-input']"
    );
  }
  cppLanguageOption(): Cypress.Chainable {
    return cy.get("[data-cy='c++-value']");
  }
  practiceButton(): Cypress.Chainable {
    return cy.get("[data-cy='practice-button']");
  }
  codeSnippet(): Cypress.Chainable {
    return cy.get("[data-cy='code-snippet-preformatted']");
  }
}
