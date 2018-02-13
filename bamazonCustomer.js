// require inquirer npm to ask user for input
var inquirer = require('inquirer');
// require mysql to use mysql tables/database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     :  3306,
  user     : 'root',
  password : '',
  database : "bamazonDB"
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
};