const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
// const {expressCspHeader, NONE, SELF} = require('express-csp-header');

const authenticated = require('./lib/middleware/authenticated');
const messages = require('./routes/messages');
const daily = require('./routes/daily');
const articles = require('./routes/articles');


const app = express();

app.use(methodOverride());
app.use(cookieParser('961002'));
app.use(session());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(authenticated);
// app.use(expressCspHeader({
//     directives: {
//         'default-src': [NONE],
//         'img-src': [SELF],
//     }
// }));
app.use('/messages', messages);
app.use('/daily', daily);
app.use('/articles', articles);

app.get('/', (req, res) => {
    res.set('Content-type', 'text/html');
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/auth', (req, res) => {
    res.json({
        identity: res.locals.admin,
    });
});

app.listen(8000);
