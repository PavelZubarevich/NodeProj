const http = require("http");
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

const requestHandler = (request, response) => {
	console.log(request.method);
	response.writeHead(200, {
		"Content-type": "application/json",
	});

	if (request.url === "/products") {
		if (request.method === "GET") {
			response.end(JSON.stringify(data));
		}
		if (request.method === "POST") {
			let body = "";
			request.on("data", (chunk) => {
				body += chunk.toString();
			});
			request.on("end", () => {
				data.push(JSON.parse(body))
				response.end();
			});
		}
	} else {
		response.end();
	}
};
const server = http.createServer(requestHandler);
server.listen(port, (err) => {
	if (err) {
		return console.log("something bad happened", err);
	}
	console.log(`server is listening on ${port}`);
});
