
import { useGetme } from "../Hooks/useAuth"
import LoadingSpinner from "../../Interview/Components/Spinner";
import { Navigate } from "react-router-dom";


const PublicRoute = ({ children }) => {

    const { data: user, isPending} = useGetme();

    if (isPending) {
        return (
            <main>
                <LoadingSpinner />
            </main>
        )
    }

    if (user) {
        return <Navigate to="/" replace />;
    }
    return children
}

export default PublicRoute