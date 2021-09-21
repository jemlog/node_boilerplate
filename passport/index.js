const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')


// passport는 전략을 사용한다. 전략은 로그인을 어떻게 할지 전략을 적어놓은 것이다. 



module.exports = () => {

  passport.serializeUser((user,done)=>{
    done(null,user.id)   // 세션에 user의 id만 저장 서버 메모리가 한정되어있는데 전체 user정보를 다넣으면 나중에 감당 못한다. 
    // 처음 한번만 session에 저장해놓는 과정! 
    // 실무에서는 메모리에도 저장하면 안되고 redis를 사용한다!
    // serialize의 done이 실행되는 순간, authrouter로 돌아간다. 
  })
  // 즉 세션에 id만 저장하는 기능 

  passport.deserializeUser((id,done)=>{ // 여기는 passport.session()에서 해독된 id가 들어온다. 
    User.findOne({where : {id},
    include : [
      {
        model : User , 
        attributes : ['id','nick'],
        as: 'Followers'
      },
      {
        model : User, 
        attributes : ['id', 'nick'],
        as : 'Followings'
      }
    ]})
    .then(user=>done(null,user))  // req.user에 찾은 user를 집어넣는다. req.isAuthenticated() 이 함수 실행시 로그인되어있으면 true
    .catch(err=>done(err))  // 세션에 저장했던 아이디를 가지고 User에서 해당하는 사람 찾는다. 찾아서 다시 done에 넣어준다. 
  })

  local()  // passport.authenticate('local') 에 걸렸기 때문에 여기서 localStrategy로 넘어간다. 
  kakao()
}



// index는 serialize와 deserialize를 위한 영역 
// serialize의 역할은 세션에 user.id를 저장하는 역할이다. 
// deserialize의 역할은 passport.session()에서 해독해준 id를 가지고 user에서 검색을 하고 user를 찾아서 done에 넣고, req.user를 사용하게 해줌 






