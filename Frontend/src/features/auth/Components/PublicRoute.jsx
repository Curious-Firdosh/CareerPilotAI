import { useNavigate } from "react-router";
import { useGetme } from "../Hooks/useAuth"


const PublicRoute = ({ children }) => {

    const { data: user, isPending } = useGetme();
    const navigate = useNavigate()

    if (isPending) {
        return (
            <main>
                <div className="loader"></div>
            </main>
        )
    }

    if (user) {
        navigate('/')
    }

    return children
}

export default PublicRoute