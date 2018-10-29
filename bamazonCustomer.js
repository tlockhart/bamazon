/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

/*****************************************************
 *  CONNECTION TO DATABASE
 ****************************************************/
var connection = mysql.createConnection({
    host: "localhost", //hostname on your computer
  
    // Your port; if not 3306
    port: 3306, //Default mysql
  
    // Your username
    user: "root",
  
    // Your password
    password: "El1zab3th!",
    database: "bamazon"
  });
   var query;
  
  //Make the connection, End the connection
  connection.connect(function(err) {
    if (err) {
      throw err;
    }
    /***************/
    //START PROGRAM
    /***************/
    //promptUser();
    displayProducts()

    /*****************
     * END CONNECTION
     *****************/
    connection.end();
  });

  /*********************************************/
function displayProducts() {
  //var table;
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    //console.log(results);

    // instantiate cli-table
    var table = new Table({
      head: ['ID', 'Product', 'Price']
      , colWidths: [5, 35, 10]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].price]
      );
    }

    console.log(table.toString());
  });//query

}//displayProducts

/*****************************************************
 *  RUN PROGRAMS
 ****************************************************/
//node .\bamazonCustomer.js*/