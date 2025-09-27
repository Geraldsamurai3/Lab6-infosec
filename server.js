"use strict";

// Load environment variables
require('dotenv').config();

// Imports
const express = require("express");
const { auth, requiresAuth } = require('express-openid-connect');
var cons = require('consolidate');
var path = require('path');
let app = express();

// Globals
const PORT = process.env.PORT || "3000";

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// MVC View Setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('models', path.join(__dirname, 'models'));
app.set('view engine', 'html');

// App middleware
app.use("/static", express.static("static"));

// App routes
app.get("/", (req, res) => {
  res.render("index", { 
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user 
  });  
});

app.get("/dashboard", requiresAuth(), (req, res) => {  
  res.render("dashboard", { user: req.oidc.user });
});

// Start server
app.listen(parseInt(PORT), () => {
  console.log("Server running on port: " + PORT);
});