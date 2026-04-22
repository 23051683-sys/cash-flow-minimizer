import { useMemo, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import BalanceSummary from "./components/BalanceSummary";
import SettlementDisplay from "./components/SettlementDisplay";
import { minimizeCashFlow } from "./utils/minimizerLogic";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const minimizedResult = useMemo(
    () => minimizeCashFlow(transactions),
    [transactions]
  );

  const handleAddTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    setShowResults(false);
  };

  const handleDeleteTransaction = (indexToDelete) => {
    setTransactions((prev) => prev.filter((_, index) => index !== indexToDelete));
    setShowResults(false);
  };

  const handleReset = () => {
    setTransactions([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Cash Flow Minimizer
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Track group expenses, view who owes whom, and generate the minimum
            number of payments required to settle all balances.
          </p>
        </header>

        <section className="grid gap-6">
          <TransactionForm onAddTransaction={handleAddTransaction} />

          <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-800">
                Recorded Transactions
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowResults(true)}
                  disabled={transactions.length === 0}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Minimize Transactions
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={transactions.length === 0}
                  className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reset All
                </button>
              </div>
            </div>

            {transactions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No transactions added yet.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="pb-2 pr-4">Payer</th>
                      <th className="pb-2 pr-4">Receiver</th>
                      <th className="pb-2 pr-4">Amount</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={`${tx.payer}-${tx.receiver}-${index}`}>
                        <td className="py-2 pr-4 text-slate-700">{tx.payer}</td>
                        <td className="py-2 pr-4 text-slate-700">{tx.receiver}</td>
                        <td className="py-2 pr-4 font-medium text-slate-800">
                          ₹{Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteTransaction(index)}
                            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <BalanceSummary balances={minimizedResult.balances} />
            <SettlementDisplay result={showResults ? minimizedResult : null} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

