'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, { sequelize });
  
    // associations can be defined here
    User.associate = (models) => { User.hasMany(models.Course,
      { foreignKey: { 
        fieldname: 'userId',
        allowNull: false } });
      }
  
  return User;
};