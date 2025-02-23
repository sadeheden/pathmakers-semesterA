import { mount } from '@cypress/react18';
import Header from "../../src/components/Header";

describe('Header test', () => {
    it('should present the Header and the text', () => {
        mount(<Header text="Main" />);
        cy.get('button').should('have.text', 'Main');
    })
});
