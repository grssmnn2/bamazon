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
manager();
// ask if user is a manager (no password right now)
function manager (){
    inquirer.prompt({
        name: "choice",
        type: "rawlist",
        message: "Are you an authorized manager?",
        choices: ["YES", "NO"]
    })
        .then(function (answer) {
            if (answer.choice === "YES") {
                viewMenu();
            } else if (answer.choice === "NO") {
                console.log("Sorry, you do not have permission to view this site.");
            } 
        })

}
// if they answered yes to manager, show menu
function viewMenu() {
    inquirer.prompt({
        name: "choice",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View all products", "View low inventory", "Add to inventory", "Add new product"]
    })
        .then(function (answer) {
            // run each function depending on user input
            if (answer.choice === "View all products") {
                viewProducts();
            } else if (answer.choice === "View low inventory") {
                lowInven();
            } else if (answer.choice === "Add to inventory") {
               addInven();
            } else if (answer.choice === "Add new product") {
                addProduct();
            }
        })

}

// if selected view products
// app should show all available items with ID, name, price, quantity

    function viewProducts() {  
        connection.connect(function (err) { 
        if (err) throw err;
        // show table of items user has as options
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " Product: " + res[i].product_name +
                    " Price: $" + res[i].price + " Items in Stock: " + res[i].stock_quantity + "\n");
            }
            viewMenu();
        });
    });
}


// if selected view low inventory
// app shows items with inventory count lower than 5
function lowInven() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        if (res.stock_quantity <= 5) {
        for (var j = 0; j < res.length; j++) {          
                console.log("ID: " + res[i].item_id + " Product: " + res[i].product_name +
                    " Price: $" + res[i].price + " Items in Stock: " + res[i].stock_quantity + "\n");
                   
            }
        }else{
                console.log("All items are well stocked.");
                viewMenu();
            }

        })
       
    };

    function productsOnly(){
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].item_id + " Product: " + res[i].product_name +
                        " Price: $" + res[i].price + " Items in Stock: " + res[i].stock_quantity + "\n");
                }
                
            });
    }



// if selected add to inventory, app should prompt manager to add more of any item currently in the store
function addInven(){
    productsOnly();
    // questions are in timer to keep from showing before table populates
    setTimeout(function(){      
   
    inquirer.prompt([
        {
            message: "Please enter the ID of the item you'd like to add more of.\n",
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
            message: "Please enter the quantity of items you'd like to restock.",
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
            for (var k = 0; k < res.length; k++) {
                // if table ID equals requested item ID AND stock quantity is less than what user requests OR equals zero
                if (res[k].item_id === itemID) {
                    var newQuantity = +res[k].stock_quantity+requestedQuantity;
                    // update table to display new stock amount
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: itemID}],
                    function(err){
                      if(err)throw err;
                    //   tell user their total and keep track of stock remaining (more for programmer than user)
                      console.log("Stock updated! " + "There are now " + newQuantity + " items available for purchase.");
                      viewMenu();
                    }
                  )                 
                }
            }
        })
    });
},250);
}


// if selected add new product
// allow manager to add completely new product to store
function addProduct() {
    // prompt for info about new item to add to store
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the name of the product?"
        },
        {
          name: "department",
          type: "input",
          message: "What home department does this item go in?"
        },
        {
          name: "price",
          type: "input",
          message: "What is the selling price of this item?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many items are you adding?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }

        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
          },
          function(err) {
            if (err) throw err;
            console.log("Your store now sells a new item! See below to see your item in action.");
            // show user the menu again
            productsOnly();
            viewMenu();
          }
        );
      });
  }