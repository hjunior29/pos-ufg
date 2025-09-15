// Interceptar console.log para capturar saída
let consoleOutput = '';
const originalConsoleLog = console.log;

function captureConsoleLog(...args) {
    const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
    ).join(' ');
    
    consoleOutput += message + '\n';
    originalConsoleLog.apply(console, args);
}

// Event listener para o botão
document.addEventListener('DOMContentLoaded', function() {
    const btnExecutar = document.getElementById('executarSistema');
    const resultadosDiv = document.getElementById('resultados');
    const consoleOutputEl = document.getElementById('consoleOutput');

    btnExecutar.addEventListener('click', function() {
        // Resetar saída do console
        consoleOutput = '';
        console.log = captureConsoleLog;
        
        // Executar o sistema
        const apartamentos = Main.executar();
        
        // Restaurar console.log original
        console.log = originalConsoleLog;
        
        // Mostrar console output
        consoleOutputEl.textContent = consoleOutput;
        consoleOutputEl.style.display = 'block';
        
        // Gerar cards visuais
        gerarCardsApartamentos(apartamentos);
        
        // Mostrar resultados
        resultadosDiv.style.display = 'flex';
        
        // Scroll suave para os resultados
        resultadosDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Desabilitar botão temporariamente
        btnExecutar.disabled = true;
        btnExecutar.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sistema Executado';
        
        setTimeout(() => {
            btnExecutar.disabled = false;
            btnExecutar.innerHTML = '<i class="bi bi-play-circle me-2"></i>Executar Sistema';
        }, 3000);
    });
});

function gerarCardsApartamentos(apartamentos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';
    
    apartamentos.forEach((apartamento, index) => {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-md-6 col-lg-4';
        
        const card = document.createElement('div');
        card.className = 'card apartment-card h-100';
        
        card.innerHTML = `
            <div class="card-header text-center">
                <h5 class="mb-0">
                    <i class="bi bi-house-door me-2"></i>
                    Apartamento ${index + 1}
                </h5>
            </div>
            <div class="card-body">
                <!-- Dados do Apartamento -->
                <div class="info-section apartment-info">
                    <h6><i class="bi bi-info-circle me-1"></i>Dados do Apartamento</h6>
                    <p><strong>Número:</strong> ${apartamento.getNumero()}</p>
                    <p><strong>Andar:</strong> ${apartamento.getAndar()}º</p>
                    <p><strong>Bloco:</strong> ${apartamento.getBloco()}</p>
                </div>
                
                <!-- Dados do Edifício -->
                <div class="info-section building-info">
                    <h6><i class="bi bi-building me-1"></i>Dados do Edifício</h6>
                    <p><strong>Nome:</strong> ${apartamento.getEdificio().getNome()}</p>
                    <p><strong>Endereço:</strong> ${apartamento.getEdificio().getEndereco()}</p>
                    <p><strong>Bairro:</strong> ${apartamento.getEdificio().getBairro()}</p>
                    <p><strong>Cidade:</strong> ${apartamento.getEdificio().getCidade()}</p>
                    <p><strong>UF:</strong> ${apartamento.getEdificio().getUf()}</p>
                </div>
                
                <!-- Dados do Morador -->
                <div class="info-section resident-info">
                    <h6><i class="bi bi-person me-1"></i>Dados do Morador</h6>
                    <p><strong>Nome:</strong> ${apartamento.getMorador().getNome()}</p>
                    <p><strong>CPF:</strong> ${apartamento.getMorador().getCpf()}</p>
                    <p><strong>Código de Acesso:</strong> ${apartamento.getMorador().getCodigoAcesso()}</p>
                </div>
            </div>
        `;
        
        cardCol.appendChild(card);
        resultadosDiv.appendChild(cardCol);
    });
}