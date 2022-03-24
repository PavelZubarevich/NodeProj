const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	displayName: String,
	categoryId: mongoose.Schema.Types.ObjectId,
	createdAt: Date,
	totalRating: Number,
	price: Number,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
