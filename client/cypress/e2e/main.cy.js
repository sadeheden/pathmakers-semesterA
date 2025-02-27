describe('home page loaded', () => {
  // בדיקה קטנה שהדף נטען ויש תמונה, טקסט וכפתור
  it('displays an image, text, and a button', () => {
    cy.visit('http://localhost:5173/main')
    
    // בדיקה אם יש אלמנט <img> (תמונה)
    cy.get('img').should('exist')
    
    // בדיקה אם יש טקסט "Welcome to Pathmakers"
    cy.contains('Welcome to Pathmakers').should('exist')
    
    // בדיקה אם יש כפתור
    cy.get('button').should('exist')
  });
});
