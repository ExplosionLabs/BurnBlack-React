import React from "react";
import { useNavigate } from "react-router-dom";

const SectionNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <button onClick={() => navigate("/fileITR/personalDetail")}>
        Personal Detail
      </button>
      <button onClick={() => navigate("/fileITR/incomeSources")}>
        Incomes Sources
      </button>
      <button onClick={() => navigate("/fileITR/bankDetail")}>
        Tax Saving
      </button>
      <button onClick={() => navigate("/fileITR/bankDetail")}>
        Tax Summary
      </button>
    </div>
  );
};

export default SectionNavigation;
