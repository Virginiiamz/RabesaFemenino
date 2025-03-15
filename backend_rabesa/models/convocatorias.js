const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('convocatorias', {
    idconvocatoria: {
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
    idpartido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'partidos',
        key: 'idpartido'
      }
    }
  }, {
    sequelize,
    tableName: 'convocatorias',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idconvocatoria" },
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
        name: "idpartido",
        using: "BTREE",
        fields: [
          { name: "idpartido" },
        ]
      },
    ]
  });
};
