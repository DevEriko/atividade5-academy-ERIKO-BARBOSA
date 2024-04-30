export default class CriarUsuarioPage {
    inputNome = "#name";
    inputEmail = "#email";
    buttonSalvar = "#root > div.sc-cWSHoV.giKWPW > div > form > button";

    linkVoltar = '[href="/users/novo"]';

    typeNome(nome) {
        cy.get(this.inputNome).type(nome);
    }

    typeEmail(email) {
        cy.get(this.inputEmail).type(email);
    }

    clickButtonSalvar() {
        cy.get(this.buttonSalvar).click();
    }

    cadastrar(nome, email) {
        this.typeNome(nome);
        this.typeEmail(email);
        this.clickButtonSalvar();
    }
}