import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const DividentComponent: React.FC = () => {
 

  return (
    <>

Dividend Income
    <Link to="/fileITR/dividend-income">
    Add Details</Link>
    </>
  );
};

export default DividentComponent;
