import { fetchUsers } from '@/api/adminApi';
import React, { useEffect, useState } from 'react';

const AdminUser = () => {
  interface User {
    _id: string;
    name: string;
    phone: string;
    email: string;
    itrType: string;
    walletBalance: number;
  }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h3>
            <p className="text-gray-600">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>ITR Type:</strong>{' '}
              <span className={`${user.itrType === 'Not Filed' ? 'text-red-500' : 'text-green-600'}`}>
                {user.itrType}
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Wallet Balance:</strong>{' '}
              <span className="text-indigo-600 font-semibold">
                ₹{user.walletBalance.toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUser;
