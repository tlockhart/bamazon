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
        "View Products Sales by Department",
        "Create New Department",
        "Quit"]
    })
    .then(function (answer) {
      switch (answer.selection) {
        case "View Products Sales by Department":
          viewProducts();
          break;

        case "Create New Department":
          //addRecordPrompt();
          break;

        case "Quit":
          process.exit(0);//0 means we are making a clean exit
          break;
      }
    }); //then
}//function prompot user

function viewProducts(){
    connection.query("SELECT d.department_id, p.department_name, SUM(p.product_sales) AS product_sales, d.over_head_costs, "
    +"SUM(p.product_sales) - d.over_head_costs AS total_profit FROM departments d JOIN products p USING (department_name) "
    +"GROUP BY d.department_id", function (err, results) {
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
      values[i] = [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit];
    }//for
    console.log();
    console.table(['department_id', 'department_name', 'over_head_costs', "product_sales", "total_profit"], values);
    console.log();
    promptUser();
  }//function