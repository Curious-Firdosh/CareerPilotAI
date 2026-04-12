import React from "react";
import { Navigate } from "react-router-dom";

import { useGetme } from "../Hooks/useAuth";
import PremiumLoader from "./PremiumLoader";



const Protected = ({ children }) => {
  const { data, isPending} = useGetme();

  if (isPending) {
    return (
      <div className="main">
          <PremiumLoader/>
      </div>
    )
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected