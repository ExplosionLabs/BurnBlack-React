import React from "react";
import { useLocation } from "react-router-dom";

const { useEffect } = React;

function ScrollToTop() {
  const location = useLocation();

  // Reset scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
