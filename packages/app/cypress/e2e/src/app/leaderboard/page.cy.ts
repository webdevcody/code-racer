describe("Leaderboard Page", () => {
  it("should not display the the rankings when user is not signed in", () => {
    cy.visit(`http://localhost:${process.env.PORT ?? 3000}/leaderboard`);
    cy.get("body")
      .should("not.contain.text", "Your Rankings")
      .should("not.contain.text", "BY AVERAGE CPM")
      .should("not.contain.text", "BY AVERAGE ACCURACY")
      .should("not.contain.text", "BY RACES PLAYED");
  });
});
