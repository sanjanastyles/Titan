"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    const accessTokenSecret = process.env['JWT_SECRET'] || '';
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.send({ code: 403, msg: "Error Processing Token" });
            }
            req.body.username = user;
            next();
        });
    }
    else {
        res.send({ code: 401, msg: "Forbidden" });
    }
}
exports.auth = auth;
//# sourceMappingURL=index.js.map