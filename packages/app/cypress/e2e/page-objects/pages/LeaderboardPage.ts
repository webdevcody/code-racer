export class LeaderboardPage{

    userRow(): Cypress.Chainable{ return cy.get('.table-row') }
    user(): Cypress.Chainable{ return cy.get('.flex.items-center.gap-2') }
    rowDropdown(): Cypress.Chainable{ return cy.get('[role="combobox"]') }

    rowDropdownElement(): Cypress.Chainable{ return cy.get('[role="option"]') }
}