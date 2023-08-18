import { RacePage } from "../page-objects/pages";
import { RaceBL } from "../business-layer/raceBL";
import { NavbarComponent } from "../page-objects/components";

const racePage = new RacePage();
const navbarComponent = new NavbarComponent();

const TIMEOUT = 10000;
Cypress.config("defaultCommandTimeout", TIMEOUT);

beforeEach(() => {
  // Go to Home Page
  cy.visit("/");
});

const TIME_TO_WAIT = 1000;

it("can successfully completed a practice race", () => {
  // Find Race Navigation and click on it
  navbarComponent.race().should("be.visible").click();

  // Find language selection and type snippet language
  racePage.practiceCardlanguageDropdown().should("be.visible").click();
  cy.wait(TIME_TO_WAIT);
  cy.get("input").type("c++");
  cy.wait(TIME_TO_WAIT);
  racePage.cppLanguageOption().should("be.visible").click();

  // Find practice button to start practice race
  racePage.practiceButton().click();

  // Get code as text, and use that to type into input
  racePage
    .codeSnippet()
    .children()
    .then((spans) => {
      RaceBL.runTypingRace(spans);
    });
  cy.wait(TIME_TO_WAIT);

  cy.url().should("include", "/result");
});
