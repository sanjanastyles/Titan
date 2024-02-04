"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Serviceman schema
const serviceManSignup = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    passcode: {
        type: String,
        required: [true, "Passcode is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    jobs: {
        type: [String],
        required: [true, "Jobs are required"],
    },
    jobId: {
        type: [String],
        required: [true, "Job IDs are required"],
    },
    isServiceman: {
        type: Boolean,
    },
    token: {
        type: String,
    },
}, {
    timestamps: true,
});
// Define the Serviceman model
const Serviceman = (0, mongoose_1.model)("Serviceman", serviceManSignup);
exports.default = Serviceman;
//# sourceMappingURL=index.js.map