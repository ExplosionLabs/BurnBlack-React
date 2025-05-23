import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { ChevronUpIcon, CircleUserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import type { RootState } from "@/stores/store";


interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
}

// Define type for tracked field keys
type TrackedField = 'firstName' | 'middleName'| 'lastName' | 'dob' | 'gender' | 'maritalStatus';
export default function PersonalDetails() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
  });
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");

  const trackedFields: TrackedField[] = ['firstName', 'middleName','lastName', 'dob', 'gender', 'maritalStatus'];
  const getFilledFieldsCount = () => {
    return trackedFields.filter(field => formData[field] && formData[field].trim() !== "").length;
  };

  const getTotalFieldsCount = () => {
    return trackedFields.length;
  };


  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPersonalDetail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        const formFields = {
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "",
          gender: data.gender || "",
          maritalStatus: data.maritalStatus || "",
        };
        setFormData(formFields);
        setSaveStatus("saved"); // Mark as saved on initial fetch
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchPersonalDetails();
    }
  }, [isUserLoggedIn]);

  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token");
    setSaveStatus("saving"); // Mark as saving
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updatePersonalDetail`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaveStatus("saved"); // Mark as saved on success
    } catch (error) {
      console.error("Error updating data:", error);
      setSaveStatus("unsaved"); // Mark as unsaved on error
    }
  }, 1000);

  
  const handleChange = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setSaveStatus("unsaved"); // Mark as unsaved on input change
    // updateDatabase(updatedData);
  };
  const handleInputBlur = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    // setSaveStatus("unsaved"); // Mark as unsaved on input blur
    updateDatabase(updatedData); // Save the data on blur
  };
  return (
    <div className="mx-auto bg-white border rounded-md overflow-hidden max-w-4xl">
      <div onClick={toggleOpen} className="cursor-pointer p-2 border-b border-gray-200 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <CircleUserRound className="h-7 w-7 text-blue-500 ml-2" />
          <div>
            <h2 className="text-lg md:text-base font-bold text-gray-800">Permanent Information</h2>
            <p className="text-xs md:text-xs text-gray-600">
              Please provide all info as per your government identity documents (PAN, Aadhaar, etc.)
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-6"
          >
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
                    onBlur={(e) => handleInputBlur("firstName", e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* <span className="text-xs text-gray-500">First Name</span> */}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Middle Name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange("middleName", e.target.value)}
                    onBlur={(e) => handleInputBlur("middleName", e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* <span className="text-xs text-gray-500">Middle Name</span> */}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    onBlur={(e) => handleInputBlur("lastName", e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* <span className="text-xs text-gray-500">Last Name</span> */}
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
                onBlur={(e) => handleInputBlur("dob", e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onBlur={(e) => handleInputBlur("gender", e.target.value)}
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
                    onBlur={(e) => handleInputBlur("gender", e.target.value)}
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
                    onBlur={(e) => handleInputBlur("maritalStatus", e.target.value)}
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
                    onBlur={(e) => handleInputBlur("maritalStatus", e.target.value)}
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
                    onBlur={(e) => handleInputBlur("maritalStatus", e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Prefer not to disclose</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

