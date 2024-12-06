import axios from "axios"

export const fetchInterestData = async (token: string, type: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/get-interest-income/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data for ${type}:`, error)
      return []
    }
  }
export const fetchAllInterestData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getInterestIncomeData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response.data.success && response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }