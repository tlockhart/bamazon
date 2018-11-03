/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");
//var Table = require('cli-table');

// call once somewhere in the beginning of the app
const cTable = require('console.table');
//var displayCtr = 0;

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
  //displaySongs();

  /*****************
   * END CONNECTION
   *****************/
  ///DEPENDENT ON USR RESPONSE:
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
          addRecordPrompt();
          break;

        case "Quit":
          process.exit(0);//0 means we are making a clean exit
          break;
      }
    }); //then
}//function prompot user

function viewProducts(){
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.log();
    displayProducts(results);
});//Query
}//viewProducts

/*****************************************
 * CTABLE
 *****************************************/
function displayProducts(res){
  //console.log("Position: " + res[i].billboard_rank + " || Song: " + res[i].song_name + " || Year: " + res[i].song_year);
  var values = [];
  for (var i = 0; i < res.length; i++) {
    values[i] = [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity];
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
        message: "\nEnter an item ID to add additional inventory?\n",
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
        message: "\nHow many additional units would you like to add?\n",
        type: "number",
        validate: function(quantity){
          //console.log("Item = "+item);
          if(isNaN(quantity) === false && quantity >= 0){
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
        updateInventory(results, response);
    });
  });//query
}//addQuantityPrompt
function updateInventory(results, response){
  console.log("Item_ID = "+response.item);
  console.log("Quantity = "+response.quantity);
  //console.log("Available Quantity = "+results[response.item-1].stock_quantity);
  //console.log("Price = "+results[response.item-1].price);
  console.log("Item Name = "+results[response.item-1].product_name);
  var productName = results[response.item-1].product_name;
  //var price = results[response.item-1].price;
  var userChoice = response.item;
  var userQuantity = response.quantity;
  var stockQuantity = results[response.item-1].stock_quantity;
  var newQuantity = stockQuantity + userQuantity;
  launchUpdate(userChoice, newQuantity)
  //var cost =0; 
      /*if (userQuantity <= stockQuantity){
        //Update Database stock_quantity
        newQuantity = stockQuantity - userQuantity;
        //console.log("Update the quantity in products database.");
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
        //displayProducts();
        quitContinue();
      }*/
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
      //reset displayCtr after transaction is complete
      //displayCtr = 0;
      //displayProducts();
      promptUser();
    }
  );
}//updateInventery

function addRecordPrompt(){
  //var syntax = /^[A-Za-z]+$/;
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
        name: "department",
        type: "list",
        message: "Select a department name to add to inventory?",
        choices: [
          "Home & Kitchen",
          "Electronics",
          "Toys & Games",
          "Automative"]
        },
        {
          name: "price",
          message: "Enter the unit price.\n",
          type: "number",
          validate: function(price){
            //console.log("Item = "+item);
            if(isNaN(price) === false && price >0){
                return true;
            }
            else{
              //console.log("Quantity not available in stock, please try again.");
                return false;
            }//else
          }//validate
        },
        {
          name: "quantity",
          message: "Enter the product quantity.\n",
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
          }//validate
        }
      ])
      .then(function(answer) {
       //var productExists = false;
        selectAll(answer);/*.then(function (productExists) {
          // now you have your rows, you can see if there are <20 of them
          console.log("Outside Connect Product Exists = " + productExists);
          if (productExists) {
            console.log("Product already exists, please perform and update instead.\n");
          }

          promptUser();
        });*/
        /*.catch((err) => setImmediate(() => { throw err; }));//SelectAll Promise */  
      });
      /*.catch((err) => setImmediate(() => { throw err; }));//addRecordPrompt Promise*/
}//addRecordPrompt

function selectAll(answer){
  var query = "SELECT product_name FROM products";
  var productExists = false;
        connection.query(query, function(err,res){
          //Call reject on error states,
          //Call launchInsert with results
          if(err){
            throw err; 
          }
          
          for (var i = 0; i < res.length; i++){
            if (res[i].product_name.toLowerCase() === answer.product.toLowerCase()){
              productExists = true;
              //console.log("\nResult = "+res[i].product_name+" Answer_Product = "+answer.product+" Inside Product Exists = "+productExists);
              console.log("\nThe product already exists in inventory.  Please update the item instead.\n")
              //Prompt user regardless if the db is updated or not.
              promptUser();
            }//if
          }//for
          if(!productExists){
            launchInsert(answer);
          }
          
        });//query
}

function launchInsert(answer){
  var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)";
        var values = [answer.product, answer.department, answer.price, answer.quantity];
  
        connection.query(query, values, function(err, res) {
          if (err) throw err;
            console.log("\nNumber of records inserted: " + res.affectedRows+"\n");
            //Prompt user regardless if the db is updated or not.
          promptUser();
        });//query
}//LaunchInsert