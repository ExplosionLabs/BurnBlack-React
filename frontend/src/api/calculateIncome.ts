import axios from "axios";
import { API_CONFIG, getFullApiUrl } from '../config/api';

export const fetchIncomeCal = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        getFullApiUrl(API_CONFIG.ENDPOINTS.CALCULATE_INCOME + '/getTaxableIncome'),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if ( response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }
export const fetchForm16 = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        getFullApiUrl(API_CONFIG.ENDPOINTS.FILL_DETAIL + '/getForm16Data'),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if ( response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }
export const fetchTaxPaid = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        getFullApiUrl(API_CONFIG.ENDPOINTS.CALCULATE_INCOME + '/getTaxPaid'),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if ( response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }