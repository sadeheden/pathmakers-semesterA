import { mount } from "@cypress/react";
import Header from "../../src/components/Header";
import { MemoryRouter } from "react-router-dom"; 

describe("Header test", () => {
  it("should present the Header and the text", () => {
    mount(
      <MemoryRouter>
        <Header text="Main" />
      </MemoryRouter>
    );
    cy.get('img').should('be.visible');
  });
});

