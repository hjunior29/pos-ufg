import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateInitialTables1733540000000 implements MigrationInterface {
  name = 'CreateInitialTables1733540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar tabela de Mesas
    await queryRunner.createTable(
      new Table({
        name: 'mesas',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'numero',
            type: 'integer',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'disponivel',
            type: 'boolean',
            default: true,
          },
        ],
      }),
      true,
    );

    // 2. Criar tabela de Itens do Cardápio
    await queryRunner.createTable(
      new Table({
        name: 'itens_cardapio',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ingredientes',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'preco',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'disponivelNaCozinha',
            type: 'boolean',
            default: true,
          },
        ],
      }),
      true,
    );

    // 3. Criar tabela de Contas
    await queryRunner.createTable(
      new Table({
        name: 'contas',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'ABERTA'",
          },
          {
            name: 'valorTotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'dataAbertura',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dataFechamento',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'mesaId',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // 4. Criar tabela de Pedidos
    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'numero',
            type: 'integer',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'horarioPedido',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'horarioEntrega',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'CRIADO'",
          },
          {
            name: 'contaId',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // 5. Criar tabela de Itens do Pedido
    await queryRunner.createTable(
      new Table({
        name: 'itens_pedido',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'quantidade',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'precoUnitario',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'pedidoId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'itemCardapioId',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // 6. Criar Foreign Keys

    // Conta -> Mesa
    await queryRunner.createForeignKey(
      'contas',
      new TableForeignKey({
        name: 'FK_contas_mesa',
        columnNames: ['mesaId'],
        referencedTableName: 'mesas',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Pedido -> Conta
    await queryRunner.createForeignKey(
      'pedidos',
      new TableForeignKey({
        name: 'FK_pedidos_conta',
        columnNames: ['contaId'],
        referencedTableName: 'contas',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ItemPedido -> Pedido
    await queryRunner.createForeignKey(
      'itens_pedido',
      new TableForeignKey({
        name: 'FK_itens_pedido_pedido',
        columnNames: ['pedidoId'],
        referencedTableName: 'pedidos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ItemPedido -> ItemCardapio
    await queryRunner.createForeignKey(
      'itens_pedido',
      new TableForeignKey({
        name: 'FK_itens_pedido_item_cardapio',
        columnNames: ['itemCardapioId'],
        referencedTableName: 'itens_cardapio',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover Foreign Keys
    await queryRunner.dropForeignKey('itens_pedido', 'FK_itens_pedido_item_cardapio');
    await queryRunner.dropForeignKey('itens_pedido', 'FK_itens_pedido_pedido');
    await queryRunner.dropForeignKey('pedidos', 'FK_pedidos_conta');
    await queryRunner.dropForeignKey('contas', 'FK_contas_mesa');

    // Remover tabelas na ordem inversa (por causa das dependências)
    await queryRunner.dropTable('itens_pedido');
    await queryRunner.dropTable('pedidos');
    await queryRunner.dropTable('contas');
    await queryRunner.dropTable('itens_cardapio');
    await queryRunner.dropTable('mesas');
  }
}
