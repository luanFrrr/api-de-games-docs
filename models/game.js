// models/game.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Corrigido o caminho para o diretório pai

const Game = sequelize.define("Game", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Game;
