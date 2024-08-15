const express = require('express');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const session = require('express-session');
const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const path = require('path');
// declaring routers once
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const indexRouter = require('./routes/index');


// Initialize Express app
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'decoration')));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cars', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'cars',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration for MongoDB (uncomment if needed)
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Routes
//const searchRouter = require('./routes/search');
//app.use('/search', searchRouter);
//
//const authRouter = require('./routes/auth');
//app.use("/auth", authRouter);
//
//const indexRouter = require('./routes/index');
//app.use("/index", indexRouter);
//
//const authRouter = require('./routes/auth');
//app.use('/users', authRouter);

//const searchRouter = require('./routes/search');
//const authRouter = require('./routes/auth');
//const indexRouter = require('./routes/index');

// Use routers
app.use('/auth', authRouter);
app.use('/search', searchRouter);
app.use('/users', authRouter);
app.use('/index', indexRouter);


// Default route
app.get('/', (req, res) => {
    res.redirect('/index');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
