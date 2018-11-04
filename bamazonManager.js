/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");

const cTable = require('console.table');
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
connection.connect(function (err) {
  if (err) {
    throw err;
  }
  /***************/
  //START PROGRAM
  /***************/
  promptUser();

  /*****************
   * END CONNECTION
   *****************/
  ///PROGRAM ENDS WHEN USER SELECTS QUIT
  //connection.end();
  //process.exit(0);//0 means we are making a clean exit
  /************************/
});

function promptUser() {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "What action would you like to perform?\n",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Quit"]
    })
    .then(function (answer) {
      switch (answer.selection) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addQuantityPrompt();
          break;

        case "Add New Product":
          getDepartmentNames();
          break;

        case "Quit":
          process.exit(0);//0 means we are making a clean exit
          break;
      }
    }); //then
}//function prompt user

function viewProducts(){
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.log();
    displayProducts(results);
  });//Query
}//viewProducts

/*****************************************
 * CONSOLE TABLE
 *****************************************/
function displayProducts(res){
  var values = [];
  for (var i = 0; i < res.length; i++) {
    values[i] = [res[i].item_id, res[i].product_name, res[i].price.toFixed(decimalPlaces), res[i].stock_quantity];
  }//for
  console.log();
  console.table(['ID', 'Product', 'Price', "Quantity"], values);
  console.log();
  promptUser();
}//function

function viewLowInventory(){
  var lowNum = 5;
  var query = "SELECT * FROM products WHERE stock_quantity < " +mysql.escape(lowNum);
  connection.query(query, function (err, results) {
    if (err) throw err;
    console.log();
    displayProducts(results);
  });//Query
}//viewProducts

function addQuantityPrompt(){
  var lowNum = 5;
  var query = "SELECT * FROM products";
  connection.query(query, function (err, results) {
    inquirer.prompt([
      {
        name: "item",
        message: "Enter an item ID to add additional inventory?\n",
        type: "number",
        validate: function(item){
          if(isNaN(item) === false && item > 0 && item <= results[results.length-1].item_id && Number.isInteger(item)){
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
        message: "How many additional units would you like to add?\n",
        type: "number",
        validate: function(quantity){
          if(isNaN(quantity) === false && quantity >= 0 && Number.isInteger(quantity)){
              return true;
          }
          else{
              return false;
          }//else
        }
      }
    ]).then(function(response) {
      //Call Undate function and send the results of the MySQL query and inquirer response as arguments.
        updateInventory(results, response);
    });
  });//query
}//addQuantityPrompt
function updateInventory(results, response){
   var oldQuantity;
   var productFound = false;
   for (var i = 0; i < results.length; i++) {
    if (results[i].item_id === response.item)
    {
      oldQuantity = results[i].stock_quantity;
      productFound = true;
    }
  }//for

  var userQuantity = response.quantity;
  var userChoice = response.item;
  var newQuantity = oldQuantity + userQuantity;
  if(productFound){
    launchUpdate(userChoice, newQuantity)
  }
  else{
    console.log("Item not found.\n");
    promptUser();
  }
  
}//updateInventory

function launchUpdate(item, newQuantity){
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

      console.log("\nInventory Updated successfully!\n");
      promptUser();
    }
  );
}//updateInventery

function addRecordPrompt(results){
  var syntax = /^[a-zA-Z\s]*$/;
    inquirer
      .prompt([
        {
        name: "product",
        type: "input",
        message: "Enter a product name to add to inventory?",
        validate: function (product) {
          if (product.match(syntax)) {
            return true;
          }
          else {
            return false;
          }
        }//validate
      },
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].department_name);
            }//for
            return choiceArray;
          },
          message: "Select a department:"
        },
        {
          name: "price",
          message: "Enter the unit price.\n",
          type: "number",
          validate: function(price){
            if(isNaN(price) === false && price >0){
                return true;
            }
            else{
                return false;
            }//else
          }//validate
        },
        {
          name: "quantity",
          message: "Enter the product quantity.\n",
          type: "number",
          validate: function(quantity){
            if(isNaN(quantity) === false && quantity >0 && Number.isInteger(quantity)){
                return true;
            }
            else{
                return false;
            }//else
          }//validate
        }
      ])
      .then(function(answer) {
        selectAll(answer); 
      });
}//addRecordPrompt

function selectAll(answer) {
  var query = "SELECT product_name FROM products";
  var productExists = false;
  connection.query(query, function (err, res) {
    //Call reject on error states
    if (err) {
      throw err;
    }

    for (var i = 0; i < res.length; i++) {
      if (res[i].product_name.toLowerCase() === answer.product.toLowerCase()) {
        productExists = true;
        console.log("\nThe product already exists in inventory.  Please update the item instead.\n")
        promptUser();
      }//if
    }//for
    //Call launchInsert with results only if product does not exist
    if (!productExists) {
      launchInsert(answer);
    }
  });//query
}

function launchInsert(answer) {
  var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)";
  var values = [answer.product, answer.choice, answer.price, answer.quantity];
  connection.query(query, values, function (err, res) {
    if (err) throw err;
    console.log("\nNumber of records inserted: " + res.affectedRows + "\n");
    //Prompt user regardless if the db is updated or not.
    promptUser();
  });//query
}//LaunchInsert

function getDepartmentNames(){
    //Query the department db for all department_names, to return as choices:
    connection.query("SELECT department_name FROM departments", function(err, results) {
       //Call reject on error states,
          if(err){
            throw err; 
          }
          try {
            //Call addRecordPrompts and pass the results of the department query
          addRecordPrompt(results);
          } catch(err) {
            console.log(err)
          }
  });//Query
}//function