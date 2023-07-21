beforeEach(() => {
    cy.visit(`http://localhost:${process.env.PORT ?? 3000}/contributors?page=1&per_page=30`);
})

it("can hover on contributor card and display recent commits", () => {
    cy.contains("contributions").first().focus();
    cy.contains("Last", {
        timeout: 20000,
        matchCase: false
    });
})

it("can click on contributor card and redirected to github profile page", () => {
    cy.contains("contributions").first().click();
    cy.url().should("include", "github")
})