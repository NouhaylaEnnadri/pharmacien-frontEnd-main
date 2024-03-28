// productRoute.js
const express = require("express");
const router = express.Router();
const path = require("path");
const Product = require("../model/product");
const { productValidation } = require("../validation/productValidation");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads

router.use("/uploads", express.static("uploads"));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/", // Specify the folder where images will be stored temporarily
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

// Reconfigure multer to use the storage setup
const uploadWithStorage = multer({ storage: storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a new product with image upload
router.post("/", uploadWithStorage.single("image"), async (req, res) => {
  try {
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, description, category, subCategory } = req.body;
    const image = req.file; // Access the uploaded file from req.file

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      category,
      subCategory,
      image: image ? `/uploads/${image.filename}` : null,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      subCategory : newProduct.subCategory,
      image: newProduct.image,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a product by ID
router.put("/:id", uploadWithStorage.single("image"), async (req, res) => {
  try {
    // Validate the request body
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Destructure relevant properties from the request body
    const { name, description, category } = req.body;

    // Check if the request includes an image
    const updatedFields = {
      name,
      description,
      category,
    };

    if (req.file) {
      // Assuming you are using middleware like multer for handling file uploads
      // Save the new image and update the 'image' field in the database
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    // Check if the product exists
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send the updated product as the response
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product details by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
