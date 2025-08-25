document.addEventListener('DOMContentLoaded', function() {
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnSalvar = document.getElementById('btnSalvar');

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function() {
            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            
            if (usuario.trim() === '' || senha.trim() === '') {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            window.location.href = 'produtos.html';
        });
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', function() {
            window.location.href = 'cadastro.html';
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', function() {
            const form = document.getElementById('cadastroForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (field.value.trim() === '') {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            alert('Cadastro realizado com sucesso! Redirecionando para o login...');
            window.location.href = 'index.html';
        });
    }

    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.value = value;
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = value;
        });
    }

    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && this.value.trim() === '') {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnConfirmar.click();
            }
        });
    }

    // Carrinho de compras
    let carrinho = [];

    // Função para alterar quantidade de produtos
    window.alterarQuantidade = function(button, delta) {
        const input = button.parentElement.querySelector('.quantidade-input');
        let valor = parseInt(input.value) + delta;
        if (valor < 1) valor = 1;
        if (valor > 10) valor = 10;
        input.value = valor;
    }

    // Função para adicionar ao carrinho
    window.adicionarAoCarrinho = function(button) {
        const card = button.closest('.produto-card');
        const nome = card.querySelector('.card-title').textContent;
        const preco = parseFloat(card.querySelector('.h5.text-success').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const quantidade = parseInt(card.querySelector('.quantidade-input').value);
        const img = card.querySelector('.card-img-top').src;
        
        const itemExistente = carrinho.find(item => item.nome === nome);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: quantidade,
                img: img
            });
        }
        
        atualizarCarrinho();
        mostrarToast('Produto adicionado ao carrinho!');
    }

    // Função para remover do carrinho
    window.removerDoCarrinho = function(index) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    }

    // Função para alterar quantidade no carrinho
    window.alterarQuantidadeCarrinho = function(index, delta) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        atualizarCarrinho();
    }

    // Função para atualizar o carrinho
    function atualizarCarrinho() {
        const contadorCarrinho = document.getElementById('contadorCarrinho');
        const itensCarrinho = document.getElementById('itensCarrinho');
        const totalCarrinho = document.getElementById('totalCarrinho');
        const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
        
        if (contadorCarrinho) {
            const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
            contadorCarrinho.textContent = totalItens;
        }
        
        if (itensCarrinho) {
            if (carrinho.length === 0) {
                itensCarrinho.innerHTML = '<p class="text-muted text-center">Seu carrinho está vazio</p>';
            } else {
                itensCarrinho.innerHTML = carrinho.map((item, index) => `
                    <div class="item-carrinho">
                        <div class="d-flex align-items-center">
                            <img src="${item.img}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${item.nome}</h6>
                                <small class="text-muted">R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary btn-quantity" onclick="alterarQuantidadeCarrinho(${index}, -1)">-</button>
                                <span class="mx-2">${item.quantidade}</span>
                                <button class="btn btn-sm btn-outline-secondary btn-quantity" onclick="alterarQuantidadeCarrinho(${index}, 1)">+</button>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="removerDoCarrinho(${index})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        if (totalCarrinho) {
            const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
            totalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
        
        if (btnFinalizarCompra) {
            btnFinalizarCompra.disabled = carrinho.length === 0;
        }

        // Salvar no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    // Função para finalizar compra
    window.finalizarCompra = function() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        window.location.href = 'pagamento.html';
    }

    // Função para mostrar toast
    function mostrarToast(mensagem) {
        // Criar elemento toast simples
        const toast = document.createElement('div');
        toast.className = 'position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success alert-dismissible';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    // Carregar carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }

    // === FUNCIONALIDADES DA PÁGINA DE PAGAMENTO ===
    const bandeiraCartao = document.getElementById('bandeiraCartao');
    const numeroCartao = document.getElementById('numeroCartao');
    const dataExpiracao = document.getElementById('dataExpiracao');
    const codigoSeguranca = document.getElementById('codigoSeguranca');
    const nomeCartao = document.getElementById('nomeCartao');
    const btnFinalizar = document.getElementById('btnFinalizar');
    const mesmoEndereco = document.getElementById('mesmoEndereco');
    const enderecoCobranca = document.getElementById('enderecoCobranca');

    // Atualizar imagem da bandeira
    if (bandeiraCartao) {
        bandeiraCartao.addEventListener('change', function() {
            const bandeiraImg = document.getElementById('bandeiraImg');
            const bandeiras = {
                'visa': 'https://via.placeholder.com/80x50/1a1f71/ffffff?text=VISA',
                'mastercard': 'https://via.placeholder.com/80x50/eb001b/ffffff?text=MASTER',
                'amex': 'https://via.placeholder.com/80x50/006fcf/ffffff?text=AMEX'
            };
            
            if (this.value && bandeiras[this.value]) {
                bandeiraImg.src = bandeiras[this.value];
                bandeiraImg.style.display = 'inline-block';
            } else {
                bandeiraImg.style.display = 'none';
            }
        });
    }

    // Formatação do número do cartão
    if (numeroCartao) {
        numeroCartao.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
            this.value = valor;
            
            // Validação simples
            if (valor.replace(/\s/g, '').length < 13) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }

    // Formatação da data de expiração
    if (dataExpiracao) {
        dataExpiracao.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
            this.value = valor;
            
            // Validação simples
            const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!regex.test(valor)) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }

    // Formatação do código de segurança
    if (codigoSeguranca) {
        codigoSeguranca.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            
            const tamanho = bandeiraCartao && bandeiraCartao.value === 'amex' ? 4 : 3;
            if (this.value.length < tamanho) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }

    // Nome do cartão em maiúsculas
    if (nomeCartao) {
        nomeCartao.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            
            if (this.value.length < 2) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }

    // Toggle endereço de cobrança
    if (mesmoEndereco) {
        mesmoEndereco.addEventListener('change', function() {
            if (enderecoCobranca) {
                enderecoCobranca.style.display = this.checked ? 'none' : 'block';
            }
        });
    }

    // CEP de cobrança
    const cepCobranca = document.getElementById('cepCobranca');
    if (cepCobranca) {
        cepCobranca.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = valor;
        });
    }

    // Atualizar resumo do pedido na página de pagamento
    if (document.getElementById('subtotalResumo')) {
        const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        document.getElementById('subtotalResumo').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        document.getElementById('totalResumo').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Finalizar pagamento
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function() {
            const form = document.getElementById('pagamentoForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (field.value.trim() === '' || field.classList.contains('is-invalid')) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }
            
            // Simular processamento
            this.innerHTML = '<i class="bi bi-hourglass-split"></i> Processando...';
            this.disabled = true;
            
            setTimeout(() => {
                // Limpar carrinho
                carrinho = [];
                localStorage.removeItem('carrinho');
                window.location.href = 'finalizacao.html';
            }, 2000);
        });
    }
});