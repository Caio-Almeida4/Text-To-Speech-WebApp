import dbConfig from "../config/db.config.js"
import { DataTypes, Sequelize } from "sequelize"
import userModel from "./user.model.js"
import audiobookModel from "./audiobook.model.js"
import trackModel from "./tracks.model.js"


const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = userModel(sequelize, DataTypes)
db.audiobook = audiobookModel(sequelize, DataTypes)
db.track = trackModel(sequelize, DataTypes)

export default db