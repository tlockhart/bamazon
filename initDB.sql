DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER(30) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INTEGER(30) NOT NULL,
  stock_quantity INTEGER(30) NOT NULL,
  product_sales INTEGER(30) NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs INTEGER(30) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values ('hair dryer', 'Home & Kitchen', 50, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('hair brush', 'Home & Kitchen', 5, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('LG TV', 'Electronics', 1000, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('PS4 Red Dead Redemption', 'Toys & Games', 60, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('OWL Diaries Box Set', 'Books', 20, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Lego City Advent Calender', 'Toys & Games', 20, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Alexa FireStick Remote', 'Electronics', 40, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('NOCO Battery Charger', 'Automative', 30, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('L.O.L. Surprise! Glam Doll', 'Toys & Games', 10, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Crayola LightUp Tracing Pad', 'Toys & Games', 25, 20);

INSERT INTO departments (department_name, over_head_costs) values ('Home & Kitchen', 500);
INSERT INTO departments (department_name, over_head_costs) values ('Electronics', 10000);
INSERT INTO departments (department_name, over_head_costs) values ('Toys & Games', 1000);
INSERT INTO departments (department_name, over_head_costs) values ('Books', 800);
INSERT INTO departments (department_name, over_head_costs) values ('Automotive', 500);

-- execute 
-- mysql -u root -p < initDB.sql 