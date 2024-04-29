import { faker } from '@faker-js/faker';
describe('Teste de criação de usuários', function () {
    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });

    it('Deve ser possível criar um usuário com informações válidas.', function () {
        const nome = faker.person.firstName();
        const email = faker.internet.email();
        cy.get('.sc-gEvEer').click();
        cy.get('#name').type(nome);
        cy.get('#name').invoke('val').should('equal', nome);
        cy.get('#email').type(email);
        cy.get('#email').invoke('val').should('equal', email);
        cy.contains('button', 'Salvar').click();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
    });

    it('Não deve ser possível criar um usuário com e-mail inválido.', function () {
        cy.get('.sc-gEvEer').click();
        cy.get('#name').type('Ériko');
        cy.get('#email').type('nome.com');
        cy.get('#email').invoke('val').should('equal', 'nome.com');
        cy.contains('button', 'Salvar').click();
        cy.contains('Formato de e-mail inválido').should('be.visible');
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
    });

    it('Não deve ser possível cadastrar um usuário com e-mail já existente.', function () {
        cy.intercept('POST', 'api/v1/users', { statusCode: 422, fixture: 'erroUsuarioExist.json' }).as('postUser');

        cy.get('.sc-gEvEer').click();
        cy.get('#name').type('Eriko');
        cy.get('#email').type('eriko@qa.com.br');

        cy.contains('button', 'Salvar').click();
        cy.wait('@postUser');
        cy.contains('Este e-mail já é utilizado por outro usuário.').should('be.visible');
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');

    });

    it('Não deve ser possível cadastrar um nome com mais de 100 caracteres.', function () {
        const nome = Cypress._.repeat('Nome Usuário', 11)
        cy.get('.sc-gEvEer').click();
        cy.get('#name').type(nome);
        cy.get('#email').type('erikao@qa.com.br');
        cy.contains('button', 'Salvar').click();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');

        cy.get('.sc-cPiKLX').contains('Informe no máximo 100 caracteres para o nome').should('be.visible');
    });

    it('Não deve ser possível cadastrar um e-mail com mais de 60 caracteres.', function () {
        const email = Cypress._.repeat('ha', 40);

        cy.get('.sc-gEvEer').click();
        cy.get('#name').type('UsuárioNovo');
        cy.get('#email').type(email + '@qa.com');
        cy.contains('button', 'Salvar').click();
        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');

        cy.get('.sc-cPiKLX').contains('Informe no máximo 60 caracteres para o e-mail').should('be.visible');
    });
});

