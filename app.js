

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
var port = process.env.PORT || 3000;

//This allows node to serve the static polymer elements without having to vulcanize
app.use('/static', express.static(path.join(process.cwd(), 'bower_components')))
app.use('/elements', express.static(path.join(process.cwd(), 'app/elements')))
app.use('/scripts', express.static(path.join(process.cwd(), 'app/scripts')))
app.use('/styles', express.static(path.join(process.cwd(), 'app/styles')))

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
app.use('/users', users);
app.get('/', function(req,res){
 res.sendfile(__dirname + '/app/index.html');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

io.sockets.on('connection', function (socket) {
  var addedUser = false;
  // when the client emits 'new message', this listens and executes
  socket.on('send message', function (data) {
    console.log(data.message)
  });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
