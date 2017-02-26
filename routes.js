const Router = require('koa-router');
const bodyParser = (require('koa-body'));
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = 'Hello Koa';
    })
    .post('/webhook', bodyParser(), (ctx, next) => {
        console.log('ctx', ctx.request.body);
        next();
    });

module.exports = router.routes();
