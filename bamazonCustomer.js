/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var displayCtr = 0;

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
    displayProducts();

    /*****************
     * END CONNECTION
     *****************/
    ///DEPENDENT ON USR RESPONSE:
    //connection.end();
    //process.exit(0);//0 means we are making a clean exit
    /************************/
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
    //If products table has not been displayed show it
    if(displayCtr < 1){
      console.log(table.toString());
      displayCtr++;
    }
    
    //promptUser(results);
    var syntax = /^[A-Za-z]+$/;
  inquirer.prompt([
      {
        name: "item",
        message: "Enter an item ID to purchase?\n",
        type: "number",
        validate: function(item){
          if(isNaN(item) === false && item > 0 && item < results.length){
              return true;
          }
          else{
            //console.log("Item ID not found, please try again.");
              return false;
          }//else
        }//validate
      },//prompt
      {
        name: "quantity",
        message: "How many units would you like to purchase?\n",
        type: "number",
        validate: function(quantity){
          //console.log("Item = "+item);
          if(isNaN(quantity) === false && quantity >0){
              return true;
          }
          else{
            //console.log("Quantity not available in stock, please try again.");
              return false;
          }//else
        }
      }
    ]).then(function(response) {
      //Examines user input and sends a callback function in as an argument.
        //console.log("Name = "+response.name.toLowerCase());
        //processInput(response.name.toLowerCase(), promptUser);
        testFunc(results, response);
    });
    //testFunc(results);
  });//query

}//displayProducts

//PROMPT USER FOR INPUT
/*function promptUser(results){
  
}//promptUser*/

function testFunc(results, response){
  console.log("Item_ID = "+response.item);
  console.log("Quantity = "+response.quantity);
  //&& quantity <= results[item].stock_quantity
  console.log("Available Quantity = "+results[response.item-1].stock_quantity);
  console.log("Price = "+results[response.item-1].price);
  console.log("Item Name = "+results[response.item-1].product_name);
  var productName = results[response.item-1].product_name;
  var price = results[response.item-1].price;
  var userChoice = response.item;
  var userQuantity = response.quantity;
  var stockQuantity = results[response.item-1].stock_quantity;
  var newQuantity;
  var cost =0; 
      if (userQuantity <= stockQuantity){
        //Update Database stock_quantity
        newQuantity = stockQuantity - userQuantity;
        console.log("Update the quantity in products database.");
        cost = price*userQuantity;
        console.log(userQuantity +" "+productName+"'s at "+price+" = "+cost);
        updateInventory(userChoice, newQuantity)
        //figure out bill and output to user
        //restart 
      }
      else
      {
        //Let user know not enough in stock
        //Show products table and then loop back from start.
        console.log("Quantity is not in stock.");
        displayProducts();
      }
}//testFunc

function updateInventory(item, newQuantity){
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: item
      }
    ],
    function(error) {
      if (error) throw error;

      console.log("Inventory Updated successfully!");
      //reset displayCtr after transaction is complete
      displayCtr = 0;
      //displayProducts();
    }
  );
}//updateInventery
/*****************************************************
 *  RUN PROGRAMS
 ****************************************************/
//node .\bamazonCustomer.js*/