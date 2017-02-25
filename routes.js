const Router = require('koa-router');
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = 'Hello Koa';
    });

module.exports = router.routes();
