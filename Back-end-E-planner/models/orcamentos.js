// Importações
const Sequelize = require('sequelize');

const connection = require('../database/database');

const usuarios = require('./usuarios')

// Model de orçamento
const orcamentos = connection.define(
  'orcamentos',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    valor: {
      type: Sequelize.DECIMAL(10, 2)
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }
)

// Configurações de relacionamento
orcamentos.belongsTo(usuarios, {
  foreignKey: 'usuarioId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

usuarios.hasOne(orcamentos, {
  foreignKey: 'usuarioId',
  onUpdate:'cascade',
  onDelete:'cascade'
})


//orcamentos.sync()

module.exports = orcamentos