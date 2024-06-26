import { faker } from '@faker-js/faker';

const nome = faker.person.firstName();
const email = faker.internet.email();

describe('Teste para pesquisar usuários', function () {

    // Aqui usamos o before para criarmos os usuários que pesquisaremos
    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
        cy.get('.sc-gEvEer').click();
        cy.get('#name').type(nome);
        cy.get('#email').type(email);
        cy.contains('button', 'Salvar').click();
        cy.get('.sc-gEvEer').click();
    });

    // Aqui usamos para deletarmos os nossos usuários criados para não encher o banco de dados das nossas aplicações
    // Será deletado após toda a operação que fizermos com o usuário ainda cadastrado.
    afterEach(function () {
        cy.get('.sc-eqUAAy').click();
        cy.get('.sc-gsFSXq').clear().type(email)
        cy.get('.sc-fUnMCh').click();
        cy.get('button').contains('Confirmar').click();
        cy.get('.go3958317564').should("contain.text", "Usuário removido!");
    });

    it('Deve ser possível pesquisar um usuário por nome', function () {
        cy.get('.sc-gsFSXq').type(nome).click();
        cy.get('[data-test="userDataName"]').should("contain.text", "Nome: ", nome);
        cy.get('#userData').should('be.visible');
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    it('Deve ser possível pesquisar um usuário por email', function () {
        cy.get('.sc-gsFSXq').type(email).click();
        cy.get('#userData').should('be.visible');
        cy.get('[data-test="userDataEmail"]').should("contain.text", "E-mail: ", email);
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    it('Deve ser possível pesquisar os detalhes de um usuário cadastrado', function () {
        cy.get('#userDataDetalhe').click();
        cy.get('[name="id"]').should('be.visible');
        cy.get('#userName').should('be.visible');
        cy.get('#userEmail').should('be.visible');
    });
});