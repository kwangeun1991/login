const member = require("../models/member")
/**
  로그인 세션 처리
*/
module.exports.loginSession = async (req, res, next) => {
  req.isLogin = res.isLogin = res.locals.isLogin = false;
  console.log(req.session.memId);
  if (req.session.memId){ // 로그인 성공시 세션처리
    const info = await member.get(req.session.memId);
    //console.log(info);
    delete info.memPw;
    if (info) {
      req.isLogin = res.isLogin = res.locals.isLogin = true;
      req.member = res.member = res.locals.member = info;
    }
  }

  next(); // 항상 다음 미들웨어로 이동해야 하므로
};
