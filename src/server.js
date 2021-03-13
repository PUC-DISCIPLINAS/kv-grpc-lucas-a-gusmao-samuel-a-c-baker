const grpc = require("grpc");
const path = require("path");

const protoPath = path.resolve(__dirname, "../protos/map.proto");

const mapProto = grpc.load(protoPath);

const server = new grpc.Server();
const map = new Map();

server.addService(mapProto.MapService.service, {
	put: (call, callback) => {
		console.log("put");
		const mapItem = call.request;
		map.set(mapItem.key, mapItem.value);
		callback(null, {});
	},
	get: (call, callback) => {
		console.log("get");
		const key = call.request.key;
		console.log(key);

		if (map.has(key)) {
			callback(null, {
				value: map.get(key),
			});
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found",
			});
		}
	},
	getAllKeys: (_, callback) => {
		const keys = [...map.keys()].map((string) => ({
			key: string,
		}));

		callback(null, keys);
	},
});

server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Servidor rodando em: http://127.0.0.1:50051");
server.start();
