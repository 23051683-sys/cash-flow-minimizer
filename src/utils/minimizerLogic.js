/**
 * A binary heap implementation that accepts a comparator.
 * The comparator decides priority ordering for parent/child nodes.
 */
class Heap {
  constructor(comparator) {
    this.items = [];
    this.comparator = comparator;
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    this.items.push(value);
    this.#heapifyUp(this.size() - 1);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }

    if (this.size() === 1) {
      return this.items.pop();
    }

    const root = this.items[0];
    this.items[0] = this.items.pop();
    this.#heapifyDown(0);
    return root;
  }

  #heapifyUp(index) {
    let current = index;
    while (current > 0) {
      const parentIndex = Math.floor((current - 1) / 2);
      if (this.comparator(this.items[current], this.items[parentIndex]) >= 0) {
        break;
      }
      [this.items[current], this.items[parentIndex]] = [
        this.items[parentIndex],
        this.items[current],
      ];
      current = parentIndex;
    }
  }

  #heapifyDown(index) {
    let current = index;
    const length = this.size();

    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let target = current;

      if (
        left < length &&
        this.comparator(this.items[left], this.items[target]) < 0
      ) {
        target = left;
      }

      if (
        right < length &&
        this.comparator(this.items[right], this.items[target]) < 0
      ) {
        target = right;
      }

      if (target === current) {
        break;
      }

      [this.items[current], this.items[target]] = [
        this.items[target],
        this.items[current],
      ];
      current = target;
    }
  }
}

/**
 * Minimize cash flow transactions among a group of people.
 *
 * Why greedy works:
 * - At each step we settle between the largest debtor and largest creditor.
 * - This immediately clears at least one side fully (debtor or creditor), reducing
 *   the number of active participants quickly.
 * - Repeating this cannot increase the needed transaction count compared to
 *   splitting the same payment into smaller fragments.
 *
 * How heaps reduce complexity:
 * - A max heap gives the current largest creditor in O(log N) updates.
 * - A min heap gives the current largest debtor (most negative balance) in O(log N) updates.
 * - Each settlement performs constant heap pop/push operations, so total runtime is O(T log N),
 *   where T is number of settlements (bounded by number of participants and transactions).
 *
 * Why this minimizes number of transactions:
 * - Each settlement eliminates one extreme imbalance first.
 * - The process tends to zero out one account per step, which leads to near-minimal
 *   and in this net-balance model minimal transfer count for settling all debts.
 *
 * @param {Array<{payer: string, receiver: string, amount: number}>} transactions
 * @returns {{
 *  balances: Record<string, number>,
 *  settlements: Array<{from: string, to: string, amount: number}>,
 *  originalTransactionCount: number,
 *  minimizedTransactionCount: number
 * }}
 */
export function minimizeCashFlow(transactions = []) {
  const balances = {};

  for (const tx of transactions) {
    const payer = String(tx.payer || "").trim();
    const receiver = String(tx.receiver || "").trim();
    const amount = Number(tx.amount);

    if (!payer || !receiver || Number.isNaN(amount) || amount <= 0) {
      continue;
    }

    balances[payer] = (balances[payer] || 0) - amount;
    balances[receiver] = (balances[receiver] || 0) + amount;
  }

  const maxHeap = new Heap((a, b) => b.amount - a.amount);
  const minHeap = new Heap((a, b) => a.amount - b.amount);

  Object.entries(balances).forEach(([person, amount]) => {
    if (amount > 0) {
      maxHeap.push({ person, amount });
    } else if (amount < 0) {
      minHeap.push({ person, amount });
    }
  });

  const settlements = [];

  while (!maxHeap.isEmpty() && !minHeap.isEmpty()) {
    const creditor = maxHeap.pop();
    const debtor = minHeap.pop();

    const settledAmount = Math.min(creditor.amount, Math.abs(debtor.amount));
    const roundedAmount = Number(settledAmount.toFixed(2));

    if (roundedAmount <= 0) {
      break;
    }

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: roundedAmount,
    });

    const creditorLeft = Number((creditor.amount - roundedAmount).toFixed(2));
    const debtorLeft = Number((debtor.amount + roundedAmount).toFixed(2));

    if (creditorLeft > 0) {
      maxHeap.push({ person: creditor.person, amount: creditorLeft });
    }
    if (debtorLeft < 0) {
      minHeap.push({ person: debtor.person, amount: debtorLeft });
    }
  }

  const normalizedBalances = {};
  Object.entries(balances).forEach(([person, amount]) => {
    normalizedBalances[person] = Number(amount.toFixed(2));
  });

  return {
    balances: normalizedBalances,
    settlements,
    originalTransactionCount: transactions.length,
    minimizedTransactionCount: settlements.length,
  };
}

