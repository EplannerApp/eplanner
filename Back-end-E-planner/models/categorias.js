// Importações
const Sequelize = require('sequelize');

const connection = require('../database/database');

const orcamentos = require('./orcamentos')

// Model de categorias
const categorias = connection.define(
  'categorias',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING
    },
    descricao: {
      type: Sequelize.STRING
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
orcamentos.hasMany(categorias, {
  foreignKey: 'orcamentoId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

categorias.belongsTo(orcamentos, {
  foreignKey: 'orcamentoId',
  onUpdate:'cascade',
  onDelete:'cascade'
})



//categorias.sync()

module.exports = categorias