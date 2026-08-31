"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
if (!process.env.VERCEL) {
    app_1.default.listen(env_1.PORT, () => {
        console.log(`🚀 E-Loker Backend Server active and running on http://localhost:${env_1.PORT}`);
        console.log(`📋 API Health Check available at http://localhost:${env_1.PORT}/api/health`);
    });
}
exports.default = app_1.default;
