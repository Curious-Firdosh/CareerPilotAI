import React from "react";
import { Navigate } from "react-router";

import { useGetme } from "../Hooks/useAuth";
import LoadingSpinner from "../../Interview/Components/Spinner";


const Protected = ({ children }) => {

  const { data: user, isPending } = useGetme()


    if (isPending) {
        return (
            <main>
                <LoadingSpinner/>
            </main>
        )
    }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
