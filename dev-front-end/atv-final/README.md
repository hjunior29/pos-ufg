# Sistema de Gerenciamento de Conteúdo Pessoal (SGCP)

Um sistema dinâmico de gerenciamento de conteúdo pessoal inspirado no Evernote, apresentando um design moderno com operações CRUD completas, sistema de etiquetas, funcionalidade de busca e capacidade de alteração de temas.

## 📋 Visão Geral do Projeto

Este projeto implementa um sistema abrangente de gerenciamento de conteúdo pessoal, com foco na experiência do usuário, design responsivo e arquitetura de código limpa.

- **Operações CRUD**: Funcionalidade completa de Criar, Ler, Atualizar, Excluir para usuários e notas
- **Organização de Conteúdo**: Sistema avançado de etiquetas e categorização
- **Busca e Filtro**: Busca em tempo real com debouncing e filtragem baseada em etiquetas
- **Design Responsivo**: Abordagem mobile-first com experiência perfeita entre dispositivos

## 🏗️ Arquitetura e Tecnologias

### Stack Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework de aplicação web
- **PostgreSQL**: Banco de dados relacional para persistência de dados
- **Docker & Docker Compose**: Containerização e orquestração

### Stack Frontend
- **HTML5**: Markup semântico e acessibilidade
- **CSS3**: Estilização moderna com propriedades personalizadas CSS e grid/flexbox
- **JavaScript Vanilla**: Recursos ES6+ com arquitetura modular
- **Web APIs**: LocalStorage, Fetch API, MediaQuery API

### Esquema do Banco de Dados
```sql
users (id, name, email, created_at, updated_at)
notes (id, user_id, title, content, created_at, updated_at)
tags (id, name, color, created_at)
note_tags (note_id, tag_id) -- Relacionamento muitos-para-muitos
```

## 🚀 Recursos

### Funcionalidade Principal
- ✅ **Gerenciamento de Notas**: Criar, editar, atualizar e excluir notas com conteúdo rico
- ✅ **Sistema de Etiquetas**: Etiquetas com códigos de cores para organização de conteúdo
- ✅ **Busca em Tempo Real**: Busca de texto completo em títulos e conteúdo de notas
- ✅ **Filtragem por Etiquetas**: Filtrar notas por etiquetas específicas

### Experiência do Usuário
- ✅ **Design Responsivo**: Design mobile-first que funciona em todos os tamanhos de tela
- ✅ **Alternância de Tema**: Modo claro/escuro com detecção de preferência do sistema
- ✅ **Estados de Carregamento**: Feedback visual durante operações da API
- ✅ **Notificações Toast**: Mensagens de sucesso/erro não intrusivas
- ✅ **Estados Vazios**: Orientação útil quando não há conteúdo disponível

### Recursos Técnicos
- ✅ **Roteamento Client-side**: Aplicação de página única com gerenciamento de rotas
- ✅ **Busca com Debounce**: Performance otimizada da busca
- ✅ **Tratamento de Erros**: Tratamento abrangente de erros com feedback ao usuário
- ✅ **Arquitetura Modular**: Estrutura de código organizada com separação de responsabilidades
- ✅ **Suporte Docker**: Deployment completamente containerizado

## 🎨 Princípios de Design

