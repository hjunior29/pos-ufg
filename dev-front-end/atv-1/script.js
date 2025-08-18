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
            
            window.location.href = 'welcome.html';
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
});