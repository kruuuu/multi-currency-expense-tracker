import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { Transaction, Budget, Currency } from './types';
import { getTransactions, saveTransactions, getBudget, saveBudget } from './utils/storage';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { BalanceSummary } from './components/BalanceSummary';
import { BudgetAlert } from './components/BudgetAlert';
import { CurrencyConverter } from './components/CurrencyConverter';
import { CategoryChart } from './components/CategoryChart';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('EUR');

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedTransactions = getTransactions();
    const loadedBudget = getBudget();
    setTransactions(loadedTransactions);
    setBudget(loadedBudget);
  }, []);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleSetBudget = (newBudget: Budget) => {
    setBudget(newBudget);
    saveBudget(newBudget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Multi-Currency Finance Tracker
                </h1>
                <p className="text-sm text-gray-500">Smart expense management</p>
              </div>
            </div>
            
            {/* Currency Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
              <button
                onClick={() => setDisplayCurrency('EUR')}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  displayCurrency === 'EUR'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EUR
              </button>
              <button
                onClick={() => setDisplayCurrency('INR')}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  displayCurrency === 'INR'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                INR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Balance Summary */}
          <BalanceSummary transactions={transactions} displayCurrency={displayCurrency} />

          {/* Budget Alert */}
          <BudgetAlert
            transactions={transactions}
            budget={budget}
            onSetBudget={handleSetBudget}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Converter */}
            <div className="lg:col-span-1 space-y-8">
              <TransactionForm onAddTransaction={handleAddTransaction} />
              <CurrencyConverter />
            </div>

            {/* Right Column - Transactions and Chart */}
            <div className="lg:col-span-2 space-y-8">
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
              
              {transactions.some((t) => t.type === 'expense') && (
                <CategoryChart transactions={transactions} displayCurrency={displayCurrency} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">Built for international students • Data stored securely in your browser • Built by Kruti Joshi</p>
        </div>
      </footer>
    </div>
  );
}