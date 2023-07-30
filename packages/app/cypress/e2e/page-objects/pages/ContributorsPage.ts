export class ContributorsPage{

    contributorCard(): Cypress.Chainable{ return cy.get('[data-cy="contributor-card"]') }
    contributorName(): Cypress.Chainable{ return cy.get('[data-cy="contributor-name"]') }
    commitDisplay(): Cypress.Chainable{ return cy.get('[data-cy="github-commit-display"]') }
    commitLink(): Cypress.Chainable{ return cy.get('[data-cy="github-commit-link"]') }

    public contributorCardText(contributorCard: Cypress.Chainable): Cypress.Chainable{
        return contributorCard.find('[data-cy="contributor-name"]').invoke('text')
    }
}