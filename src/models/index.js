import { DataTypes, Sequelize } from "sequelize"
import mysql from "mysql2/promise"
import dbConfig from "../config/db.config.js"

import userModel from "./user.model.js"
import audiobookModel from "./audiobook.model.js"
import trackModel from "./tracks.model.js"
import permissionModel from "./permission.model.js"

async function isThereADatabase() {
    try {
            const connection = await mysql.createConnection({
                host: dbConfig.HOST,
                user: dbConfig.USER,
                password: dbConfig.PASSWORD,
            });
        
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
            await connection.end();
            console.log(`Database "${dbConfig.DB}" verified/created successfully.`);

        } catch (error) {
            console.error("Critical error while ensuring database exists:", error);
            throw error;
        }
}
  
  await isThereADatabase();

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


db.users = userModel(sequelize);
db.audiobooks = audiobookModel(sequelize); 
db.tracks = trackModel(sequelize);
db.permissions = permissionModel(sequelize);


db.audiobooks.hasMany(db.tracks, { foreignKey: 'audiobook_id', onDelete: 'CASCADE' });
db.tracks.belongsTo(db.audiobooks, { foreignKey: 'audiobook_id' });


db.users.belongsToMany(db.audiobooks, { through: db.permissions, foreignKey: 'user_id', otherKey: 'audiobook_id' });
db.audiobooks.belongsToMany(db.users, { through: db.permissions, foreignKey: 'audiobook_id', otherKey: 'user_id' });

export default db