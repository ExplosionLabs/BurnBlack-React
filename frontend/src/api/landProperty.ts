import axios from "axios";

export const fetchLandPropertyData = async (token: string,propertyIndex:string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPropertyData/${propertyIndex}`,
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
export const fetchAllLandPropertyData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getAllPropertyData`,
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
export const fetchRentPropertyData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getRentalData`,
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