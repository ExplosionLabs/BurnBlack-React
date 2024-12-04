import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const ProSubSection: React.FC = () => {
 

  return (
    <>
 <div>


 Professional Income({`Revenue < ₹ 75 lakhs`})
    <Link to="/fileITR/professional-income">
    Add Details</Link>
    </div>
    </>
  );
};

export default  ProSubSection;
