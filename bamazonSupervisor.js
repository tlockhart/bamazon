/*****************************************************
 *  REQUIREMENTS
 ****************************************************/
var inquirer = require("inquirer");
var mysql = require("mysql");
var decimalPlaces = 2;

// call once somewhere in the beginning of the app
const cTable = require('console.table');

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
  ///PROGRAM WILL END WHEN USER QUITS
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
          addRecordPrompt();
          break;

        case "Quit":
          process.exit(0);//0 means we are making a clean exit
          break;
      }
    }); //then
}//function prompot user

function viewProducts() {
  connection.query("SELECT d.department_id, p.department_name, SUM(p.product_sales) AS product_sales, d.over_head_costs, "
    + "SUM(p.product_sales) - d.over_head_costs AS total_profit FROM departments d JOIN products p USING (department_name) "
    + "GROUP BY d.department_id", function (err, results) {
      if (err) throw err;
      console.log();
      displayProducts(results);
    });//Query
}//viewProducts
  
/*****************************************
 * CONSOLE TABLE
 *****************************************/
function displayProducts(res) {
  var values = [];
  //console.log("Record Length = " + res.length);
  for (var i = 0; i < res.length; i++) {
    if (res[i].product_sales === null) {
      values[i] = [res[i].department_id, res[i].department_name, res[i].over_head_costs.toFixed(decimalPlaces), res[i].product_sales, res[i].total_profit];
    }
    else
      values[i] = [res[i].department_id, res[i].department_name, res[i].over_head_costs.toFixed(decimalPlaces), res[i].product_sales.toFixed(decimalPlaces), res[i].total_profit.toFixed(decimalPlaces)];
  }//for
  console.log();
  console.table(['department_id', 'department_name', 'over_head_costs', "product_sales", "total_profit"], values);
  console.log();
  promptUser();
}//function

function addRecordPrompt() {
  //var syntax = /^[A-Za-z]+$/;
  var syntax = /^[a-zA-Z\s]*$/;
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter a department name to add to inventory?",
        validate: function (department) {
          if (department.match(syntax)) {
            return true;
          }
          else {
            return false;
          }
        }//validate
      },
      {
        name: "overHeadCosts",
        message: "Enter the over head cost.\n",
        type: "number",
        validate: function (overHeadCosts) {
          if (isNaN(overHeadCosts) === false && overHeadCosts > 0) {
            return true;
          }
          else {
            return false;
          }//else
        }//validate
      }
    ])
    .then(function (answer) {
      selectAll(answer);
    });
}//addRecordPrompt

function selectAll(answer) {
  var query = "SELECT department_name FROM departments";
  var departmentExists = false;
  connection.query(query, function (err, res) {
    //Call reject on error states,
    if (err) {
      throw err;
    }

    for (var i = 0; i < res.length; i++) {
      if (res[i].department_name.toLowerCase() === answer.department.toLowerCase()) {
        departmentExists = true;
        console.log("\nThe department already exists.  Please view the department instead.\n")
        //Prompt user regardless if the db is updated or not.
        promptUser();
      }//if
    }//for
    if (!departmentExists) {
      //Call launchInsert with results
      launchInsert(answer);
    }
  });//query
}
  
function launchInsert(answer) {
  var query = "INSERT INTO departments (department_name, over_head_costs) VALUES(?, ?)";
  var values = [answer.department, answer.overHeadCosts];

  connection.query(query, values, function (err, res) {
    if (err) throw err;
    console.log("\nNumber of records inserted: " + res.affectedRows + "\n");
    //Prompt user regardless if the db is updated or not.
    promptUser();
  });//query
}//LaunchInsert