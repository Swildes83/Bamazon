// Require prompt node package 
var prompt = require('prompt');

// Require mySQL node package
var mysql = require('mysql');

var padText = require('./padTable.js')

// Link to mySQL Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "kingsley1", //Your password
    database: "Bamazon"
});

// Connect to Database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    // Prompt user with options 
    prompt.start();

    // Display Menu
    console.log('\nBamazon Manager Menu');
    console.log('----------------------------')
    console.log('Select a (numeric) option.')
    console.log('1. View Products for Sale');
    console.log('2. View Low Inventory');
    console.log('3. Add to Inventory');
    console.log('4. Add New Product');

    prompt.get(['menuSelection'], function (err, result) {

        // Switch Case for different options
        var menuSelection = parseInt(result.menuSelection);

        switch (menuSelection) {
            case 1:
                console.log('\nView Products for Sale...');
                viewProducts(function () { }); //this function uses a callback 
                connection.end();
                break;

            case 2:
                console.log('\nView Low Inventory...');
                viewLowInventory();
                connection.end();
                break;

            case 3:
                console.log('\nAdd to Inventory...');
                addInventory();
                break;

            case 4:
                console.log('\nAdd New Product...');
                addNewProduct();
                break;

            default:
                console.log('Not a vaild entry. Aborting.');
                connection.end();

        }

    });

});

// View Products for sale 
function viewProducts(callback) {

    // Display All Items inside Database
    connection.query('SELECT * FROM Products', function (err, res) {

        // Error Handler
        if (err) throw err;

        // Show User message
        console.log('Total FC Inventory is below...\n');

        // Set up table header
        console.log('  ID  |      Product Name      |  Department Name  |   Price  | In Stock');
        console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')

        // Loop through database and show all items
        for (var i = 0; i < res.length; i++) {

            // Add in padding for table 
            var itemID = res[i].ItemID + ''; // converting to string
            itemID = padText("  ID  ", itemID);

            var productName = res[i].ProductName + ''; // converting to string
            productName = padText("      Product Name      ", productName);

            var departmentName = res[i].DepartmentName + ''; // converting to string
            departmentName = padText("  Department Name  ", departmentName);

            var price = '$' + res[i].Price.toFixed(2) + ''; // converting to string
            price = padText("   Price  ", price);

            var quantity = res[i].StockQuantity + ''; // converting to string 

            // Log table entry
            console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
        }
        // Callback function (for use in case 3 to counter asynch behavior)
        callback();
    });
}

// View Low Inventory
function viewLowInventory() {
    // Displays Items inside Database with less than 5 in stock
    connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function (err, res) {

        // Error Handler
        if (err) throw err;

        // Show User message
        console.log('Inventory for Items < 5 In Stock is below...\n');

        // Sets up table header
        console.log('  ID  |      Product Name      |  Department Name  |   Price  | In Stock');
        console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')

        // Loops through database and show all items
        for (var i = 0; i < res.length; i++) {

            // Add in padding for table 
            var itemID = res[i].ItemID + '';
            itemID = padText("  ID  ", itemID);

            var productName = res[i].ProductName + '';
            productName = padText("      Product Name      ", productName);

            var departmentName = res[i].DepartmentName + '';
            departmentName = padText("  Department Name  ", departmentName);

            var price = '$' + res[i].Price.toFixed(2) + '';
            price = padText("   Price  ", price);

            var quantity = res[i].StockQuantity + '';

            // Log table entry
            console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
        }


        console.log('\nNeed to stock!')
    });
}

// Add to Inventory
function addInventory() {

    // Running the View Products Function (case 1) and then asking user for unput after callback
    viewProducts(function () {

        // Prompt user for re-stock item
        prompt.start();
        console.log('\nWhich item would you like to restock?');
        prompt.get(['restockItemID'], function (err, result) {

            // Show Item ID selected
            var restockItemID = result.restockItemID;
            console.log('You have selected to re-stock Item # ' + restockItemID + '.');

            // Prompt for how many more items
            console.log('\nHow many items will you restock?');
            prompt.get(['restockCount'], function (err, result) {

                //Show Restock Count selected
                var restockCount = result.restockCount;
                console.log('You have selected to re-stock ' + restockCount + ' items.');
                restockCount = parseInt(restockCount);

                if (Number.isInteger(restockCount)) {

                    // Query for current item inventory
                    connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ ItemID: restockItemID }], function (err, res) {

                        // Check if the item Id was valid (i.e. something was returned from mySQL)
                        if (res[0] == undefined) {

                            console.log('Sorry... We were unable to locate items with Item ID "' + restockItemID + '"');
                            connection.end(); // end the script/connection

                        }
                        // Valid Item ID, so add Bamazon Inventory 
                        else {

                            var bamazonQuantity = res[0].StockQuantity;
                            var newInventory = parseInt(bamazonQuantity) + parseInt(restockCount);

                            // Update Database with new items
                            connection.query('UPDATE Products SET ? WHERE ?', [{ StockQuantity: newInventory }, { ItemID: restockItemID }], function (err, res) {
                                if (err) throw err;

                                console.log('\nInventory updated')
                                connection.end();

                            });

                        }

                    });
                }
                else {
                    connection.end();
                }

            });

        });

    });

}

// Add New Product
function addNewProduct() {

    // Prompt user for new item details
    prompt.start();
    prompt.get(['ProductName', 'DepartmentName', 'Price', 'Quantity'], function (err, result) {

        // Collect/parse variables
        var productName = result.ProductName;
        var departmentName = result.DepartmentName;
        var price = result.Price;
        var quantity = result.Quantity;

        // Update Database
        connection.query('INSERT INTO Products SET ?', {
            ProductName: productName,
            DepartmentName: departmentName,
            Price: price,
            StockQuantity: quantity
        }, function (err, res) {

            // Error Handler
            if (err) {
                console.log('\nDatabase could not be updated\n');
                connection.end();
            }
            else {
                console.log('\nInventory updated')
                connection.end();
            }

        });

    });

}