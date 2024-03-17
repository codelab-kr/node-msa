import mysql from 'mysql2';
const conn = {
   host: 'localhost',
   user: 'micro',
   password: 'service',
   database: 'monolithic'
}


/**
 * 상품 관리의 각 기능별 분기
*/
export function goods (res, method, pathname, params, cb) {
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
 * 상품 등록
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

   if (params.name == null || params.category == null || params.price == null || params.description == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('insert into goods (name, category, price, description) values (?, ?, ?, ?)', [params.name, params.category, params.price, params.description], (error, results, fields) => {
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
 * 상품 조회
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

   const connection = mysql.createConnection(conn);
   connection.connect();
   connection.query('select * from goods', (error, results, fields) => {
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


/**
 * 상품 삭제
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

   if (params.id == null) {
      response.errorcode = 1;
      response.errormessage = 'Invalid Parameters';
      cb(response);
   } else {
      const connection = mysql.createConnection(conn);
      connection.connect();
      connection.query('delete from goods where id = ?', [params.id], (error, results, fields) => {
         if (error) {
            response.errorcode = 1;
            response.errormessage = error;
         }
         cb(response);
      });
      connection.end();
   }
}




