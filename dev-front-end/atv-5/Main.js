// Importações para Node.js
if (typeof require !== 'undefined') {
    const Pessoa = require('./Pessoa.js');
    const Morador = require('./Morador.js');
    const Edificio = require('./Edificio.js');
    const Apartamento = require('./Apartamento.js');
    
    // Tornar classes globais para o Node.js
    global.Pessoa = Pessoa;
    global.Morador = Morador;
    global.Edificio = Edificio;
    global.Apartamento = Apartamento;
}

class Main {
    static executar() {
        console.log("=== SISTEMA DE GERENCIAMENTO DE APARTAMENTOS ===\n");

        // Criando instâncias de Edifícios
        const edificio1 = new Edificio("Residencial Primavera", "Rua das Flores, 123", "Jardim Botânico", "Goiânia", "GO");
        const edificio2 = new Edificio("Condomínio Sunset", "Av. T-4, 567", "Setor Bueno", "Goiânia", "GO");
        const edificio3 = new Edificio("Edifício Vista Verde", "Rua 85, 890", "Setor Sul", "Goiânia", "GO");

        // Criando instâncias de Moradores
        const morador1 = new Morador("João Silva", "123.456.789-01", "1234");
        const morador2 = new Morador("Maria Santos", "987.654.321-02", "5678");
        const morador3 = new Morador("Pedro Oliveira", "456.789.123-03", "9012");
        const morador4 = new Morador("Ana Costa", "789.123.456-04", "3456");
        const morador5 = new Morador("Carlos Ferreira", "321.654.987-05", "7890");

        // Criando cinco instâncias de Apartamento
        const apartamento1 = new Apartamento(101, 1, "A", edificio1, morador1);
        const apartamento2 = new Apartamento(205, 2, "B", edificio1, morador2);
        const apartamento3 = new Apartamento(304, 3, "A", edificio2, morador3);
        const apartamento4 = new Apartamento(402, 4, "C", edificio2, morador4);
        const apartamento5 = new Apartamento(150, 15, "B", edificio3, morador5);

        // Array com todos os apartamentos
        const apartamentos = [apartamento1, apartamento2, apartamento3, apartamento4, apartamento5];

        // Chamando o método mostrarDadosApartamento para cada instância
        apartamentos.forEach((apartamento, index) => {
            console.log(`APARTAMENTO ${index + 1}:`);
            console.log(apartamento.mostrarDadosApartamento());
        });

        console.log("=== FIM DO RELATÓRIO ===");
        
        return apartamentos;
    }
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
}

// Executando o programa principal
if (typeof window === 'undefined') {
    // Ambiente Node.js
    Main.executar();
} else {
    // Ambiente do navegador - anexar ao window para acesso global
    window.Main = Main;
}