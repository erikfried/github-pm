const Router = require('koa-router');
const bodyParser = require('koa-body')();
const send = require('koa-send');
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = `<html>
        Download <a download href="/extension.crx">extension</a>,
        open <pre>chrome://extensions</pre> and drag the downloaded file there</html>`;
    })
    .get('/extension/update.xml', async ctx => send(ctx, 'extension/update.xml'))
    .get('/extension.crx', async (ctx) => {
        return await send(ctx, 'extension.crx')
    })
    .post('/webhook', bodyParser, require('./app/webhook'));

module.exports = router.routes();
