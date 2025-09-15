class Pessoa {
    constructor(nome, cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }

    getNome() {
        return this.nome;
    }

    setNome(nome) {
        this.nome = nome;
    }

    getCpf() {
        return this.cpf;
    }

    setCpf(cpf) {
        this.cpf = cpf;
    }

    mostrarDadosPessoa() {
        return `Nome: ${this.nome}, CPF: ${this.cpf}`;
    }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pessoa;
}