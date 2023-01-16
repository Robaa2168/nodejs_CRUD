const Product = require('../models/product.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};



exports.product_create = function (req, res,next) {
    const { name, price} = req.body;

    const product = new Product({
        name,
        price
    });

    product.save(function (err) {
        if (err) {
            return next(err);
        }
       res.redirect("/products/all");
    })
};


exports.product_details = function (req, res) {
    Product.find({}, function (err, product) {
        if (err) return next(err);
        const products = product
        res.render('../views/products.ejs',{ products});
       
    })
};



exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, updatedProduct) {
        if (err) return next(err);
        res.send('Product udpated.');
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        Product.find({}, function (err, product) {
            if (err) return next(err);
            const products = product
            return res.render('../views/products.ejs', { products });
        });
    });
};