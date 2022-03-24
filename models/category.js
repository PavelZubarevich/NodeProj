const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	displayName: String,
	createdAt: Date,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
