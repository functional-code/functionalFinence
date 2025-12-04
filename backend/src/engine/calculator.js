"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTax = calculateTax;
var rules_1 = require("./rules");
var RULES = rules_1.TAX_RULES.FY2024_25;
function calculateHRAExemption(profile) {
    var _a = profile.income, basic = _a.basic, hra = _a.hra;
    var hraPaid = profile.deductions.hraPaid;
    var cityType = profile.cityType;
    if (hraPaid <= 0)
        return 0;
    var rentMinus10PercentBasic = Math.max(0, hraPaid - (0.10 * basic));
    var cityLimit = cityType === 'METRO' ? 0.50 * basic : 0.40 * basic;
    return Math.min(hra, rentMinus10PercentBasic, cityLimit);
}
function calculateTaxForSlabs(taxableIncome, slabs) {
    var remainingIncome = taxableIncome;
    var totalTax = 0;
    var slabBreakdown = [];
    var previousLimit = 0;
    for (var _i = 0, slabs_1 = slabs; _i < slabs_1.length; _i++) {
        var slab = slabs_1[_i];
        if (remainingIncome <= 0)
            break;
        var slabRange = slab.limit - previousLimit;
        var taxableInThisSlab = Math.min(remainingIncome, slabRange);
        if (taxableInThisSlab > 0) {
            var taxForSlab = taxableInThisSlab * slab.rate;
            totalTax += taxForSlab;
            slabBreakdown.push({
                range: "".concat(previousLimit, " - ").concat(slab.limit === Infinity ? 'Above' : slab.limit),
                rate: slab.rate,
                amount: taxForSlab
            });
            remainingIncome -= taxableInThisSlab;
        }
        previousLimit = slab.limit;
    }
    return { totalTax: totalTax, slabBreakdown: slabBreakdown };
}
function calculateTax(profile) {
    // --- OLD REGIME ---
    var hraExemption = calculateHRAExemption(profile);
    var standardDeductionOld = RULES.OLD.limits.standardDeduction;
    var grossDeductionsOld = Math.min(profile.deductions.section80C, RULES.OLD.limits.section80C) +
        Math.min(profile.deductions.section80CCD1B, RULES.OLD.limits.section80CCD1B) +
        profile.deductions.section80D +
        profile.deductions.homeLoanInterest +
        profile.deductions.otherDeductions +
        hraExemption +
        standardDeductionOld;
    var taxableIncomeOld = Math.max(0, profile.income.grossSalary - grossDeductionsOld);
    var slabsOld = RULES.OLD.slabs;
    if (profile.age >= 80)
        slabsOld = RULES.OLD.superSeniorSlabs;
    else if (profile.age >= 60)
        slabsOld = RULES.OLD.seniorSlabs;
    var _a = calculateTaxForSlabs(taxableIncomeOld, slabsOld), taxOld = _a.totalTax, breakdownOld = _a.slabBreakdown;
    // Rebate 87A Old
    if (taxableIncomeOld <= RULES.OLD.limits.rebateIncomeLimit) {
        taxOld = Math.max(0, taxOld - RULES.OLD.limits.rebate87A);
    }
    var cessOld = taxOld * 0.04;
    var resultOld = {
        regime: 'OLD',
        taxableIncome: taxableIncomeOld,
        taxAmount: taxOld,
        cess: cessOld,
        totalTax: taxOld + cessOld,
        breakdown: {
            standardDeduction: standardDeductionOld,
            chapterVIA: grossDeductionsOld - standardDeductionOld - hraExemption,
            hraExemption: hraExemption,
            homeLoanDeduction: profile.deductions.homeLoanInterest
        },
        slabs: breakdownOld
    };
    // --- NEW REGIME ---
    var standardDeductionNew = RULES.NEW.limits.standardDeduction;
    var taxableIncomeNew = Math.max(0, profile.income.grossSalary - standardDeductionNew);
    var _b = calculateTaxForSlabs(taxableIncomeNew, RULES.NEW.slabs), taxNew = _b.totalTax, breakdownNew = _b.slabBreakdown;
    // Rebate 87A New
    if (taxableIncomeNew <= RULES.NEW.limits.rebateIncomeLimit) {
        taxNew = Math.max(0, taxNew - RULES.NEW.limits.rebate87A);
    }
    var cessNew = taxNew * 0.04;
    var resultNew = {
        regime: 'NEW',
        taxableIncome: taxableIncomeNew,
        taxAmount: taxNew,
        cess: cessNew,
        totalTax: taxNew + cessNew,
        breakdown: {
            standardDeduction: standardDeductionNew,
            chapterVIA: 0,
            hraExemption: 0,
            homeLoanDeduction: 0
        },
        slabs: breakdownNew
    };
    return { oldRegime: resultOld, newRegime: resultNew };
}
