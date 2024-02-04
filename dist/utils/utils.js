"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createToken(username) {
    var _a, _b;
    const secret = (_a = process.env['JWT_SECRET']) !== null && _a !== void 0 ? _a : '';
    const accessToken = (_b = jsonwebtoken_1.default.sign({ username: username }, secret, { expiresIn: '20m' })) !== null && _b !== void 0 ? _b : '';
    return accessToken;
}
exports.createToken = createToken;
//# sourceMappingURL=utils.js.map