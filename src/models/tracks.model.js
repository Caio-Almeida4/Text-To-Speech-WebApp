import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Track extends Model {}

  Track.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      audiobook_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'audiobook_id',
        references: {
            model: 'Audiobook',
            key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_path:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'file_path'
      },
      duration:{
        type: DataTypes.TIME
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
      
    },
    {
      sequelize,
      modelName: "track",
      tableName: "tracks",
      underscored: true,
      updatedAt: false,
    }
  );

  return Track;
};