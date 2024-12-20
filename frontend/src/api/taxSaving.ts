import axios from "axios"

export const fetchTaxInvestData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getTaxInvestment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }