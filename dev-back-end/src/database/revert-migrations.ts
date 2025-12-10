import { AppDataSource } from './data-source';

async function revertMigrations() {
  try {
    console.log('Inicializando conexão com o banco de dados...');
    await AppDataSource.initialize();
    console.log('Conexão estabelecida com sucesso!\n');

    console.log('Revertendo última migration...');
    await AppDataSource.undoLastMigration();

    console.log('\nMigration revertida com sucesso!');
  } catch (error) {
    console.error('Erro ao reverter migration:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

revertMigrations();
