/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");
const bcrypt = require('bcrypt');

const dbCon = mysql.createPool({
    connectionLimit: 100,
    host: "us-cdbr-east-03.cleardb.com",
    user: "b748299304b6a7",               // replace with the database user provided to you
    password: "97f88d58",                  // replace with the database password provided to you
    database: "heroku_773e80d42b633bf",           // replace with the database user provided to you
    port: 3306
});

console.log("Attempting database connection");
console.log("Connected to database!");

const saltRounds = 10;
const myPlaintextPassword = 'admin%'; // replace with password chosen by you OR retain the same value
const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

const rowToBeInserted = {
    acc_name: 'admin$',            // replace with acc_name chosen by you OR retain the same value
    acc_login: 'admin$',           // replace with acc_login chosen by you OR retain the same value
    acc_password: passwordHash      
};

console.log("Attempting to insert record into tbl_accounts");

dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result, fields) {
    if (err) {
        throw err;
    }
    console.log("Table record inserted!");
    dbCon.end();
});

