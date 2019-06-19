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
    // run a function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
    .prompt({
        name: "printMenuOrBuy",
        type: "list",
        message: "Would you like to [Print Menu] or [Buy an Item] ?",
        choices: ["Print Menu", "Buy an Item", "Exit"]
    })
    .then(function(answer) {
        // based on users answer call chosen function
        if (answer.printMenuOrBuy === "Print Menu") {
            // run function for menu print
            displayItems();
        }
        else if (answer.printMenuOrBuy === "Buy an Item") {
            // run function for buying
            buyAnItem();
        } 
        else if (answer.printMenuOrBuy === "Exit") {
            connection.end()
        }
    })
}

// Function for displaying all items in the current products db
function displayItems(){
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        // Display the results in a table for easy viewing 
        console.table(res)
        
        // re-prompt the user for what they want to do
        start();
        
    })
};

// function that runs when a user wants to buy something
function buyAnItem() {
    // query the database for all item_ids for sale
    connection.query("SELECT * from products", function(err, results){
        if (err) throw (err);
        //prompt the user for which items they'd like to buy 
        inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    let choiceArray = [];
                    for (var i=0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id + "- " + results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "What item would you like to buy?",
                validate : function(value) {
                    if (isNaN(value)=== false){
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // get information of the item they want to buy
            let choiceId = parseInt(answer.choice)
            
            var query = "SELECT * FROM products WHERE ? "
            connection.query(query, {item_id: choiceId}, function(err, response) {
                // function for purchase quantity
                purchaseQuantity(choiceId, response[0].price, response[0].stock_quantity);
            })
        });
    });
};


// function for capturing how much of an item a user wants to purchase
function purchaseQuantity(itemId, price, stock_quantity) {
    inquirer
    .prompt([
        {
            name : "quantity",
            type: "number",
            message: "How much of this product do you want?"
        }
    ])
    .then(function (answer) {
        var quantity = parseInt(answer.quantity);
        
        if(quantity <= stock_quantity.quantity) {
            completePurchase(itemId, price, stock_quantity, quantity);
            
        } else {
            console.log("the amount you requested is not in stock");
            console.log(parseInt(quantity))
            start();
        }
    })
};

// Function to calculate to purchase total
function completePurchase(itemId, price, stockQuantity, quantity) {
    console.log("Your total is:" + price*quantity);
    var updateStock = stockQuantity - quantity;
    var query = "UPDATE products SET ? WHERE ?"
    connection.query(query, [{ stock_quantity: updateStock}, {item_id: itemId}]), function (err, response){
        if (err) throw (err);
        connection.end();
    }
};