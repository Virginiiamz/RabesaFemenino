const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario', {
    idusuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "correo"
    },
    contrasena: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idusuario" },
        ]
      },
      {
        name: "correo",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "correo" },
        ]
      },
    ]
  });
};
