import axios from "axios";

export const fetchIncomeCal = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/calculateIncome/getTaxableIncome`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getForm16Data`,
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