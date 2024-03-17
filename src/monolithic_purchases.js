import mysql from 'mysql2';
const conn = {
   host: 'localhost',
   user: 'micro',
   password: 'service',
   database: 'monolithic'
}


/**
 * 구매 관리의 각 기능별 분기
*/
export function purchases (res, method, pathname, params, cb) {
   switch (method) {
      case 'POST':
         return register(res, method, pathname, params, (response) => {
            process.nextTick(cb, res, response);
         });
      case 'GET':
         return inquiry(res, method, pathname, params, (response) => {
            process.nextTick(cb, res, response);
         });
      default:
         return process.nextTick(cb, res, null);
   }
}

/**
 * 구매 등록
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

   if (params.userid == null || params.goodsid == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('insert into purchases (userid, goodsid) values (?, ?)', [params.userid, params.goodsid], (error, results, fields) => {
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
 * 구매 조회
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

   if (params.userid == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('select * from purchases', (error, results, fields) => {
         if (error || results.length == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : 'no data';
         } else {
            response.results = results;
         }
         cb(response);
      });
      connection.end();
   }
}