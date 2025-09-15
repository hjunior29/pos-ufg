class Edificio {
    constructor(nome, endereco, bairro, cidade, uf) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
    }

    getNome() {
        return this.nome;
    }

    setNome(nome) {
        this.nome = nome;
    }

    getEndereco() {
        return this.endereco;
    }

    setEndereco(endereco) {
        this.endereco = endereco;
    }

    getBairro() {
        return this.bairro;
    }

    setBairro(bairro) {
        this.bairro = bairro;
    }

    getCidade() {
        return this.cidade;
    }

    setCidade(cidade) {
        this.cidade = cidade;
    }

    getUf() {
        return this.uf;
    }

    setUf(uf) {
        this.uf = uf;
    }

    mostrarDadosEdificio() {
        return `Edifício: ${this.nome}, Endereço: ${this.endereco}, Bairro: ${this.bairro}, Cidade: ${this.cidade}, UF: ${this.uf}`;
    }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Edificio;
}