beforeEach(() => {
  // Go to Home Page
  cy.visit("http://localhost:3000/");
});

it("can successfully completed a practice race", () => {
  const TIMEOUT = 10000;
  const LANGUAGE_SNIPPET = "c#";
  const NEW_LINE = "⏎\n";

  // Find Race Navigation and click on it
  cy.get("nav").contains("Race", { matchCase: false }).click();

  // Find language selection and enter typescript
  cy.get(
    '[data-cy="practice-card"] [data-cy="language-dropdown"]',
  ).scrollIntoView();
  cy.get('[data-cy="practice-card"] [data-cy="language-dropdown"]').click();
  cy.get("input").type(LANGUAGE_SNIPPET);

  // Find typescript selection and click on it
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
          isIndentWhiteSpace = false;
        }
        if (char === " " && isIndentWhiteSpace) {
          continue;
        }
        code += char === NEW_LINE ? "\n" : char;
        if (char === NEW_LINE) {
          isIndentWhiteSpace = true;
        }
      }
      cy.get("input", { timeout: TIMEOUT }).type(code, {
        force: true,
        timeout: TIMEOUT,
        parseSpecialCharSequences: false,
        delay: 30,
        waitForAnimations: true,
      });
    });

  cy.url().should("include", "http://localhost:3000/result");
});
