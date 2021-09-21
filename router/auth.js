const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const {isLoggedIn , isNotLoggedIn } = require('../middleware/auth')
const router = express.Router()

router.post('/join',isNotLoggedIn, async (req,res,next) => {

  const {email, nick, password} = req.body; // user에 관련된 email, nick, password를 전달해 줄꺼야 
  try{
      
    const exUser = await User.findOne({where : { email }}) // 먼저 이메일로 기존 사용자가 있는지 체크해주자 있으면 에러 
    if(exUser)
    {
      return res.redirect('/join?error=exist') // 프론트엔드가 error=exist를 보고 에러 메세지를 띄운다. 
    }

    const hash = await bcrypt.hash(password, 12); // 저장할때는 이제 hash 해서 저장할꺼야! 
    await User.create({
      email, 
      nick,
      password : hash
    });
    return res.redirect('/')
  }
  catch(err)
  {
    console.error(err)
    return next(err)
  }
})

// 미들웨어 안에 미들웨어를 넣었기 때문에 확장법을 사용했다. 
router.post('/login',isNotLoggedIn, (req,res,next) => {
  // authenticate 걸리면 인증시작~ 이제 index로 넘어간다. 
  // autherror는 아예 초기 에러 , user 는 성공했을때의 exUser, info는 로그인 실패시의 메세지 
  passport.authenticate('local', (autherror, user, info) => {
    if(autherror)
    {
      console.error(autherror)
      return next(autherror)
    }     // 애초에 에러가 났을때 
    if(!user)
    {
      return res.redirect(`/?loginError=${info.message}`)
    }  // user가 없고 info에 메세지만 담겨 있다면 
    // 성공했을때 
    // req.login 하는 순간 index로 간다. 
    return req.logIn(user, (loginError)=>{  // 여기서 serialize로 이동 
      if(loginError)
      {
        console.error(loginError)
        return next(loginError)
      }
      return res.redirect('/')
      // 이 순간 세션쿠키를 브라우저로 보낸다. 
    })
  })(req,res,next)
})

router.get('/logout', isLoggedIn, (req,res,next) => {
  req.logOut()  // 서버에서 세션이 사라진다. 
  req.session.destroy()
  res.redirect('/')

})

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao',{
  failureRedirect : '/',
}), (req,res,next) => {
  res.redirect('/')
})

module.exports = router;



