import axios from 'axios';

export const fetchUsers = async () => {
    const token = localStorage.getItem("token");
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/adminApi/get-all-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};