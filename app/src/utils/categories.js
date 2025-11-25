import { MdLocalMall, MdMoneyOff, MdAutorenew, MdFastfood, MdCreditCard, MdHouse } from 'react-icons/md';

export const CATEGORIES = [
  'Life Style',
  'Debts',
  'Subscriptions',
  'Food',
  'Credit cards',
  'Home Expenses',
];

export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Life Style': return MdLocalMall;
    case 'Debts': return MdMoneyOff;
    case 'Subscriptions': return MdAutorenew;
    case 'Food': return MdFastfood;
    case 'Credit cards': return MdCreditCard;
    case 'Home Expenses': return MdHouse;
    default: return MdMoneyOff;
  }
};
