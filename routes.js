const Router = require('koa-router');
const bodyParser = require('koa-body')();
const send = require('koa-send');
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = `
            <html>  
                <head>                
                </head>
                <body>
                    <a href="https://chrome.google.com/webstore/detail/idafnjemhdoagijahjhefddfhdiiibpc">Install extension</a>
                </body>
            </html>`;
    })
    .get('/extension/update.xml', async ctx => send(ctx, 'extension/update.xml'))
    .get('/extension.crx', async (ctx) => {
        return await send(ctx, 'extension.crx')
    })
    .post('/webhook', bodyParser, require('./app/webhook'));

module.exports = router.routes();
