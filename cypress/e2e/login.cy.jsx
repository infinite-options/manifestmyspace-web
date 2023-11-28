describe('template spec', () => {
    it('Verify client can make it to host', () => {
      cy.visit('http://localhost:3000')

      cy.contains('Log In?').click()

      cy.contains('Log In With Email').click()
    })
  })