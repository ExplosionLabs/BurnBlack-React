import { fetchUsers } from '@/api/adminApi';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  const handleGenerateJSON = async (userId: string, itrType: string) => {
    try {
      const endpoint =
      itrType === 'ITR-2' ? 'generate-itr2' :
      itrType === 'ITR-3' ? 'generate-itr3' :
      itrType === 'ITR-4' ? 'generate-itr4' :
      'generate-itr';
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/itr/${endpoint}/${userId}`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${itrType}_${userId}.json`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error generating JSON:', error);
      alert('Error generating JSON file');
    }
  };

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
            <div className="mt-4 flex space-x-2">
            
              <button
                onClick={() => handleGenerateJSON(user._id, user.itrType)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate JSON {user.itrType}
              </button>
           
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUser;
