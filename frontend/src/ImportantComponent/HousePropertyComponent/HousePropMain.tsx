import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const HousePropMain: React.FC = () => {
 

  return (
    <>
<div>
    <div>
        <div>

    Self Occupied Properties (not given on rent)
        </div>
        <div>
            <Link to="/fileITR/self-occupied-property">
            Add Details
            </Link>
        </div>
    </div>
    <div>
        <div>

        Properties you have given on rent


        </div>
        <div>
            Add Details
        </div>
    </div>
</div>
    </>
  );
};

export default HousePropMain;
