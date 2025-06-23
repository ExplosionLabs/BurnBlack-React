import axios from "axios"

export const fetchProfessionalData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getProfesionalIncomeData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }

export const fetchBussinessData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getBussinessIncomeData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }
export const fetchProfitLossData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getProfitLossData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error(`Error fetching data `, error)
      console.log("eror",error);
   
    }
  }