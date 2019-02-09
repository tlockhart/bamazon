/* eslint-disable no-restricted-globals */
/** ***************************************************
 *  REQUIREMENTS
 *************************************************** */
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');

const decimalPlaces = 2;

/** ***************************************************
 *  CONNECTION TO DATABASE
 *************************************************** */
const connection = mysql.createConnection({
  host: 'localhost', // hostname on your computer

  // Your port; if not 3306
  port: 3306, // Default mysql

  // Your username
  user: 'root',

  // Your password
  password: 'El1zab3th!',
  database: 'bamazon',
});
// let query;

// Make the connection, End the connection
connection.connect((err) => {
  if (err) {
    throw err;
  }
  /** ************ */
  // START PROGRAM
  /** ************ */
  // promptUser();
  quitContinuePrompt();

  /** ***************
     * END CONNECTION
     **************** */
  // /CONNECTION ENDS WHEN USER QUITS:
  // connection.end();
  // process.exit(0);//0 means we are making a clean exit
  /** ********************* */
});

/** ****************************************** */
function displayProducts() {
  // query the database for all items being auctioned
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    // console.log(results);

    // instantiate cli-table
    const table = new Table({
      head: ['ID', 'Product', 'Price', 'Quantity'],
      colWidths: [5, 35, 10, 10],
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    for (let i = 0; i < results.length; i += 1) {
      table.push(
        [
          results[i].item_id,
          results[i].product_name,
          results[i].price.toFixed(decimalPlaces),
          results[i].stock_quantity,
        ],
      );
    }// for

    console.log(table.toString());
    console.log();

    inquirer.prompt([
      {
        name: 'item',
        message: 'Enter an item ID to purchase?\n',
        type: 'number',
        validate(item) {
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(item) === false
            && item > 0
            && item <= results[results.length - 1].item_id
            && Number.isInteger(item)) {
            return true;
          }

          return false;
          // else
        }, // validate
      }, // prompt
      {
        name: 'quantity',
        message: 'How many units would you like to purchase?\n',
        type: 'number',
        validate(quantity) {
          if (isNaN(quantity) === false
            && quantity > 0
            && Number.isInteger(quantity)) {
            return true;
          }

          return false;
          // else
        },
      },
    ]).then((response) => {
      // Update Inventory send query results and inquirer response as arguments
      updateInventory(results, response);
    });// updateInventory(results);
  });// query
}// displayProducts

function quitContinuePrompt() {
  inquirer
    .prompt({
      name: 'selection',
      type: 'list',
      message: 'Would you like to make a purchase?',
      choices: [
        'yes',
        'no'],
    })
    .then((answer) => {
      switch (answer.selection) {
        case 'yes':
          displayProducts();
          break;

        case 'no':
          process.exit(0);// 0 means we are making a clean exit
          break;

        default:
      }// switch
    }); // then
}// function

function updateInventory(results, response) {
  const userChoice = response.item;
  const userQuantity = response.quantity;
  let price;
  let productName;
  let newQuantity;
  let stockQuantity;
  let productSales;
  let cost = 0;
  let productFound = false;
  for (let i = 0; i < results.length; i += 1) {
    if (results[i].item_id === response.item) {
      stockQuantity = results[i].stock_quantity;
      productSales = results[i].product_sales;
      productName = results[i].product_name;
      const result = results[i];
      // eslint-disable-next-line prefer-destructuring
      price = result.price;
      productFound = true;
    }
  }// for
  if (userQuantity <= stockQuantity) {
    // Update Database stock_quantity
    newQuantity = stockQuantity - userQuantity;
    cost = price * userQuantity;
    if (productSales === null) {
      productSales = cost;
    } else productSales += cost;
    if (productFound) {
      // Figure out bill and output to customer
      console.log(`${userQuantity} ${productName}/s at $${price.toFixed(decimalPlaces)}; Total Cost: $${cost.toFixed(decimalPlaces)}`);
      launchUpdate(userChoice, newQuantity, productSales);
    } else {
      console.log('\nItem not found.\n');
      quitContinuePrompt();
    }
  } else {
    // Let user know not enough in stock
    console.log('\nQuantity is not in stock.\n');
    quitContinuePrompt();
  }
}// updateInventory

function launchUpdate(item, newQuantity, productSales) {
  const fieldsToUpdate = {
    stock_quantity: newQuantity,
    product_sales: productSales,
  };


  const whereClause = {
    item_id: item,
  };
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [fieldsToUpdate, whereClause],
    (error) => {
      if (error) throw error;

      console.log('\nProduct/s purchased successfully!\n');
      quitContinuePrompt();
    },
  );
}// updateInventory
/** ***************************************************
 *  RUN PROGRAMS
 *************************************************** */
// node .\bamazonCustomer.js*/
