var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var currLoc = require('./routes/currLoc');
var firstPage = require('./routes/firstPage');
var nextPage = require('./routes/nextPage');
var yelpMatch = require('./routes/yelpMatch');
var yelpReviews = require('./routes/yelpReviews');

var app = express();

// view engine setup
app.set(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.listen(8081);
app.disable('etag');

app.use(express.static( 'routes/FrontEnd'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

try{
	app.use('/', indexRouter);
	app.use('/currLoc', currLoc);
	app.use('/firstPage', firstPage);
	app.use('/nextPage', nextPage);
	app.use('/yelpMatch', yelpMatch);
	app.use('/yelpReviews', yelpReviews);
} catch (err){

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	// next(createError(404));
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
