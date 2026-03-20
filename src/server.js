// import app from './app.js';
// import dotenv from 'dotenv';

// //read environment variables
// dotenv.config();

// const { PORT } = process.env;

// app.listen(PORT, () => {
//     console.log(`Server started on http://localhost:${PORT}`);
// });

import app from './app.js';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

import express from 'express';
import session from 'express-session';
import path from 'path';
import passport from 'passport';
import './auth/googleStrategy.js';

//read environment variables
dotenv.config();

//destructure our env values
const { PORT, DB_DATABASE, DB_HOST, DB_PORT,
        DB_USER, DB_PASSWORD } = process.env;


// const port = process.env.PORT;

//sessions and authentication
app.use(session({
    secret: process.env.UUID,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//middleware
const ensureLoggedIn = (req, res, next) => {
    if (!req.user) return res.redirect("/");
    return next();
}

//routes
app.get("/login", (req, res) => {
    res.sendFile(path.join(process.cwd(), "views/login.ejs"));
})

app.get("/products", ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(process.cwd(), "views/products.ejs"));
})

//google routes
app.get("/auth/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}))

app.get("/auth/google/callback", passport.authenticate('google', {
    failureRedirect: "/",
    successRedirect: "/products"
}))

app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});