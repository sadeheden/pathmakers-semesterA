import { mount } from "@cypress/react";
import Header from "../../src/pages/Main";

describe('Header test', () => {
    it('should present the Header and the text', () => {
        mount(<Header text="Main" />);
        cy.get('button').should('have.text', 'Main');
    })
});