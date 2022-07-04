const Product = require('../../models/Product');
const router = require('express').Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const productsData = await Product.find();

    res.status(200).json(productsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
    });

    if (newProduct) res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
