const PROTO_PATH="./product.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var ShopService =grpc.loadPackageDefinition(packageDefinition).ShopService;

const client = new ShopService("localhost:30043", grpc.credentials.createInsecure());

module.exports = client;