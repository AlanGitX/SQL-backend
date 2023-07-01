const mysql = require('mysql2');
const express = require('express')

const cors = require('cors')


const server = express();
server.use(cors())


// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: true }));

// parse application/json
server.use(express.json());


const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'User',
    password: 'Assasins@505',
    database: 'PRODUCTS'
  });


  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to the database');
  });

  server.listen(3000, () => {
    console.log(`Server running on port 3000`);
  });  


//sql. 

server.get('/products',(req,res)=>{
  connection.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }  });
})

server.post('/products/add',(req,res)=>{
  const { category_name, product_name, product_quantity, product_price } = req.body;
  console.log(req.body)
  connection.query(
    'INSERT INTO products (category_name, product_name, product_quantity, product_price) VALUES (?, ?, ?, ?)',
    [category_name, product_name, product_quantity, product_price],    (error, result) => {
      if (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Product added successfully' });
      }    }  );
})

server.delete('/delete/:id', (req, res) => {
  const productId = req.params.id;

  // Delete the product from the database
  connection.query('DELETE FROM products WHERE id = ?', [productId], (error, result) => {
    if (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  });
});





server.put('/edit/:id', (req, res) => {
  console.log('inside')
  const productId = req.params.id;
  const { category_name, product_name, product_quantity, product_price } = req.body;

  connection.query(
    'UPDATE products SET category_name = ?, product_name = ?, product_quantity = ?, product_price = ? WHERE id = ?',
    [category_name, product_name, product_quantity, product_price, productId],    (error, result) => {
      if (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );


})