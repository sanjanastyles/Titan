"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils/utils");
const middleware_1 = require("../../middleware");
const model_1 = require("../../model");
class ServiceManController {
    constructor() {
        this.handleLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield model_1.SERVICEMAN_SIGNUP_MODEL.findOne({ email });
                if (user && user.password === password) {
                    res.status(200).json({ code: 200, msg: 'Success', data: user });
                }
                else {
                    res.status(401).json({ code: 401, msg: 'Invalid credentials', data: {} });
                }
            }
            catch (err) {
                res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
            }
        });
        this.handleSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, phoneNumber, email, address, passcode, password, jobs, } = req.body;
                const existingUser = yield model_1.SERVICEMAN_SIGNUP_MODEL.findOne({ email });
                if (existingUser) {
                    res.status(409).json({ code: 409, msg: 'Email already registered', data: {} });
                    return;
                }
                // Generate a token based on passcode (assuming createToken is defined and works)
                const token = (0, utils_1.createToken)(passcode);
                // Create a new SERVICEMAN_SIGNUP_MODEL instance
                const newServiceMan = new model_1.SERVICEMAN_SIGNUP_MODEL({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    address,
                    passcode,
                    password,
                    jobs,
                    isServiceman: true,
                    token,
                });
                // Save the new Serviceman to the database
                yield newServiceMan.save();
                // Update the associatedServiceman array in the Service model
                newServiceMan.jobs.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                    yield model_1.SERVICE_MODEL.findOneAndUpdate({ serviceName: e.toLowerCase() }, { $push: { associatedServiceman: newServiceMan._id } }, { new: true });
                }));
                // Respond with success message and token
                res.status(201).json({ code: 201, msg: 'Created Successfully', token });
            }
            catch (err) {
                // Handle errors and respond with an error message
                res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
            }
        });
        this.handleProfile = (req, res) => {
            res.send({ KEY: 'profile', TOKEN: 'token' });
        };
        this.handleProfilePost = (req, res) => {
            res.send({ KEY: 'profile_post', TOKEN: 'token' });
        };
        this.handleSeeReviews = (req, res) => {
            res.send({ KEY: 'see_reviews', TOKEN: 'token' });
        };
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', this.handleLogin);
        this.router.post('/signup', this.handleSignup);
        this.router.get('/profile', middleware_1.auth, this.handleProfile);
        this.router.post('/profile', middleware_1.auth, this.handleProfilePost);
        this.router.get('/see/reviews', middleware_1.auth, this.handleSeeReviews);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = ServiceManController;
//# sourceMappingURL=index.js.map