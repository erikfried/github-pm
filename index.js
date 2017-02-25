const Koa = require('koa');
const app = new Koa();

app.use(require('./routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Application listening to ${PORT}`));
