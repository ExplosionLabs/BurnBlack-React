import { useState, useEffect, SetStateAction } from "react"
import axios from "axios"
import debounce from "lodash.debounce"
import { MapPin, ChevronUp as ChevronUpIcon } from 'lucide-react'
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"
import { useSelector } from "react-redux"
import { RootState } from "@/stores/store"
import { motion } from "framer-motion"


interface FormData {
  flatNo: string,
  premiseName: string,
  road: string,
  area: string,
  pincode:string,
  country: string,
  state: string,
  city: string,
}
type TrackedField = 'flatNo' | 'premiseName'| 'road' | 'area' | 'pincode' | 'country' | 'state'|'city';

export default function AddressSection() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [isOpen, setIsOpen] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    flatNo: "",
    premiseName: "",
    road: "",
    area: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  })
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [countryid, setCountryid] = useState(101) // India country ID
  const [stateid, setStateid] = useState(null)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  const trackedFields: TrackedField[] = ['flatNo', 'premiseName', 'road' ,'area' , 'pincode' , 'country' ,'state','city'];
  const getFilledFieldsCount = () => {
    return trackedFields.filter(field => formData[field] && formData[field].trim() !== "").length;
  };

  const getTotalFieldsCount = () => {
    return trackedFields.length;
  };
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
        setFormData(data);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Error fetching personal details:", error)
      }
    }

    if (isUserLoggedIn) {
      fetchContactDetail()
    }
  }, [isUserLoggedIn])

  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token");
    setSaveStatus("saving");
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
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error updating address:", error);
      setSaveStatus("unsaved");
    }
  }, 1000)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)
    updateDatabase(updatedData);
    setSaveStatus("unsaved");
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
    setSaveStatus("unsaved");
    updateDatabase(updatedData);
  };
  
  const handleCitySelect = (selectedCity: any) => {
    if (!selectedCity) return;
    const updatedData = { ...formData, city: selectedCity.name };
    setFormData(updatedData);
    setSaveStatus("unsaved");
    updateDatabase(updatedData);
  };
  

  return (
    <div className="relative mx-auto bg-white border rounded-md overflow-visible max-w-4xl">
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
      <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{getFilledFieldsCount()}</span>
            <span className="mx-1">/</span>
            <span>{getTotalFieldsCount()}</span>
            <span className="ml-1">fields filled</span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-medium ${
                saveStatus === "saved"
                  ? "text-green-500"
                  : saveStatus === "saving"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "unsaved" && "Unsaved"}
            </span>
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${isOpen ? "" : "rotate-180"}`} />
          </div>
        </div>
      </div>
      <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 } }
      transition={{ duration: 0.3 }}
      className="z-10 overflow-visible"
      >
      <div className="z-10 p-4 space-y-6">
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
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
            </label>
            <CountrySelect
            onChange={handleCountrySelect}
            value={formData.country}
            placeHolder="Select Country"
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
            </label>
            <StateSelect
            value={formData.state}
            countryid={countryid ?? 0}
            onChange={handleStateSelect}
            placeHolder="Select State"
            className="w-full px-3 py-1  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
            </label>
            <CitySelect
            countryid={countryid ?? 0}
            stateid={stateid ?? 0}
            onChange={handleCitySelect}
            placeHolder="Select City"
            className="w-full px-3 py-1  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

