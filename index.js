const Koa = require('koa');
const app = new Koa();
const PORT = process.env.PORT || 3001;

// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(PORT, () => console.log(`Application listening to ${PORT}`));
