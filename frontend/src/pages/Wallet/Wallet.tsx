import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Transaction {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
}

interface WalletData {
    balance: number;
    transactions: Transaction[];
}

const Wallet = () => {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        fetchWallet();
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);
    
    const fetchWallet = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/wallet/getWallet`,  {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            setWallet(response.data);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMoney = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/wallet/add-money`, {
                amount: parseFloat(amount)
            },  {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

            const options = {
                key: response.data.keyId,
                amount: response.data.amount,
                currency: response.data.currency,
                name: 'Tax Filing System',
                description: 'Wallet Top Up',
                order_id: response.data.orderId,
                handler: async function (response: any) {
                    try {
                        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/wallet/verify-payment`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        },  {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                        fetchWallet(); // Refresh wallet data
                        setAmount('');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: '#6366F1'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
                <div className="text-3xl font-bold text-indigo-600 mb-6">
                    ₹{wallet?.balance?.toFixed(2) || '0.00'}
                </div>

                <div className="flex gap-4 mb-6">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 p-2 border rounded-lg"
                        min="1"
                    />
                    <button
                        onClick={handleAddMoney}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        Add Money
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                <div className="space-y-4">
                    {wallet?.transactions && wallet.transactions.length > 0 ? (
                        wallet.transactions.map((transaction, index) => (
                            <div
                                key={index}
                                className="border-b pb-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {transaction.description}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(transaction.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No transactions yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet; 