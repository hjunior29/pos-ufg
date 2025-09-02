document.addEventListener('DOMContentLoaded', function() {
    const imcForm = document.getElementById('imcForm');
    const resultCard = document.querySelector('.result-card');
    const resultDiv = document.getElementById('resultado');

    imcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            calcularIMC();
        }
    });

    function validarFormulario() {
        const altura = document.getElementById('altura');
        const peso = document.getElementById('peso');
        let isValid = true;

        // Reset estados anteriores
        [altura, peso].forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });

        // Validar altura
        const alturaValue = parseFloat(altura.value);
        if (!altura.value.trim() || isNaN(alturaValue) || alturaValue < 0.5 || alturaValue > 3) {
            altura.classList.add('is-invalid');
            isValid = false;
        } else {
            altura.classList.add('is-valid');
        }

        // Validar peso
        const pesoValue = parseFloat(peso.value);
        if (!peso.value.trim() || isNaN(pesoValue) || pesoValue < 20 || pesoValue > 500) {
            peso.classList.add('is-invalid');
            isValid = false;
        } else {
            peso.classList.add('is-valid');
        }

        return isValid;
    }

    function calcularIMC() {
        const altura = parseFloat(document.getElementById('altura').value);
        const peso = parseFloat(document.getElementById('peso').value);
        
        // Calcular IMC
        const imc = peso / (altura * altura);
        const imcFormatado = imc.toFixed(1);

        // Determinar classificação e grau
        const classificacao = obterClassificacao(imc);
        
        mostrarResultado(imcFormatado, classificacao, altura, peso);
        destacarLinhaTabela(imc);
    }

    function obterClassificacao(imc) {
        if (imc < 16) {
            return {
                situacao: 'Magreza grave',
                grau: '0',
                classe: 'magreza-grave',
                icon: 'exclamation-triangle-fill',
                headerClass: 'bg-danger'
            };
        } else if (imc >= 16 && imc <= 16.9) {
            return {
                situacao: 'Magreza moderada',
                grau: '0',
                classe: 'magreza-moderada',
                icon: 'exclamation-triangle',
                headerClass: 'bg-warning'
            };
        } else if (imc >= 17 && imc <= 18.5) {
            return {
                situacao: 'Magreza leve',
                grau: '0',
                classe: 'magreza-leve',
                icon: 'info-circle',
                headerClass: 'bg-warning'
            };
        } else if (imc >= 18.6 && imc <= 24.9) {
            return {
                situacao: 'Peso ideal',
                grau: '0',
                classe: 'peso-ideal',
                icon: 'check-circle-fill',
                headerClass: 'bg-success'
            };
        } else if (imc >= 25 && imc <= 29.9) {
            return {
                situacao: 'Sobrepeso',
                grau: '0',
                classe: 'sobrepeso',
                icon: 'exclamation-circle',
                headerClass: 'bg-warning'
            };
        } else if (imc >= 30 && imc <= 34.9) {
            return {
                situacao: 'Obesidade grau I',
                grau: 'I',
                classe: 'obesidade-1',
                icon: 'exclamation-triangle',
                headerClass: 'bg-danger'
            };
        } else if (imc >= 35 && imc <= 39.9) {
            return {
                situacao: 'Obesidade grau II ou severa',
                grau: 'II',
                classe: 'obesidade-2',
                icon: 'exclamation-triangle-fill',
                headerClass: 'bg-danger'
            };
        } else {
            return {
                situacao: 'Obesidade grau III ou mórbida',
                grau: 'III',
                classe: 'obesidade-3',
                icon: 'exclamation-octagon-fill',
                headerClass: 'bg-danger'
            };
        }
    }

    function mostrarResultado(imc, classificacao, altura, peso) {
        // Atualizar header do card com a cor apropriada
        const cardHeader = resultCard.querySelector('.card-header');
        cardHeader.className = `card-header ${classificacao.headerClass} text-white`;

        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-muted mb-2">Seus dados:</h5>
                        <p class="mb-1"><strong>Altura:</strong> ${altura}m</p>
                        <p class="mb-1"><strong>Peso:</strong> ${peso}kg</p>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-muted mb-2">Resultado:</h5>
                        <div class="imc-value">${imc}</div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <div class="imc-classification ${classificacao.classe}">
                    <i class="bi bi-${classificacao.icon}"></i>
                    ${classificacao.situacao}
                </div>
                
                <div class="imc-degree">
                    <strong>Grau de Obesidade:</strong> ${classificacao.grau}
                </div>
                
                <div class="mt-3">
                    ${obterRecomendacao(classificacao.situacao)}
                </div>
            </div>
        `;

        // Mostrar o card de resultado com animação
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function obterRecomendacao(situacao) {
        const recomendacoes = {
            'Magreza grave': {
                texto: 'Procure orientação médica imediatamente. Pode ser necessário acompanhamento nutricional especializado.',
                classe: 'alert-danger'
            },
            'Magreza moderada': {
                texto: 'Recomenda-se consultar um médico e nutricionista para avaliação e orientação.',
                classe: 'alert-warning'
            },
            'Magreza leve': {
                texto: 'Considere consultar um nutricionista para orientações sobre ganho de peso saudável.',
                classe: 'alert-info'
            },
            'Peso ideal': {
                texto: 'Parabéns! Seu peso está dentro da faixa considerada saudável. Mantenha hábitos saudáveis.',
                classe: 'alert-success'
            },
            'Sobrepeso': {
                texto: 'Considere adotar uma dieta equilibrada e atividade física regular. Consulte um profissional.',
                classe: 'alert-warning'
            },
            'Obesidade grau I': {
                texto: 'Importante buscar orientação médica e nutricional para um plano de emagrecimento saudável.',
                classe: 'alert-danger'
            },
            'Obesidade grau II ou severa': {
                texto: 'Procure acompanhamento médico especializado urgentemente para avaliação e tratamento.',
                classe: 'alert-danger'
            },
            'Obesidade grau III ou mórbida': {
                texto: 'Necessário acompanhamento médico imediato. Podem ser consideradas intervenções especializadas.',
                classe: 'alert-danger'
            }
        };

        const recomendacao = recomendacoes[situacao] || recomendacoes['Peso ideal'];
        
        return `
            <div class="alert ${recomendacao.classe}" role="alert">
                <i class="bi bi-lightbulb"></i>
                <strong>Recomendação:</strong> ${recomendacao.texto}
            </div>
        `;
    }

    function destacarLinhaTabela(imc) {
        // Remover destaque anterior
        const linhas = document.querySelectorAll('.table tbody tr');
        linhas.forEach(linha => linha.classList.remove('highlight'));

        // Encontrar e destacar a linha correspondente
        let linhaPraDestacar;
        
        if (imc < 16) {
            linhaPraDestacar = 0;
        } else if (imc >= 16 && imc <= 16.9) {
            linhaPraDestacar = 1;
        } else if (imc >= 17 && imc <= 18.5) {
            linhaPraDestacar = 2;
        } else if (imc >= 18.6 && imc <= 24.9) {
            linhaPraDestacar = 3;
        } else if (imc >= 25 && imc <= 29.9) {
            linhaPraDestacar = 4;
        } else if (imc >= 30 && imc <= 34.9) {
            linhaPraDestacar = 5;
        } else if (imc >= 35 && imc <= 39.9) {
            linhaPraDestacar = 6;
        } else {
            linhaPraDestacar = 7;
        }

        if (linhaPraDestacar !== undefined && linhas[linhaPraDestacar]) {
            linhas[linhaPraDestacar].classList.add('highlight');
            
            // Scroll suave para a tabela
            setTimeout(() => {
                document.querySelector('.table-card').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 1000);
        }
    }
});

function limparTudo() {
    // Limpar campos do formulário
    document.getElementById('imcForm').reset();
    
    // Remover classes de validação
    const campos = document.querySelectorAll('.form-control');
    campos.forEach(campo => {
        campo.classList.remove('is-invalid', 'is-valid');
    });
    
    // Esconder resultado
    const resultCard = document.querySelector('.result-card');
    resultCard.style.display = 'none';
    
    // Remover destaque da tabela
    const linhas = document.querySelectorAll('.table tbody tr');
    linhas.forEach(linha => linha.classList.remove('highlight'));
    
    // Focar no primeiro campo
    document.getElementById('altura').focus();
    
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
    const campos = document.querySelectorAll('.form-control');
    
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
    const valor = parseFloat(campo.value);
    
    if (campo.id === 'altura') {
        if (!campo.value.trim() || isNaN(valor) || valor < 0.5 || valor > 3) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
        } else {
            campo.classList.add('is-valid');
            campo.classList.remove('is-invalid');
        }
    } else if (campo.id === 'peso') {
        if (!campo.value.trim() || isNaN(valor) || valor < 20 || valor > 500) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
        } else {
            campo.classList.add('is-valid');
            campo.classList.remove('is-invalid');
        }
    }
}

// Adicionar formatação automática para campos numéricos
document.addEventListener('DOMContentLoaded', function() {
    const alturaInput = document.getElementById('altura');
    const pesoInput = document.getElementById('peso');
    
    // Formatação da altura (máximo 2 casas decimais)
    alturaInput.addEventListener('input', function() {
        let value = this.value;
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1] && parts[1].length > 2) {
                this.value = parts[0] + '.' + parts[1].substring(0, 2);
            }
        }
    });
    
    // Formatação do peso (máximo 1 casa decimal)
    pesoInput.addEventListener('input', function() {
        let value = this.value;
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1] && parts[1].length > 1) {
                this.value = parts[0] + '.' + parts[1].substring(0, 1);
            }
        }
    });
});