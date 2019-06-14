// Import the required node packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Mysql database connection credentials (SQL Database is hosted on my locl machine)

var connection = mysql.createConnection({
host: "localhost",
port: 3306,
user: "root", // username
password:"password",
database: storefront_db
});

// Creating a live connection
connection.connect(function(err) {
    if (err) throw err;
    //Put a function here for what you want to run upon connecting
})