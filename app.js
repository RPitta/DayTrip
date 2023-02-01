if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const axios = require("axios").default
const User = require('./models/user');

const cityRoutes = require('./routes/cities');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://mongo:27017/daytrip');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// 

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.currentPath = req.url;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Search bar for city search. Have a user enter a city from an autocompleted
// list of cities and generate a view for that city

app.use('/cities', cityRoutes);
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render("home");
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    // res.status(statusCode).send(err.message)
    res.status(statusCode).render('error', { err })
})

// app.get('/register', (req, res) => {
//     res.render('users/register');
// })


app.listen(3000, () => {
    console.log('Serving on port 3000')
})