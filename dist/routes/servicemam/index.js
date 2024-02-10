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
                    res.status(200).json({ code: 200, msg: "Success", data: user });
                }
                else {
                    res
                        .status(401)
                        .json({ code: 401, msg: "Invalid credentials", data: {} });
                }
            }
            catch (err) {
                res
                    .status(500)
                    .json({ msg: "Internal Server Error", code: 500, error: err.message });
            }
        });
        this.handleSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, phoneNumber, email, address, passcode, password, jobs, signupType, } = req.body;
                const existingUser = yield model_1.SERVICEMAN_SIGNUP_MODEL.findOne({ email });
                if (existingUser) {
                    res
                        .status(409)
                        .json({ code: 409, msg: "Email already registered", data: {} });
                    return;
                }
                const token = (0, utils_1.createToken)(passcode);
                const newServiceMan = new model_1.SERVICEMAN_SIGNUP_MODEL({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    address,
                    passcode,
                    password,
                    jobs,
                    isServiceman: signupType,
                    token,
                });
                yield newServiceMan.save();
                newServiceMan.jobs.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                    yield model_1.SERVICE_MODEL.findOneAndUpdate({ serviceName: e.toLowerCase() }, { $push: { associatedServiceman: newServiceMan._id } }, { new: true });
                }));
                res.status(201).json({
                    code: 201,
                    msg: "Created Successfully",
                    token,
                    _id: newServiceMan._id,
                    isServiceman: newServiceMan.isServiceman,
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ msg: "Internal Server Error", code: 500, error: err.message });
            }
        });
        this.handleProfile = (req, res) => {
            res.send({ KEY: "profile", TOKEN: "token" });
        };
        this.handleProfilePost = (req, res) => {
            res.send({ KEY: "profile_post", TOKEN: "token" });
        };
        this.handleSeeReviews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewerId, isServiceman } = req.body;
                let pipeline = [
                    {
                        $lookup: {
                            from: isServiceman ? "servicemen" : "customers", // Change to match your collection name
                            localField: isServiceman ? "associatedServiceman" : "reviewerId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    { $addFields: { "user.id": "$_id" } },
                    {
                        $project: {
                            _id: 0,
                            id: "$user.id",
                            name: "$user.name",
                            review: "$$ROOT",
                        },
                    },
                ];
                // if (isServiceman) {
                pipeline.push({
                    $lookup: {
                        from: "services", // Change to match your service collection name
                        localField: "review.associatedJob",
                        foreignField: "_id",
                        as: "service",
                    },
                });
                pipeline.push({ $unwind: "$service" });
                pipeline.push({
                    $addFields: { "service.id": "$review.associatedJob" },
                });
                pipeline.push({ $project: { "review.associatedJob": 0 } });
                // }
                const response = yield model_1.REVIEW_MODEL.aggregate(pipeline);
                res.status(200).json({
                    code: 200,
                    msg: "Fetched Successfully",
                    data: response,
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ msg: "Internal Server Error", code: 500, error: err.message });
            }
        });
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/login", this.handleLogin);
        this.router.post("/signup", this.handleSignup);
        this.router.get("/profile", middleware_1.auth, this.handleProfile);
        this.router.post("/profile", middleware_1.auth, this.handleProfilePost);
        this.router.get("/see/reviews", this.handleSeeReviews);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = ServiceManController;
//# sourceMappingURL=index.js.map