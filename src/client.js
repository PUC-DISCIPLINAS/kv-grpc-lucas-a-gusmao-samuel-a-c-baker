const grpc = require("grpc");
const path = require("path");
const readline = require("readline");

const protoPath = path.resolve(__dirname, "../protos/map.proto");

const MapService = grpc.load(protoPath).MapService;

const client = new MapService(
	"localhost:50051",
	grpc.credentials.createInsecure()
);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log("Escolha uma operação");
console.log(`1. put <key>:<value> (Exemplo: put nome:Matheus`);
console.log("2. get <key> (Exemplo: get nome");
console.log("3. getAllKeys (Exemplo: getAllKeys");

function put(string) {
	const key = string.split(":")[0];
	const value = string.split(":")[1];

	client.put({ key, value }, (error, _) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Valor inserido com sucesso!");
		}
	});
}

function get(string) {
	client.get({ key: string }, (error, res) => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Chave: ${string}, Valor: ${res.value}`);
		}
	});
}

function getAllKeys() {
	client.getAllKeys({}, (error, res) => {
		if (error) {
			console.log(error);
		} else {
			const keysString = res.keys?.map((item) => item.key)?.join(", ");

			console.log(`Chaves: ${keysString}`);
		}
	});
}

rl.question("> ", (string) => {
	const command = string.split(" ")[0];
	const rest = string.split(" ");
	rest.shift();

	const restString = rest.join("");

	switch (command) {
		case "put":
			put(restString);
			break;
		case "get":
			get(restString);
			break;
		case "getAllKeys":
			getAllKeys();
			break;
	}

	rl.close();
});
