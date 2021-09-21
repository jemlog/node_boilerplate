const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model{

  static init(sequelize)
  {
    return super.init({
       email : {
         type : Sequelize.STRING(40),
         allowNull : true,
         unique :true
       },
       nick : {
         type : Sequelize.STRING(15),
         allowNull : false
       },
       password  : {
         type : Sequelize.STRING(100),
         allowNull : true
       },
       provider : {                       // 어떤 방법으로 로그인? 
         type : Sequelize.STRING(10),
         allowNull : false,
         defaultValue : 'local'
       },
       snsId : {                          // oauth 사용할때 필요한 아이디 
         type : Sequelize.STRING(30),
         allowNull : true
       }
    },{
      sequelize,
      timestamps : true,
      underscored : false,
      modelName : 'User',
      tableName : 'users',
      paranoid : true,         // 탈퇴했다가 복원하는 사람들을 위한 것이다. 
      charset : 'utf8',
      collate : 'utf8_general_ci'
    })
  }
  static associate(db)
  {
    // db.User.hasMany(db.Post)
    db.User.belongsToMany(db.User, {foreignKey : 'followingId', as : 'Followers', through : 'Follow'}) // 나는 누구를 참조할꺼고, 내 이름은 뭐다 가 중요하다     
    // db.User.belongsToMany(db.User, {foreignKey : 'followerId', as : 'followings', through : 'Follow'})
    db.User.belongsToMany(db.User, { foreignKey : 'followerId' , as : 'Followings', through : 'Follow'})
    
  }
}