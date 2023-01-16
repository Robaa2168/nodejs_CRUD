const express = require('express');
const router = express.Router();
const cors = require('cors');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');



// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);
router.post('/create', product_controller.product_create);
router.get('/all',cors(), product_controller.product_details);
router.put('/:productId/update', product_controller.product_update);
router.delete('/:id/deletion', product_controller.product_delete);
router.get("/loadmore/:skip/:limit", product_controller.product_more);
router.get('/:productId', product_controller.product_find);


module.exports = router;