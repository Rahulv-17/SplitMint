// Smart Debt Simplification Algorithm
// Goal: Minimize the number of transactions between users in a group

/**
 * Calculates optimized settlements to minimize total transactions.
 * @param {Array} expenses - Array of Mongoose Expense documents with splits
 * @returns {Array} - Array of optimized settlement objects { payer, receiver, amount }
 */
const optimizeDebts = (expenses, settlements = []) => {
  // 1. Calculate net balance for each user
  const balances = new Map(); // userId -> net balance (positive means they are owed money, negative means they owe money)

  // Process all expenses
  expenses.forEach(expense => {
    const paidByStr = expense.paidBy._id ? expense.paidBy._id.toString() : expense.paidBy.toString();
    
    // The person who paid gets a positive balance for the total amount
    balances.set(paidByStr, (balances.get(paidByStr) || 0) + expense.amount);
    
    // Everyone involved in the split gets a negative balance for their share
    expense.splits.forEach(split => {
      const userStr = split.user._id ? split.user._id.toString() : split.user.toString();
      balances.set(userStr, (balances.get(userStr) || 0) - split.amount);
    });
  });

  // Process all completed settlements to adjust net balances
  settlements.forEach(settlement => {
    if (settlement.status === 'completed') {
      const payerStr = settlement.payer._id ? settlement.payer._id.toString() : settlement.payer.toString();
      const receiverStr = settlement.receiver._id ? settlement.receiver._id.toString() : settlement.receiver.toString();
      
      // Payer's balance goes up (they paid off debt)
      balances.set(payerStr, (balances.get(payerStr) || 0) + settlement.amount);
      // Receiver's balance goes down (they received money owed)
      balances.set(receiverStr, (balances.get(receiverStr) || 0) - settlement.amount);
    }
  });

  // 2. Separate into Debtors and Creditors
  const debtors = []; // People who owe money (negative balance)
  const creditors = []; // People who are owed money (positive balance)

  balances.forEach((amount, userId) => {
    // We round to 2 decimal places to avoid floating point errors
    const roundedAmount = Math.round(amount * 100) / 100;
    
    if (roundedAmount < -0.01) {
      debtors.push({ userId, amount: Math.abs(roundedAmount) });
    } else if (roundedAmount > 0.01) {
      creditors.push({ userId, amount: roundedAmount });
    }
  });

  // Sort by amount descending to optimize large debts first (Greedy approach)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // 3. Generate optimal transactions
  const optimizedSettlements = [];
  let i = 0; // Debtors index
  let j = 0; // Creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    // Find the minimum of what debtor owes and what creditor is owed
    const minAmount = Math.min(debtor.amount, creditor.amount);
    const settleAmount = Math.round(minAmount * 100) / 100;
    
    if (settleAmount > 0) {
      optimizedSettlements.push({
        payer: debtor.userId,
        receiver: creditor.userId,
        amount: settleAmount
      });
    }

    // Update remaining amounts
    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    // Move to next if fully settled
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return optimizedSettlements;
};

module.exports = {
  optimizeDebts
};
