"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTax = calculateTax;
const rules_1 = require("./rules");
const RULES = rules_1.TAX_RULES.FY2024_25;
function calculateHRAExemption(profile) {
    const { basic, hra } = profile.income;
    const { hraPaid } = profile.deductions;
    const { cityType } = profile;
    if (hraPaid <= 0)
        return 0;
    const rentMinus10PercentBasic = Math.max(0, hraPaid - (0.10 * basic));
    const cityLimit = cityType === 'METRO' ? 0.50 * basic : 0.40 * basic;
    return Math.min(hra, rentMinus10PercentBasic, cityLimit);
}
function calculateTaxForSlabs(taxableIncome, slabs) {
    let remainingIncome = taxableIncome;
    let totalTax = 0;
    const slabBreakdown = [];
    let previousLimit = 0;
    for (const slab of slabs) {
        if (remainingIncome <= 0)
            break;
        const slabRange = slab.limit - previousLimit;
        const taxableInThisSlab = Math.min(remainingIncome, slabRange);
        if (taxableInThisSlab > 0) {
            const taxForSlab = taxableInThisSlab * slab.rate;
            totalTax += taxForSlab;
            slabBreakdown.push({
                range: `${previousLimit} - ${slab.limit === Infinity ? 'Above' : slab.limit}`,
                rate: slab.rate,
                amount: taxForSlab
            });
            remainingIncome -= taxableInThisSlab;
        }
        previousLimit = slab.limit;
    }
    return { totalTax, slabBreakdown };
}
function calculateTax(profile) {
    // --- OLD REGIME ---
    const hraExemption = calculateHRAExemption(profile);
    const standardDeductionOld = RULES.OLD.limits.standardDeduction;
    const grossDeductionsOld = Math.min(profile.deductions.section80C, RULES.OLD.limits.section80C) +
        Math.min(profile.deductions.section80CCD1B, RULES.OLD.limits.section80CCD1B) +
        profile.deductions.section80D +
        profile.deductions.homeLoanInterest +
        profile.deductions.otherDeductions +
        hraExemption +
        standardDeductionOld;
    const taxableIncomeOld = Math.max(0, profile.income.grossSalary - grossDeductionsOld);
    let slabsOld = RULES.OLD.slabs;
    if (profile.age >= 80)
        slabsOld = RULES.OLD.superSeniorSlabs;
    else if (profile.age >= 60)
        slabsOld = RULES.OLD.seniorSlabs;
    let { totalTax: taxOld, slabBreakdown: breakdownOld } = calculateTaxForSlabs(taxableIncomeOld, slabsOld);
    // Rebate 87A Old
    if (taxableIncomeOld <= RULES.OLD.limits.rebateIncomeLimit) {
        taxOld = Math.max(0, taxOld - RULES.OLD.limits.rebate87A);
    }
    const cessOld = taxOld * 0.04;
    const resultOld = {
        regime: 'OLD',
        taxableIncome: taxableIncomeOld,
        taxAmount: taxOld,
        cess: cessOld,
        totalTax: taxOld + cessOld,
        breakdown: {
            standardDeduction: standardDeductionOld,
            chapterVIA: grossDeductionsOld - standardDeductionOld - hraExemption,
            hraExemption,
            homeLoanDeduction: profile.deductions.homeLoanInterest
        },
        slabs: breakdownOld
    };
    // --- NEW REGIME ---
    const standardDeductionNew = RULES.NEW.limits.standardDeduction;
    const taxableIncomeNew = Math.max(0, profile.income.grossSalary - standardDeductionNew);
    let { totalTax: taxNew, slabBreakdown: breakdownNew } = calculateTaxForSlabs(taxableIncomeNew, RULES.NEW.slabs);
    // Rebate 87A New
    if (taxableIncomeNew <= RULES.NEW.limits.rebateIncomeLimit) {
        taxNew = Math.max(0, taxNew - RULES.NEW.limits.rebate87A);
    }
    const cessNew = taxNew * 0.04;
    const resultNew = {
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
