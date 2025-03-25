const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('noAsistenciaEntrenamientos', {
    idnoasistencia: {
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
      },
      unique: "no_asistencia_entrenamientos_ibfk_1"
    },
    identrenamiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'entrenamientos',
        key: 'identrenamiento'
      },
      unique: "no_asistencia_entrenamientos_ibfk_2"
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
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idjugadora" },
        ]
      },
      {
        name: "identrenamiento",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "identrenamiento" },
        ]
      },
    ]
  });
};
