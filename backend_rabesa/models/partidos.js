const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partidos', {
    idpartido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idrival: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clubs',
        key: 'idclub'
      }
    },
    resultado: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    fecha_partido: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'partidos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idpartido" },
        ]
      },
      {
        name: "idrival",
        using: "BTREE",
        fields: [
          { name: "idrival" },
        ]
      },
    ]
  });
};
