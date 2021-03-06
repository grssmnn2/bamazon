// require inquirer npm to ask user for input
var inquirer = require('inquirer');
// require mysql to use mysql tables/database
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "Caggac11*",
    database: "bamazonDB"
});
// initial connection, display table if no errors
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
// call ask function after table loads in command line
setTimeout(function(){
    ask();
},250);
// ask user to place an order prompting for ID and number of items 
function ask() {   
    // prompt user for guess and keep track of user's remaining guess
    inquirer.prompt([
        {
            message: "Please enter the ID of the item you'd like to purchase\n",
            name: "itemID",
            type: "input",
            // validate for number input only
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
                // if table ID equals requested item ID AND stock quantity is less than what user requests OR equals zero
                if (res[j].item_id === itemID && res[j].stock_quantity < requestedQuantity || res[j].stock_quantity===0) {
                    console.log("Sorry, there is insufficient stock to fill your order.");
                    askAgain();
                    // otherwise if table ID equals requested ID and there is enough stocked items
                } else if (res[j].item_id === itemID && res[j].stock_quantity > requestedQuantity) {
                    var newQuantity = +res[j].stock_quantity-requestedQuantity;
                    var newTotal = +res[j].price * requestedQuantity
                    // update table to new stock amount based on user order
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: itemID}],
                    function(err){
                      if(err)throw err;
                    //   tell user their total
                      console.log("Thank you for your order. Your total is " + "$" + newTotal);
                      askAgain();
                    }
                  )                 
                }
            }
        })
    });
}
// ask again function runs program or ends program based on user input
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

