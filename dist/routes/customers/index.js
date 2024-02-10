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
class CustomerController {
    constructor() {
        this.handleReviewPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quality, feedback, recommend, reviewerId, associatedServiceman, associatedJob, } = req.body;
                const newReview = new model_1.REVIEW_MODEL({
                    quality,
                    feedback,
                    recommend,
                    reviewerId,
                    associatedServiceman,
                    associatedJob,
                });
                yield newReview.save();
                res.status(200).json({ code: 201, msg: "Created Successfully" });
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
        this.router.post("/review", this.handleReviewPost);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = CustomerController;
//# sourceMappingURL=index.js.map