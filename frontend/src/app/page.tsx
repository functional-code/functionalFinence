import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">FunctionalFinance</div>
          <div className="space-x-4">
            <Link href="/login" className="hover:text-blue-200">Login</Link>
            <Link href="/calculate" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
              Start Calculation
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Maximize Your Tax Savings <br /> with AI-Powered Precision
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Compare Old vs New Regime, find hidden deductions, and generate your tax report in minutes.
          </p>
          <Link href="/calculate" className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition shadow-lg">
            Calculate Now <ArrowRight className="ml-2" />
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose FunctionalFinance?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Accurate Comparison</h3>
              <p className="text-gray-600">Instantly compare Old vs New tax regimes to see which one saves you more money based on your specific investments.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Deductions</h3>
              <p className="text-gray-600">Our engine identifies eligible deductions under 80C, 80D, HRA, and more that you might have missed.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <FileText className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
              <p className="text-gray-600">Get a comprehensive PDF report with a breakdown of your tax liability and actionable saving tips.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} FunctionalFinance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
