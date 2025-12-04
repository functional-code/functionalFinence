export type Regime = 'OLD' | 'NEW';

export interface TaxpayerProfile {
    age: number;
    income: {
        basic: number;
        hra: number;
        specialAllowance: number;
        lta: number;
        otherIncome: number;
        grossSalary: number;
    };
    deductions: {
        section80C: number; // Limit 1.5L
        section80D: number; // Health Insurance
        section80CCD1B: number; // NPS (50k)
        hraPaid: number;
        homeLoanInterest: number; // Section 24
        otherDeductions: number;
    };
    cityType: 'METRO' | 'NON_METRO';
}

export interface TaxResult {
    regime: Regime;
    taxableIncome: number;
    taxAmount: number;
    cess: number;
    totalTax: number;
    breakdown: {
        standardDeduction: number;
        chapterVIA: number;
        hraExemption: number;
        homeLoanDeduction: number;
    };
    slabs: {
        range: string;
        rate: number;
        amount: number;
    }[];
}
