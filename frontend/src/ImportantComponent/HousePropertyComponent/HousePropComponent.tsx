import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const HousePropComponent: React.FC = () => {
 

  return (
    <>
 
House Properties owned by you
    <Link to="/fileITR/income-house-property">
    Add Details</Link>
    </>
  );
};

export default HousePropComponent;
