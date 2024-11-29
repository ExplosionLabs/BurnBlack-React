import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const CapitalGainMain: React.FC = () => {
 

  return (
    <>
    Capital Gain Main
    <Link to="/fileITR/capitalGain">
    Add Details</Link>
    </>
  );
};

export default CapitalGainMain;
