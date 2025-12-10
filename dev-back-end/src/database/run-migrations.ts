import { AppDataSource } from './data-source';

async function runMigrations() {
  try {
    console.log('Inicializando conexão com o banco de dados...');
    await AppDataSource.initialize();
    console.log('Conexão estabelecida com sucesso!\n');

    console.log('Executando migrations...');
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('Nenhuma migration pendente para executar.');
    } else {
      console.log(`\n${migrations.length} migration(s) executada(s) com sucesso:`);
      migrations.forEach((migration) => {
        console.log(`  - ${migration.name}`);
      });
    }

    console.log('\nMigrations concluídas!');
  } catch (error) {
    console.error('Erro ao executar migrations:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

runMigrations();
