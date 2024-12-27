import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { uploadForm16 } from "@/api/fileITR";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, UploadCloud } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "what-is-form-16",
    question: "What is Form 16?",
    answer:
      "Form 16 is a certificate issued by employers, detailing the salary paid and taxes deducted for an employee in a financial year.",
  },
  {
    id: "where-to-get-form-16",
    question: "From where do I get my Form 16?",
    answer:
      "Your employer will provide Form 16 after the end of the financial year, typically by June.",
  },
  {
    id: "annexure-as-separate-file",
    question: "I have got annexure as a different file.",
    answer:
      "You can upload both Form 16 and its annexure separately. Both documents are important for filing your ITR.",
  },
  {
    id: "multiple-form-16s",
    question: "Can I upload multiple Form 16s at once?",
    answer:
      "Yes, if you have switched jobs during the financial year, you can upload Form 16 from each employer.",
  },
];

export default function Form16Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?._id) {
      alert("Please select a file and ensure you are logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user._id);

    try {
      const response = await uploadForm16(formData);
      // alert(response.message)
      navigate("/fileITR/personalDetail");
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file.");
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="lg:col-span-2 p-6">
      <div className="flex items-center gap-4 mb-8 mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            className="flex bg-gray-200 p-1 hover:bg-gray-300 border border-gray-300 rounded-full items-center gap-2 text-gray-600 pr-3"
            onClick={() => navigate("/fileITR/addPanCardDetail")}
          >
            <ArrowLeft className="pl-2 w-5 h-5 text-gray-600" /> Back
          </button>

          <p className="ml-auto text-blue-600 text-sm font-medium bg-blue-100 border border-blue-200 rounded-full px-4 py-1">
            Step 1/3
          </p>
        </div>

        <div className="flex items-center  mb-8">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-blue-600" />
          </div>
          <div className="gap-3 row-span-2 ml-4">
            <h1 className="flex text-xl font-semibold text-gray-800 items-center gap-2">
              Upload Form-16 to auto-fill your data{" "}
            </h1>
            <p className="text-sm text-gray-500">
              This will auto fill the form and reduce 70% time in filing ITR
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                  <li>
                    You can upload multiple Form 16's if you have switched jobs
                    in this Financial Year.
                  </li>
                  <li>
                    You should also upload the annexure if you have received it
                    separately from your employer.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg mb-2">
                Drop PDF file here or click to select
              </p>
              <p className="text-sm text-gray-500 mb-4">OR</p>
              <label
                htmlFor="fileInput"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
              >
                Browse Files
              </label>
              <input
                id="fileInput"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Selected file: {selectedFile.name}
                </p>
                <button
                  onClick={handleUpload}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Upload File
                </button>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/fileITR/personalDetail"
                className="w-full  border text-dark  py-4 px-6  rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-blue-200 transition-colors"
              >
                Continue without Form 16 (Manual Entry)
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-semibold">FAQs</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-700 pb-2">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex justify-between items-center w-full text-left py-2"
                >
                  <span className="text-sm">{faq.question}</span>
                  <span>{openFaqId === faq.id ? "−" : "+"}</span>
                </button>
                {openFaqId === faq.id && (
                  <p className="text-sm text-gray-300 mt-2 mb-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
