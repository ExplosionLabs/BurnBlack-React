
export const formatCurrency = (amount: string | number) => {
    if (!amount) return '₹ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };
