"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var dotenv_1 = require("dotenv");
var calculator_1 = require("./engine/calculator");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('FunctionalFinance API is running');
});
app.get('/health', function (req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
var auth_routes_1 = require("./auth/auth.routes");
app.use('/api/auth', auth_routes_1.default);
app.post('/api/calculate', function (req, res) {
    try {
        var profile = req.body;
        // TODO: Add Zod validation here
        var result = (0, calculator_1.calculateTax)(profile);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
