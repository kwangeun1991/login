const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./lib/logger');
const { sequelize } = require('./models');

// 라우터
const indexRouter = require('./routes');

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3002);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express : app,
  watch : true,
});

sequelize.sync({ force:false })
        .then(() => {
          logger('데이터베이스 연결성공');
        })
        .catch((err) => {
          logger(err.message, 'error');
          logger(err.stack, 'error');
        });

if (process.env.NODE_ENV == 'production') {
  app.use(morgan('combiend'));
} else {
  app.use(morgan('dev'));
}

app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키파서 미들웨어 등록
app.use(session({
  resave : false,
  saveUninitialized : true,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly : true,
    secure : false,
  },
  name : 'kesession',
}));

app.use(methodOverride('_method'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// 라우터 등록
app.use('/', indexRouter);


// 없는 페이지 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url}는 없는 페이지 입니다.`);
  error.status = 404;
  next(error);
});

// 오류처리 미들웨어
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  logger("[" + err.status + "]" + err.message, 'error');
  logger(err.stack, 'error');

  if (process.env.NODE_ENV == 'production') err.stack = "";

  res.locals.error = err;
  res.status(err.status).render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
