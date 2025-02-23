describe('home page loaded', () => {
  // בדיקה קטנה שהדף נטען ויש אלמנט וידאו ולחצן עם טקסט "Continue"
  it('displays a video element and a continue button', () => {
    cy.visit('http://localhost:5174/chat')
    cy.get('button').contains('Next').should('exist')   // בדיקה אם יש לחצן עם טקסט "Continue"
    cy.get('button').contains('Back').should('exist')   // בדיקה אם יש לחצן עם טקסט "Continue"
    cy.get('option')
    .contains('Paris')
    .should('exist') 
  });
});
