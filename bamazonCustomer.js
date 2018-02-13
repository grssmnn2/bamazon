// var passwords = require('./passwords.js');
// var password = new connection(passwords.userPass);
// require inquirer npm to ask user for input
var inquirer = require('inquirer');
// require mysql to use mysql tables/database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     :  3306,
  user     : 'root',
  password : "",
  database : "bamazonDB"
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
//   console.log('connected as id ' + connection.threadId);
  afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      for(var i=0; i<res.length; i++){
      console.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: $" + res[i].price);
      }
      ask();
      connection.end();
    });
};
// ask user to place an order prompting for ID and number of items 
function ask() {
    // prompt user for guess and keep track of user's remaining guess
    inquirer.prompt([
      {
        message: "Please enter the ID of the item you'd like to purchase",
        name: "itemID",
        type: "input",
        validate: function (value) {
          if (!value.match(/^[0-9]+$/)) {
            return('Please only enter number values');
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
              return('Please only enter number values');
              return false;
            } return true;
          }
      }
    ]).then(function (answers) {    
      var itemID = +answers.itemID;
      var requestedQuantity = +answers.quantity;
     
      if (this.quantity < requestedQuantity){
          console.log("Sorry, there is insufficient stock to fill your order.");
      }else{
          console.log("Thank you for your order. Your total is " + (+this.price * requestedQuantity));
          this.quantity = this.quantity-requestedQuantity;
      }
       
 
    });
  }

 