import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class AudioBook extends Model {}

  AudioBook.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      original_pdf: {
        type: DataTypes.BLOB,
        allowNull: true,
        field: 'original_pdf'
      },
      status: {
        type: DataTypes.ENUM({
            values: ['pending', 'processing', 'completed', 'failed']
        }),
        allowNull: false,
        defaultValue: 'pending'
      }
      
    },
    {
      sequelize,
      modelName: "audiobook",
      tableName: "audiobooks",
      underscored: true,
      updatedAt: false,
    }
  );

  return AudioBook;
};