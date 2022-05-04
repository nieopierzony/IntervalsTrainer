const SETTINGS_URL = 'http://localhost:8080/settings.html';

describe('Check elements accessibility', () => {
  it('Visisits settings page', () => {
    cy.visit(SETTINGS_URL);
  });
});
