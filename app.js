if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const port = 3000;
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);



users = [];
locations = [];


/* Create server, serve files */
const app = express();
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//serve logged in home page
app.get('/', checkAuthenticated, function(req, res){
    res.render('index.ejs', {name: req.user.name});
});

//serve log in
app.get('/login', checkNotAuthenticated,function(req, res){
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/assets/login-720.png', checkNotAuthenticated,function(req, res){
    res.sendFile('login-720.png', {root: path.join(__dirname,'./assets')});
});

//serve registration page
app.get('/register', checkNotAuthenticated,function(req, res){
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated,async function(req, res){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
});

app.post('/addLocation', function(req,res){
    console.log(req.body);
    res.redirect('/');
    locations.push({
        id: Date.now().toString(),
        name: req.body.loc_name,
        picture: req.body.picture,
        location: req.body.location,
        description: req.body.description
    });
})

app.get('/getLocations', function(req,res){
    res.send(locations);
})

//logout
app.delete('/logout', function(req,res){
    req.logOut();
    res.redirect('/login');
})

//serve css
app.get('/css/main.css', function(req, res){
    res.sendFile('main.css', {root: path.join(__dirname,'./css')});
});

app.get('/css/test.css', function(req, res){
    res.sendFile('test.css', {root: path.join(__dirname,'./css')});
});

//serve client js
app.get('/js/client.js',function(req, res){
    res.sendFile('client.js', {root: path.join(__dirname,'./js')});
});

//serve file uploader
app.get('/js/fileUpload.js',function(req, res){
    res.sendFile('fileUpload.js', {root: path.join(__dirname,'./js')});
});

//bring server up
app.listen(port, function (error){
    if (error){
        console.log('Something went wrong', error);
    }else{
        console.log(`Listening on port ${port}`);
    }
});

//connect to db
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,})

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', error => console.log('Connected to Mongoose'));

mongoose.model('users', {name: String, email: String, password: String});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
       return res.redirect('/');
    }
    next();
}


