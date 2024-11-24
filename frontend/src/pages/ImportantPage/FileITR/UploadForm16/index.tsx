import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import axios from "axios";
import { uploadForm16 } from "@/api/fileITR";
import { Link } from "react-router-dom";
function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false); // State to track upload success
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const userId = user?._id;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setIsUploaded(false); // Reset upload state if the user selects a new file
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !userId) {
      alert("Please select a file and ensure you are logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await uploadForm16(formData); // API call
      setIsUploaded(true); // Set upload state to true on success
      alert(response.message);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file.");
    }
  };

  const handleContinue = () => {
    // Logic for the Continue button (e.g., navigate to another page or perform another action)
    alert("Continuing to the next step...");
  };

  return (
    <div>
      <h1>Upload Form 16</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>
        Upload
      </button>
      <div>
        <Link to="/fileITR/personalDetail">
        Contine without form16
        </Link>
      </div>
      

      {isUploaded && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
}

export default Main;
