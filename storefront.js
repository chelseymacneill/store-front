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
            buy()
        }
        else if (answer.buyOrNot === "NO") {
            console.log("Ok. Have a great day")
            // insert function for NO here
        } else {
            //connection.end();
            console.log("Connection ended")
        }
    });
}

// Function to buy an item
function buy() {
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err; 
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
        .prompt([
            {
                name: "orderItem",
                type : "rawlist",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id);
                    }
                    return choiceArray;
                },
                message: "What item would you like to buy?"
            },
            { 
                name: "orderAmount",
                type: "input",
                message: "How many would you like?"
            }
        ])
        .then(function(answer) {
            // based on the answer search the db for the item chosen
            var chosenItem;
            for (var i = 0; i < results.length; i++){
                if (results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                }
            }
            // make sure there are enough items for sale as the user wants
            if (chosenItem.stock_quantity >= parseInt(answer.orderAmount)) {
                console.log("Order in stock");
                // calculate new stock quantity 
                let newStockQuantity = chosenItem.stock_quantity - parseInt(answer.orderAmount);
                // there is enough in stock to fill the order
                connection.query(
                    "UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity : newStockQuantity
                        },
                        { id: chosenItem.item_id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Order placed successfully!");
                    });
                }
                else { 
                    // if the user wants more than what is in stock
                    console.log("There aren't that many in stock")
                }
            });
        });
    };
    
    
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
            
            
            
            