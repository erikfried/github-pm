const Router = require('koa-router');
const bodyParser = require('koa-body')();
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = 'Hello Koa';
    })
    .post('/webhook', bodyParser, require('./webhook'));

module.exports = router.routes();
