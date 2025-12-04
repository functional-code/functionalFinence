"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculator_1 = require("../src/engine/calculator");
describe('Tax Calculator', function () {
    var baseProfile = {
        age: 30,
        cityType: 'METRO',
        income: {
            basic: 500000,
            hra: 200000,
            specialAllowance: 300000,
            lta: 0,
            otherIncome: 0,
            grossSalary: 1000000 // 10L
        },
        deductions: {
            section80C: 150000,
            section80D: 25000,
            section80CCD1B: 0,
            hraPaid: 180000,
            homeLoanInterest: 0,
            otherDeductions: 0
        }
    };
    test('should calculate tax correctly for 10L income (Old Regime)', function () {
        var result = (0, calculator_1.calculateTax)(baseProfile);
        // Old Regime Calculation:
        // Gross: 10,00,000
        // HRA Exemption: Min(2L, 1.8L - 50k = 1.3L, 2.5L) = 1.3L
        // Std Deduction: 50k
        // 80C: 1.5L
        // 80D: 25k
        // Total Deductions: 1.3L + 50k + 1.5L + 25k = 3,55,000
        // Taxable: 6,45,000
        // Tax:
        // 0-2.5L: 0
        // 2.5-5L: 12,500
        // 5-6.45L: 1,45,000 * 20% = 29,000
        // Total Tax: 41,500
        // Cess: 4% of 41,500 = 1,660
        // Final: 43,160
        expect(result.oldRegime.taxableIncome).toBe(645000);
        expect(result.oldRegime.totalTax).toBe(43160);
    });
    test('should calculate tax correctly for 10L income (New Regime)', function () {
        var result = (0, calculator_1.calculateTax)(baseProfile);
        // New Regime Calculation:
        // Gross: 10,00,000
        // Std Deduction: 75k
        // Taxable: 9,25,000
        // Tax:
        // 0-3L: 0
        // 3-7L: 4L * 5% = 20,000
        // 7-9.25L: 2.25L * 10% = 22,500
        // Total Tax: 42,500
        // Cess: 4% of 42,500 = 1,700
        // Final: 44,200
        expect(result.newRegime.taxableIncome).toBe(925000);
        expect(result.newRegime.totalTax).toBe(44200);
    });
});
