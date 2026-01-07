import { AlertTriangle, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { Transaction, Budget, Currency } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';

interface BudgetAlertProps {
  transactions: Transaction[];
  budget: Budget | null;
  onSetBudget: (budget: Budget) => void;
}

export function BudgetAlert({ transactions, budget, onSetBudget }: BudgetAlertProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget?.amount.toString() || '');
  const [budgetCurrency, setBudgetCurrency] = useState<Currency>(budget?.currency || 'EUR');

  const calculateExpenses = () => {
    if (!budget) return 0;

    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, transaction) => {
        const amountInBudgetCurrency = convertCurrency(
          transaction.amount,
          transaction.currency,
          budget.currency
        );
        return sum + amountInBudgetCurrency;
      }, 0);
  };

  const totalExpenses = calculateExpenses();
  const budgetUsedPercentage = budget ? (totalExpenses / budget.amount) * 100 : 0;
  const isOverBudget = budget && totalExpenses > budget.amount;
  const isNearBudget = budget && budgetUsedPercentage >= 80 && budgetUsedPercentage < 100;

  const handleSaveBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (amount > 0) {
      onSetBudget({ amount, currency: budgetCurrency });
      setShowSettings(false);
    }
  };

  if (!budget && !showSettings) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Settings className="text-blue-600" size={18} />
            </div>
            <p className="text-blue-900 font-medium">Set a monthly budget to track your spending</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm font-medium"
          >
            Set Budget
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Set Monthly Budget</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="1000.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={budgetCurrency}
                onChange={(e) => setBudgetCurrency(e.target.value as Currency)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSaveBudget}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium"
            >
              Save Budget
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isOverBudget) {
    return (
      <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 rounded-xl flex-shrink-0">
            <AlertTriangle className="text-rose-600" size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-rose-900">Budget Exceeded!</h3>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
              >
                <Settings size={16} />
              </button>
            </div>
            <p className="text-rose-800 text-sm mb-3">
              You've spent {formatCurrency(totalExpenses, budget.currency)} of your{' '}
              {formatCurrency(budget.amount, budget.currency)} budget
            </p>
            <div className="bg-rose-200/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
            <p className="text-xs text-rose-700 mt-2 font-medium">
              Over budget by {formatCurrency(totalExpenses - budget.amount, budget.currency)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isNearBudget) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
            <AlertTriangle className="text-amber-600" size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-amber-900">Approaching Budget Limit</h3>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-all"
              >
                <Settings size={16} />
              </button>
            </div>
            <p className="text-amber-800 text-sm mb-3">
              You've spent {formatCurrency(totalExpenses, budget.currency)} of your{' '}
              {formatCurrency(budget.amount, budget.currency)} budget ({budgetUsedPercentage.toFixed(0)}%)
            </p>
            <div className="bg-amber-200/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full transition-all duration-500"
                style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              {formatCurrency(budget.amount - totalExpenses, budget.currency)} remaining
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (budget) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-emerald-900">Budget on Track</h3>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
              >
                <Settings size={16} />
              </button>
            </div>
            <p className="text-emerald-800 text-sm mb-3">
              You've spent {formatCurrency(totalExpenses, budget.currency)} of your{' '}
              {formatCurrency(budget.amount, budget.currency)} budget ({budgetUsedPercentage.toFixed(0)}%)
            </p>
            <div className="bg-emerald-200/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-full transition-all duration-500"
                style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-emerald-700 mt-2 font-medium">
              {formatCurrency(budget.amount - totalExpenses, budget.currency)} remaining
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}