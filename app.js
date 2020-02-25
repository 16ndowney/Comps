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

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)

);



users = []; // just for now


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

//logout
app.delete('/logout', function(req,res){
    req.logOut();
    res.redirect('/login');
})

//serve css
app.get('/css/main.css', function(req, res){
    res.sendFile('main.css', {root: path.join(__dirname,'./css')});
});

//serve javascript
app.get('/js/client.js',function(req, res){
    res.sendFile('client.js', {root: path.join(__dirname,'./js')});
});

app.listen(port, function (error){
    if (error){
        console.log('Something went wrong', error);
    }else{
        console.log(`Listening on port ${port}`);
    }
});



// create db
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'nodemysql'
// });

//Create a table
// app.get('/createpoststable', function(req, res){
//     let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
//     db.query(sql, function(err, result){
//         if(err) throw err;
//         console.log(result);
//         res.send('Posts table created');
//     });
// });

//Insert post 1
// app.get('/addpost2', function(req, res){
//     let post = {title: 'Post two', body:'this is post #1'};
//     let sql = 'INSERT INTO posts SET ?';
//     let query = db.query(sql, post, function(err, result){
//         if(err) throw err;
//         console.log(result);
//         res.send('Insert succeded');
//     });
// });

//select posts
// app.get('/getposts', function(req,res){
//     let sql ='SELECT * FROM posts';
//     let query = db.query(sql, function(err, results){
//         if (err) throw err;
//         console.log(results);
//         res.send('success');
//     });
// });

//connect

// db.connect(function(err){
//     if(err){
//         throw err;
//     }
//     console.log('MySQL Connected...');
// });

// app.get('/createdb', function(req, res){
//     let sql = 'CREATE DATABASE nodemysql';
//     db.query(sql, function(err, result){
//         if(err){
//             console.log(result)
//             throw err;
//         }
//         res.send('database created...');
//     });
// });

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


