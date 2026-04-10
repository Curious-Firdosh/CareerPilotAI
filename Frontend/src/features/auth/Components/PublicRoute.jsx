
import { useGetme } from "../Hooks/useAuth"
import LoadingSpinner from "../../Interview/Components/Spinner";
import { Navigate } from "react-router-dom";


const PublicRoute = ({ children }) => {
    const { data, isPending, isError } = useGetme();

    if (isPending) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return children; // allow access if API failed
    }

    if (data) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute