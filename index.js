var express =require('express');
var mysql = require('mysql') ;
var bodyParser = require('body-parser') ;
var dbconfig = require('./db') ;
var indexRoute = require('./routes/indexRoute') ;
var session = require('express-session') ;
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser') ;
var passport = require('passport') 
var flash = require('connect-flash') ;
var socketHandler = require('./socket') ;

const connection = mysql.createConnection(dbconfig);

connection.connect();

require('./passport')(passport,connection);

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('views',__dirname+'/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Jang key'));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret:'Jang key'}));
app.use('/closet',express.static(__dirname+'/public'));

app.use('/', indexRoute);
app.use('/closet',require('./routes/closetRoute')(express.Router(),connection));
app.use('/chat',require('./routes/chatRoute')(express.Router(),connection,passport,io));
app.use('/login',require('./routes/loginRoute')(express.Router(),connection,passport));
app.use('/signup', require('./routes/signupRoute')(express.Router(),connection,passport));


server.listen(8000,()=>{
    console.log("서버 시작");
});

socketHandler(io);