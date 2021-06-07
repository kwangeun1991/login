const express = require('express');
const router = express.Router();

/** /member/join */
router.route('/join')
      // 회원가입양식
      .get((req, res, next) => {
        res.render('./form');
      })
      // 회원가입 처리
      .post((req, res, next) => {

      });

/** /member/login */
router.route('/login')
      // 로그인 양식
      .get((req, res, next) => {

      })
      // 로그인 처리
      .post((req, res, next) => {

      });

/** /member/logout */
router.route('/logout', (req, res, next) => {

});

module.exports = router;
