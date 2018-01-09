-- Database Creation
CREATE DATABASE Bamazon;

USE Bamazon;

-- ============================ First Table ============================

CREATE TABLE Products(
ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
ProductName VARCHAR(30),
DepartmentName VARCHAR(30),
Price DOUBLE(10,2),
StockQuantity INTEGER);

-- Seed Items into Database
INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Bananas", "grocery", 1.99, 12),
  ("Milk", "grocery", 2.99, 24),
  ("PS3", "electronics", 199.99, 10),
  ("Xbox 360", "electronics", 199.99, 10),
  ("Bicycle", "sporting goods", 599.99, 5),
  ("Football", "sporting goods", 10.99, 50),
  ("Dictionary", "books", 9.99, 50),
  ("Logan", "dvds",19.99,25),
  ("Office Space", "dvds", 9.99, 21),
  ("The Growlers", "music", 15.99, 20);

-- ============================ Second Table ============================

CREATE TABLE Departments(
DepartmentID INTEGER AUTO_INCREMENT PRIMARY KEY,
DepartmentName VARCHAR(30),
OverHeadCosts DOUBLE(10,2),
TotalSales DOUBLE(10,2));

-- Seed Departments into Database
INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales)
VALUES ("grocery", 18000.00, -10000.00), 
  ("electronics", 75000.00, 0.00),
  ("sporting goods", 15000.00, 0.00),
  ("books", 8000.00, 0.00),
  ("dvds", 20000.00, 0.00),
  ("music", 5000.00, 0.00);
