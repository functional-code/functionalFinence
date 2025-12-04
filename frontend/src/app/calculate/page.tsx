'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalculationResponse, TaxpayerProfile } from '../../types';

const schema = z.object({
    age: z.number().min(18).max(100),
    cityType: z.enum(['METRO', 'NON_METRO']),
    income: z.object({
        basic: z.number().min(0),
        hra: z.number().min(0),
        specialAllowance: z.number().min(0),
        lta: z.number().min(0),
        otherIncome: z.number().min(0),
    }),
    deductions: z.object({
        section80C: z.number().min(0),
        section80D: z.number().min(0),
        section80CCD1B: z.number().min(0),
        hraPaid: z.number().min(0),
        homeLoanInterest: z.number().min(0),
        otherDeductions: z.number().min(0),
    }),
});

type FormData = z.infer<typeof schema>;

export default function CalculatorPage() {
    const [result, setResult] = useState<CalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            age: 30,
            cityType: 'METRO',
            income: { basic: 0, hra: 0, specialAllowance: 0, lta: 0, otherIncome: 0 },
            deductions: { section80C: 0, section80D: 0, section80CCD1B: 0, hraPaid: 0, homeLoanInterest: 0, otherDeductions: 0 },
        }
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const grossSalary = data.income.basic + data.income.hra + data.income.specialAllowance + data.income.lta + data.income.otherIncome;

            const payload: TaxpayerProfile = {
                ...data,
                income: {
                    ...data.income,
                    grossSalary
                }
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Calculation failed');

            const dataRes = await response.json();
            setResult(dataRes);
        } catch (err) {
            setError('Failed to calculate tax. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Income Tax Calculator</h1>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Personal Details */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input type="number" {...register('age', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City Type</label>
                                    <select {...register('cityType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2">
                                        <option value="METRO">Metro</option>
                                        <option value="NON_METRO">Non-Metro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Income Details */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Income Details (Yearly)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['basic', 'hra', 'specialAllowance', 'lta', 'otherIncome'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <input type="number" {...register(`income.${field}` as any, { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deductions */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Deductions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'section80C', label: 'Section 80C (LIC, PPF, etc.)' },
                                    { name: 'section80D', label: 'Section 80D (Health Ins.)' },
                                    { name: 'section80CCD1B', label: 'NPS (80CCD 1B)' },
                                    { name: 'hraPaid', label: 'Rent Paid (Yearly)' },
                                    { name: 'homeLoanInterest', label: 'Home Loan Interest' },
                                    { name: 'otherDeductions', label: 'Other Deductions' }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                        <input type="number" {...register(`deductions.${field.name}` as any, { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                            {loading ? 'Calculating...' : 'Calculate Tax'}
                        </button>
                    </form>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">{error}</div>}

                {result && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Old Regime Result */}
                        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-orange-500">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Old Regime</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Taxable Income:</span> <span className="font-semibold">₹{result.oldRegime.taxableIncome.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Tax Amount:</span> <span>₹{result.oldRegime.taxAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Cess (4%):</span> <span>₹{result.oldRegime.cess.toLocaleString()}</span></div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold text-orange-600">
                                    <span>Total Tax:</span> <span>₹{result.oldRegime.totalTax.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* New Regime Result */}
                        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-green-500">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">New Regime</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Taxable Income:</span> <span className="font-semibold">₹{result.newRegime.taxableIncome.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Tax Amount:</span> <span>₹{result.newRegime.taxAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Cess (4%):</span> <span>₹{result.newRegime.cess.toLocaleString()}</span></div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold text-green-600">
                                    <span>Total Tax:</span> <span>₹{result.newRegime.totalTax.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-lg">
                                Recommendation: You save <span className="font-bold text-green-600">₹{Math.abs(result.oldRegime.totalTax - result.newRegime.totalTax).toLocaleString()}</span> by choosing the
                                <span className="font-bold"> {result.oldRegime.totalTax < result.newRegime.totalTax ? 'OLD' : 'NEW'} </span> Regime.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
