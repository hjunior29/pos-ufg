class Apartamento {
    constructor(numero, andar, bloco, edificio, morador) {
        this.numero = numero;
        this.andar = andar;
        this.bloco = bloco;
        this.edificio = edificio;
        this.morador = morador;
    }

    getNumero() {
        return this.numero;
    }

    setNumero(numero) {
        this.numero = numero;
    }

    getAndar() {
        return this.andar;
    }

    setAndar(andar) {
        this.andar = andar;
    }

    getBloco() {
        return this.bloco;
    }

    setBloco(bloco) {
        this.bloco = bloco;
    }

    getEdificio() {
        return this.edificio;
    }

    setEdificio(edificio) {
        this.edificio = edificio;
    }

    getMorador() {
        return this.morador;
    }

    setMorador(morador) {
        this.morador = morador;
    }

    mostrarDadosApartamento() {
        const dadosApartamento = `
=== DADOS DO APARTAMENTO ===
Número: ${this.numero}
Andar: ${this.andar}
Bloco: ${this.bloco}

=== DADOS DO EDIFÍCIO ===
${this.edificio.mostrarDadosEdificio()}

=== DADOS DO MORADOR ===
${this.morador.mostrarDadosMorador()}
=============================
        `;
        return dadosApartamento;
    }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Apartamento;
}