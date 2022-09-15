import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the cypress querying examples page", () => {
  cy.visit("https://example.cypress.io");
  cy.findByRole("link", { name: /get/i }).click();
});
