import axios from 'axios';

export const uploadForm16 = async (formData: FormData) => {

    const token = localStorage.getItem("token");
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/uploadForm`, formData,
        {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          }
    );
    return response.data;
  };