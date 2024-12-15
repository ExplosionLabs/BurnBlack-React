import { useState, useEffect } from "react"
import axios from "axios"
import debounce from "lodash.debounce"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { ChevronUpIcon, User } from 'lucide-react'
import { ChevronDown, ChevronUp ,CircleUserRound} from "lucide-react";
import type { RootState } from "@/stores/store"

export default function PersonalDetails() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
  })
  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPersonalDetail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = response.data
        setFormData({
          ...data,
          dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "",
        })
      } catch (error) {
        console.error("Error fetching personal details:", error)
      }
    }

    if (isUserLoggedIn) {
      fetchPersonalDetails()
    }
  }, [isUserLoggedIn])

  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token")
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updatePersonalDetail`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
    } catch (error) {
      console.error("Error updating data:", error)
    }
  }, 300)

  const handleChange = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)
    updateDatabase(updatedData)
  }

  return (
    <div className=" mx-auto bg-white shadow-md rounded-lg overflow-hidden">
    <div onClick={toggleOpen} className="cursor-pointer p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CircleUserRound className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">Permanent Information</h2>
            <p className="text-xs md:text-sm text-gray-600">
              Please provide all info as per your government identity documents (PAN, Aadhaar, etc.)
            </p>
          </div>
        </div>
        {/* Toggle Button */}
        <button onClick={toggleOpen} className="text-gray-600 hover:text-gray-800">
        <ChevronUpIcon className={`w-5 h-5 transition-transform ${isOpen  ? '' : 'rotate-180'}`} />
        </button>
      </div>
      {isOpen && (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">First Name</span>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Middle Name</span>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Last Name</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Name should be as per the PAN; 5th character of PAN no. is the first letter of the last name
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            Specify date in a format like DD/MM/YYYY
          </p>
        </div>

      
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="married"
                checked={formData.maritalStatus === "married"}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Married</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="unmarried"
                checked={formData.maritalStatus === "unmarried"}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Unmarried</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="prefernottodisclose"
                checked={formData.maritalStatus === "prefernottodisclose"}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Prefer not to disclose</span>
            </label>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

