import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

interface RequiredAuthProps {
  children: ReactNode;
}

function RequiredAuth({ children }: RequiredAuthProps) {
  // Get auth state from global context
  const isUserLoggedIn = useSelector((state: RootState) => state.user.user !== null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [isUserLoggedIn, navigate]);

  // If authenticated, render children
  if (!isUserLoggedIn) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}

export default RequiredAuth;
