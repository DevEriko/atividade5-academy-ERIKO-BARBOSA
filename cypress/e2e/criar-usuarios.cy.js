import { faker } from '@faker-js/faker';
import CriarUsuarioPage from '../support/pages/criarUsuarios.pages';
describe('Teste de criação de usuários', function () {
    const paginaCriar = new CriarUsuarioPage();
    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    it('Deve ser possível criar um usuário com informações válidas.', function () {
        const nome = faker.person.firstName();
        const email = faker.internet.email();
        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome(nome);
        cy.get('#name').invoke('val').should('equal', nome);
        paginaCriar.typeEmail(email);
        cy.get('#email').invoke('val').should('equal', email);
        paginaCriar.clickButtonSalvar();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
    });

    it('Não deve ser possível criar um usuário com e-mail inválido.', function () {
        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome('Ériko');
        paginaCriar.typeEmail('nome.com');
        cy.get('#email').invoke('val').should('equal', 'nome.com');
        paginaCriar.clickButtonSalvar();
        cy.contains('Formato de e-mail inválido').should('be.visible');
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
    });

    it('Não deve ser possível cadastrar um usuário com e-mail já existente.', function () {
        cy.intercept('POST', 'api/v1/users', { statusCode: 422, fixture: 'erroUsuarioExist.json' }).as('postUser');

        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome('Eriko');
        paginaCriar.typeEmail('eriko@qa.com.br');

        paginaCriar.clickButtonSalvar();
        cy.wait('@postUser');
        cy.contains('Este e-mail já é utilizado por outro usuário.').should('be.visible');
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');

    });

    it('Não deve ser possível cadastrar um nome com mais de 100 caracteres.', function () {
        const nome = Cypress._.repeat('hahahahahaha', 11)
        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome(nome);
        paginaCriar.typeEmail('erikao@qa.com.br');
        paginaCriar.clickButtonSalvar();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
        cy.get('.sc-cPiKLX').contains('Informe no máximo 100 caracteres para o nome').should('be.visible');
    });

    it('Não deve ser possível cadastrar um e-mail com mais de 60 caracteres.', function () {
        const email = Cypress._.repeat('ha', 40);
        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome('UsuárioNovo');
        paginaCriar.typeEmail(email + '@qa.com');
        paginaCriar.clickButtonSalvar();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
        cy.get('.sc-cPiKLX').contains('Informe no máximo 60 caracteres para o e-mail').should('be.visible');
    });
});

