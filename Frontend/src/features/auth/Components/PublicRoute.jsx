import { useNavigate } from "react-router";
import { useGetme } from "../Hooks/useAuth"
import LoadingSpinner from "../../Interview/Components/Spinner";


const PublicRoute = ({ children }) => {

    const { data: user, isPending } = useGetme();
    const navigate = useNavigate()

    if (isPending) {
        return (
            <main>
                <LoadingSpinner/>
            </main>
        )
    }

    if (user) {
        navigate('/')
    }

    return children
}

export default PublicRoute