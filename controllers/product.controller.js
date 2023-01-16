
const { io } = require('../index');
const Product = require('../models/product.model');




exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res, next) {
    const { name, price } = req.body;
    if (!name || !price) {
       
        io.emit("flashMessage", {type: 'error', message: 'Both Name and Price fields are required'});
    }

    const product = new Product({ name, price });

    product.save(function (err) {
        if (err) {
            return next(err);
        }

        // Send the new product data to connected clients
        io.emit("newProduct",  product );

        io.emit("flashMessage", { type: 'success', message: "New product created!" });

        // Send a success message to the client
        res.setHeader('Location', req.originalUrl);
        res.status(200).json({message:'Product Created'});
    });
};






exports.product_update = function (req, res, next) {
    const { productId } = req.params;
    const { updatedname, updatedprice } = req.body;
    Product.findByIdAndUpdate(productId, { name: updatedname, price: updatedprice }, function(err, product) {
        if (err) {
            return next(err);
        }

        io.emit("updateProduct", product);
        io.emit("flashMessage", { type: "success", message: "Product updated successfully" });
        res.status(200).json({ message: 'Product updated.' });
    });
};





let products;
Product.find({}, (err, foundProducts) => {
    if (err) {
        console.log(err);
        return;
    }
    products = foundProducts;
});

io.on("connection", (socket) => {
    console.log("Client connected");
    Product.find({}).limit(3).exec((err, products) => {
        if (err) {
            socket.emit("error", { error: err });
            return;
        }
        socket.emit("products", products);
    });
});




exports.product_details = function (req, res) {

    res.render('../views/products.ejs',{products});
    };


    exports.product_delete = function (req, res, next) {
        const productId = req.params.id;

        // Find and delete the product from the database
        Product.findByIdAndDelete(productId, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
    
            // Emit an event to all connected clients to update their product list
            io.emit('deleteProduct', productId);
    
            return res.status(200).send({ message: 'Product deleted successfully' });
        });
    };
    

    exports.product_more = function (req, res, next) {
        const { skip, limit } = req.params;
        Product.find({}).skip(Number(skip)).limit(Number(limit)).exec((err, products) => {
            if (err) {
                return res.status(500).json({error: err})
            }
            res.json(products);
        });
    }
    
      



    exports.product_find = function  (req, res, next) {
        const productId = req.params.productId;
        // Find the product in the database using the productId
        Product.findById(productId, (err, product) => {
          if (err) return res.status(500).send(err);
          if (!product) return res.status(404).send({ message: "Product not found." });
          // Send the product data to the client
          res.json(product);
        });
      };
      