### Sistema de Cores
- **Tema Claro**: Brancos limpos e cinzas sutis
- **Tema Escuro**: Pretos verdadeiros com contraste apropriado
- **Cores de Destaque**: Azul do sistema (#007AFF) como destaque primário
- **Cores de Etiquetas**: Paleta de cores semânticas para categorização
- **Sem Gradientes**: Cores sólidas com sombras sutis para profundidade

### Abordagem Responsiva
- **Mobile-first**: Projetado primeiro para dispositivos móveis
- **Breakpoints**: 768px (tablet) e 480px (mobile)
- **Grid Flexível**: CSS Grid e Flexbox para layouts responsivos
- **Touch-friendly**: Alvos de toque apropriados para interação móvel

## 📁 Estrutura do Projeto

```
atv-final/
├── backend/
│   ├── server.js           # Configuração do servidor Express
│   ├── db/
│   │   ├── connection.js   # Configuração de conexão PostgreSQL
│   │   └── schema.sql      # Esquema do banco e dados de exemplo
│   ├── models/
│   │   ├── user.js         # Modelo de dados e operações do usuário
│   │   └── note.js         # Modelo de dados e operações das notas
│   ├── routes/
│   │   ├── users.js        # Endpoints da API de usuários
│   │   └── notes.js        # Endpoints da API de notas
│   └── test/
│       ├── test.sh         # Script de teste CRUD para API
│       └── result.log      # Logs de execução dos testes
├── frontend/
│   ├── index.html          # Template principal da aplicação
│   ├── css/
│   │   └── styles.css      # Estilização completa com temas
│   └── js/
│       ├── app.js          # Lógica principal da aplicação
│       ├── api.js          # Camada de comunicação da API
│       ├── router.js       # Roteamento client-side
│       ├── components.js   # Componentes reutilizáveis de UI
│       └── theme.js        # Gerenciamento de temas
├── docker-compose.yml      # Orquestração Docker
├── Dockerfile             # Definição do container da aplicação
├── package.json           # Dependências Node.js
├── .env                   # Configuração de ambiente
└── README.md             # Esta documentação
```

## 🐳 Instalação e Configuração

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git para controle de versão

### Início Rápido com Docker

1. **Clone o repositório**
   ```bash
   git clone https://github.com/hjunior29/pos-ufg
   cd ./dev-front-end/atv-final
   ```

2. **Inicie a aplicação**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:3000`
   - O banco de dados será automaticamente inicializado com dados de exemplo

### Configuração de Desenvolvimento Local

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Inicie o PostgreSQL** (usando Docker)
   ```bash
   docker run --name sgcp-postgres -e POSTGRES_DB=sgcpd_db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres:15-alpine
   ```

3. **Inicialize o banco de dados**
   ```bash
   psql -h localhost -U admin -d sgcpd_db -f backend/db/schema.sql
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📖 Documentação da API

### Endpoints de Usuários
- `GET /api/users` - Obter todos os usuários
- `GET /api/users/:id` - Obter usuário por ID
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### Endpoints de Notas
- `GET /api/notes` - Obter notas (suporta busca e filtragem por etiquetas)
- `GET /api/notes/:id` - Obter nota por ID
- `POST /api/notes` - Criar nova nota
- `PUT /api/notes/:id` - Atualizar nota
- `DELETE /api/notes/:id` - Excluir nota
- `GET /api/notes/tags` - Obter todas as etiquetas disponíveis

### Parâmetros de Query
- `search` - Busca de texto completo em título e conteúdo
- `tag` - Filtrar notas por ID da etiqueta
- `userId` - Filtrar por usuário (padrão para ID de usuário 1)

## 🎮 Guia de Uso

### Criando Notas
1. Clique no botão "Nova Nota" na barra lateral
2. Digite um título e conteúdo
3. Selecione etiquetas relevantes
4. Clique em "Salvar" ou use o recurso de salvamento automático

### Organizando com Etiquetas
1. Use as caixas de seleção de etiquetas ao criar/editar notas
2. Clique nas etiquetas na barra lateral para filtrar notas
3. Use "Todas as Notas" para limpar filtros

### Buscando Conteúdo
1. Digite na caixa de busca na barra lateral
2. A busca funciona em títulos e conteúdo de notas
3. Limpe a caixa de busca para retornar a todas as notas

### Alternando Temas
1. Clique no botão de alternância de tema (◐/☀) no cabeçalho da barra lateral
2. A preferência de tema é automaticamente salva
3. O tema do sistema é detectado por padrão

## 🧪 Testes da API

### Script de Teste CRUD

O projeto inclui um script bash automatizado (`backend/test/test.sh`) para testar todas as operações CRUD da API de notas.

#### Recursos do Script de Teste
- ✅ **Logs Verbosos**: Timestamps detalhados com emojis para fácil identificação
- ✅ **IDs Dinâmicos**: Captura automaticamente IDs das respostas da API
- ✅ **Códigos de Status**: Validação de códigos HTTP (200, 201, 404, 500)
- ✅ **Request/Response**: Mostra corpo das requisições e respostas JSON
- ✅ **Teste Completo**: Executa ciclo CRUD completo automaticamente

#### Comandos Disponíveis
```bash
# Navegar para o diretório de testes
cd backend/test

# Executar operações individuais
./test.sh create        # Criar nova nota (dados mockados)
./test.sh read          # Listar todas as notas
./test.sh read_one      # Ler primeira nota disponível
./test.sh edit          # Editar primeira nota disponível
./test.sh delete        # Deletar primeira nota disponível

# Executar teste completo
./test.sh test_all      # Executa sequência CRUD completa
```

#### Resultado dos Testes
- **CREATE**: Nota criada com sucesso (Status 201)
- **READ ALL**: Lista de notas recuperada (Status 200)
- **READ ONE**: Nota específica recuperada (Status 200)
- **UPDATE**: Nota editada com sucesso (Status 200)
- **DELETE**: Nota removida completamente (Status 200)

#### Exemplo de Log de Saída
```
[2025-09-29 16:31:51] 🧪 INICIANDO TESTE COMPLETO DE CRUD
[2025-09-29 16:31:51] 📝 CRUD_CREATE: Iniciando criação de nova nota
[2025-09-29 16:31:51] 🚀 REQUEST: POST http://localhost:3000/api/notes
[2025-09-29 16:31:51] 📦 BODY: {"title":"Nota de Teste","content":"Conteúdo..."}
[2025-09-29 16:31:51] ✅ RESPONSE (201): SUCCESS
[2025-09-29 16:31:51] 📄 RESPONSE BODY: {"id":6,"title":"Nota de Teste"...}
[2025-09-29 16:31:51] 🆔 ID capturado: 6
[2025-09-29 16:31:51] 🏆 TESTE COMPLETO FINALIZADO
```

**Conclusão dos Testes**: ✅ API de notas completamente funcional e pronta para produção.

## 🔧 Implementação Técnica

### Arquitetura Frontend
- **Design Modular**: Cada recurso principal é implementado como uma classe separada
- **Orientado a Eventos**: Usa eventos DOM para comunicação entre componentes
- **Responsivo**: CSS Grid e Flexbox para todos os layouts
- **Aprimoramento Progressivo**: Funciona sem JavaScript para funcionalidade básica

### Arquitetura Backend
- **API RESTful**: Métodos HTTP padrão e códigos de status
- **Baseado em Modelos**: Operações de banco de dados abstraídas em classes de modelo
- **Tratamento de Erros**: Tratamento abrangente de erros com mensagens significativas
- **Segurança**: Proteção contra injeção SQL através de queries parametrizadas

### Design do Banco de Dados
- **Esquema Normalizado**: Relacionamentos e restrições adequados
- **Indexação**: Índices de busca de texto completo para performance
- **Dados de Exemplo**: Pré-populado com conteúdo de demonstração

## 📱 Experiência Mobile

A aplicação é totalmente responsiva e oferece uma experiência otimizada em todos os tamanhos de dispositivo:

- **Mobile Portrait**: Layout de coluna única com barra lateral recolhível
- **Mobile Landscape**: Espaçamento e navegação otimizados
- **Tablet**: Layout de duas colunas com barra lateral persistente
- **Desktop**: Layout completo de três colunas com máxima produtividade

## 🎯 Conformidade com Requisitos

### Requisitos Funcionais ✅
- ✅ Operações CRUD de conteúdo
- ✅ Sistema de categorização/etiquetas
- ✅ Capacidades de filtragem e busca
- ✅ Interface de usuário intuitiva
- ✅ Design responsivo

### Requisitos Não-Funcionais ✅
- ✅ Excelente usabilidade e design UX
- ✅ Performance rápida com carregamento otimizado
- ✅ Código manutenível e documentado
- ✅ Arquitetura limpa e modular
- ✅ Modo Claro/Escuro

### Requisitos de Tecnologia ✅
- ✅ Markup semântico HTML5
- ✅ CSS3 com recursos modernos
- ✅ JavaScript vanilla (sem frameworks)
- ✅ Backend Node.js
- ✅ Banco de dados PostgreSQL

## 🚧 Notas de Desenvolvimento

### Estilo de Código
- Comentários mínimos focando apenas em lógica complexa
- Convenções de nomenclatura consistentes
- Recursos modernos ES6+ JavaScript

### Otimizações de Performance
- Busca com debounce para reduzir chamadas da API
- Salvamento automático com debouncing inteligente
- Manipulação eficiente do DOM
- CSS otimizado com propriedades personalizadas

## 👨‍💻 Equipe de Desenvolvimento
- [Hélder Júnior](https://github.com/hjunior29)
- [Diego Costa](https://github.com/CostaDiego)
- [João Marcelo](https://github.com/joaooujdq)

**Projeto Estudantil para Curso de Desenvolvimento Frontend**
- Instituição: UFG (Universidade Federal de Goiás)
- Curso: Desenvolvimento Frontend, Pós Graduação INF
- Ano Acadêmico: 2025

## Apresentação do Design
- https://link.excalidraw.com/p/readonly/lLRxa55HnvHSFn6rt4wm