// Importações
const Sequelize = require('sequelize');

const connection = require('../database/database');

const categorias = require('./categorias')

// Model de gastos realizados
const gastosRealizados = connection.define(
  'gastosRealizados',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
    }
  }
)

// Configurações de relacionamento
categorias.hasMany(gastosRealizados, {
  foreignKey: 'categoriaId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

gastosRealizados.belongsTo(categorias, {
  foreignKey: 'categoriaId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

//gastosRealizados.sync()

module.exports = gastosRealizados