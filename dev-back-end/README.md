# Sistema de Garçom Eletrônico - Backend API

API REST para gerenciamento de restaurante com sistema de garçom eletrônico.

## Tecnologias Utilizadas

### Linguagem de Programação
- **JavaScript/TypeScript**: Linguagem principal do projeto, escolhida por sua ampla adoção, tipagem estática (TypeScript) e excelente suporte a APIs modernas.

### Framework
- **NestJS**: Framework progressivo para construção de aplicações Node.js eficientes e escaláveis. Escolhido pelos seguintes motivos:
  - Arquitetura modular e organizada baseada em Angular
  - Suporte nativo a TypeScript
  - Injeção de dependências integrada
  - Decorators para validação de dados (class-validator)
  - Fácil integração com bancos de dados (TypeORM, Prisma)
  - Excelente documentação e comunidade ativa

## Estrutura do Projeto

```
dev-back-end/
├── src/
│   └── domain/
│       └── dto/           # Data Transfer Objects (Camada de Domínio)
│           ├── caixa.dto.ts
│           ├── cardapio.dto.ts
│           ├── categoria.dto.ts
│           ├── cliente.dto.ts
│           ├── conta.dto.ts
│           ├── cozinha.dto.ts
│           ├── garcom.dto.ts
│           ├── gerente.dto.ts
│           ├── index.ts
│           ├── item-cardapio.dto.ts
│           ├── item-pedido.dto.ts
│           ├── mesa.dto.ts
│           ├── pagamento.dto.ts
│           ├── pedido.dto.ts
│           ├── restaurante.dto.ts
│           └── usuario.dto.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Camada de Domínio - DTOs

### Classes Implementadas

#### 1. **RestauranteDto** ([restaurante.dto.ts](src/domain/dto/restaurante.dto.ts))
Representa a entidade principal do sistema - o restaurante.
- `nome: string` - Nome do restaurante

#### 2. **UsuarioDto** ([usuario.dto.ts](src/domain/dto/usuario.dto.ts))
Classe base para todos os tipos de usuários do sistema.
- `nome: string` - Nome do usuário
- `login: string` - Login de acesso
- `senha: string` - Senha de acesso

**Especializações de Usuário:**
- **GarcomDto** ([garcom.dto.ts](src/domain/dto/garcom.dto.ts)) - Atende mesas
- **GerenteDto** ([gerente.dto.ts](src/domain/dto/gerente.dto.ts)) - Define cardápios
- **CozinhaDto** ([cozinha.dto.ts](src/domain/dto/cozinha.dto.ts)) - Recebe pedidos
- **CaixaDto** ([caixa.dto.ts](src/domain/dto/caixa.dto.ts)) - Gerencia pagamentos

#### 3. **MesaDto** ([mesa.dto.ts](src/domain/dto/mesa.dto.ts))
Representa as mesas do restaurante.
- `numero: number` - Número da mesa
- `disponivel: boolean` - Indica se a mesa está disponível

#### 4. **ContaDto** ([conta.dto.ts](src/domain/dto/conta.dto.ts))
Representa a conta de uma mesa.
- `nome: string` - Nome da conta

#### 5. **ClienteDto** ([cliente.dto.ts](src/domain/dto/cliente.dto.ts))
Representa um cliente que faz pedidos.
- `nome: string` - Nome do cliente
- `horaChegada: Date` - Horário de chegada
- `horaSaida: Date` - Horário de saída

#### 6. **PedidoDto** ([pedido.dto.ts](src/domain/dto/pedido.dto.ts))
Representa um pedido feito por um cliente.
- `numero: number` - Número do pedido
- `horarioPedido: Date` - Horário em que o pedido foi feito
- `horarioEntrega: Date` - Horário de entrega do pedido

#### 7. **ItemPedidoDto** ([item-pedido.dto.ts](src/domain/dto/item-pedido.dto.ts))
Representa um item dentro de um pedido.
- `quantidade: number` - Quantidade do item

#### 8. **CategoriaDto** ([categoria.dto.ts](src/domain/dto/categoria.dto.ts))
Representa categorias de itens do cardápio (pode ter subcategorias).
- `nome: string` - Nome da categoria

#### 9. **ItemCardapioDto** ([item-cardapio.dto.ts](src/domain/dto/item-cardapio.dto.ts))
Representa um item do cardápio.
- `nome: string` - Nome do item
- `ingredientes: string` - Lista de ingredientes
- `preco: number` - Preço do item
- `disponivelNaCozinha: boolean` - Indica disponibilidade na cozinha

#### 10. **CardapioDto** ([cardapio.dto.ts](src/domain/dto/cardapio.dto.ts))
Representa o cardápio definido pelo gerente.
- `nome: string` - Nome do cardápio

#### 11. **PagamentoDto** ([pagamento.dto.ts](src/domain/dto/pagamento.dto.ts))
Representa um pagamento. Implementado com herança de três formas:
- **DinheiroPagamentoDto** - Pagamento em dinheiro
- **CartaoPagamentoDto** - Pagamento em cartão
  - `nroTransacao: number` - Número da transação
- **ChequePagamentoDto** - Pagamento em cheque
  - `numero: number` - Número do cheque

### Padrão de DTOs

Cada entidade possui três variações de DTO:
1. **Base DTO** - Define todos os campos da entidade
2. **Create DTO** - Usado para criação (pode omitir campos auto-gerados)
3. **Update DTO** - Usado para atualização (todos os campos opcionais)

### Validações

Todos os DTOs utilizam decorators do `class-validator` para garantir a integridade dos dados:
- `@IsString()` - Valida strings
- `@IsInt()` - Valida números inteiros
- `@IsNumber()` - Valida números
- `@IsBoolean()` - Valida booleanos
- `@IsDateString()` - Valida datas
- `@IsEnum()` - Valida enumerações
- `@IsNotEmpty()` - Campo obrigatório
- `@Min()` - Valor mínimo

## Instalação

```bash
# Instalar dependências
npm install
```

## Scripts Disponíveis

```bash
# Compilar o projeto
npm run build

# Iniciar em modo de desenvolvimento
npm run start:dev

# Iniciar em modo de produção
npm start
```

## Dependências Principais

- `@nestjs/common` - Core do NestJS
- `@nestjs/core` - Funcionalidades principais do NestJS
- `@nestjs/platform-express` - Adapter para Express
- `class-validator` - Validação de classes com decorators
- `class-transformer` - Transformação de objetos
- `reflect-metadata` - Metadata reflection API
- `typescript` - Compilador TypeScript

## Próximos Passos

1. Implementar a camada de persistência (Entities e Repository)
2. Criar a camada de serviços (Business Logic)
3. Implementar os controllers (Endpoints REST)
4. Adicionar autenticação e autorização
5. Configurar banco de dados (PostgreSQL/MySQL)
6. Implementar testes unitários e de integração
7. Adicionar documentação Swagger/OpenAPI

## Diagrama de Classes

O projeto foi desenvolvido seguindo o diagrama de classes UML fornecido, que define:
- Relacionamentos entre entidades (1:1, 1:*, 0..*)
- Hierarquia de classes (herança)
- Atributos e tipos de dados
- Associações e composições

## Autor

Desenvolvido como parte do trabalho final do curso de Desenvolvimento Back-End da Pós-Graduação em Informática da UFG.
