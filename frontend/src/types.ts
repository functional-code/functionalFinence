export type Regime = 'OLD' | 'NEW';

export interface TaxpayerProfile {
    age: number;
    cityType: 'METRO' | 'NON_METRO';
    income: {
        basic: number;
        hra: number;
        specialAllowance: number;
        lta: number;
        otherIncome: number;
        grossSalary: number;
    };
    deductions: {
        section80C: number;
        section80D: number;
        section80CCD1B: number;
        hraPaid: number;
        homeLoanInterest: number;
        otherDeductions: number;
    };
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

export interface CalculationResponse {
    oldRegime: TaxResult;
    newRegime: TaxResult;
}
