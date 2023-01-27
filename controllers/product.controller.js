
const { io } = require('../index');
const Product = require('../models/product.model');
const Coupon = require('../models/Coupon.model');
const Category = require('../models/category.model');
const slugify = require('slugify');
const crypto = require('crypto');



exports.product_create = function (req, res, next) {
    // Generate a new SKU
    function generateSKU() {
        let sku = crypto.randomBytes(4).toString('hex');
        return sku.toUpperCase();
    }

    function generateQuantity() {
        return Math.floor(Math.random() * (1000 - 100 + 1) + 100);
    }

    const { title, unit, parent, children, image, originalPrice, discount, description, type,flashSale, status } = req.body;
    const price = originalPrice - (originalPrice * (discount/100));
    const slug = slugify(title, { lower: true }); // create a slug from the title
    const sku = generateSKU();
    const quantity = generateQuantity();

    const newProduct = new Product({
        title,
        unit,
        parent,
        children,
        image,
        originalPrice,
        price,
        discount,
        quantity,
        description,
        type,
        flashSale,
        status,
        slug,
        sku
    });
    
    newProduct.save()
        .then(product => {
            res.status(201).json({
                message: 'Product added successfully',
                product
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    };

    
exports.product_coupon=async function (req, res) {

    try {
        // Find all coupons in the database
        const coupons = await Coupon.find();
        // Render the coupons on the page
        res.render('../views/coupon.ejs', { coupons });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading coupons' });
    }
};
    

exports.coupon_create= async function (req, res) {
    try {
        // create a new coupon with the request data
        const coupon = new Coupon(req.body);

        // save the coupon to the database
        await coupon.save();

        // send a 201 status and the new coupon as the response
        res.status(201).json(coupon);
    } catch(err) {
        // if there's an error, send a 500 status and the error message
        console.error(err);
        res.status(500).json({ message: 'Error adding coupon' });
    }
};
  

exports.product_category=async function (req, res) {

    try {
        // Find all coupons in the database
        const categories = await Category.find();
        // Render the coupons on the page
        res.render('../views/category.ejs', { categories });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading coupons' });
    }
};
    

exports.category_create= async function (req, res) {
    try {
        // Create a new category with the request data
        const { parent,type,icon,status } = req.body;
        const slug = slugify(parent, { lower: true }); // create a slug from the title

        
    const newCategory = new Category({
       parent,
       type,
       icon,
       slug,
       status
    });
        // Save the category to the database
        await newCategory.save();

        // Send a 201 status and the new category as the response
        res.status(201).json(newCategory);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding category' });
    }
};
  

exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
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
      

    