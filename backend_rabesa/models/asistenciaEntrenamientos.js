const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asistenciaEntrenamientos', {
    idasistencia: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idjugadora: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jugadoras',
        key: 'idjugadora'
      }
    },
    identrenamiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'entrenamientos',
        key: 'identrenamiento'
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'asistencia_entrenamientos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idasistencia" },
        ]
      },
      {
        name: "idjugadora",
        using: "BTREE",
        fields: [
          { name: "idjugadora" },
        ]
      },
      {
        name: "identrenamiento",
        using: "BTREE",
        fields: [
          { name: "identrenamiento" },
        ]
      },
    ]
  });
};
