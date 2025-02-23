import { mount } from "@cypress/react";
import Header from "../../src/components/Header";

describe('Header test', () => {
    it('should present the Header and the text', () => {
        mount(<Header text="main" />);
        cy.get('button').should('have.text', 'main');
    })
});
