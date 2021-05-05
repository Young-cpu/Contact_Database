// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT
const createError = require('http-errors');

// Include the express module
const express = require('express');
const router = express.Router();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// Path module - provides utilities for working with file and directory paths.
const path = require('path');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');

// Include the express router. 

const port = 6747;

// create an express application
const app = express();

//Only for javascript module uses "require".
var dbConn = 'database/dbconfig.xml';

const fs = require("fs");

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var contacts;

fs.readFile(path.join(__dirname, "..", dbConn), function(err, data) {
    if (err) throw err;
    parser.parseString(data, function (err, result) {
        if (err) throw err;
        contacts = mysql.createConnection({
            host: result['dbconfig'].host[0],
            user: result['dbconfig'].user[0],
            password: result['dbconfig'].password[0],
            database: result['dbconfig'].database[0],
            port: result['dbconfig'].port[0],
        });
        contacts.connect(function(err){
            if (err) throw err;
            console.log("Connected");
        });
    });
});

// TODO: Add implementation for other necessary end-points

router.get('/logout', function(req,res){
    console.log("Attempting to log out");
    if(!req.session.user){
        res.send('Session not started, can not logtout');
    }
    else{
        req.session.destroy();
        res.redirect('/login');
    }
});


router.get('/contacts', function(req, res){
    contacts.query('SELECT * FROM tbl_contacts',
    function(err, results){
        if(err){
            throw err;
        }
        var list = [];
        for (var i = 0; i < results.length; i++){
            list.push(results[i]);
        }
        res.json(list);
    })
});

var urlencodedParser = bodyparser.urlencoded({ extended: false })

router.post('/login', urlencodedParser, function(req,res){
    var loginInfo = req.body;
    var login = loginInfo.login;
    var pwd = loginInfo.password;
    
    contacts.query('SELECT * FROM tbl_accounts WHERE acc_login = ?',
    [login],
    function(err,results){
        if (err){
            throw err;
        }
        results = JSON.parse(JSON.stringify(results));

        if (results.length === 1 && bcrypt.compareSync(pwd, results[0].acc_password)){
            req.session.regenerate((err) =>{
                if(err){
                    throw err;
                }
                else{
                    req.session.user = login;
                    res.json({status: 'success'});
                }
            });
        }
        else{
            res.json({status: 'fail'});
        }
    })
});

router.post('/addContact', urlencodedParser, function(req,res){
    contacts.query('SELECT * FROM tbl_contacts WHERE name =?', req.body.name,
    function(err,result){
        if(err) throw err;
        if (result == ""){
            var contactInfo = {
                name: req.body.name,
                category: req.body.cat,
                location: req.body.loc,
                contact_info: req.body.info,
                email: req.body.email,
                website_url: req.body.web
            };
            contacts.query('INSERT tbl_contacts SET ?', contactInfo, function(err,result){
                if(err) throw err;
                var response = {flag:true};
                res.send(response);

                });
            
        }
        else{
            var response ={flag:false};
            res.send(response);
            }
        });
    });

//Homework 7 functions
router.get('/getUser', function(req,res){
    if (!req.session.user){
        throw err;
    }
    else{
        contacts.query('SELECT * FROM tbl_accounts WHERE acc_name = ?', req.session.user,
        function(err, results){
            if (err) throw err;
            res.send(results);
        });
    }
});

router.post('/updateContact', urlencodedParser, function(req,res){
    contacts.query('SELECT * FROM tbl_contacts WHERE name =?', req.body.name,
    function(err, result){
        if(err){
            throw err;
        }
        //If result return nothing, it means that name is changed
        if("" == result){
            var response = {flag:false};
            res.send(response);
        }
        else{
            var contactInfo = {
                name: req.body.name,
                category: req.body.category,
                location: req.body.location,
                contact_info: req.body.contact_info,
                email: req.body.email,
                website_url: req.body.website_url
            };
        
                //Choose the name, because name cannot be duplicated.
                contacts.query('UPDATE tbl_contacts SET ? WHERE name=?', [contactInfo, req.body.name], function(err,result){
                if (err){
                    throw err;
                }
                else{
                    var response = {flag:true};
                    res.send(response);   
                }
            });
            
        }
    })



});

router.post('/deleteContact', urlencodedParser, function(req,res){
    console.log("Connected to deleteContact");
    if(!req.session.user) throw err;
    else{
        contacts.query('DELETE FROM tbl_contacts WHERE name = ?', req.body.name, function(err, result){
            if (err){
                res.json({status: 'fail'});
            }
            else{
                res.json({status: 'success'});
            }
        })
    }
});



module.exports = router;
