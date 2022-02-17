const express = require("express");
const app = express();
const port = 3000;

const data = [
	{
		displayName: "Cyberpank 2077",
		price: "60$",
	},
	{
		displayName: "SpongeBob SquarePants: Battle for Bikini Bottom – Rehydrated",
		price: "40$",
	},
	{
		displayName: "God Of War",
		price: "50$",
	},
];

app.get("/products", (req, res) => {
	res.send(data);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
