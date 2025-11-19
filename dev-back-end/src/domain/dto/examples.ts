/**
 * Exemplos de uso dos DTOs
 * Este arquivo demonstra como utilizar as classes DTO implementadas
 */

import {
  RestauranteDto,
  MesaDto,
  ClienteDto,
  PedidoDto,
  ItemPedidoDto,
  ItemCardapioDto,
  CategoriaDto,
  CardapioDto,
  GarcomDto,
  GerenteDto,
  CozinhaDto,
  CaixaDto,
  ContaDto,
  PagamentoDto,
  TipoPagamento,
  DinheiroPagamentoDto,
  CartaoPagamentoDto,
  ChequePagamentoDto,
  CreateRestauranteDto,
  CreateMesaDto,
  CreateClienteDto,
  CreatePedidoDto,
} from './index';

// Exemplo 1: Criando um Restaurante
const restauranteExample: CreateRestauranteDto = {
  nome: 'Restaurante do Helder',
};

// Exemplo 2: Criando uma Mesa
const mesaExample: CreateMesaDto = {
  numero: 5,
  disponivel: true,
};

// Exemplo 3: Criando um Cliente
const clienteExample: CreateClienteDto = {
  nome: 'João Silva',
  horaChegada: new Date('2025-11-19T19:00:00'),
};

// Exemplo 4: Criando um Pedido
const pedidoExample: CreatePedidoDto = {
  numero: 101,
  horarioPedido: new Date('2025-11-19T19:15:00'),
};

// Exemplo 5: Criando Usuários
const garcomExample: GarcomDto = {
  nome: 'Carlos Garçom',
  login: 'carlos.garcom',
  senha: 'senha123',
};

const gerenteExample: GerenteDto = {
  nome: 'Ana Gerente',
  login: 'ana.gerente',
  senha: 'senha456',
};

const cozinhaExample: CozinhaDto = {
  nome: 'Pedro Cozinheiro',
  login: 'pedro.cozinha',
  senha: 'senha789',
};

const caixaExample: CaixaDto = {
  nome: 'Maria Caixa',
  login: 'maria.caixa',
  senha: 'senha321',
};

// Exemplo 6: Criando um Item do Cardápio
const itemCardapioExample: ItemCardapioDto = {
  nome: 'Feijoada Completa',
  ingredientes: 'Feijão preto, linguiça, bacon, costela, arroz, couve, laranja',
  preco: 45.90,
  disponivelNaCozinha: true,
};

// Exemplo 7: Criando uma Categoria
const categoriaExample: CategoriaDto = {
  nome: 'Pratos Principais',
};

// Exemplo 8: Criando um Cardápio
const cardapioExample: CardapioDto = {
  nome: 'Cardápio Executivo - Novembro 2025',
};

// Exemplo 9: Criando uma Conta
const contaExample: ContaDto = {
  nome: 'Conta Mesa 5',
};

// Exemplo 10: Criando um Item de Pedido
const itemPedidoExample: ItemPedidoDto = {
  quantidade: 2,
};

// Exemplo 11: Criando Pagamentos
const pagamentoDinheiroExample: DinheiroPagamentoDto = {
  tipo: TipoPagamento.DINHEIRO,
  valor: 100.00,
};

const pagamentoCartaoExample: CartaoPagamentoDto = {
  tipo: TipoPagamento.CARTAO,
  valor: 150.00,
  nroTransacao: 123456789,
};

const pagamentoChequeExample: ChequePagamentoDto = {
  tipo: TipoPagamento.CHEQUE,
  valor: 200.00,
  numero: 987654,
};

// Exemplo 12: Criando um Pagamento genérico
const pagamentoGenericoExample: PagamentoDto = {
  tipo: TipoPagamento.DINHEIRO,
  valor: 75.50,
};

/**
 * Este arquivo serve apenas como referência e documentação.
 * Em uma aplicação real, esses dados seriam validados usando
 * o ValidationPipe do NestJS antes de serem processados.
 */
