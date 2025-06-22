import React from "../../react-shim";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  // Reset scroll position
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
