// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Não inclua createdAt e updatedAt se elas não existirem na sua tabela
  },
  {
    timestamps: false, // Isso desativa a criação automática de createdAt e updatedAt
  }
);

module.exports = User;
