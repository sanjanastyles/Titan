"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import { IReview } from '../interface';
const reviewSchema = new mongoose_1.Schema({
    quality: {
        type: String,
        required: [true, "Quality is required"],
    },
    feedback: {
        type: String,
    },
    recommend: {
        type: Number,
        required: [true, "Quality is required"],
    },
    reviewerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "customers",
    },
    associatedServiceman: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "serviceman",
    },
    associatedJob: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "service",
    },
}, {
    timestamps: true,
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
//# sourceMappingURL=index.js.map