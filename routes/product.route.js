const express = require('express');
const router = express.Router();
const cors = require('cors');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');



// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);
router.post('/create', product_controller.product_create);
router.get('/coupon', product_controller.product_coupon);
router.post('/coupon_create', product_controller.coupon_create);
router.get('/category', product_controller.product_category);
router.post('/category_create', product_controller.category_create);
router.get('/all',cors(), product_controller.product_details);


module.exports = router;