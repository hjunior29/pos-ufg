// Importação para Node.js
if (typeof require !== 'undefined') {
    const Pessoa = require('./Pessoa.js');
    global.Pessoa = Pessoa;
}

class Morador extends Pessoa {
    constructor(nome, cpf, codigoAcesso) {
        super(nome, cpf);
        this.codigoAcesso = codigoAcesso;
    }

    getCodigoAcesso() {
        return this.codigoAcesso;
    }

    setCodigoAcesso(codigoAcesso) {
        this.codigoAcesso = codigoAcesso;
    }

    mostrarDadosMorador() {
        return `${this.mostrarDadosPessoa()}, Código de Acesso: ${this.codigoAcesso}`;
    }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Morador;
}