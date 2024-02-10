"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function dbInit() {
    var _a;
    const options = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close soccreateCustomerkets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    };
    const url = (_a = process.env['MONGO_URI']) !== null && _a !== void 0 ? _a : '';
    mongoose_1.default.connect(url, options).then(() => console.log('databse connected'));
}
exports.default = dbInit;
//# sourceMappingURL=dbConnection.js.map