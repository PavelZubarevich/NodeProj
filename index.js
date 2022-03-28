const mongoose = require("mongoose");
const express = require("express");
const Product = require("./models/produst");
const Category = require("./models/category");

const url = "mongodb://localhost:27017/testProducts";
const app = express();
const port = 3000;

const startServer = () => {
	app.listen(port, () => {
		console.log(`App listening on port ${port}`);
	});
};

const conectDB = async () => {
	try {
		await mongoose.connect(url);
		startServer();
	} catch (e) {
		console.log(e);
	}
};

conectDB();

app.get("/products", (req, res) => {
	Product.find((err, users) => {
		err && console.log(err);
		res.send(users);
	});
});
