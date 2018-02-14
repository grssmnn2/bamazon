// require inquirer npm to ask user for input
var inquirer = require('inquirer');
// require mysql to use mysql tables/database
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;   
       // show table of items user has as options
       connection.query("SELECT * FROM products", function (err, res) {        
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: $" + res[i].price + "\n");       
        }       
    });
   
});

ask();

// ask user to place an order prompting for ID and number of items 
function ask() {   
    // prompt user for guess and keep track of user's remaining guess
    inquirer.prompt([
        {
            message: "Please enter the ID of the item you'd like to purchase\n",
            name: "itemID",
            type: "input",
            validate: function (value) {
                if (!value.match(/^[0-9]+$/)) {
                    return ('Please only enter number values');
                    return false;
                } return true;
            }

        },
        {
            message: "Please enter the quantity of items you'd like to buy.",
            name: "quantity",
            type: "input",
            validate: function (value) {
                if (!value.match(/^[0-9]+$/)) {
                    return ('Please only enter number values');
                    return false;
                } return true;
            }
        }
    ]).then(function (answers) {
        var itemID = +answers.itemID;
        var requestedQuantity = +answers.quantity;
        
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (var j = 0; j < res.length; j++) {
                if (res[j].item_id === itemID && res[j].stock_quantity < requestedQuantity) {
                    console.log("Sorry, there is insufficient stock to fill your order.");
                    askAgain();
                } else if (res[j].item_id === itemID && res[j].stock_quantity > requestedQuantity) {
                    // connection.query(sql, function(err, result){
                    var newQuantity = +res[j].stock_quantity-requestedQuantity;
                    "UPDATE products SET stock_quantity = newQuantity WHERE res[j].item_id = itemID"
                    // [{stock_quantity: newQuantity},{item_id: res[j].item_id}],
                     console.log("Stock updated! " + "There are " + newQuantity + " items left.");
                    
                    //   );
                    console.log("Thank you for your order. Your total is " + "$" + (+res[j].price * requestedQuantity));
                    askAgain();
                }
            }
        })
    });
}

function askAgain() {
    inquirer.prompt({
        name: "choice",
        type: "rawlist",
        message: "What you like to place another order?",
        choices: ["YES", "NO"]
    })
        .then(function (answer) {
            if (answer.choice.toUpperCase() === "YES") {
                ask();
            } else {
                console.log("Thank you for shopping at Bamazon.");
                connection.end();
            }
        })

}


