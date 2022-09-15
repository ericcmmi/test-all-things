describe("empty spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
    cy.findByRole("link", { name: /get/i }).click();
  });
});
