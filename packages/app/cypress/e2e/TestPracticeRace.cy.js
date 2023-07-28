import { siteConfig } from "../../src/config/site";

const headerLinks = siteConfig.getHeaderLinks();

const TIMEOUT = 10000;
Cypress.config("defaultCommandTimeout", TIMEOUT);

beforeEach(() => {
  // Go to Home Page
  cy.visit("/");
});

const TIME_TO_WAIT = 1000;

it("can successfully completed a practice race", () => {
  const LANGUAGE_SNIPPET = "html";
  const NEW_LINE = "⏎\n";

  // Find Race Navigation and click on it
  cy.get(
    `[data-cy="${
      headerLinks.find((e) => e.title.includes("Race"))?.title ?? "Race"
    }-main-nav-link"]`,
  ).click();

  // Find language selection and type snippet language
  cy.get('[data-cy="practice-card"] [data-cy="language-dropdown"]').click();
  cy.get('[data-cy="search-language-input"]').type(LANGUAGE_SNIPPET);

  // Find target language selection and click on it
  cy.contains(LANGUAGE_SNIPPET, { matchCase: false }).click();

  // Find practice button to start practice race
  cy.get('[data-cy="practice-button"]').click();

  // Get code as text, and use that to type into input
  cy.get('[data-cy="code-snippet-preformatted"]')
    .children()
    .then((spans) => {
      let code = "";
      let isIndentWhiteSpace = false;
      for (let i = 0; i < spans.length; i++) {
        const char = spans[i].innerText;
        if (char !== " " && isIndentWhiteSpace) {
          // Encounter non-whitespace character when isIndentWhiteSpace=true
          // Unset isIndentWhiteSpace back to false
          isIndentWhiteSpace = false;
        }
        if (char === " " && isIndentWhiteSpace) {
          continue;
        }
        code += char === NEW_LINE ? "\n" : char;
        if (char === NEW_LINE) {
          // When we encounter new line, the following whitespace up to
          // encounting non-whitespace character will be considered indent whitespace.
          // Since our app auto indent, we don't type it
          isIndentWhiteSpace = true;
        }
      }
      cy.get('[data-cy="race-practice-input"]').type(code, {
        force: true,
        parseSpecialCharSequences: false,
        delay: 30,
        waitForAnimations: true,
      });
    });
  cy.wait(TIME_TO_WAIT)

  cy.url().should("include", "/result");
});
