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
export const fetchStockMututalData = async (token: string) => {
    try {
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getAllStockMutualData`,
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
export const fetchForeignAssetsData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getForeignAssest`,
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
export const fetchLandFormData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getLandFormAssest`,
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
export const fetchStockRsuData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getStockRsuAssest`,
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
export const fetchGoldData = async (token: string) => {
    try {
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getGoldAssest`,
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
export const fetchBondData = async (token: string) => {
    try {

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getBondDebentureAssest`,
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
export const fetchLongShortData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getShortLongAssest`,
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
export const fetchDividendData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getDividentData`,
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

  export const fetchCryptoAssestData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getCryptoIncome`,
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
  export const fetchDeprecatationData = async (token: string) => {
    try {
      console.log("ad");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getDeprecationEntry`,
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