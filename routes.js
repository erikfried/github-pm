const Router = require('koa-router');
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = 'Hello Koa';
    })
    .post('/webhook', (ctx, next) => {
        const data = JSON.parse(ctx.body);
        
    });

module.exports = router.routes();
