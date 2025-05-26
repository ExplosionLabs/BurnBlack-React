import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, MessageCircle, Shield } from "lucide-react";
import Sliderbar from "@/Layout/Sidebar";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [verificationMethod, setVerificationMethod] = useState<
    "it" | "aadhaar"
  >("it");
  const [panNumber, setPanNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const updateDatabase = debounce(async (panNumber) => {
    const token = localStorage.getItem("token");
    const payload = { panNumber }; // Properly structure the payload

    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/fillDetail/updateContactDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", payload);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  }, 3000);
  const updateDatabaseDob = debounce(async (dob) => {
    const token = localStorage.getItem("token");
    const payload = { dob }; // Properly structure the payload

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/personal/personal-details`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", payload);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  }, 3000);

  
  useEffect(() => {
    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/personal/contact-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setPanNumber(data.panNumber);
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };
    const fetchPersonalDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/personal/personal-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setDob(data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "");
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchContactDetail();
      fetchPersonalDetail();
    }
  }, [isUserLoggedIn]);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/verificationApi/verifyPan`, {
        panNumber,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      // setResult(response.data);
      alert("verification Succes");
      setError(null)
    } catch (err) {
      console.error(err || 'An error occurred');
      // setResult(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
        <div className="lg:col-span-2">
          <div className=" mx-auto p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <button
                className="flex bg-gray-200 p-1 hover:bg-gray-300 border border-gray-300 rounded-full items-center gap-2 text-gray-600 pr-3"
                onClick={() => navigate("/fileITR")}
              >
                <ArrowLeft className="pl-2 w-5 h-5 text-gray-600" /> Back
              </button>

              <p className="ml-auto text-blue-600 text-sm font-medium bg-blue-100 border border-blue-200 rounded-full px-4 py-1">
                Step 1/3
              </p>
            </div>

            <div className="flex items-center  mb-8">
              <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="gap-3 row-span-2 ml-4">
                <h1 className="flex text-xl font-semibold text-gray-800 items-center gap-2">
                  Link your PAN to auto-fill details{" "}
                </h1>
                <p className="text-sm text-gray-500">
                  This will help us fetch your details from the IT department.
                </p>
              </div>
            </div>

            {/* Main Form */}
            <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="space-y-6">
                {/* PAN and DOB Fields */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="lg:w-1/2">
                    <label
                      htmlFor="pan"
                      className="block text-sm font-semibold text-gray-800 mb-1 "
                    >
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      id="pan"
                      value={panNumber}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                        setPanNumber(value);
                        if (panRegex.test(value) || value === "") {
                          updateDatabase(value);
                        }
                      }}
                      className="w-full px-6 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      maxLength={10}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a valid PAN number (e.g., ABCDE1234F)
                    </p>
                  </div>
                  <div className="lg:w-1/2">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-semibold text-gray-800 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        updateDatabaseDob(e.target.value);
                      }}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Specify date in a format like DD/MM/YYYY
                    </p>
                  </div>
                </div>

                {/* OTP Verification Method */}
                <div className="justify-between align-middle justify-center  mt-9">
                  <h3 className="text-sm font-semibold text-gray-800 mt-9">
                    Choose a method to verify OTP
                  </h3>
                  <p className="text-gray-500 text-xs">
                    OTP helps to verify your identity with the Income Tax
                    Department.
                  </p>
                  <div className="flex flex-col lg:flex-row gap-4 mt-5">
                    <label
                      className={`flex flex-col items-center gap-2 p-3 cursor-pointer border rounded-md ${
                        verificationMethod === "it"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                      onClick={() => setVerificationMethod("it")}
                    >
                      <input
                        type="radio"
                        name="verification"
                        checked={verificationMethod === "it"}
                        onChange={() => setVerificationMethod("it")}
                        className="hidden"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_of_Income_Tax_Department_India.png"
                        alt="IT Department Logo"
                        className="w-15 h-10"
                      />
                      <span className="text-gray-700 text-center px-4">
                        IT Department registered mobile number
                      </span>
                    </label>

                    <label
                      className={`flex flex-col items-center gap-2 p-3 cursor-pointer border rounded-md ${
                        verificationMethod === "aadhaar"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                      onClick={() => setVerificationMethod("aadhaar")}
                    >
                      <input
                        type="radio"
                        name="verification"
                        checked={verificationMethod === "aadhaar"}
                        onChange={() => setVerificationMethod("aadhaar")}
                        className="hidden"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png"
                        alt="Aadhaar Logo"
                        className="w-15 h-10"
                      />
                      <span className="text-gray-700 text-center px-4">
                        Aadhaar registered mobile number
                      </span>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-5 pt-6">
                  <button
                    className="w-full  border text-dark  py-4 px-6  rounded-md hover:bg-gray-200 focus:ring-4 focus:ring-blue-200 transition-colors"
                    onClick={() => navigate("/fileITR/uploadForm16")}
                  >
                    Skip
                  </button>
                  <button
                    className="w-full  items-center bg-dark  border hover:text-white hover:bg-blue-900 text-white font-semibold py-4 px-6 rounded-md transition duration-300 ease-in-out"
                   onClick={handleVerify}
                    // onClick={() => navigate("/fileITR/uploadForm16")}
                  >
                    Proceed →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5 rounded-md">
                <Shield className="w-5 h-5 text-gray-600" />
                <p className="text-xs">
                  Burnblack is a Government authorized ERI license holder. Your
                  data is 100% secure with BurnBlack.
                </p>
              </div>
            </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "How do I link my PAN card?",
                  answer:
                    "You can link your PAN card by entering your PAN number and date of birth in the provided fields and following the verification steps.",
                },
                {
                  question: "What is the benefit of linking my PAN card?",
                  answer:
                    "Linking your PAN card allows us to auto-fill your details from the IT department, making the filing process faster and more accurate.",
                },
                {
                  question: "Can I file ITR for multiple people or companies?",
                  answer:
                    "Yes, our platform supports filing ITR for multiple individuals and companies, including bulk filing options.",
                },
                {
                  question: "Is my data secure on this platform?",
                  answer:
                    "Absolutely. BurnBlack is a Government authorized ERI license holder, and we ensure that your data is 100% secure with us.",
                },
                {
                  question:
                    "What should I do if I face issues during the filing process?",
                  answer:
                    "If you encounter any issues, you can contact our support team for assistance. We are here to help you through every step of the process.",
                },
              ].map((faq, index) => (
                <details key={index} className="border-b pb-2 group">
                  <summary className="cursor-pointer text-gray-800 font-medium group-open:text-gray-600">
                    {faq.question}
                  </summary>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
