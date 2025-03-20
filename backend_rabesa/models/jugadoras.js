const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jugadoras', {
    idjugadora: {
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
    posicion: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    numero_camiseta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "numero_camiseta"
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(4000),
      allowNull: true
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
    tableName: 'jugadoras',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idjugadora" },
        ]
      },
      {
        name: "numero_camiseta",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "numero_camiseta" },
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
