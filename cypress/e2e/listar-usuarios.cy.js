describe('Teste lista de suários', function () {
  beforeEach(function () {
    cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
  })

  it('Deve ser possível verificar os usuários contidos na lista após a consulta.', function () {
    cy.intercept('GET', 'api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarios.json'
    }).as('usuariosDaLista')
    cy.get('#listaUsuarios').should('be.visible');
  });

  it('Caso não existam usuários cadastrados deve existir uma opção para cadastrar um usuário.', function () {
    cy.intercept('GET', 'api/v1/users', { statusCode: 200, body: [] }).as('listaVazia');
    cy.get('h3').invoke('text').should('equal', 'Ops! Não existe nenhum usuário para ser exibido.');
    cy.get('p').invoke('text').should('equal', 'Cadastre um novo usuário').as('cadastrarUsuárioNovo');
  });

  it('Deve ser possível encontrar um usuário dentro da lista', function () {
    cy.intercept('GET', 'api/v1/users', {
      statusCode: 200,
      fixture: 'listaUsuarios.json'
    }).as('usuariosDaLista');
    cy.get('#listaUsuarios').should('be.visible');
    cy.get('#listaUsuarios > :nth-child(1)').should('be.visible');
  });
});