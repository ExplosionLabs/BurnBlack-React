import axios from 'axios';
import { API_CONFIG, getFullApiUrl } from '../config/api';

export const uploadForm16 = async (formData: FormData) => {

    const token = localStorage.getItem("token");
    const response = await axios.post(getFullApiUrl(API_CONFIG.ENDPOINTS.FILL_DETAIL + '/uploadForm'), formData,
        {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          }
    );
    return response.data;
  };