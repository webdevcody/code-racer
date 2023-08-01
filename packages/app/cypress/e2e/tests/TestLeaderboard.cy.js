import { NavbarComponent } from "../page-objects/components";
import { LeaderboardPage } from "../page-objects/pages";

beforeEach(() => {
    // Go to Home Page
    cy.visit("/");
});

const navbarComponent = new NavbarComponent();
const leaderboardPage = new LeaderboardPage();
  
it.only("can open leaderboard page and validate board", () => {
    // Navigate to leaderboard page
    navbarComponent.leaderboard().click();

    // Validating the User's not currently possible locally :/
    // leaderboardPage.leaderboardUserRow().should("have.length", 5);

    // If no wait is added, the dropdown will not be visible
    cy.wait(1000)

    // Click dropdown and select 20
    leaderboardPage.rowDropdown().click();
    leaderboardPage.rowDropdownElement().eq(3).click();

    leaderboardPage.rowDropdown().should("have.text", "20");
    // leaderboardPage.leaderboardUserRow().should("have.length", 20);
});

// Validating the User's not currently possible locally :/
// it("can open leaderboard page and navigate to first user profile", () => {
//     navbarComponent.leaderboard().click();

//     leaderboardPage.userRow().should("have.length", 5);

//     Also validating that the user can click on a user and go to their profile not possible locally :/
//     leaderboardPage.user().eq(0).click();

//     Validate user profile page - maybe through url or username
// });