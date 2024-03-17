import mysql from 'mysql2';
const conn = {
   host: 'localhost',
   user: 'micro',
   password: 'service',
   database: 'monolithic'
}


/**
 * 회원 관리의 각 기능별 분기
*/
export function members(res, method, pathname, params, cb) {
   switch (method) {
      case 'POST':
         return register(res, method, pathname, params, (response) => {
            process.nextTick(cb, res, response);
         });
      case 'GET':
         return inquiry(res, method, pathname, params, (response) => {
            process.nextTick(cb, res, response);
         });
      case 'DELETE':
         return unregister(res, method, pathname, params, (response) => {
            process.nextTick(cb, res, response);
         });
      default:
         return process.nextTick(cb, res, null);
   }
}

/**
 * 회원 등록
 * @param res - response 객체
 * @param method - 메소드
 * @param pathname - URI
 * @param params - 입력 파라미터
 * @param cb - 콜백
 * @returns
 */
function register(res, method, pathname, params, cb) {
   let response = {
      key: params.key,
      errorcode: 0,
      errormessage: 'success'
   };

   if (params.username == null || params.password == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('insert into members (username, password) values (?, ?)', [params.username, params.password], (error, results, fields) => {
         if (error) {
            response.errorcode = 1;
            response.errormessage = error;
         }
         cb(response);
      });
      connection.end();
   }
}


/**
 * 회원 인증
 * @param res - response 객체
 * @param method - 메소드
 * @param pathname - URI
 * @param params - 입력 파라미터
 * @param cb - 콜백
 * @returns
 */

function inquiry(res, method, pathname, params, cb) {
   let response = {
      key: params.key,
      errorcode: 0,
      errormessage: 'success'
   };

   if (params.username == null || params.password == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('select * from members where username = ? and password = ?', [params.username, params.password], (error, results, fields) => {
         if (error || results.length == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : 'invalid password';
         } else {
            response.userid = results[0].id;
         }
         cb(response);
      });
      connection.end();
   }
}


/**
 * 회원 탈퇴
 * @param res - response 객체
 * @param method - 메소드
 * @param pathname - URI
 * @param params - 입력 파라미터
 * @param cb - 콜백
 * @returns
 */
function unregister(res, method, pathname, params, cb) {
   let response = {
      key: params.key,
      errorcode: 0,
      errormessage: 'success'
   };

   if (params.username == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('delete from members where username = ?', [params.username], (error, results, fields) => {
         if (error) {
            response.errorcode = 1;
            response.errormessage = error;
         }
         cb(response);
      });
      connection.end();
   }
}