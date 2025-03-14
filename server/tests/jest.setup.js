const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

module.exports = async () => {
  // Démarrer le conteneur PostgreSQL
  const container = await new PostgreSqlContainer("postgres:latest")
    .withDatabase("cd_database")
    .start();

  // Définir les variables de configuration
  const dbConfig = {
    DB_USER: container.getUsername(),
    DB_PASSWORD: container.getPassword(),
    DB_HOST: container.getHost(),
    DB_PORT: container.getPort().toString(),
    DB_NAME: container.getDatabase(),
  };

  // Créer l’URI de connexion
  const connectionString = `postgresql://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@${dbConfig.DB_HOST}:${dbConfig.DB_PORT}/${dbConfig.DB_NAME}`;
  process.env.URI_DB = connectionString;

  // Créer une nouvelle instance de Pool pour les tests
  const testPool = new Pool({
    connectionString: process.env.URI_DB,
  });

  // Exécuter le script SQL pour initialiser la base
  const sqlPath = path.join(__dirname, "../configs/import.sql");
  const createTableSQL = fs.readFileSync(sqlPath, "utf8");
  await testPool.query(createTableSQL);

  // Fermer la connexion temporaire
  await testPool.end();

  // Stocker le conteneur et la config pour les tests
  global.__POSTGRES_CONTAINER__ = container;
};
