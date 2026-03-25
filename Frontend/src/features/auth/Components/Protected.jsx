import React from "react";
import { Navigate } from "react-router";

import { useGetme } from "../Hooks/useAuth";


const Protected = ({ children }) => {

  const { data: user, isPending } = useGetme()


    if (isPending) {
        return (
            <main>
                <div className="loader"></div>
            </main>
        )
    }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
