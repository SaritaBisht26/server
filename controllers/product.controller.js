import Product from "../model/product.model.js";
import UserProductRelation from "../model/productUserRelation.js";

const addProductController = async (req, res) => {
  try {
    const { name, description, price, category, brand, stockQuantity } =
      req.body;
    const imageUrls = req.files.map((file) => file.filename);
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      brand,
      imageUrls,
      stockQuantity,
    });

    await newProduct.save();
    const userProductRelation = new UserProductRelation({
      productOwner: req.user._id,
      product: newProduct._id,
    });
    await userProductRelation.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllProductController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user ? req.user._id : null;
    const searchQuery = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: "i" } },
            { description: { $regex: req.query.q, $options: "i" } },
          ],
        }
      : {};

    let products;
    let totalCount;

    if (userId) {
      // Find user's product relations
      const userProductRelations = await UserProductRelation.find({
        productOwner: userId,
      });
      const productsToShow = userProductRelations.map(
        (relation) => relation.product
      );

      products = await Product.find({
        ...searchQuery,
        _id: { $nin: productsToShow },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      totalCount = await Product.countDocuments({
        ...searchQuery,
        _id: { $nin: productsToShow },
      });
    } else {
      products = await Product.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);

      totalCount = await Product.countDocuments(searchQuery);
    }

    res.json({
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      products,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOneProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateProductController = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.filename);
    const updatedProductData = {
      ...req.body,
      imageUrls,
    };
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addOrUpdateProductController = async (req, res) => {
  const { id } = req.params;
  const imageUrls = req.files.map((file) => file.filename);
  const {
    name,
    description,
    price,
    category,
    brand,
    stockQuantity,
    ratings,
    numReviews,
  } = req.body;

  try {
    let product;
    if (id) {
      product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          category,
          brand,
          imageUrls,
          stockQuantity,
          ratings,
          numReviews,
        },
        { new: true }
      );
    } else {
      product = new Product({
        name,
        description,
        price,
        category,
        brand,
        imageUrls,
        stockQuantity,
        ratings,
        numReviews,
      });
      await product.save();
    }

    res.status(200).json({ message: "Product saved successfully", product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error saving product" });
  }
};
const getOwnerProductController = async (req, res) => {
  try {
    const userId = req.user._id;
    const relations = await UserProductRelation.find({
      productOwner: userId,
    }).populate("product");
    const productIds = relations.map((relation) => relation.product);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== 0) {
      res.status(200).json({
        message: "Product fetched successfully",
        products,
      });
    } else {
      res.status(404).json({
        message: "No products available",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in finding products" });
  }
};

export {
  addProductController,
  getAllProductController,
  getOneProductController,
  updateProductController,
  deleteProductController,
  getOwnerProductController,
  addOrUpdateProductController,
};
