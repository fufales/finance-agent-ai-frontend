import { exportToCSV, parseCSV } from './src/utils/csvUtils.js';

const mockData = {
  income: { period1: 5000, period2: 5500 },
  expenses: [
    { id: '1', name: 'Rent', amount: 1200, category: 'Housing', period: 1, date: '2023-10-01', paid: true },
    { id: '2', name: 'Groceries', amount: 300.50, category: 'Food', period: 1, date: '2023-10-05', paid: false }
  ],
  funds: [
    { id: 'f1', name: 'Debit Card', amount: 1000, type: 'Debit Card', period: 1, color: 'blue' }
  ]
};

console.log('Testing Export...');
const csv = exportToCSV(mockData);
console.log('CSV Output:\n', csv);

console.log('\nTesting Import...');
const parsed = parseCSV(csv);
console.log('Parsed Data:', JSON.stringify(parsed, null, 2));

// Simple verification
const incomeMatch = parsed.income.period1 === mockData.income.period1 && parsed.income.period2 === mockData.income.period2;
const expenseMatch = parsed.expenses.length === mockData.expenses.length && parsed.expenses[0].name === mockData.expenses[0].name;
const fundMatch = parsed.funds.length === mockData.funds.length && parsed.funds[0].name === mockData.funds[0].name;

if (incomeMatch && expenseMatch && fundMatch) {
  console.log('\nSUCCESS: Data round-trip verified!');
} else {
  console.error('\nFAILURE: Data mismatch!');
}
