import AddCD from "../../src/components/AddCD";
import { mount } from "cypress/react";

describe("AddCD Component", () => {
  it("Doit afficher le formulaire d’ajout de CD", () => {
    mount(<AddCD onAdd={() => {}} />);

    cy.contains("h2", "Ajouter un CD ➕").should("be.visible");
    cy.get('input[name="title"]').should("be.visible");
    cy.get('input[name="artist"]').should("be.visible");
    cy.get('input[name="year"]').should("be.visible");
    cy.get('button[type="submit"]').should("contain", "Ajouter");
  });

  it("Doit mettre à jour les champs du formulaire lors de la saisie", () => {
    mount(<AddCD onAdd={() => {}} />);

    cy.get('input[name="title"]').type("Test Album");
    cy.get('input[name="title"]').should("have.value", "Test Album");

    cy.get('input[name="artist"]').type("Test Artist");
    cy.get('input[name="artist"]').should("have.value", "Test Artist");

    cy.get('input[name="year"]').type("2023");
    cy.get('input[name="year"]').should("have.value", "2023");
  });

  it("Doit appeler onAdd après soumission du formulaire", () => {
    const onAdd = cy.stub().as("onAddStub");
    mount(<AddCD onAdd={onAdd} />);

    cy.get('input[name="title"]').type("Test Album");
    cy.get('input[name="artist"]').type("Test Artist");
    cy.get('input[name="year"]').type("2023");
    cy.get("form").submit();

    cy.get("@onAddStub").should("have.been.calledOnce");
  });
});
