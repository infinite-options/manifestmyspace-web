describe("dashboard spec", () => {
    it("Verify client can make it to host", () => {
        cy.visit('http://localhost:3000')

        cy.contains('Log In?').click()

        cy.contains('Log In With Email').click()

        cy.get("#email-field").type("rmarathay+manifest@gmail.com")
        cy.get("#password-field").type("1234")
        cy.get("#login-button").click()


        cy.get('#MAINTENANCE').click()
        // cy.get('#OWNER > .MuiButton-label').click()
    })
})