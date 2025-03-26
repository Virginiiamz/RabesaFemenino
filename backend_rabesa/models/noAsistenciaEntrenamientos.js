const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('noAsistenciaEntrenamientos', {
    idnoasistencia: {
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
    }
  }, {
    sequelize,
    tableName: 'no_asistencia_entrenamientos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idnoasistencia" },
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
