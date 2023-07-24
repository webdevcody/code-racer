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
    cy.contains("contributions").first().click({ timeout: 20000 });
    cy.on("url:changed", (newUrl) => {
        expect(newUrl).to.contain("github");
    })
})

it("can click on contributor card and click on any commit message and redirected to github commit page", () => {
    cy.contains("contributions").first().focus();
    cy.contains("Last").parent().get("ol li").first().click();
    cy.on("url:changed", (newUrl: string) => {
        expect(newUrl).to.contain("github").and.contain("commit");
    })
})