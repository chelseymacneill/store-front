// Import the required node packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Mysql database connection credentials (SQL Database is hosted on my locl machine)

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", // username
    password:"password",
    database: "storefront_db"
});

// Creating a live connection
connection.connect(function(err) {
    if (err) throw err;
    // If successful connect 
    console.log("Connected as id" + connection.threadId);
    //Put a function here for what you want to run upon connecting
    // Upon connection always display the current inventory summary
    displayItems();
    // Then give the user a choice for what to do next 
    menu();
})

// Function for displaying all items in the current products db
function displayItems(){
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        console.log(res);
        // Display the results nicely 
        for (var i=0; i < res.length; i++) {
            console.log("Item ID:" + res[i].item_id  + 
             "\nItem Name:" + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].unit_count + " | " + res[i].stock_quantity
             + "\n -----------------------")
        }
        // End the connection when tasks are complete
        connection.end();
    })
};

// Menu of option for the user to control the program 
function menu() {
    inquirer.prompt({
        name: "buyOrNot",
        type: "list",
        message:"Would you like to buy and item? ",
        choices: ["YES", "NO"]
    })
    .then(function(answer) {
        // based on their answer call the corresponding function
        if (answer.buyOrNot === "YES") {
            console.log("BUY");
            // insert function for buy here
        }
        else if (answer.buyOrNot === "NO") {
            console.log("Ok. Have a great day")
            // insert function for NO here
        } else {
            connection.end();
            console.log("Connection ended")
        }
    });
}

// Function to buy an item
function buyHowMuch() {
    inquirer.prompt({
        name: "buyHowMuch",
        type : "number",
        message: "What item would you like to buy?"
    })
    .then(function(answer) {
        // based on the answer search the db for the item chosen
        

    })
    ;
}

// (Admin only) Function for Admin only to add new products to the db
function createProduct() {
    console.log("Inserting a new product...\n");
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: "Rocky Road",
        price: 3.0,
        stock_quantity: 50
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
        // Call updateProduct AFTER the INSERT completes
        updateProduct();
      }
    )};



