import React from "react";
import { Navigate } from "react-router-dom";

import { useGetme } from "../Hooks/useAuth";
import LoadingSpinner from "../../Interview/Components/Spinner";


const Protected = ({ children }) => {
  const { data, isPending, isError } = useGetme();

  if (isPending) return <LoadingSpinner />;

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected