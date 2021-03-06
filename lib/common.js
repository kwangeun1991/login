/**
* 공통
*
*/
const commonLib = {
  /**
  * 메세지 출력
  *
  * @param String msg 알림 메세지
  * @param Object res 객체
  * @param Int | String action => Int -> history.go  // String -> location.href
  * @param String target 기본값 self,
  */
  alert : function(msg, res, action, target) {
    target = target || 'self';

    let script = `<script>alert('${msg}');`;
    if (action) {
      if (isNaN(action)) { // 이동
        script += `${target}.location.href='${action}';`;
      } else { // history.go
        script += `${target}.history.go(${action});`;
      }
    }
    script += "</script>";
    return res.send(script);
  },
  /**
  *  페이지 이동
  *
  */
  go : function(url, res, target) {
    target = target || 'self';
    return res.send(`<script>${target}.location.href='${url}';</script>`);
  },
  /**
  * 페이지 뒤로가기
  *
  */
  back : function(res, target) {
    target = target || 'self';
    return res.send(`<script>${target}.history.back();</script>`);
  },
  /**
  * 페이지 앞으로 가기
  *
  */
  forward : function(res, target) {
    target = target || 'self';
    return res.send(`<script>${target}.history.forward();<script>`);
  },
};

module.exports = commonLib;
