import http from 'http';

const options = {
   hostname: 'localhost',
   port: 3000,
   headers: {
      'Content-Type': 'application/json'
   },
};

function request(cb, params) {
   const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
         data += chunk;
      });
      res.on('end', () => {
         console.log(options, data);
         cb();
      });
   });
   if (params) req.write(JSON.stringify(params));
   req.end();
}

/**
 * 상품 관리 
 */
function goods(callback) {
   goods_post(() => {
      goods_get(() => {
         goods_delete(callback);
      });
   })

   function goods_post(cb) {
      options.method = 'POST';
      options.path = '/goods';
      request(cb, { name: 'test', category: 'test', price: 1000, description: 'test' });
   }

   function goods_get(cb) {
      options.method = 'GET';
      options.path = '/goods';
      request(cb);
   }

   function goods_delete(cb) {
      options.method = 'DELETE';
      options.path = '/goods';
      request(cb, { id: 1 });
   }
}

/**
 * 회원 관리
 */

function members(callback) {
   members_delete(() => {
      members_post(() => {
         members_get(callback);
      });
   })

   function members_post(cb) {
      options.method = 'POST';
      options.path = '/members';
      request(cb, { username: 'test', password: '1234', passwordConfirm: '1234'});
   }

   function members_get(cb) {
      options.method = 'GET';
      options.path = '/members?username=test&password=1234';
      request(cb);
   }

   function members_delete(cb) {
      options.method = 'DELETE';
      options.path = '/members?username=test';
      request(cb);
   }
}

/**
 * 구매 관리
 */ 
function purchases(callback) {
   purchases_post(() => {
      purchases_get(() => {
         callback();
      });
   })

   function purchases_post(cb) {
      options.method = 'POST';
      options.path = '/purchases';
      request(cb, { userid: 1, goodsid: 1 });
   }

   function purchases_get(cb) {
      options.method = 'GET';
      options.path = '/purchases?userid=1';
      request(cb);
   }
}


console.log('===== 회원테스트 =====');
members(() => { 
   console.log('===== 상품테스트 =====');
   goods(() => {
      console.log('===== 구매테스트 =====');
      purchases(() => {
         console.log('테스트 종료');
      });
   });
});