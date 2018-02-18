-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazonDB;
-- Create a database called programming_db --
CREATE DATABASE bamazonDB;

-- Use bamazon db for the following statements --
USE bamazonDB;

CREATE TABLE products(
  -- item_id will automatically increment its default value as we create new rows. --
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  -- string type name of product --
  product_name VARCHAR(50),
  -- string type department name --
  department_name VARCHAR(20),
-- price column
  price FLOAT(6),
--   available items
stock_quantity INTEGER(100),
  -- Set the id as this table's primary key
  PRIMARY KEY(item_id)
);

CREATE TABLE departments(

    department_id INTEGER(10) AUTO_INCREMENT NOT NULL,

    department_name VARCHAR(30),
    
    over_head_costs INTEGER(10)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Loofah", "Bath Supplies", 3.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kitchenaide", "Kitchen Supplies", 300.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Soap", "Bath Supplies", 2.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toaster", "Kitchen Supplies", 30.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toothbrush", "Bath Supplies", 2.00, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Conditioner", "Bath Supplies", 3.00, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microwave", "Kitchen Supplies", 20.00, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toothpaste", "Bath Supplies", 3.00, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sponge", "Kitchen Supplies", 1.00, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shampoo", "Bath Supplies", 3.00, 20);