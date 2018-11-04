/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var decimalPlaces = 2;

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
    quitContinuePrompt();

    /*****************
     * END CONNECTION
     *****************/
    ///CONNECTION ENDS WHEN USER QUITS:
    //connection.end();
    //process.exit(0);//0 means we are making a clean exit
    /************************/
  });

  /*********************************************/
function displayProducts() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    //console.log(results);

    // instantiate cli-table
    var table = new Table({
      head: ['ID', 'Product', 'Price', 'Quantity']
      , colWidths: [5, 35, 10, 10]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].price.toFixed(decimalPlaces), results[i].stock_quantity]
      );
    }//for

      console.log(table.toString());
      console.log();

  inquirer.prompt([
      {
        name: "item",
        message: "Enter an item ID to purchase?\n",
        type: "number",
        validate: function(item){
          if(isNaN(item) === false && item > 0 && item <= results[results.length-1].item_id && Number.isInteger(item)){
              return true;
          }
          else{
              return false;
          }//else
        }//validate
      },//prompt
      {
        name: "quantity",
        message: "How many units would you like to purchase?\n",
        type: "number",
        validate: function(quantity){
          if(isNaN(quantity) === false && quantity > 0 && Number.isInteger(quantity)){
              return true;
          }
          else{
              return false;
          }//else
        }
      }
    ]).then(function(response) {
      //Update Inventory send query results and inquirer response as arguments
        updateInventory(results, response);
    });//updateInventory(results);
  });//query
}//displayProducts

function quitContinuePrompt() {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "Would you like to make a purchase?",
      choices: [
        "yes",
        "no"]
    })
    .then(function (answer) {
      switch (answer.selection) {
        case "yes":
          displayProducts();
          break;

        case "no":
          process.exit(0);//0 means we are making a clean exit
          break;
      }//switch
    }); //then
}//function

function updateInventory(results, response) {
  var userChoice = response.item;
  var userQuantity = response.quantity;
  var price;
  var productName;
  var newQuantity;
  var stockQuantity;
  var productSales;
  var cost = 0;
  var productFound = false;
  for (var i = 0; i < results.length; i++) {
    if (results[i].item_id === response.item) {
      stockQuantity = results[i].stock_quantity;
      productSales = results[i].product_sales;
      productName = results[i].product_name;
      price = results[i].price;
      productFound = true;
    }
  }//for
  if (userQuantity <= stockQuantity) {
    //Update Database stock_quantity
    newQuantity = stockQuantity - userQuantity;
    cost = price * userQuantity;
    if (productSales === null) {
      productSales = cost;
    }
    else
      productSales = productSales + cost;
    if(productFound){
      //Figure out bill and output to customer
      console.log(userQuantity + " " + productName + "/s at $" + price.toFixed(decimalPlaces) + "; Total Cost: $" + cost.toFixed(decimalPlaces));
      launchUpdate(userChoice, newQuantity, productSales)
    }
    else{
      console.log("\nItem not found.\n")
      quitContinuePrompt();
    }
  }
  else {
    //Let user know not enough in stock
    console.log("\nQuantity is not in stock.\n");
    quitContinuePrompt();
  }
}//updateInventory

function launchUpdate(item, newQuantity, productSales){
  var fieldsToUpdate =
  {
    stock_quantity: newQuantity,
    product_sales: productSales
  },
  whereClause =
  {
    item_id: item
  };
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [fieldsToUpdate, whereClause],
    function(error) {
      if (error) throw error;

      console.log("\nProduct/s purchased successfully!\n");
      quitContinuePrompt();
    }
  );
}//updateInventory
/*****************************************************
 *  RUN PROGRAMS
 ****************************************************/
//node .\bamazonCustomer.js*/