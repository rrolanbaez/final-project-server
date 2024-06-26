var express = require('express');
var logger = require('morgan');

var cors = require('cors');
var mongoose = require('mongoose');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var carsRouter = require('./routes/cars');
var reservationsRouter = require('./routes/reservations'); 
var photosRouter = require('./routes/photos');
var favoritesRouter = require('./routes/favorites');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', 1); // apps will be runing on proxy server. Important for deployment
app.enable('trust proxy');

app.use(
    cors({
      origin: [process.env.REACT_APP_URI]  // <== URL of our future React app
    })
  );

// app.use(
//     cors()
//   );

// app.use('/', indexRouter);  --> We never use this because everything can match the index router
app.use('/reservations', reservationsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/cars', carsRouter);
app.use('/photos', photosRouter);
app.use('/favorites', favoritesRouter);   // When I add this it crashessss 

mongoose
    .connect(process.env.MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo! 💚 Database name: "${x.connections[0].name}"`))
    .catch((err) => console.error("Error connecting to mongo", err));

module.exports = app;

