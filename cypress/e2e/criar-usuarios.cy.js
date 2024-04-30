import { faker } from '@faker-js/faker';
import CriarUsuarioPage from '../support/pages/criarUsuarios.pages';

describe('Teste criação de usuários', function () {
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
        cy.get('#name').should('be.visible')

        paginaCriar.typeEmail(email);
        cy.get('#email').invoke('val').should('equal', email);
        cy.get('#email').should('be.visible')
        paginaCriar.clickButtonSalvar();

        cy.url().should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
    });
});

describe('Teste que não possibilita a criação de usuários', function () {
    const paginaCriar = new CriarUsuarioPage();
    beforeEach(function () {
        cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    });
    it('Não deve ser possível criar um usuário sem as informações obrigatórias', function () {
        cy.get('.sc-gEvEer').click();
        cy.get('.sc-kpDqfm').click();
        cy.get('#name').should('be.visible');
        cy.contains('O campo nome é obrigatório.').should('be.visible');
        cy.get('#email').should('be.visible');
        cy.contains('O campo e-mail é obrigatório.').should('be.visible');
    })

    it('Não deve ser possível criar um usuário com menos de 4 caracteres', function () {
        cy.get('.sc-gEvEer').click();
        paginaCriar.typeNome('ANA');
        paginaCriar.typeEmail('ana@qa.com');
        paginaCriar.clickButtonSalvar();
        cy.get('#name').should('be.visible');
        cy.contains('Informe pelo menos 4 letras para o nome.').should('be.visible');
    })

    it('Não deve ser possível criar um usuário com e-mail inválido.', function () {
        cy.get('.sc-gEvEer').click();

        paginaCriar.typeNome('Ériko');
        cy.get('#name').should('be.visible')
        paginaCriar.typeEmail('nome.com');
        cy.get('#email').should('be.visible')
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
