DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER(30) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(30, 2) NOT NULL,
  stock_quantity INTEGER(30) NOT NULL,
  product_sales DECIMAL(30, 2) NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs DECIMAL(30, 2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES 
  ('hair dryer', 'Home & Kitchen', 50.00, 20), 
  ('hair brush', 'Home & Kitchen', 5.00, 2), 
  ('LG TV', 'Electronics', 1000.00, 10), 
  ('PS4 Red Dead Redemption', 'Toys & Games', 60.00, 30),
  ('OWL Diaries Box Set', 'Books', 20.00, 10),
  ('Lego City Advent Calender', 'Toys & Games', 20.00, 10),
  ('Alexa FireStick Remote', 'Electronics', 40.00, 20),
  ('NOCO Battery Charger', 'Automotive', 30.00, 20),
  ('L.O.L. Surprise! Glam Doll', 'Toys & Games', 10.00, 20),
  ('Crayola LightUp Tracing Pad', 'Toys & Games', 25.00, 20);



/*INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ('PS4 Red Dead Redemption', 'Toys & Games', 60, 30);*/


INSERT INTO departments (department_name, over_head_costs) values ('Home & Kitchen', 500.00);
INSERT INTO departments (department_name, over_head_costs) values ('Electronics', 10000.00);
INSERT INTO departments (department_name, over_head_costs) values ('Toys & Games', 1000.00);
INSERT INTO departments (department_name, over_head_costs) values ('Books', 800.00);
INSERT INTO departments (department_name, over_head_costs) values ('Automotive', 500.00);

-- execute 
-- mysql -u root -p < initDB.sql 