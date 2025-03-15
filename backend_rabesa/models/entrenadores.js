const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entrenadores', {
    identrenador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    idclub: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clubs',
        key: 'idclub'
      }
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'idusuario'
      }
    }
  }, {
    sequelize,
    tableName: 'entrenadores',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "identrenador" },
        ]
      },
      {
        name: "idclub",
        using: "BTREE",
        fields: [
          { name: "idclub" },
        ]
      },
      {
        name: "idusuario",
        using: "BTREE",
        fields: [
          { name: "idusuario" },
        ]
      },
    ]
  });
};
