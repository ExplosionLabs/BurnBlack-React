import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RequiredAdminProps {
  children: ReactNode;
}

function RequiredAdmin({ children }: RequiredAdminProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Store admin status
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // No token found, redirect to login
        navigate("/login");
        return;
      }

      try {
        // Send token to the backend for validation
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/adminApi/protected/admin`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        // If the backend confirms the user is an admin, allow access
        if (response.status === 200) {
          setIsAdmin(true); // User is admin
        }
      } catch (err) {
        // If there's any error (e.g., not an admin, token expired), redirect to login
        console.error(err);
        navigate("/login");
        setIsAdmin(false); // Set as non-admin
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show loading state until the check is done
  }

  if (!isAdmin) {
    return null; // Return nothing if not an admin or invalid token
  }

  return <>{children}</>;
}

export default RequiredAdmin;
