"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const calculator_1 = require("./engine/calculator");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('FunctionalFinance API is running');
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
app.use('/api/auth', auth_routes_1.default);
app.post('/api/calculate', (req, res) => {
    try {
        const profile = req.body;
        // TODO: Add Zod validation here
        const result = (0, calculator_1.calculateTax)(profile);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
