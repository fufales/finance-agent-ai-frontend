import { MdLocalMall, MdMoneyOff, MdAutorenew, MdFastfood, MdCreditCard, MdHouse, MdMedicalServices, MdDirectionsCar, MdAttachMoney } from 'react-icons/md';

export const CATEGORIES = [
  'Extra Expenses',
  'Life Style',
  'Debts',
  'Subscriptions',
  'Food',
  'Credit cards',
  'Home Expenses',
  'Health',
  'Car',
];

export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Extra Expenses': return MdAttachMoney;
    case 'Life Style': return MdLocalMall;
    case 'Debts': return MdMoneyOff;
    case 'Subscriptions': return MdAutorenew;
    case 'Food': return MdFastfood;
    case 'Credit cards': return MdCreditCard;
    case 'Home Expenses': return MdHouse;
    case 'Health': return MdMedicalServices;
    case 'Car': return MdDirectionsCar;
    default: return MdMoneyOff;
  }
};
