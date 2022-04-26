import { creds } from "../../src/pages/Login"
import { calcOptimalFrameRate } from "../../src/utils/frameRate"

Cypress.Commands.add("dataCy", (value) => cy.get(`[data-cy=${value}]`))

describe("app rendering", () => {
    it("prevent unauthorized access", () => {
        cy.visit(Cypress.env("app_url"))
        cy.dataCy("login").should("be.visible")
    })

    it("render app with valid auth creds", () => {
        cy.setCookie(Cypress.env("cookie_name"), creds)
        cy.visit(Cypress.env("app_url"))
        cy.dataCy("app").should("be.visible")
    })
})

describe("util functions", () => {
    it("dynamically calculates FPS from zoom level", () => {
        // handle bad/missing values
        expect(calcOptimalFrameRate()).equal(33)
        expect(calcOptimalFrameRate(undefined)).equal(33)
        expect(calcOptimalFrameRate(null)).equal(33)
        expect(calcOptimalFrameRate("10")).equal(33)
        expect(calcOptimalFrameRate("abc")).equal(33)
        // actual values
        expect(calcOptimalFrameRate(0)).equal(10000)
        expect(calcOptimalFrameRate(11)).equal(8549)
        expect(calcOptimalFrameRate(15)).equal(534)
        expect(calcOptimalFrameRate(20)).equal(33)
    })
})
