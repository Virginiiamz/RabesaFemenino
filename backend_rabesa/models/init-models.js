var DataTypes = require("sequelize").DataTypes;
var _asistenciaEntrenamientos = require("./asistenciaEntrenamientos");
var _clubs = require("./clubs");
var _entrenadores = require("./entrenadores");
var _entrenamientos = require("./entrenamientos");
var _jugadoras = require("./jugadoras");
var _noAsistenciaEntrenamientos = require("./noAsistenciaEntrenamientos");
var _partidos = require("./partidos");
var _usuario = require("./usuario");

function initModels(sequelize) {
  var asistenciaEntrenamientos = _asistenciaEntrenamientos(sequelize, DataTypes);
  var clubs = _clubs(sequelize, DataTypes);
  var entrenadores = _entrenadores(sequelize, DataTypes);
  var entrenamientos = _entrenamientos(sequelize, DataTypes);
  var jugadoras = _jugadoras(sequelize, DataTypes);
  var noAsistenciaEntrenamientos = _noAsistenciaEntrenamientos(sequelize, DataTypes);
  var partidos = _partidos(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);

  entrenadores.belongsTo(clubs, { as: "idclub_club", foreignKey: "idclub"});
  clubs.hasMany(entrenadores, { as: "entrenadores", foreignKey: "idclub"});
  jugadoras.belongsTo(clubs, { as: "idclub_club", foreignKey: "idclub"});
  clubs.hasMany(jugadoras, { as: "jugadoras", foreignKey: "idclub"});
  partidos.belongsTo(clubs, { as: "idrival_club", foreignKey: "idrival"});
  clubs.hasMany(partidos, { as: "partidos", foreignKey: "idrival"});
  asistenciaEntrenamientos.belongsTo(entrenamientos, { as: "identrenamiento_entrenamiento", foreignKey: "identrenamiento"});
  entrenamientos.hasMany(asistenciaEntrenamientos, { as: "asistencia_entrenamientos", foreignKey: "identrenamiento"});
  noAsistenciaEntrenamientos.belongsTo(entrenamientos, { as: "identrenamiento_entrenamiento", foreignKey: "identrenamiento"});
  entrenamientos.hasMany(noAsistenciaEntrenamientos, { as: "no_asistencia_entrenamientos", foreignKey: "identrenamiento"});
  asistenciaEntrenamientos.belongsTo(jugadoras, { as: "idjugadora_jugadora", foreignKey: "idjugadora"});
  jugadoras.hasMany(asistenciaEntrenamientos, { as: "asistencia_entrenamientos", foreignKey: "idjugadora"});
  noAsistenciaEntrenamientos.belongsTo(jugadoras, { as: "idjugadora_jugadora", foreignKey: "idjugadora"});
  jugadoras.hasMany(noAsistenciaEntrenamientos, { as: "no_asistencia_entrenamientos", foreignKey: "idjugadora"});
  entrenadores.belongsTo(usuario, { as: "idusuario_usuario", foreignKey: "idusuario"});
  usuario.hasMany(entrenadores, { as: "entrenadores", foreignKey: "idusuario"});
  jugadoras.belongsTo(usuario, { as: "idusuario_usuario", foreignKey: "idusuario"});
  usuario.hasMany(jugadoras, { as: "jugadoras", foreignKey: "idusuario"});

  return {
    asistenciaEntrenamientos,
    clubs,
    entrenadores,
    entrenamientos,
    jugadoras,
    noAsistenciaEntrenamientos,
    partidos,
    usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
