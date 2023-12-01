describe('template spec', () => {
    it('Verify client can make it to host', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Log In?').click()

        cy.contains('Log In With Email').click()

        cy.get("#email-field").type("rmarathay+manifest@gmail.com")
        cy.get("#password-field").type("1234")
        cy.get("#login-button").click()


        cy.get('#OWNER > .MuiButton-label').click()

        // create a test property
        // add all details


        cy.get('.mt-widget-requests-container').click()

        cy.get('#addMaintenanceButton').click()
    })
})