import http from 'http';
import url from 'url';
import querystring from 'querystring';
import {  members } from './monolithic_members.js';
import {goods} from './monolithic_goods.js';
import {purchases} from './monolithic_purchases.js';


/**
 * HTTP 서버를 만들고 요청 처리
 */
const server = http.createServer((req, res) => {
   const method = req.method;
   const uri = url.parse(req.url, true);
   const pathname = uri.pathname;

   if (method === 'POST' || method === 'PUT') { // POST, PUT 요청 처리 - 데이터를 읽어들임
      let body = '';

      req.on('data', (data) => {
         body += data;
      });

      req.on('end', () => {
         let params;
         if (req.headers['content-type'] === 'application/json') { 
            params = JSON.parse(body); // JSON 형식의 데이터 처리
         } else { 
            params = querystring.parse(body); // URL-encoded 형식의 데이터 처리 (키=값&키=값&...)
         }

         onRequest(res, pathname, method, params);
      });
   } else { // GET, DELETE 요청 처리 - 쿼리스트링을 읽어들임
      onRequest(res, pathname, method, uri.query);
   }
}).listen(3000, () => {
   console.log('Server running at http://localhost:3000');

});

/**
 * 요청에 대해 회원, 상품, 구매 관리를 모듈별로 분기
* @param res - response 객체
* @param pathname - URI
* @param method - HTTP 메소드
* @param params - 입력 파라미터
*/
function onRequest(res, pathname, method, params) {
   switch (pathname) {
      case '/members':
         members(res, method, pathname, params, response);
         break;
      case '/goods':
         goods(res, method, pathname, params, response);
         break;
      case '/purchases':
         purchases(res, method, pathname, params, response);
         break;
      default:
         res.writeHead(404);
         return res.end();
   }
};

/**
 * HTTP 헤더에 JSON 형식으로 응답
 * @param res - response 객체
 * @param packet - 응답 패킷
 */   
function response(res, packet) {
   res.writeHead(200, { 'Content-Type': 'application/json' });
   res.end(JSON.stringify(packet ));
}