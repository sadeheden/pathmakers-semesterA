describe('home page loaded', () => {
  // בדיקה קטנה שהדף נטען ויש אלמנט וידאו ולחצן עם טקסט "Continue"
  it('displays a video element and a continue button', () => {
    cy.visit('http://localhost:5174/video')
    cy.get('video').should('exist')   // בדיקה אם יש אלמנט וידאו
    cy.get('button').contains('Continue').should('exist')   // בדיקה אם יש לחצן עם טקסט "Continue"
  });
});
