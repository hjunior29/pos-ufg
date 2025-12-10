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

### Banco de Dados
- **SQLite**: Banco de dados relacional leve, ideal para desenvolvimento e demonstração
- **TypeORM**: ORM (Object-Relational Mapping) para gerenciamento de entidades e consultas

## Estrutura do Projeto

```
dev-back-end/
├── src/
│   ├── app.module.ts          # Módulo principal da aplicação
│   ├── main.ts                # Ponto de entrada da aplicação
│   ├── database/              # Configuração do banco de dados
│   │   ├── data-source.ts     # DataSource para migrations
│   │   ├── run-migrations.ts  # Script para executar migrations
│   │   ├── revert-migrations.ts # Script para reverter migrations
│   │   └── migrations/        # Arquivos de migration
│   │       └── 1733540000000-CreateInitialTables.ts
│   ├── domain/
│   │   ├── dto/               # Data Transfer Objects (Camada de Domínio)
│   │   │   └── *.dto.ts
│   │   └── entities/          # Entidades do banco de dados
│   │       ├── mesa.entity.ts
│   │       ├── conta.entity.ts
│   │       ├── pedido.entity.ts
│   │       ├── item-pedido.entity.ts
│   │       ├── item-cardapio.entity.ts
│   │       └── index.ts
│   └── modules/               # Módulos da aplicação
│       ├── mesa/              # Módulo de Mesas
│       ├── pedido/            # Módulo de Pedidos
│       ├── conta/             # Módulo de Contas
│       └── item-cardapio/     # Módulo de Itens do Cardápio
├── garcom-eletronico.db       # Banco de dados SQLite
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints da API

### Módulo Mesa (`/api/mesas`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/mesas` | Listar todas as mesas |
| GET | `/api/mesas/disponiveis` | Listar mesas disponíveis |
| GET | `/api/mesas/:id` | Buscar mesa por ID |
| POST | `/api/mesas` | Criar nova mesa |
| PUT | `/api/mesas/:id` | Atualizar mesa |
| DELETE | `/api/mesas/:id` | Remover mesa |
| **PATCH** | `/api/mesas/:id/ocupar` | **[NÃO-CRUD]** Ocupar mesa |
| PATCH | `/api/mesas/:id/liberar` | Liberar mesa |

### Módulo Pedido (`/api/pedidos`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar todos os pedidos |
| GET | `/api/pedidos/:id` | Buscar pedido por ID |
| GET | `/api/pedidos/conta/:contaId` | Listar pedidos de uma conta |
| POST | `/api/pedidos` | Criar novo pedido |
| POST | `/api/pedidos/:id/itens` | Adicionar item ao pedido |
| DELETE | `/api/pedidos/:id` | Remover pedido |
| **POST** | `/api/pedidos/:id/enviar-cozinha` | **[NÃO-CRUD]** Enviar para cozinha |
| PATCH | `/api/pedidos/:id/em-preparo` | Marcar em preparo |
| PATCH | `/api/pedidos/:id/pronto` | Marcar como pronto |
| PATCH | `/api/pedidos/:id/entregue` | Marcar como entregue |

### Módulo Conta (`/api/contas`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/contas` | Listar todas as contas |
| GET | `/api/contas/abertas` | Listar contas abertas |
| GET | `/api/contas/:id` | Buscar conta por ID |
| GET | `/api/contas/:id/resumo` | Obter resumo da conta |
| GET | `/api/contas/mesa/:mesaId` | Listar contas de uma mesa |
| POST | `/api/contas` | Criar nova conta |
| PUT | `/api/contas/:id` | Atualizar conta |
| DELETE | `/api/contas/:id` | Remover conta |
| **POST** | `/api/contas/:id/fechar` | **[NÃO-CRUD]** Fechar conta |
| POST | `/api/contas/:id/pagar` | Marcar como paga |

### Módulo Item Cardápio (`/api/itens-cardapio`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/itens-cardapio` | Listar todos os itens |
| GET | `/api/itens-cardapio/disponiveis` | Listar itens disponíveis |
| GET | `/api/itens-cardapio/:id` | Buscar item por ID |
| POST | `/api/itens-cardapio` | Criar novo item |
| PUT | `/api/itens-cardapio/:id` | Atualizar item |
| DELETE | `/api/itens-cardapio/:id` | Remover item |
| PATCH | `/api/itens-cardapio/:id/disponibilidade` | Alterar disponibilidade |

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

## Instalacao e Execucao

```bash
# Instalar dependencias
npm install

# Executar migrations (criar tabelas no banco)
npm run migration:run

# Iniciar o servidor
npm start
```

O servidor estara disponivel em `http://localhost:3000`

## Migrations (Banco de Dados)

O projeto utiliza TypeORM Migrations para controle do schema do banco de dados.

### Estrutura de Migrations

```
src/database/
├── data-source.ts                              # Configuracao do DataSource
├── run-migrations.ts                           # Script para executar migrations
├── revert-migrations.ts                        # Script para reverter migrations
└── migrations/
    └── 1733540000000-CreateInitialTables.ts    # Migration inicial
```

### Scripts Disponiveis

| Script | Comando | Descricao |
|--------|---------|-----------|
| `npm run migration:run` | Executa migrations | Cria/atualiza tabelas no banco |
| `npm run migration:revert` | Reverte migration | Desfaz a ultima migration |
| `npm run db:reset` | Recria banco | Remove o banco e executa migrations |

### Tabelas Criadas

A migration inicial cria as seguintes tabelas:

1. **mesas** - Mesas do restaurante
2. **itens_cardapio** - Itens do cardapio
3. **contas** - Contas das mesas (FK → mesas)
4. **pedidos** - Pedidos (FK → contas)
5. **itens_pedido** - Itens dos pedidos (FK → pedidos, itens_cardapio)

### Uso

```bash
# Primeira vez - criar banco e tabelas
npm run migration:run

# Reverter ultima migration
npm run migration:revert

# Recriar banco do zero (apaga dados!)
npm run db:reset
```

## Dependencias Principais

- `@nestjs/common` - Core do NestJS
- `@nestjs/core` - Funcionalidades principais do NestJS
- `@nestjs/platform-express` - Adapter para Express
- `@nestjs/typeorm` - Integracao TypeORM com NestJS
- `typeorm` - ORM para banco de dados
- `sqlite3` - Driver SQLite
- `class-validator` - Validacao de classes com decorators
- `class-transformer` - Transformacao de objetos
- `reflect-metadata` - Metadata reflection API
- `typescript` - Compilador TypeScript

## Documentacao Adicional

- [GUIA-APRESENTACAO.md](GUIA-APRESENTACAO.md) - Guia completo para apresentacao das URIs implementadas

## Diagrama de Classes

O projeto foi desenvolvido seguindo o diagrama de classes UML fornecido, que define:
- Relacionamentos entre entidades (1:1, 1:*, 0..*)
- Hierarquia de classes (heranca)
- Atributos e tipos de dados
- Associacoes e composicoes

## Autor

Desenvolvido como parte do trabalho final do curso de Desenvolvimento Back-End da Pos-Graduacao em Informatica da UFG.
