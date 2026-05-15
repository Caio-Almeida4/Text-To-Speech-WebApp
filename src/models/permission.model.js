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
          model: 'user', 
          key: 'id'
        },
        onDelete: 'CASCADE' 
      },
      audiobookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'audiobook_id',
        references: {
          model: 'audiobook', 
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
      modelName: "Permission",
      tableName: "permissions",
      underscored: true,
      timestamps: false
    }
  );

  return Permission;
};