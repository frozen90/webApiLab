const router = require('express').Router();

let validator = require('validator');

const { sql, dbConnPoolPromise } = require('../database/db.js');
// Define SQL statements here for use in function below

// These are parameterised queries note @named parameters.

// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON

const SQL_SELECT_ALL = 'SELECT * FROM dbo.Product for json path;';

// without_array_wrapper - use for single result

const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.Product WHERE ProductId = @id for json path, without_array_wrapper;';

// Second statement (Select...) returns inserted record identified by ProductId = SCOPE_IDENTITY()

const SQL_INSERT = 'INSERT INTO dbo.Product (CategoryId, ProductName, ProductDescription, ProductStock, ProductPrice) VALUES (@categoryId, @productName, @productDescription, @ProductStock, @ProductPrice); SELECT * from dbo.Product WHERE ProductId = SCOPE_IDENTITY();';

const SQL_UPDATE = 'UPDATE dbo.Product SET CategoryId = @categoryId, ProductName = @productName, ProductDescription = @productDescription, ProductStock = @ProductStock, ProductPrice = @ProductPrice WHERE ProductId = @id; SELECT * FROM dbo.Product WHERE ProductId = @id;';

const SQL_DELETE = 'DELETE FROM dbo.Product WHERE ProductId = @id;'; 


router.get('/', async ( req, res ) => {

    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .query(SQL_SELECT_ALL);

        res.json(result.recordset[0]);

    } catch (err) {
        res.status(500)
        res.send(err.message)

    }
});


router.get('/:id', async (req, res) => {

    const productId = req.params.id;

    if (!validator.isNumeric(productId, { no_symbols : true })){
        res.json({ "error": "invalid id parrameter" });
        return false;
    }


    try {

        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('id', sql.Int, productId)
            .query(SQL_SELECT_BY_ID);

            res.json(result.recordset)

    } catch (err){
        res.status(500)
        res.send(err.message)
    }


});

// POST - Insert a new product.

// This async function sends a HTTP post request

router.post('/', async (req, res) => {

    // Validate - this string, inially empty, will store any errors
    
    let errors = "";
    
    // Make sure that category id is just a number - note that values are read from request body
    
    const categoryId = req.body.categoryId;
    
    if (!validator.isNumeric(categoryId, {no_symbols: true})) {
    
    errors+= "invalid category id; ";
    
    }
    
    // Escape text and potentially bad characters
    
    const productName = validator.escape(req.body.productName);
    
    if (productName === "") {
    
    errors+= "invalid productName; ";
    
    }
    
    const productDescription = validator.escape(req.body.productDescription);
    
    if (productDescription === "") {
    
    errors+= "invalid productDescription; ";
    
    }
    
    // Make sure that category id is just a number
    
    const productStock = req.body.productStock;
    
    if (!validator.isNumeric(productStock, {no_symbols: true})) {
    
    errors+= "invalid productStock; ";
    
    }
    
    // Validate currency
    
    const productPrice = req.body.productPrice;
    
    if (!validator.isCurrency(productPrice, {allow_negatives: false})) {
    
    errors+= "invalid productPrice; ";
    
    }
    
    // If errors send details in response
    
    if (errors != "") {
    
    // return http response with errors if validation failed
    
    res.json({ "error": errors });
    
    return false;
    
    }
    
    // If no errors, insert
    
    try {
    
    // Get a DB connection and execute SQL
    
    const pool = await dbConnPoolPromise
    
    const result = await pool.request()
    
    // set name parameter(s) in query
    
    .input('categoryId', sql.Int, categoryId)
    
    .input('productName', sql.NVarChar, productName)
    
    .input('productDescription', sql.NVarChar, productDescription)
    
    .input('productStock', sql.Int, productStock)
    
    .input('productPrice', sql.Decimal, productPrice)
    
    // Execute Query
    
    .query(SQL_INSERT);
    
    // If successful, return inserted product via HTTP
    
    res.json(result.recordset[0]);
    
    } catch (err) {
    
    res.status(500)
    
    res.send(err.message)
    
    }
    
    });



module.exports = router;