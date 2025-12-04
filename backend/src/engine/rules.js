"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAX_RULES = void 0;
exports.TAX_RULES = {
    FY2024_25: {
        OLD: {
            slabs: [
                { limit: 250000, rate: 0 },
                { limit: 500000, rate: 0.05 },
                { limit: 1000000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 },
            ],
            seniorSlabs: [
                { limit: 300000, rate: 0 },
                { limit: 500000, rate: 0.05 },
                { limit: 1000000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 },
            ],
            superSeniorSlabs: [
                { limit: 500000, rate: 0 },
                { limit: 1000000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 },
            ],
            limits: {
                section80C: 150000,
                section80CCD1B: 50000,
                standardDeduction: 50000,
                rebate87A: 12500, // Taxable income <= 5L
                rebateIncomeLimit: 500000,
            }
        },
        NEW: {
            slabs: [
                { limit: 300000, rate: 0 },
                { limit: 700000, rate: 0.05 },
                { limit: 1000000, rate: 0.10 },
                { limit: 1200000, rate: 0.15 },
                { limit: 1500000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 },
            ],
            limits: {
                standardDeduction: 75000, // Increased in recent budget
                rebate87A: 25000, // Taxable income <= 7L
                rebateIncomeLimit: 700000,
            }
        }
    }
};
