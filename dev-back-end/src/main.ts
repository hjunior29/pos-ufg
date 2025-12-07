import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validação automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS
  app.enableCors();

  // Prefixo global para API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Sistema de Garçom Eletrônico - API                 ║
╠══════════════════════════════════════════════════════════════╣
║  Servidor rodando em: http://localhost:${port}                   ║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints disponíveis:                                      ║
║                                                              ║
║  PESSOA 1 - Módulo Mesa:                                     ║
║    GET    /api/mesas              - Listar todas as mesas    ║
║    GET    /api/mesas/disponiveis  - Listar mesas disponíveis ║
║    GET    /api/mesas/:id          - Buscar mesa por ID       ║
║    POST   /api/mesas              - Criar nova mesa          ║
║    PUT    /api/mesas/:id          - Atualizar mesa           ║
║    DELETE /api/mesas/:id          - Remover mesa             ║
║    PATCH  /api/mesas/:id/ocupar   - [NÃO-CRUD] Ocupar mesa   ║
║    PATCH  /api/mesas/:id/liberar  - Liberar mesa             ║
║                                                              ║
║  PESSOA 2 - Módulo Pedido:                                   ║
║    GET    /api/pedidos            - Listar todos os pedidos  ║
║    GET    /api/pedidos/:id        - Buscar pedido por ID     ║
║    POST   /api/pedidos            - Criar novo pedido        ║
║    DELETE /api/pedidos/:id        - Remover pedido           ║
║    POST   /api/pedidos/:id/enviar-cozinha - [NÃO-CRUD]       ║
║    PATCH  /api/pedidos/:id/em-preparo     - Marcar preparo   ║
║    PATCH  /api/pedidos/:id/pronto         - Marcar pronto    ║
║    PATCH  /api/pedidos/:id/entregue       - Marcar entregue  ║
║                                                              ║
║  PESSOA 3 - Módulo Conta:                                    ║
║    GET    /api/contas             - Listar todas as contas   ║
║    GET    /api/contas/abertas     - Listar contas abertas    ║
║    GET    /api/contas/:id         - Buscar conta por ID      ║
║    GET    /api/contas/:id/resumo  - Obter resumo da conta    ║
║    POST   /api/contas             - Criar nova conta         ║
║    PUT    /api/contas/:id         - Atualizar conta          ║
║    DELETE /api/contas/:id         - Remover conta            ║
║    POST   /api/contas/:id/fechar  - [NÃO-CRUD] Fechar conta  ║
║    POST   /api/contas/:id/pagar   - Marcar como paga         ║
║                                                              ║
║  Suporte - Módulo Item Cardápio:                             ║
║    GET    /api/itens-cardapio     - Listar itens             ║
║    POST   /api/itens-cardapio     - Criar item               ║
║    PUT    /api/itens-cardapio/:id - Atualizar item           ║
║    DELETE /api/itens-cardapio/:id - Remover item             ║
╚══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
