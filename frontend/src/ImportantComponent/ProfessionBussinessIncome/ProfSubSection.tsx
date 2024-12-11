import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FinancialParticular from "../FinancialParticular/FinancialParticular";
const ProSubSection: React.FC = () => {
 

  return (
    <>
 <div>


 Professional Income({`Revenue < ₹ 75 lakhs`})
    <Link to="/fileITR/professional-income">
    Add Details</Link>
    </div>
 <div>


 Business Income({`Revenue < ₹3 crores`})
    <Link to="/fileITR/bussiness-income">
    Add Details</Link>
    </div>
 <div>

 Professional Income({`Revenue > ₹ 75 lakhs`}) or Business Income({`Revenue > ₹3 crores`})
    <Link to="/fileITR/book-of-account-dashboard">
    Add Details</Link>
    </div>

    <FinancialParticular/>
    </>
  );
};

export default  ProSubSection;
