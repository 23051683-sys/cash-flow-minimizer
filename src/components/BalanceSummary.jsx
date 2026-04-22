function BalanceSummary({ balances }) {
  const entries = Object.entries(balances || {});

  const totalToReceive = entries
    .filter(([, value]) => value > 0)
    .reduce((sum, [, value]) => sum + value, 0);

  const totalToOwe = Math.abs(
    entries
      .filter(([, value]) => value < 0)
      .reduce((sum, [, value]) => sum + value, 0)
  );

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 md:p-6">
      <h2 className="text-lg font-semibold text-slate-800">Balance Summary</h2>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No balances available yet.</p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {entries.map(([person, value]) => {
              const isPositive = value > 0;
              const isNegative = value < 0;
              const prettyAmount = Math.abs(value).toFixed(2);

              return (
                <div
                  key={person}
                  className="rounded-xl border border-slate-200 p-3 text-sm"
                >
                  <p className="font-semibold text-slate-800">{person}</p>
                  {isPositive ? (
                    <p className="mt-1 font-medium text-emerald-600">
                      Gets ₹{prettyAmount}
                    </p>
                  ) : null}
                  {isNegative ? (
                    <p className="mt-1 font-medium text-rose-600">
                      Owes ₹{prettyAmount}
                    </p>
                  ) : null}
                  {!isPositive && !isNegative ? (
                    <p className="mt-1 text-slate-500">Settled</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <p>
              Total to Receive:{" "}
              <span className="font-semibold text-emerald-600">
                ₹{totalToReceive.toFixed(2)}
              </span>
            </p>
            <p>
              Total Owed:{" "}
              <span className="font-semibold text-rose-600">
                ₹{totalToOwe.toFixed(2)}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default BalanceSummary;

