const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user')

module.exports = () => {

  passport.use(new KakaoStrategy({
    clientID : process.env.KAKAO_ID,
    callbackURL : '/auth/kakao/callback'
  },
  async (accessToken, refreshToken, profile, done) => {

    // accessToken , refreshToken은 실무에서 사용하게 될것, 지금은 아니다. 
    console.log('kakao profile', profile)
    try{
       const exUser = await User.findOne({
         where : { snsId : profile.id, provider : 'kakao'} // 
       })
       if(exUser)
       {
         done(null,exUser)
       }
       else
       {
         const newUser = await User.create({
           email : profile._json && profile._json?.kakao_account_email, // 자바스크립트에서는 &&는 앞에것이 있으면 뒤에걸로 하라는 뜻이다. 
           nick : profile.displayName,
           snsId : profile.id,
           provider : 'kakao'
         })
         done(null,newUser)
       }
    }
    catch(error)
    {
       console.error(error)
       done(error)
    }


  }))

}