"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const mysql = require("promise-mysql");

// To handle different POST formats
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

const DEBUG = true;
const SERVER_ERROR = "Something went wrong on the server... Please try again later.";
const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;

app.use(express.static("public"));

/*---- SELECT queries ------ */

/**
  * Error Handler function
 */

async function getDB() {
  let db = await mysql.createConnection({
    // Variables for connections to the database.
    host: "localhost",      
    port: "3306",          
    user: "appclient",         
    password: "clientpw",    
    database: "bank"
  });
  return db;
}

function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  // All error responses are plain/text 
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});