import dbConfig from "../config/db.config.js"
import { DataTypes, Sequelize } from "sequelize"
import userModel from "./user.model.js"

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = userModel(sequelize, DataTypes)

export default db