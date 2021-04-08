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
<<<<<<< HEAD
=======

>>>>>>> f7bf0d01cf446e3aaa8df70a5ef656cf0b60c0dd
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

<<<<<<< HEAD
var PORT = process.env.PORT || 3000
server.listen(8000,'0.0.0.0',()=>{
 console.log(connection.query('desc user'));
	console.log('server open');});
socketHandler(io);
=======

const PORT = process.env.PORT || 8000;

server.listen(PORT,()=>{
    console.log("서버 시작");
});

socketHandler(io);
>>>>>>> f7bf0d01cf446e3aaa8df70a5ef656cf0b60c0dd
