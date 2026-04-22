function SettlementDisplay({ result }) {
  const {
    settlements = [],
    originalTransactionCount = 0,
    minimizedTransactionCount = 0,
  } = result || {};

  if (!result) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 md:p-6">
        <h2 className="text-lg font-semibold text-slate-800">Settlement Plan</h2>
        <p className="mt-3 text-sm text-slate-500">
          Add transactions and click minimize to generate the optimized payment
          list.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Settlement Plan</h2>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Reduced transactions from {originalTransactionCount} to{" "}
          {minimizedTransactionCount}
        </span>
      </div>

      {settlements.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          Everyone is already settled. No payments required.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3">
            {settlements.map((step, index) => (
              <div
                key={`${step.from}-${step.to}-${index}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm"
              >
                <p className="font-medium text-slate-700">
                  {step.from} <span className="px-2 text-slate-400">-></span>{" "}
                  {step.to}
                </p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ₹{Number(step.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Step-by-step logic
            </h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
              {settlements.map((step, index) => (
                <li key={`explain-${step.from}-${step.to}-${index}`}>
                  Largest debtor <strong>{step.from}</strong> pays largest
                  creditor <strong>{step.to}</strong> an amount of{" "}
                  <strong>₹{Number(step.amount).toFixed(2)}</strong>. This
                  reduces pending balances immediately.
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-500">
              Greedy matching of highest debt and highest credit removes
              imbalances faster, so fewer final transactions are needed.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SettlementDisplay;

