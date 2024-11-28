import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const InterestIncomeMain: React.FC = () => {
 

  return (
    <>
    Interest Income 
    <Link to="/incomeInterest">
    Add Details</Link>
    </>
  );
};

export default InterestIncomeMain;
