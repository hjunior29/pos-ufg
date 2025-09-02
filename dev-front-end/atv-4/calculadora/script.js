document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('calculatorForm');
    const resultCard = document.querySelector('.result-card');
    const resultDiv = document.getElementById('resultado');

    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            calcular();
        }
    });

    function validarFormulario() {
        const numero1 = document.getElementById('numero1');
        const numero2 = document.getElementById('numero2');
        const operador = document.getElementById('operador');
        let isValid = true;

        // Reset estados anteriores
        [numero1, numero2, operador].forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });

        // Validar número 1
        if (!numero1.value.trim() || isNaN(numero1.value)) {
            numero1.classList.add('is-invalid');
            isValid = false;
        } else {
            numero1.classList.add('is-valid');
        }

        // Validar número 2
        if (!numero2.value.trim() || isNaN(numero2.value)) {
            numero2.classList.add('is-invalid');
            isValid = false;
        } else {
            numero2.classList.add('is-valid');
        }

        // Validar operador
        if (!operador.value) {
            operador.classList.add('is-invalid');
            isValid = false;
        } else {
            operador.classList.add('is-valid');
        }

        // Validar divisão por zero
        if (operador.value === '/' && parseFloat(numero2.value) === 0) {
            numero2.classList.remove('is-valid');
            numero2.classList.add('is-invalid');
            mostrarErro('Erro: Divisão por zero não é permitida!');
            isValid = false;
        }

        return isValid;
    }

    function calcular() {
        const numero1 = parseFloat(document.getElementById('numero1').value);
        const numero2 = parseFloat(document.getElementById('numero2').value);
        const operador = document.getElementById('operador').value;
        
        let resultado;
        let operacaoTexto;

        switch (operador) {
            case '+':
                resultado = numero1 + numero2;
                operacaoTexto = 'Adição';
                break;
            case '-':
                resultado = numero1 - numero2;
                operacaoTexto = 'Subtração';
                break;
            case '*':
                resultado = numero1 * numero2;
                operacaoTexto = 'Multiplicação';
                break;
            case '/':
                resultado = numero1 / numero2;
                operacaoTexto = 'Divisão';
                break;
            default:
                mostrarErro('Operador inválido!');
                return;
        }

        mostrarResultado(numero1, numero2, operador, resultado, operacaoTexto);
    }

    function mostrarResultado(num1, num2, op, resultado, operacaoTexto) {
        const simboloOperador = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };

        const resultadoFormatado = Number.isInteger(resultado) ? resultado : resultado.toFixed(2);

        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="mb-3">
                    <h4 class="text-primary mb-2">
                        <i class="bi bi-calculator-fill"></i> ${operacaoTexto}
                    </h4>
                    <div class="operation-display">
                        <span class="number">${num1}</span>
                        <span class="operator">${simboloOperador[op]}</span>
                        <span class="number">${num2}</span>
                        <span class="equals">=</span>
                        <span class="result-value">${resultadoFormatado}</span>
                    </div>
                </div>
                <div class="alert alert-success mb-0" role="alert">
                    <i class="bi bi-check-circle-fill"></i>
                    <strong>Resultado:</strong> ${resultadoFormatado}
                </div>
            </div>
        `;

        // Adicionar estilos inline para a operação
        const style = document.createElement('style');
        style.textContent = `
            .operation-display {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 1rem 0;
                color: #495057;
            }
            .operation-display .number {
                color: #007bff;
                margin: 0 0.5rem;
            }
            .operation-display .operator {
                color: #dc3545;
                font-weight: 700;
                margin: 0 0.5rem;
            }
            .operation-display .equals {
                color: #28a745;
                font-weight: 700;
                margin: 0 0.5rem;
            }
            .operation-display .result-value {
                color: #17a2b8;
                font-weight: 700;
                font-size: 1.8rem;
                margin: 0 0.5rem;
            }
        `;
        
        // Remover style anterior se existir
        const existingStyle = document.querySelector('style[data-calc="true"]');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.setAttribute('data-calc', 'true');
        document.head.appendChild(style);

        // Mostrar o card de resultado com animação
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function mostrarErro(mensagem) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <strong>Erro:</strong> ${mensagem}
            </div>
        `;
        
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

function limparTudo() {
    // Limpar campos do formulário
    document.getElementById('calculatorForm').reset();
    
    // Remover classes de validação
    const campos = document.querySelectorAll('.form-control, .form-select');
    campos.forEach(campo => {
        campo.classList.remove('is-invalid', 'is-valid');
    });
    
    // Esconder resultado
    const resultCard = document.querySelector('.result-card');
    resultCard.style.display = 'none';
    
    // Focar no primeiro campo
    document.getElementById('numero1').focus();
    
    // Mostrar feedback visual
    const btnLimpar = document.querySelector('button[onclick="limparTudo()"]');
    const textoOriginal = btnLimpar.innerHTML;
    btnLimpar.innerHTML = '<i class="bi bi-check"></i> Limpo!';
    btnLimpar.classList.add('btn-success');
    btnLimpar.classList.remove('btn-secondary');
    
    setTimeout(() => {
        btnLimpar.innerHTML = textoOriginal;
        btnLimpar.classList.remove('btn-success');
        btnLimpar.classList.add('btn-secondary');
    }, 1000);
}

// Adicionar validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    const campos = document.querySelectorAll('.form-control, .form-select');
    
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validarCampo(this);
            }
        });
    });
});

function validarCampo(campo) {
    if (campo.type === 'number') {
        if (!campo.value.trim() || isNaN(campo.value)) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
        } else {
            // Verificar divisão por zero
            if (campo.id === 'numero2') {
                const operador = document.getElementById('operador').value;
                if (operador === '/' && parseFloat(campo.value) === 0) {
                    campo.classList.add('is-invalid');
                    campo.classList.remove('is-valid');
                    return;
                }
            }
            campo.classList.add('is-valid');
            campo.classList.remove('is-invalid');
        }
    } else if (campo.tagName === 'SELECT') {
        if (!campo.value) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
        } else {
            campo.classList.add('is-valid');
            campo.classList.remove('is-invalid');
        }
    }
}