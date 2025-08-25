// Função para exibir resultados na área de resultados
function exibirResultado(titulo, conteudo) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="alert alert-success">
            <h6 class="alert-heading"><i class="bi bi-check-circle"></i> ${titulo}</h6>
            <hr>
            ${conteudo}
        </div>
    `;
    
    // Scroll suave para a área de resultados
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Exercício 1: Calcular média do aluno
function exercicio1() {
    try {
        // Solicitar dados do aluno
        const nomeAluno = prompt("Digite o nome do aluno:");
        if (!nomeAluno) {
            alert("Nome do aluno é obrigatório!");
            return;
        }

        const disciplina = prompt("Digite o nome da disciplina:");
        if (!disciplina) {
            alert("Nome da disciplina é obrigatório!");
            return;
        }

        const nota1 = parseFloat(prompt("Digite a primeira nota:"));
        if (isNaN(nota1) || nota1 < 0 || nota1 > 10) {
            alert("A primeira nota deve ser um número entre 0 e 10!");
            return;
        }

        const nota2 = parseFloat(prompt("Digite a segunda nota:"));
        if (isNaN(nota2) || nota2 < 0 || nota2 > 10) {
            alert("A segunda nota deve ser um número entre 0 e 10!");
            return;
        }

        // Calcular média
        const media = (nota1 + nota2) / 2;
        
        // Status do aluno
        let status = "";
        if (media >= 7) {
            status = '<span class="text-success">Aprovado</span>';
        } else if (media >= 5) {
            status = '<span class="text-warning">Recuperação</span>';
        } else {
            status = '<span class="text-danger">Reprovado</span>';
        }

        // Exibir resultado
        const resultado = `
            <div class="row">
                <div class="col-md-6">
                    <strong>Nome do Aluno:</strong> ${nomeAluno}<br>
                    <strong>Disciplina:</strong> ${disciplina}<br>
                </div>
                <div class="col-md-6">
                    <strong>Nota 1:</strong> ${nota1.toFixed(1)}<br>
                    <strong>Nota 2:</strong> ${nota2.toFixed(1)}<br>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <h5><strong>Média:</strong> ${media.toFixed(1)}</h5>
                <h6><strong>Status:</strong> ${status}</h6>
            </div>
        `;

        exibirResultado("Média do Aluno - Resultado", resultado);

    } catch (error) {
        alert("Erro ao calcular a média. Tente novamente!");
        console.error("Erro no exercício 1:", error);
    }
}

// Exercício 2: Calcular idade
function exercicio2() {
    try {
        const anoNascimento = parseInt(prompt("Digite o ano de nascimento:"));
        
        if (isNaN(anoNascimento) || anoNascimento < 1900 || anoNascimento > 2024) {
            alert("Por favor, digite um ano válido entre 1900 e 2024!");
            return;
        }

        // Calcular idade em 2024
        const idade = 2024 - anoNascimento;
        
        // Determinar se já completou ou irá completar
        const anoAtual = new Date().getFullYear();
        let texto = "";
        
        if (anoAtual >= 2024) {
            texto = `Quem nasceu em <strong>${anoNascimento}</strong> tem <strong>${idade} anos</strong> em 2024.`;
        } else {
            texto = `Quem nasceu em <strong>${anoNascimento}</strong> irá completar <strong>${idade} anos</strong> em 2024.`;
        }

        // Informações adicionais
        const anoAtualIdade = anoAtual - anoNascimento;
        const informacoes = `
            <div class="text-center">
                <div class="alert alert-info">
                    <h5>${texto}</h5>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-4">
                        <strong>Ano de Nascimento:</strong><br>
                        <span class="h6">${anoNascimento}</span>
                    </div>
                    <div class="col-md-4">
                        <strong>Idade em 2024:</strong><br>
                        <span class="h6">${idade} anos</span>
                    </div>
                    <div class="col-md-4">
                        <strong>Idade atual (${anoAtual}):</strong><br>
                        <span class="h6">${anoAtualIdade} anos</span>
                    </div>
                </div>
            </div>
        `;

        exibirResultado("Cálculo de Idade - Resultado", informacoes);

    } catch (error) {
        alert("Erro ao calcular a idade. Tente novamente!");
        console.error("Erro no exercício 2:", error);
    }
}

// Exercício 3: Calcular fatorial
function exercicio3() {
    try {
        const numero = parseInt(prompt("Digite um número para calcular o fatorial:"));
        
        if (isNaN(numero) || numero < 0) {
            alert("Por favor, digite um número inteiro não negativo!");
            return;
        }

        if (numero > 20) {
            alert("Número muito grande! Digite um número menor que 20 para evitar overflow.");
            return;
        }

        // Calcular fatorial
        function calcularFatorial(n) {
            if (n === 0 || n === 1) {
                return 1;
            }
            return n * calcularFatorial(n - 1);
        }

        const fatorial = calcularFatorial(numero);
        
        // Mostrar o cálculo passo a passo
        let calculo = "";
        if (numero === 0 || numero === 1) {
            calculo = `${numero}! = 1`;
        } else {
            let passos = [];
            for (let i = numero; i >= 1; i--) {
                passos.push(i.toString());
            }
            calculo = `${numero}! = ${passos.join(' × ')} = ${fatorial}`;
        }

        const resultado = `
            <div class="text-center">
                <div class="alert alert-primary">
                    <h5>O fatorial de <strong>${numero}</strong> é <strong>${fatorial}</strong></h5>
                </div>
                <hr>
                <div class="bg-light p-3 rounded">
                    <strong>Cálculo:</strong><br>
                    <code class="fs-5">${calculo}</code>
                </div>
                <hr>
                <small class="text-muted">
                    <strong>Definição:</strong> O fatorial de um número n (n!) é o produto de todos os números inteiros positivos menores ou iguais a n.
                </small>
            </div>
        `;

        exibirResultado("Cálculo de Fatorial - Resultado", resultado);

    } catch (error) {
        alert("Erro ao calcular o fatorial. Tente novamente!");
        console.error("Erro no exercício 3:", error);
    }
}

// Exercício 4: Verificar par ou ímpar
function exercicio4() {
    try {
        const numero = parseInt(prompt("Digite um número para verificar se é par ou ímpar:"));
        
        if (isNaN(numero)) {
            alert("Por favor, digite um número inteiro válido!");
            return;
        }

        // Verificar se é par ou ímpar
        const ehPar = numero % 2 === 0;
        const resultado = ehPar ? "par" : "ímpar";
        
        // Cor baseada no resultado
        const cor = ehPar ? "success" : "warning";
        const icone = ehPar ? "bi-check-circle" : "bi-exclamation-circle";

        const conteudo = `
            <div class="text-center">
                <div class="alert alert-${cor}">
                    <h5><i class="bi ${icone}"></i> O número <strong>${numero}</strong> que foi digitado é <strong>${resultado}</strong>!</h5>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-6">
                        <div class="card border-${cor}">
                            <div class="card-body text-center">
                                <h6 class="card-title">Número digitado</h6>
                                <h3 class="text-${cor}">${numero}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card border-${cor}">
                            <div class="card-body text-center">
                                <h6 class="card-title">Resultado</h6>
                                <h3 class="text-${cor}">${resultado.toUpperCase()}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="bg-light p-3 rounded">
                    <strong>Verificação:</strong><br>
                    <code>${numero} ÷ 2 = ${Math.floor(numero / 2)} (resto: ${numero % 2})</code><br>
                    <small class="text-muted">
                        ${ehPar ? 'Como o resto é 0, o número é par.' : 'Como o resto é 1, o número é ímpar.'}
                    </small>
                </div>
            </div>
        `;

        exibirResultado("Verificação Par/Ímpar - Resultado", conteudo);

    } catch (error) {
        alert("Erro ao verificar par/ímpar. Tente novamente!");
        console.error("Erro no exercício 4:", error);
    }
}

// Exercício 5: Mostrar tabuada
function exercicio5() {
    try {
        const numero = parseInt(prompt("Digite um número para ver sua tabuada:"));
        
        if (isNaN(numero)) {
            alert("Por favor, digite um número inteiro válido!");
            return;
        }

        if (Math.abs(numero) > 100) {
            alert("Número muito grande! Digite um número entre -100 e 100.");
            return;
        }

        // Gerar tabuada
        let tabuada = `
            <div class="text-center mb-3">
                <div class="alert alert-info">
                    <h5><i class="bi bi-table"></i> Tabuada do <strong>${numero}</strong></h5>
                </div>
            </div>
            <div class="row">
        `;

        // Criar cards para cada linha da tabuada
        for (let i = 1; i <= 10; i++) {
            const resultado = numero * i;
            tabuada += `
                <div class="col-lg-6 col-md-6 mb-2">
                    <div class="card border-primary">
                        <div class="card-body py-2 text-center">
                            <code class="fs-5">${numero} × ${i} = <strong>${resultado}</strong></code>
                        </div>
                    </div>
                </div>
            `;
        }

        tabuada += `
            </div>
            <hr>
            <div class="text-center">
                <div class="bg-light p-3 rounded">
                    <strong>Cálculo Completo da Tabuada do ${numero}:</strong><br>
                    <div class="mt-2">
        `;

        // Lista completa em uma linha
        for (let i = 1; i <= 10; i++) {
            const resultado = numero * i;
            tabuada += `<small class="d-block">${numero} × ${i} = ${resultado}</small>`;
        }

        tabuada += `
                    </div>
                </div>
            </div>
        `;

        exibirResultado("Tabuada - Resultado", tabuada);

    } catch (error) {
        alert("Erro ao gerar a tabuada. Tente novamente!");
        console.error("Erro no exercício 5:", error);
    }
}