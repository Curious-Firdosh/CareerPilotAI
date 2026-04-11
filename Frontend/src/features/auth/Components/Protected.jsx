import React from "react";
import { Navigate } from "react-router-dom";

import { useGetme } from "../Hooks/useAuth";
import LoadingSpinner from "../../Interview/Components/Spinner";


const Protected = ({ children }) => {
  const { data, isPending} = useGetme();

  if (isPending) {
    return (
      <div className="main">
          <LoadingSpinner isLoading={true}/>
      </div>
    )
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected