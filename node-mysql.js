"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const mysql = require('mysql2/promise');
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
// const saltRounds = 12;
// const pinHash = await bcrypt.hash(pin, saltRounds);

// To handle different POST formats
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

app.use(cookieParser());
const COOKIE_EXP_TIME = 5 * 60 * 1000; // login cookies last 5 minutes.

const DEBUG = true;
const SERVER_ERROR = "Something went wrong on the server... Please try again later.";
const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;

app.use(express.static("public"));

/*---- SELECT queries ------ */

/**
 * Gets account balance
 */
app.get("/balance", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let cardnumber = req.cookies.cardnumber;
      let balance = await getAccountBalance(db, cardnumber);
      res.json(balance);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
  * Calls query to get the current account balance
 */

async function getAccountBalance(db, cardnumber) {
  let query = 'SELECT balance FROM accounts WHERE card_number= ?'
  let rows = await db.query(query, [cardnumber]);
  return rows;
}

/*---- INSERT queries ------ */

/**
 * Deposits into account
 */
app.post("/deposit", async (req, res) => {

    console.log("call to deposit");
    let db;
    try {
      db = await getDB();
      let amount = req.body.amount;
      let cardnumber = req.cookies.cardnumber;
      console.log(cardnumber);
  
      let newBalance = await deposit(db, cardnumber, amount);
      console.log("got new balance" + newBalance);
      res.json({ balance: newBalance });
      // console.log("should not have gotten here");
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      await db.end();
    }
  });

/**
 * Helper function for deposit
 */

async function deposit(db, cardnumber, amount) {
    console.log("console.log deposit helper called 1");

    let [result] = await db.query(
        "SELECT balance FROM accounts WHERE card_number = ?",
        [cardnumber]
    );
    console.log(result);
    let before = parseInt(result[0].balance, 10);
    let after = before + parseInt(amount,10);
    console.log("console.log deposit helper called 2");
    await db.query(
        "UPDATE accounts SET balance = ? WHERE card_number = ?",
        [after, cardnumber]
    );
    console.log("console.log deposit helper called 3");
    await db.query(
        "INSERT INTO transactions (card_number, date, balance_before, balance_after) VALUES (?, NOW(), ?, ?)",
        [cardnumber, before, after]
    );
    console.log("console.log deposit helper called 4");
    console.log(after);

    return after;
}

/**
 * Withdraws from account balance
 */
app.post("/withdraw", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let amount = req.body.amount;
      let cardnumber = req.cookies.cardnumber;
  
      let newBalance = await withdraw(db, cardnumber, amount);
      res.json({ balance: newBalance });
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
 * Helper function for withdraw
 */
async function withdraw(db, cardnumber, amount) {

    let [result] = await db.query(
        "SELECT balance FROM accounts WHERE card_number = ?",
        [cardnumber]
    );
    amount = parseInt(amount, 10);
    let before = parseInt(result[0].balance, 10);

    if (before < amount) {
        throw new Error("Insufficient funds");
    }
    let after = before - amount;
    let after_str = after.toString();

    await db.query(
        "UPDATE accounts SET balance = ? WHERE card_number = ?",
        [after_str, cardnumber]
    );

    await db.query(
        "INSERT INTO transactions (card_number, date, balance_before, balance_after) VALUES (?, NOW(), ?, ?)",
        [cardnumber, before, after_str]
    );

    return after_str;
}
/**
 * "Login" function that allows users to access 
 * their account information
 */
app.post("/authenticate", async (req, res) => {
    console.log("correct call to post");
    let cardnumber = req.body.cardnumber;
    let pin = req.body.pin;
    let db;
    try {
      db = await getDB();

      let [rows] = await db.query(
        "SELECT pin_hash FROM accounts WHERE card_number = ?",
        [cardnumber]
      );
      console.log(rows);

      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid card number" });
      }

      let valid = bcrypt.compare(pin, rows[0].pin_hash);

      if (valid) {
        res.cookie("cardnumber", cardnumber, { maxAge: COOKIE_EXP_TIME });
        res.type("text");
        res.send(`Success`);
      }
      else {
        res.status(401).send("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Error in /authenticate:", error);
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
  * Error Handler function
 */

async function getDB() {
  let db = await mysql.createConnection({
    // Variables for connections to the database.
    host: "localhost",
    port: 3306,
    user: "appadmin",
    password: "adminpw",
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