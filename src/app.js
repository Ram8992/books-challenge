const express = require('express');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const session = require('express-session');
const cookie = require('cookie-parser');
const cookieExist = require('./middlewares/cookiemiddleware');
const userLoggedMiddleware = require ('./middlewares/userLoggedMiddleware')


const app = express();

app.use(cookie())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitealized: false
}))

app.use(userLoggedMiddleware)

app.use(cookieExist)
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
