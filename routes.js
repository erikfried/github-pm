const Router = require('koa-router');
const bodyParser = require('koa-body')();
const send = require('koa-send');
const router = new Router();

router
    .get('/', ctx => {
        ctx.body = `
            <html>  
                <head>
                    <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/idafnjemhdoagijahjhefddfhdiiibpc">
                </head>
                <body>
                    <button onclick="chrome.webstore.install()" id="install-button">Add to Chrome</button>
                    <script>
                    if (chrome.app.isInstalled) {
                        document.getElementById('install-button').style.display = 'none';
                    }
                    </script>
                </body>
            </html>`;
    })
    .get('/extension/update.xml', async ctx => send(ctx, 'extension/update.xml'))
    .get('/extension.crx', async (ctx) => {
        return await send(ctx, 'extension.crx')
    })
    .post('/webhook', bodyParser, require('./app/webhook'));

module.exports = router.routes();
