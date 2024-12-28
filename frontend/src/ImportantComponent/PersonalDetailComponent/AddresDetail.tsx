import { useState, useEffect, SetStateAction } from "react"
import axios from "axios"
import debounce from "lodash.debounce"
import { MapPin , ChevronDown, ChevronUp, ChevronUpIcon} from 'lucide-react'
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"
import { useSelector } from "react-redux"
import { RootState } from "@/stores/store"
import { motion } from "framer-motion"

export default function AddressSection() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [isOpen, setIsOpen] = useState(true)
  const [formData, setFormData] = useState({
    flatNo: "",
    premiseName: "",
    road: "",
    area: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  })

  const [countryid, setCountryid] = useState(null)
  const [stateid, setStateid] = useState(null)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  useEffect(() => {
    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getAddressDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = response.data
        setFormData(data)
      } catch (error) {
        console.error("Error fetching personal details:", error)
      }
    }

    if (isUserLoggedIn) {
      fetchContactDetail()
    }
  }, [isUserLoggedIn])

  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token")
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateAddressDetails`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
    } catch (error) {
      console.error("Error updating address:", error)
    }
  }, 300)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)
    updateDatabase(updatedData)
  }

  const handleCountrySelect = (selectedCountry: any) => {
    if (!selectedCountry) return;
    setCountryid(selectedCountry.id);
    const updatedData = {
      ...formData,
      country: selectedCountry.name,
      state: "",
      city: "",
    };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };
  
  const handleStateSelect = (selectedState: any) => {
    if (!selectedState) return;
    setStateid(selectedState.id);
    const updatedData = { ...formData, state: selectedState.name, city: "" };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };
  
  const handleCitySelect = (selectedCity: any) => {
    if (!selectedCity) return;
    const updatedData = { ...formData, city: selectedCity.name };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };
  

  return (
    <div className="mx-auto bg-white border rounded-md overflow-hidden max-w-4xl ">
      <div onClick={toggleOpen} className="cursor-pointer p-2 border-b border-gray-200 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <MapPin className="h-7 w-7 text-blue-500 ml-2" />
        <div>
        <h2 className="text-base font-semibold text-gray-800">Your Address</h2>
        <p className="text-xs text-gray-600">
          You can provide either your current address or permanent address of residence
        </p>
        </div>
      </div>
      <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={toggleOpen}>
        <ChevronUpIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>
      </div>
      <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
      >
      <div className="p-6 space-y-6">
        <div className="space-y-6">
        <div className="grid gap-4">
          <div>
          <label htmlFor="flatNo" className="block text-sm font-medium text-gray-700 mb-1">
            Flat / Door No <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="flatNo"
            name="flatNo"
            placeholder="Charde Layout Near Ganesh"
            value={formData.flatNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div>
          <label htmlFor="premiseName" className="block text-sm font-medium text-gray-700 mb-1">
            Premise Name
          </label>
          <input
            type="text"
            id="premiseName"
            name="premiseName"
            placeholder="For ex: Vivekanand Colony"
            value={formData.premiseName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div>
          <label htmlFor="road" className="block text-sm font-medium text-gray-700 mb-1">
            Road / Street
          </label>
          <input
            type="text"
            id="road"
            name="road"
            placeholder="For ex: Shivaji Road"
            value={formData.road}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Area Locality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="area"
            name="area"
            placeholder="Dhantol"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode/ZipCode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            placeholder="441302"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
            </label>
            <CountrySelect
            onChange={handleCountrySelect}
            value={formData.country}
            placeHolder="Select Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
            </label>
            <StateSelect
            value={formData.state}
            countryid={countryid ?? 0}
            onChange={handleStateSelect}
            placeHolder="Select State"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
            </label>
            <CitySelect
            countryid={countryid ?? 0}
            stateid={stateid ?? 0}
            onChange={handleCitySelect}
            placeHolder="Select City"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>
        </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

