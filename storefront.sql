-- Drops the storefront db if it exists currently --
DROP DATABASE IF EXISTS storefront_db;
-- Creates the "animals_db" database --
CREATE DATABASE storefront_db;

-- Makes it so all of the following code will affect animals_db --
USE storefront_db;

-- Creates the table "people" within animals_db --
CREATE TABLE products (
  -- A unique product_id 
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(30) NULL,
  -- price per unit (can be 1 or a box)
  price DECIMAL(6,2) NULL,
  unit_count INT NULL,
  -- # of units in stock
  stock_quantity INT NULL,
  Primary key (item_id)

);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pencil", "Office Supplies", .10, 100),
("Basketball", "Sporting Goods", 49.99, 100),
("Mascara", "Cosmetics", 6.99, 100),
("Laundry Detergent", "Consumables", 25.99, 100),
("Diaper", "Consumables", 35.99, 100),
("Coleman Grill", "Camping", 99.99, 100),
("Tent", "Camping", 299.99, 100),
("Couch", "Housewears", 999.99, 100),
("Rug", "Housewears", 399.99, 100);




