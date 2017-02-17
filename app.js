var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');
var codes = require('./routes/codes');
var collections = require('./routes/collections');
var usergroups = require('./routes/usergroups');
var codingrules = require('./routes/codingrules');
var db = require('./utils/dbmodel');

var app = express();

app.locals.moment = require('moment');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var docs = require('./routes/docs')(io);

io.on('connection', function (socket) {
    socket.on('join-room', function(room) {
        socket.join(room);
        console.log('joined ' + room);
    });

    socket.on('disconnect', function() {
    });

    socket.on('refresh_codes', function(data) {
        io.to(data.room).emit('draw_codes', data.data);
    });

    socket.on('refresh_notes', function(data) {
        //nsp.emit('draw_notes', JSON.parse(notes).sort(function(a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
        io.to(data.room).emit('draw_notes', data.data);
    });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/document', docs);
app.use('/note', notes);
app.use('/code', codes);
app.use('/collection', collections);
app.use('/usergroup', usergroups);
app.use('/codingrule', codingrules);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/cacollab', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  }
});

/* Export stuff to the world */
module.exports = {app: app, server: server};
