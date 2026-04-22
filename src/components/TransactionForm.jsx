import { useState } from "react";

const initialForm = {
  payer: "",
  receiver: "",
  amount: "",
};

function TransactionForm({ onAddTransaction }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const payer = formData.payer.trim();
    const receiver = formData.receiver.trim();
    const amount = Number(formData.amount);

    if (!payer || !receiver) {
      setError("Both payer and receiver names are required.");
      return;
    }

    if (payer.toLowerCase() === receiver.toLowerCase()) {
      setError("Payer and receiver must be different people.");
      return;
    }

    if (Number.isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    onAddTransaction({
      payer,
      receiver,
      amount: Number(amount.toFixed(2)),
    });

    setFormData(initialForm);
    setError("");
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 md:p-6">
      <h2 className="text-lg font-semibold text-slate-800">Add Transaction</h2>
      <p className="mt-1 text-sm text-slate-500">
        Record who paid and who should receive the amount.
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Payer Name
            <input
              type="text"
              name="payer"
              value={formData.payer}
              onChange={onChange}
              placeholder="e.g. Rahul"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Receiver Name
            <input
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={onChange}
              placeholder="e.g. Priya"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Amount
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={onChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 md:w-fit"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;

