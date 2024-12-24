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
export const fetchTaxDonation80GData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getDonation80G`,
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
export const fetchRuralDonationData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getRuralDonation`,
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
export const fetchContriPartyData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getContriParty`,
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
export const fetchMedical80D = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getMedical80D`,
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
export const fetchDisablilty = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getDisablity`,
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
export const fetchSpecificDisablilty = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getSpecificDisablity`,
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
export const fetchLoanData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getLoansData`,
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
export const fetchOtherDeductionData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getOtherDeduction`,
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
export const fetchSelfTaxData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getSelfTaxPaid`,
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
export const fetchNonTDSData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getNonSalary`,
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
export const fetchTDSRentData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getTDSRent`,
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
export const fetchTaxCollectedData = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getTaxCollected`,
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

  export const fetchDepLoss = async (token: string) => {
    try {
     
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/getDepLoss`,
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