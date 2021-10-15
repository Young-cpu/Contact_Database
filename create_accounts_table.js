/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");

const dbCon = mysql.createPool({
    connectionLimit: 100,
    host: "us-cdbr-east-04.cleardb.com",
    user: "b7f0c4e4d2773b",                  // replace with the database user provided to you
    password: "f7333a7d",                    // replace with the database password provided to you
    database: "heroku_1c96c27eced215d",      // replace with the database user provided to you
    port: 3306
});

var sql = `CREATE TABLE tbl_accounts (
    acc_id       INT NOT NULL AUTO_INCREMENT,
    acc_name     VARCHAR(20),
    acc_login    VARCHAR(20),
    acc_password VARCHAR(200),
    PRIMARY KEY (acc_id)
)`;


console.log("Attempting database connection");
console.log("Connected to database!");
console.log("Attempting to create table: tbl_accounts");
dbCon.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        console.log("Table tbl_accounts created");
        dbCon.end();
});

    
