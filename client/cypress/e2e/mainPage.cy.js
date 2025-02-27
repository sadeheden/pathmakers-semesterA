//אוסף של בדיקות קטנות
describe('home page loaded', () => {
    //בדיקה קטנה שהדף נטען
    it('show welcome message', () => {
      cy.visit('http://localhost:5173/')
      cy.contains('Welcome to Pathmakers')
    });
  })