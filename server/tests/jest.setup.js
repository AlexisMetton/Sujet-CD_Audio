const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

module.exports = async () => {
  const container = await new PostgreSqlContainer("postgres:latest")
    .withDatabase("cd_database")
    .start();

  // Définir les variables d'environnement de base
  const dbConfig = {
    DB_USER: container.getUsername(),
    DB_PASSWORD: container.getPassword(),
    DB_HOST: container.getHost(),
    DB_PORT: container.getPort().toString(),
    DB_NAME: container.getDatabase(),
  };

  // Créer URI_DB manuellement dans le setup
  process.env.URI_DB = `postgresql://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@${dbConfig.DB_HOST}:${dbConfig.DB_PORT}/${dbConfig.DB_NAME}`;

  // Utiliser la nouvelle URI_DB pour la connexion
  const pool = new Pool({
    connectionString: process.env.URI_DB,
  });

  const sqlPath = path.join(__dirname, "../configs/import.sql");
  const createTableSQL = fs.readFileSync(sqlPath, "utf8");
  await pool.query(createTableSQL);

  await pool.end();

  global.__POSTGRES_CONTAINER__ = container;
};
