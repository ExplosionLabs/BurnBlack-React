import Sliderbar from '@/Layout/Sidebar'
import { ArrowLeft, Box } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../CaptialGainComponent/StocksFund/Modal'
import CryptoVDAComponent from './CryptoVDAComponent'
import axios from 'axios'
import { fetchCryptoAssestData } from '@/api/incomeSoucre'
import NFTComponent from './NFTComponent'

const VirtualAssestSubMain = () => {
   const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
   const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
    const [existingCryptoData, setExistingCryptoData] = useState<any | null>(null);
    const [existingNFTData, setExistingNFTData] = useState<any | null>(null);
   const [cryptoFormData, setcryptoFormData] = useState({
    assetSubType: "Crypto Income",
    dateOfSale: "",
    dateOfPurchase: "",
    assestName: "",
    salePrice:0,
    purchasePrice:0,
    totalGains: 0,
    incomeType: "",
     });
   const [nftFormData, setNFTFormData] = useState({
    assetSubType: "NFT Income",
    dateOfSale: "",
    dateOfPurchase: "",
    assestName: "",
    salePrice:0,
    purchasePrice:0,
    totalGains: 0,
    incomeType: "",
     });

     const resetForm = () => {
      setcryptoFormData({
        assetSubType: "Crypto Income",
    dateOfSale: "",
    dateOfPurchase: "",
    assestName: "",
    salePrice:0,
    purchasePrice:0,
    totalGains: 0,
    incomeType: "",
      });
    };
     const resetFormNFT = () => {
      setcryptoFormData({
        assetSubType: "NFT Income",
        dateOfSale: "",
        dateOfPurchase: "",
        assestName: "",
        salePrice:0,
        purchasePrice:0,
        totalGains: 0,
        incomeType: "",
      });
    };
     const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Extracts "yyyy-MM-dd"
    };
       useEffect(() => {
         const fetchCryptoAssest = async () => {
           const token = localStorage.getItem("token");
       
           if (!token) {
             console.error("No token found in localStorage");
          
             return;
           }
       
           try {
             const data = await fetchCryptoAssestData(token);
       
             console.log("data",data);
             if (data && Array.isArray(data)) {
        
              const cryptoData = data.filter(item => item.assetSubType === "Crypto Income");
              const nftData = data.filter(item => item.assetSubType === "NFT Income");
      
      
              if (cryptoData.length > 0) {
                setExistingCryptoData(cryptoData);
                setcryptoFormData({
                  ...cryptoData[0],
                  dateOfSale: cryptoData[0].dateOfSale ? formatDate(cryptoData[0].dateOfSale) : "",
                  dateOfPurchase: cryptoData[0].dateOfPurchase ? formatDate(cryptoData[0].dateOfPurchase) : "",
                });
              }
              
              if (nftData.length > 0) {
                setExistingNFTData(nftData);
                setNFTFormData({
                  ...nftData[0],
                  dateOfSale: nftData[0].dateOfSale ? formatDate(nftData[0].dateOfSale) : "",
                  dateOfPurchase: nftData[0].dateOfPurchase ? formatDate(nftData[0].dateOfPurchase) : "",
                });
              }
              
             } else {
               resetForm();
             }
           } catch (error) {
             console.error("Error fetching data:", error);
             resetForm();
           }
         };
       
         fetchCryptoAssest();
       }, []);
       const handleCryptoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setcryptoFormData((prevData) => {
          const updatedData = { ...prevData, [name]: value };
    
          // Automatically calculate totalGains if salePrice or purchasePrice changes
          if (name === "salePrice" || name === "purchasePrice") {
            const salePrice = updatedData.salePrice || 0;
            const purchasePrice = updatedData.purchasePrice || 0;
            updatedData.totalGains = salePrice - purchasePrice;
          }
    
          return updatedData;
        });
       };
       const handleNFTInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setNFTFormData((prevData) => {
          const updatedData = { ...prevData, [name]: value };
    
          // Automatically calculate totalGains if salePrice or purchasePrice changes
          if (name === "salePrice" || name === "purchasePrice") {
            const salePrice = updatedData.salePrice || 0;
            const purchasePrice = updatedData.purchasePrice || 0;
            updatedData.totalGains = salePrice - purchasePrice;
          }
    
          return updatedData;
        });
       };
     

       const handleCryptoSubmit = async () => {
        try {
          const token = localStorage.getItem("token");
          const url = existingCryptoData? `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateCryptoIncome`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addCryptoIncome`;
    
          const response = await axios.post(url, cryptoFormData, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          alert(response.data.message);
          setIsCryptoModalOpen(false);
        } catch (error: any) {
          alert(error.response?.data?.error || "Error submitting form");
        }
      };

       const handleNFTSubmit = async () => {
        try {
          const token = localStorage.getItem("token");
          const url = existingNFTData? `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateNFTIncome`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addCryptoIncome`;
    
          const response = await axios.post(url,nftFormData, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          alert(response.data.message);
          setIsNFTModalOpen(false);
        } catch (error: any) {
          alert(error.response?.data?.error || "Error submitting form");
        }
      };

  return (
    <>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
      <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link to="/fileITR/incomeSources" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Crypto Income (Virtual Digital Assets - VDA)</h1>

        </div>

        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
         {/* Header Section */}
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Box className="w-6 h-6 text-blue-600" />
             <div>
               <h3 className="font-medium text-gray-900 text-base">Add Crypto / VDA income yourself</h3>
               <p className="text-sm text-gray-500 mt-1 ">
              
Choose this option in-case you don't have reports shared by your Crypto exchange <br /> or you prefer adding data yourself through form
               </p>
             </div>
           </div>
           <div className="flex items-center space-x-4">
             <button
                        onClick={() => setIsCryptoModalOpen(true)}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
             >
               Add Details
             </button>
           </div>
         </div>
   
         {/* Interest Details Section */}
         {/* <div className="mt-4 ml-10">
           {interestData.length > 0 ? (
             interestData.map((section) => {
               const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
               return (
                 <div
                   key={section._id}
                   className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
                 >
                   <div className="flex items-center space-x-2">
                     <span className="font-medium text-gray-900">{section.type}</span>
                   </div>
                   <div className="flex items-center space-x-4">
                     <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                     <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>
   
                   </div>
                 </div>
               );
             })
           ) : (
             <div>No interest income details available.</div>
           )}
         </div> */}
       </div>
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
         {/* Header Section */}
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Box className="w-6 h-6 text-blue-600" />
             <div>
               <h3 className="font-medium text-gray-900 text-base">Add gains from NFT</h3>
               <p className="text-sm text-gray-500 mt-1 ">
              

               Add your NFT gains manually
               </p>
             </div>
           </div>
           <div className="flex items-center space-x-4">
             <button
                        onClick={() => setIsNFTModalOpen(true)}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
             >
               Add Details
             </button>
           </div>
         </div>
   
         {/* Interest Details Section */}
         {/* <div className="mt-4 ml-10">
           {interestData.length > 0 ? (
             interestData.map((section) => {
               const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
               return (
                 <div
                   key={section._id}
                   className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
                 >
                   <div className="flex items-center space-x-2">
                     <span className="font-medium text-gray-900">{section.type}</span>
                   </div>
                   <div className="flex items-center space-x-4">
                     <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                     <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>
   
                   </div>
                 </div>
               );
             })
           ) : (
             <div>No interest income details available.</div>
           )}
         </div> */}
       </div>

       
      
      </div>

      {/* Sidebar */}
      <Sliderbar />
    </div>
    <Modal isOpen={isCryptoModalOpen} onClose={() => setIsCryptoModalOpen(false)}>
    <CryptoVDAComponent
          formData={cryptoFormData}
          handleInputChange={handleCryptoInputChange}
          handleSubmit={handleCryptoSubmit}
        />
    
    </Modal>
    <Modal isOpen={isNFTModalOpen} onClose={() => setIsNFTModalOpen(false)}>
    <NFTComponent
          formData={nftFormData}
          handleInputChange={handleNFTInputChange}
          handleSubmit={handleNFTSubmit}
        />
    
    </Modal>
        </>
  )
}

export default VirtualAssestSubMain