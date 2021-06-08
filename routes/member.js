const { joinValidator } = require('../middlewares/join_validator');
const { loginValidator } = require('../middlewares/login_validator');
const { memberOnly, guestOnly } = require('../middlewares/member_only');
const naverLogin = require('../models/naver_login');
const express = require('express');
const member = require('../models/member'); // Member Model
const { alert, go } = require('../lib/common');
const router = express.Router();

/** /member/join */
router.route('/join')
      // 회원가입양식
      .get((req, res, next) => {
        const data = {
          naverProfile : req.session.naverProfile || {},
        };

        if (data.naverProfile) {
          data.memNm = data.naverProfile.name;
          data.email = data.naverProfile.email;
        }

        return res.render("member/form", data);
      })
      // 회원가입 처리
      .post(joinValidator, async (req, res, next) => {
        //console.log(req.body);
        const result = await member.data(req.body, req.session).join();

        if (result) {
          // 회원가입 성공 -> 로그인 페이지
          if (req.session.naverProfile) { // 네이버 회원가입 -> 바로 로그인 처리
            const re = await naverLogin.login(req, res);
            if (re) { // 소셜 로그인 성공
              return go("/", res, "parent");
            }
          } else { // 일반 히원가입
            return go("/member/login", res, "parent");
          }
        }

        return alert('회원가입에 실패하였습니다.', res);
      });

/** /member/login */
router.route('/login')
      // 로그인 양식
      .get((req, res, next) => {
        const data = {
          naverLoginUrl : naverLogin.getCodeUrl(),
        };

        return res.render('member/login', data);
      })
      // 로그인 처리
      .post(loginValidator, async (req, res, next) => {
        //console.log(req.body);
        const result = await member.login(req.body.memId, req.body.memPw, req);
        if (result) {
          //로그인성공시 메인페이지 로
          return go("/", res, "parent");
        }

        return alert("로그인에 실패하였습니다.", res);

      });

/** /member/logout */
router.get('/logout', (req, res, next) => {
  //console.log(req.member);
  req.session.destory();
  return res.redirect("/member/login");
});

router.get('/login_callback', async (req, res, next) => {
  const result = await naverLogin.checkExists(req.query.code, req.query.state);

  if (result) { // 이미 네이버 계정이 존재 -> 로그인
    const re = await naverLogin.login(req, res);
    if (re) { // 네이버 로그인 성공
      return res.redirect("/");
    }

    return alert("네이버 로그인 실패", res, "/");
  } else { // 존재하지않으면 -> 회원가입
    return res.redirect('/member/join');
  }
});


module.exports = router;
