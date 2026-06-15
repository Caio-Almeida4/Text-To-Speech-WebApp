import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Permission extends Model {}

  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users', 
          key: 'id'
        },
        onDelete: 'CASCADE' 
      },
      audiobookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'audiobook_id',
        references: {
          model: 'audiobooks', 
          key: 'id'
        },
        onDelete: 'CASCADE' 
      },
      grantedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'granted_at'
      }
    },
    {
      sequelize,
      modelName: "permission",
      tableName: "permissions",
      underscored: true,
      timestamps: false
    }
  );

  return Permission;
};