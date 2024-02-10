"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
    },
    associatedServiceman: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Serviceman',
        },
    ],
}, {
    timestamps: true,
});
const Service = (0, mongoose_1.model)('Service', serviceSchema);
exports.default = Service;
//# sourceMappingURL=index.js.map