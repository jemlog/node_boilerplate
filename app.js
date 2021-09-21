const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passportConfig = require('./passport')
const {sequelize} = require('./models');
const passport = require('passport');
const authRouter = require('./router/auth')
const indexRouter = require('./router/index')
dotenv.config();


const app = express();
app.set('port', process.env.PORT || 8003);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
passportConfig()

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
sequelize.sync({force : false}).then(()=>{
  console.log('db start...')
})
.catch(err=>{console.error(err)})

// passport 사용하려면 설정해줘야 한다. 
// 로그인후 passport 세션 실행되면 deserialize 실행 => passport session은 세션에서 id값을 해독해낸다. 
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter)
app.use('/auth',authRouter)


app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message; // 템플릿 엔진의 변수 
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), 'jemin api server');
});
