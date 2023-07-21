describe("Navigation", () => {
    it("should navigate to the about page", () => {
      // Start from the index page
      cy.visit("http://localhost:3000/")
   
      // Find a link with an href attribute containing "race" and click it
      cy.get("a[href*=\"race\"]").contains("Race").click()
   
      // The new url should include "/race"
      cy.url().should("include", "/race")
   
      // The new page should contain an h1 with "race page"
      cy.get("h2").contains("Choose a Race Mode")
    })
  })