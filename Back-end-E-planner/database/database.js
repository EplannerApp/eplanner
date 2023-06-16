// Importações
const Sequelize = require('sequelize');

// Configurações da conexão com banco de dados
const connection = new Sequelize(
    'eplanner', 
    'root',
    '',
    {
        host:'localhost',
        dialect:'mysql',
        timezone: '-03:00',
        // port: 3307
    }
);

module.exports = connection;