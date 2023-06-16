// Importações
const Sequelize = require('sequelize');

const connection = require('../database/database');

const categorias = require('./categorias')

// Model de gastos realizados
const gastosAgendados = connection.define(
  'gastosAgendados',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    descricao: {
      allowNull: false,
      type: Sequelize.STRING
    },
    valor: {
      type: Sequelize.DECIMAL(10, 2)
    },
    dataGasto: {
      type: Sequelize.DATE
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
categorias.hasMany(gastosAgendados, {
  foreignKey: 'categoriaId',
  onUpdate: 'cascade',
  onDelete: 'cascade'
})

gastosAgendados.belongsTo(categorias, {
  foreignKey: 'categoriaId'
});


//gastosAgendados.sync()

module.exports = gastosAgendados