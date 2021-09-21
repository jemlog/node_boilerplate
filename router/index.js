const express = require('express')
const router = express.Router()
const User = require('../models/user')
const {isLoggedIn} = require('../middleware/auth')
const {v4 : uuidv4} = require('uuid')
router.get('/', async (req,res,next) => {

  res.send('hello')
})


module.exports = router;



// 먼저 도메인 등록해서 클라이언트 키 발급 
// 해당 클라이언트 키를 가지고 있으면 토큰 발급해줌 
// 다음부터 내 자료를 쓰고 싶으면 해당 토큰을 가지고 있으면 된다.
// 서버에서는 해당 토큰을 보내면서 자료를 요청하면 나는 검증하고 내 자료 주는 것이다. 
// 토큰 없으면 토큰 받아와서 세션에 토큰 저장, 그 다음부터는 뭐 할때 req.session.jwt에 저장됭 있는 토큰 사용 
// 서비스를 가져올때, 기준점은 req.session.jwt가 있냐 없느냐이다 
// 없다? 그러면 jwt 다시 받아와야함 그다음에 req.session.jwt에 저장 
// if(tokenResult.data && tokenResult.data.code === 200)
// { req.session.jwt = token}