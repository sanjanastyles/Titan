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
const model_1 = require("../../model");
class CommonController {
    constructor() {
        this.handleContactForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, subject, message } = req.body;
            try {
                const createContact = new model_1.CONTACT_MODEL({
                    email,
                    subject,
                    message,
                });
                yield createContact.save();
                res.status(200).json({ code: 200, msg: "created" });
            }
            catch (err) {
                res.send({ msg: "Something went wrong", code: 412, error: err });
            }
        });
        this.handleAllService = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield model_1.SERVICE_MODEL.find();
                res.status(200).json({ code: 200, msg: "All Service", data: services });
            }
            catch (err) {
                res.send({
                    msg: "Something went wrong in getting the service",
                    code: 412,
                    error: err,
                });
            }
        });
        this.handleService = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { serviceName } = req.params;
            try {
                const service = yield model_1.SERVICE_MODEL.findOne({ serviceName: serviceName.toLowerCase() });
                if (service) {
                    const servicemen = yield model_1.SERVICEMAN_SIGNUP_MODEL.aggregate([
                        {
                            $match: { _id: { $in: service.associatedServiceman } },
                        },
                        {
                            $project: {
                                token: 0,
                            },
                        },
                    ]);
                    res.status(200).json({ code: 200, msg: 'Servicemen found', data: servicemen });
                    return;
                }
                res.status(404).json({ code: 404, msg: 'Service not found' });
            }
            catch (err) {
                res.send({
                    msg: "Something went wrong in getting the service",
                    code: 412,
                    error: err,
                });
            }
        });
        this.handleForgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { phonenumber, password } = req.body;
            try {
                const user = yield model_1.SERVICEMAN_SIGNUP_MODEL.findOne({ phoneNumber: phonenumber });
                if (!user) {
                    res.status(404).json({ code: 404, msg: "User not found" });
                    return;
                }
                // Modify the code to use TypeScript for 'serviceman' model
                // await serviceman.updateOne(
                //   { phoneNumber: phonenumber },
                //   { $set: { password: password } }
                // );
                res.send({ code: 200, msg: "Phone Number Found" });
            }
            catch (err) {
                res.status(500).send({ msg: "Internal Server Error", code: 500, error: err });
            }
        });
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/contact", this.handleContactForm);
        // Add additional routes here
        this.router.get("/allservice", this.handleAllService);
        this.router.get("/service/:serviceName", this.handleService);
        this.router.post("/forgotpassword", this.handleForgotPassword);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = CommonController;
//# sourceMappingURL=index.js.map