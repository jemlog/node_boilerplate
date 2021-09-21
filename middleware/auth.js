const jwt = require('jsonwebtoken')
const RateLimit = require('express-rate-limit');
exports.isLoggedIn = (req,res,next) => {
  if(req.isAuthenticated())
  {
    next()
  }
  else
  {
    res.status(403).send('로그인필요')
  }
}

// exports.''' 를 사용하면 모듈 하나에 묶어서 다 보낼 수 있다. 

exports.isNotLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated())
  {
    next()
  }
  else{
    const message = encodeURIComponent('로그인한 상태입니다')
    res.redirect(`/?error=${message}`)
  }
}

exports.verifyToken = (req,res,next) => {

   try{
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
   return  next()

   }
   catch(err)
   {
    if(err.message === 'TokenExpiredError')
    {
      return res.json({
        code : 419,
        message : 'token expired'
      })
    }
    return res.json({
      code : 401, 
      message : '에러 발생'
    })
    
   }
}
// 헤더의 authorization에 저장되어있는 토큰 확인해서 req.decoded에 실어주자

exports.apiLimiter = new RateLimit({
  windowMs : 1000 * 60,
  max : 1,
  handler(req,res){
    res.status(this.statusCode).json({
      code : this.statusCode,
      message : '1분에 한번만 호출 가능합니다'
    })
  }
})